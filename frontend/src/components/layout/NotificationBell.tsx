import { useState, useEffect } from "react";
import { Bell, Check, Trash2, ExternalLink, Sparkles } from "lucide-react";
import {
    getNotifications,
    markNotificationAsRead,
    clearNotifications,
    type Notification
} from "../../services/api";
import { Button } from "../ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "../ui/popover";
import { ScrollArea } from "../ui/scroll-area";
import { Badge } from "../ui/badge";
import { Link } from "react-router-dom";
import { formatRelativeTime } from "../../lib/utils";

export function NotificationBell() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchNotifications = async () => {
        try {
            const data = await getNotifications();
            setNotifications(data.notifications);
            setUnreadCount(data.unread_count);
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Poll every 30 seconds for new alerts (Simulating real-time for hackathon)
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleMarkAsRead = async (id: string) => {
        try {
            await markNotificationAsRead(id);
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, is_read: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error("Failed to mark as read:", error);
        }
    };

    const handleClearAll = async () => {
        setLoading(true);
        try {
            await clearNotifications();
            setNotifications([]);
            setUnreadCount(0);
        } catch (error) {
            console.error("Failed to clear notifications:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative w-10 h-10 rounded-xl hover:bg-primary/10 transition-colors"
                >
                    <Bell className={`w-5 h-5 ${unreadCount > 0 ? "text-primary fill-primary/10" : "text-muted-foreground"}`} />
                    {unreadCount > 0 && (
                        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-background animate-pulse" />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 bg-card/95 backdrop-blur-xl border-border/40 shadow-2xl rounded-2xl overflow-hidden" align="end">
                <div className="p-4 border-b border-border/40 flex items-center justify-between bg-muted/20">
                    <h4 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                        <Sparkles className="w-3 h-3 text-primary" /> Alerts & Insights
                    </h4>
                    {notifications.length > 0 && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:text-red-500 transition-colors"
                            onClick={handleClearAll}
                            disabled={loading}
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                    )}
                </div>

                <ScrollArea className="h-[350px]">
                    {notifications.length > 0 ? (
                        <div className="divide-y divide-border/40">
                            {notifications.map((notif) => (
                                <div
                                    key={notif.id}
                                    className={`p-4 transition-colors relative group ${!notif.is_read ? "bg-primary/5" : "hover:bg-muted/30"}`}
                                >
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between gap-2">
                                            <Badge variant="outline" className={`text-[8px] uppercase font-black px-1.5 py-0 ${notif.type === 'analysis_complete' ? 'border-emerald-500/30 text-emerald-600 bg-emerald-500/5' :
                                                    notif.type === 'market_intel' ? 'border-blue-500/30 text-blue-600 bg-blue-500/5' :
                                                        'border-primary/30 text-primary bg-primary/5'
                                                }`}>
                                                {notif.type.replace('_', ' ')}
                                            </Badge>
                                            <span className="text-[9px] font-bold text-muted-foreground/60 uppercase">
                                                {formatRelativeTime(notif.timestamp)}
                                            </span>
                                        </div>
                                        <h5 className="text-sm font-bold leading-tight group-hover:text-primary transition-colors">
                                            {notif.title}
                                        </h5>
                                        <p className="text-xs text-muted-foreground font-medium leading-relaxed line-clamp-2">
                                            {notif.message}
                                        </p>
                                        <div className="pt-2 flex items-center gap-2">
                                            {notif.link && (
                                                <Link
                                                    to={notif.link}
                                                    className="inline-flex items-center gap-1 text-[10px] font-black text-primary uppercase tracking-widest hover:underline"
                                                    onClick={() => !notif.is_read && handleMarkAsRead(notif.id)}
                                                >
                                                    View Details <ExternalLink className="w-3 h-3" />
                                                </Link>
                                            )}
                                            {!notif.is_read && (
                                                <Button
                                                    variant="ghost"
                                                    className="h-5 px-1.5 text-[9px] font-black uppercase tracking-tighter ml-auto group-hover:bg-primary group-hover:text-white transition-all"
                                                    onClick={() => handleMarkAsRead(notif.id)}
                                                >
                                                    <Check className="w-3 h-3 mr-1" /> Mark Read
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-4 opacity-40">
                            <Bell className="w-10 h-10 text-muted-foreground" />
                            <div className="space-y-1">
                                <p className="text-xs font-black uppercase tracking-widest">Quiet for now</p>
                                <p className="text-[10px] font-medium">Reports and funding alerts will appear here.</p>
                            </div>
                        </div>
                    )}
                </ScrollArea>
                <div className="p-3 bg-muted/20 border-t border-border/40 text-center">
                    <p className="text-[9px] font-black text-muted-foreground/60 uppercase tracking-[0.2em]">
                        Auto-syncing with real-time intelligence
                    </p>
                </div>
            </PopoverContent>
        </Popover>
    );
}
