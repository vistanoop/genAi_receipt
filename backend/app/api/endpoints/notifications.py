from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
import uuid
from datetime import datetime
from app.schemas.notification import Notification, NotificationType, NotificationList

router = APIRouter()

# In-memory store for demo/hackathon purposes
MOCK_NOTIFICATIONS: List[Notification] = []

@router.get("", response_model=NotificationList)
async def get_notifications():
    unread = sum(1 for n in MOCK_NOTIFICATIONS if not n.is_read)
    return NotificationList(
        notifications=sorted(MOCK_NOTIFICATIONS, key=lambda x: x.timestamp, reverse=True),
        unread_count=unread
    )

@router.post("/{notification_id}/read")
async def mark_as_read(notification_id: str):
    for n in MOCK_NOTIFICATIONS:
        if n.id == notification_id:
            n.is_read = True
            return {"status": "success"}
    raise HTTPException(status_code=404, detail="Notification not found")

@router.post("/clear")
async def clear_all():
    global MOCK_NOTIFICATIONS
    MOCK_NOTIFICATIONS = []
    return {"status": "success"}

def add_notification(type: NotificationType, title: str, message: str, link: Optional[str] = None):
    """Utility to add notifications from other services (Scraper, Orchestrator)"""
    new_notif = Notification(
        id=str(uuid.uuid4()),
        type=type,
        title=title,
        message=message,
        link=link,
        is_read=False,
        timestamp=datetime.utcnow()
    )
    MOCK_NOTIFICATIONS.insert(0, new_notif)
    return new_notif
