
import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Notification, NotificationType } from "@/types";
import { dbService } from "@/lib/dbService";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  
  useEffect(() => {
    // Poll for notifications every 30 seconds
    const fetchNotifications = () => {
      const allNotifications = dbService.getAllNotifications();
      setNotifications(allNotifications);
    };
    
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      dbService.markNotificationAsRead(notification.id);
      setNotifications(prev => 
        prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
      );
    }
  };
  
  const getIconColor = (type: NotificationType) => {
    switch(type) {
      case NotificationType.SUCCESS: return "text-green-500";
      case NotificationType.ERROR: return "text-red-500";
      case NotificationType.WARNING: return "text-amber-500";
      case NotificationType.INFO:
      default: return "text-blue-500";
    }
  };
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-nepal-red text-white text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 mr-4">
        <div className="p-4 border-b">
          <h3 className="font-medium">Notifications</h3>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No notifications yet
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${notification.read ? 'opacity-70' : 'bg-gray-50 dark:bg-gray-800'}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start gap-2">
                    <div className={`mt-0.5 ${getIconColor(notification.type)}`}>
                      <div className="h-2 w-2 rounded-full bg-current" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="font-medium text-sm">{notification.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{notification.message}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
