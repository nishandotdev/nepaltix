
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { BellIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Notification } from "@/types";
import { dbService } from "@/lib/dbService";
import { authService } from "@/lib/authService";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = authService.getCurrentUser();
  
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) {
        // Only get public notifications if no user is logged in
        const allNotifications = await dbService.getAllNotifications();
        const publicNotifications = allNotifications.filter(n => !n.userId);
        setNotifications(publicNotifications);
        setUnreadCount(publicNotifications.filter(n => !n.read).length);
      } else {
        // Get user-specific and public notifications
        const userNotifications = await dbService.getNotificationsByUserId(user.id);
        setNotifications(userNotifications);
        setUnreadCount(userNotifications.filter(n => !n.read).length);
      }
    };
    
    fetchNotifications();
    
    // Poll for new notifications
    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [user]);
  
  const handleMarkAsRead = (id: string) => {
    dbService.markNotificationAsRead(id);
    setNotifications(prev => 
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };
  
  const handleMarkAllAsRead = () => {
    notifications.forEach(n => {
      if (!n.read) {
        dbService.markNotificationAsRead(n.id);
      }
    });
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <BellIcon className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-nepal-red text-[10px] font-bold text-white flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <div className="p-3 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-medium">Notifications</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs"
              onClick={handleMarkAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="py-6 text-center text-sm text-gray-500">
              No notifications
            </div>
          ) : (
            notifications
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((notification) => (
                <div 
                  key={notification.id}
                  className={`p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
                    !notification.read ? "bg-nepal-red/5" : ""
                  }`}
                  onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                >
                  <div className="flex justify-between items-start">
                    <h4 className={`font-medium text-sm ${!notification.read ? "text-nepal-red" : ""}`}>
                      {notification.title}
                    </h4>
                    <span className="text-[10px] text-gray-400">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{notification.message}</p>
                </div>
              ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
