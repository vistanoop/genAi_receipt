import sqlite3
import json
import threading
from typing import List, Dict, Optional
from pathlib import Path
from app.schemas.analysis import AnalysisResponse

BASE_DIR = Path(__file__).resolve().parents[2]
DATA_DIR = BASE_DIR / "data"
DB_FILE = DATA_DIR / "funding.db"
# References for migration from legacy JSON storage
ANALYSES_FILE = DATA_DIR / "analyses.json"
CHAT_HISTORY_FILE = DATA_DIR / "chat_history.json"

class Storage:
    """
    A thread-safe and process-safe storage implementation using SQLite.
    This replaces the legacy JSON-based storage which was prone to race conditions 
    in multi-worker environments.
    """
    def __init__(self):
        self._ensure_data_dir()
        self.db_path = str(DB_FILE)
        self._local = threading.local()
        self._init_db()
        self._migrate_if_needed()

    def _get_conn(self):
        # Ensure each thread has its own connection for safety within a process
        if not hasattr(self._local, "conn"):
            # check_same_thread=False is safe because we use threading.local() to isolate connections
            self._local.conn = sqlite3.connect(self.db_path, check_same_thread=False)
            self._local.conn.row_factory = sqlite3.Row
        return self._local.conn

    def _init_db(self):
        conn = self._get_conn()
        cursor = conn.cursor()
        # Create analyses table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS analyses (
                analysis_id TEXT PRIMARY KEY,
                user_id TEXT,
                created_at TEXT,
                data TEXT
            )
        """)
        # Create chat_messages table (one row per message for atomic appends)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS chat_messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT,
                message_json TEXT
            )
        """)
        conn.commit()

    def _migrate_if_needed(self):
        conn = self._get_conn()
        cursor = conn.cursor()
        
        # 1. Migrate analyses from legacy JSON
        cursor.execute("SELECT count(*) FROM analyses")
        if cursor.fetchone()[0] == 0 and ANALYSES_FILE.exists():
            print("[*] Migrating analyses from JSON to SQLite...")
            try:
                with ANALYSES_FILE.open("r") as f:
                    data = json.load(f)
                    for item in data:
                        cursor.execute(
                            "INSERT OR REPLACE INTO analyses (analysis_id, user_id, created_at, data) VALUES (?, ?, ?, ?)",
                            (item.get("analysis_id"), item.get("user_id"), item.get("created_at"), json.dumps(item))
                        )
                conn.commit()
            except Exception as e:
                print(f"[!] Migration failed for analyses: {e}")

        # 2. Migrate chat history from legacy JSON
        cursor.execute("SELECT count(*) FROM chat_messages")
        if cursor.fetchone()[0] == 0 and CHAT_HISTORY_FILE.exists():
            print("[*] Migrating chat history from JSON to SQLite...")
            try:
                with CHAT_HISTORY_FILE.open("r") as f:
                    data = json.load(f)
                    if isinstance(data, dict):
                        for user_id, messages in data.items():
                            if isinstance(messages, list):
                                for msg in messages:
                                    cursor.execute(
                                        "INSERT INTO chat_messages (user_id, message_json) VALUES (?, ?)",
                                        (user_id, json.dumps(msg))
                                    )
                conn.commit()
            except Exception as e:
                print(f"[!] Migration failed for chat history: {e}")

    def _ensure_data_dir(self):
        DATA_DIR.mkdir(exist_ok=True)

    def save_analysis(self, analysis: AnalysisResponse):
        conn = self._get_conn()
        cursor = conn.cursor()
        # Pydantic v2 uses model_dump_json, fall back to dict + json.dumps for v1
        if hasattr(analysis, "model_dump_json"):
            data_json = analysis.model_dump_json()
        else:
            data_json = json.dumps(analysis.dict())
            
        cursor.execute(
            "INSERT OR REPLACE INTO analyses (analysis_id, user_id, created_at, data) VALUES (?, ?, ?, ?)",
            (analysis.analysis_id, analysis.user_id, getattr(analysis, 'created_at', None), data_json)
        )
        conn.commit()

    def get_all_analyses(self, user_id: Optional[str] = None) -> List[AnalysisResponse]:
        conn = self._get_conn()
        cursor = conn.cursor()
        if user_id:
            cursor.execute("SELECT data FROM analyses WHERE user_id = ?", (user_id,))
        else:
            cursor.execute("SELECT data FROM analyses")
        
        rows = cursor.fetchall()
        return [AnalysisResponse(**json.loads(row['data'])) for row in rows]

    def get_analysis_by_id(self, analysis_id: str, user_id: Optional[str] = None) -> Optional[AnalysisResponse]:
        conn = self._get_conn()
        cursor = conn.cursor()
        if user_id:
            cursor.execute("SELECT data FROM analyses WHERE analysis_id = ? AND user_id = ?", (analysis_id, user_id))
        else:
            cursor.execute("SELECT data FROM analyses WHERE analysis_id = ?", (analysis_id,))
            
        row = cursor.fetchone()
        if row:
            return AnalysisResponse(**json.loads(row['data']))
        return None

    def save_chat_message(self, user_id: str, message: Dict):
        conn = self._get_conn()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO chat_messages (user_id, message_json) VALUES (?, ?)",
            (user_id, json.dumps(message))
        )
        conn.commit()

    def get_chat_history(self, user_id: str) -> List[Dict]:
        conn = self._get_conn()
        cursor = conn.cursor()
        cursor.execute("SELECT message_json FROM chat_messages WHERE user_id = ? ORDER BY id ASC", (user_id,))
        rows = cursor.fetchall()
        return [json.loads(row['message_json']) for row in rows]

    def clear_chat_history(self, user_id: str):
        conn = self._get_conn()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM chat_messages WHERE user_id = ?", (user_id,))
        conn.commit()

    def get_stats(self, user_id: Optional[str] = None) -> Dict:
        user_analyses = self.get_all_analyses(user_id)
        total = len(user_analyses)

        if total == 0:
            return {
                "total_analyses": 0,
                "total_investors": 0,
                "total_evidence": 0,
                "avg_score": "0%",
            }

        total_investors = sum(len(a.recommended_investors) for a in user_analyses)
        total_evidence = sum(len(a.evidence_used) for a in user_analyses)
        avg_score = sum(a.overall_score for a in user_analyses) / total

        return {
            "total_analyses": total,
            "total_investors": total_investors,
            "total_evidence": total_evidence,
            "avg_score": f"{int(avg_score)}%",
        }

    def get_all_evidence(self, user_id: Optional[str] = None) -> List[Dict]:
        seen_titles = set()
        all_ev = []
        user_analyses = self.get_all_analyses(user_id)

        for a in user_analyses:
            for ev in a.evidence_used:
                if ev.title not in seen_titles:
                    # model_dump() for pydantic v2, dict() for v1
                    all_ev.append(ev.model_dump() if hasattr(ev, "model_dump") else ev.dict())
                    seen_titles.add(ev.title)

        return all_ev

    def get_intelligence_library(self) -> List[Dict]:
        from app.data.evidence_store import EvidenceStore
        store = EvidenceStore()
        all_units = store.list_all_evidence(limit=50)
        return [u.model_dump() if hasattr(u, "model_dump") else u.dict() for u in all_units]

storage = Storage()
