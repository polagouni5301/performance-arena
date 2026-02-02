import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, Trophy, Zap, Gift, Target, CheckCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const mockNotifications = [
  {
    id: 1,
    type: "achievement",
    icon: Trophy,
    title: "Achievement Unlocked!",
    message: "You've reached Level 42 - Elite Agent status!",
    time: "2 min ago",
    read: false,
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10",
  },
  {
    id: 2,
    type: "reward",
    icon: Gift,
    title: "Reward Available",
    message: "You have 5,000 points ready to redeem.",
    time: "15 min ago",
    read: false,
    color: "text-pink-400",
    bgColor: "bg-pink-500/10",
  },
  {
    id: 3,
    type: "challenge",
    icon: Target,
    title: "Daily Challenge",
    message: "Complete 5 more calls to finish today's challenge.",
    time: "1 hour ago",
    read: true,
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10",
  },
  {
    id: 4,
    type: "streak",
    icon: Zap,
    title: "Streak Alert",
    message: "You're on a 7-day streak! Keep it going!",
    time: "3 hours ago",
    read: true,
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
  },
];

const NotificationPopup = ({ isOpen, onClose, onMarkAllRead }) => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    onMarkAllRead?.();
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40"
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 w-80 sm:w-96 z-50"
          >
            <div className="rounded-xl border border-border bg-card/95 backdrop-blur-xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-foreground">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-primary text-primary-foreground">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="p-1 rounded-lg hover:bg-muted transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              {/* Notifications List */}
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell className="w-10 h-10 mx-auto text-muted-foreground/50 mb-2" />
                    <p className="text-sm text-muted-foreground">No notifications</p>
                  </div>
                ) : (
                  notifications.map((notification) => {
                    const IconComponent = notification.icon;
                    return (
                      <motion.div
                        key={notification.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => markAsRead(notification.id)}
                        className={cn(
                          "flex items-start gap-3 p-4 border-b border-border/50 cursor-pointer transition-colors",
                          !notification.read
                            ? "bg-primary/5 hover:bg-primary/10"
                            : "hover:bg-muted/50"
                        )}
                      >
                        <div className={cn("p-2 rounded-lg", notification.bgColor)}>
                          <IconComponent className={cn("w-4 h-4", notification.color)} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-foreground text-sm truncate">
                              {notification.title}
                            </p>
                            {!notification.read && (
                              <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-1 mt-1.5 text-xs text-muted-foreground/70">
                            <Clock className="w-3 h-3" />
                            <span>{notification.time}</span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>

              {/* Footer Actions */}
              {notifications.length > 0 && (
                <div className="flex items-center justify-between p-3 border-t border-border bg-muted/30">
                  <button
                    onClick={markAllAsRead}
                    className="flex items-center gap-1.5 text-xs text-primary hover:underline"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    Mark all as read
                  </button>
                  <button
                    onClick={clearAll}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationPopup;
