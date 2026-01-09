from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

class NotificationType(str, Enum):
    ANALYSIS_COMPLETE = "analysis_complete"
    MARKET_INTEL = "market_intel"
    SYSTEM_ALERT = "system_alert"
    ACADEMY_UPDATE = "academy_update"

class Notification(BaseModel):
    id: str = Field(..., description="Unique notification ID")
    type: NotificationType
    title: str
    message: str
    link: Optional[str] = None
    is_read: bool = False
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class NotificationList(BaseModel):
    notifications: List[Notification]
    unread_count: int
