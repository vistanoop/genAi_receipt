from pydantic import BaseModel
from typing import List, Literal, Optional

class FraudCheckRequest(BaseModel):
    entity: str
    type: Literal["investor", "startup"]

class FraudCheckResponse(BaseModel):
    entity: str
    status: Literal["risk", "safe"]
    score: int  # Risk Score: 0-100 (High is bad)
    flags: List[str]
    verified: bool
    lastChecked: str
    summary: Optional[str] = None
