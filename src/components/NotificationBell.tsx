
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { BellIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Notification } from "@/types";
import { dbService } from "@/lib/dbService";
import { authService } from "@/lib/authService";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = authService.getCurrentUser();
  
  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true);
      try {
        if (!user) {
          // Only get public notifications if no user is logged in
          const publicNotifications = await dbService.getAllNotifications();
          setNotifications(publicNotifications);
          setUnreadCount(publicNotifications.filter(n => !n.read).length);
        } else {
          // Get user-specific and public notifications
          const userNotifications = await dbService.getNotificationsByUserId(user.id);
          setNotifications(userNotifications);
          setUnreadCount(userNotifications.filter(n => !n.read).length);
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
        toast.error("Failed to load notifications");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNotifications();
    
    // Poll for new notifications
    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [user]);
  
  const handleMarkAsRead = async (id: string) => {
    try {
      await dbService.markNotificationAsRead(id);
      setNotifications(prev => 
        prev.map(n => (n.id === id ? { ...n, read: true } : n))
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
      toast.error("Failed to update notification");
    }
  };
  
  const handleMarkAllAsRead = async () => {
    try {
      const promises = notifications
        .filter(n => !n.read)
        .map(n => dbService.markNotificationAsRead(n.id));
      
      await Promise.all(promises);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
      toast.error("Failed to update notifications");
    }
  };
  
  const getNotificationTypeClass = (type: string) => {
    switch (type) {
      case 'INFO':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'WARNING':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300';
      case 'ERROR':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'SUCCESS':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMs / 3600000);
    const diffDays = Math.round(diffMs / 86400000);
    
    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative animate-pulse hover:animate-none"
        >
          <BellIcon className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-nepal-red text-[10px] font-bold text-white flex items-center justify-center animate-entrance">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-3 border-b border-gray-100 flex justify-between items-center bg-gray-50 dark:bg-gray-800">
          <h3 className="font-medium">Notifications</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs hover:text-nepal-red"
              onClick={handleMarkAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          {isLoading ? (
            <div className="py-8 text-center">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-nepal-red border-r-transparent"></div>
              <p className="mt-2 text-sm text-gray-500">Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="py-10 text-center">
              <BellIcon className="mx-auto h-10 w-10 text-gray-300 mb-2" />
              <p className="text-gray-500">No notifications</p>
            </div>
          ) : (
            notifications
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((notification) => (
                <div 
                  key={notification.id}
                  className={cn(
                    "p-3 border-b border-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer",
                    !notification.read ? "bg-nepal-red/5" : ""
                  )}
                  onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                >
                  <div className="flex justify-between items-start">
                    <h4 className={cn(
                      "font-medium text-sm",
                      !notification.read ? "text-nepal-red" : ""
                    )}>
                      {notification.title}
                    </h4>
                    <span className="text-[10px] text-gray-400 flex-shrink-0 ml-2">
                      {formatDate(notification.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{notification.message}</p>
                  <div className="mt-2">
                    <Badge variant="outline" className={cn(
                      "text-[10px] font-normal",
                      getNotificationTypeClass(notification.type)
                    )}>
                      {notification.type}
                    </Badge>
                  </div>
                </div>
              ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
