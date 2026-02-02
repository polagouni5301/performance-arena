import { useState } from "react";
import { Bell, Search, Calendar, Download } from "lucide-react";
import { cn } from "../../lib/utils";
import NotificationPopup from "./NotificationPopup";
import UserProfileDropdown from "./UserProfileDropdown";
import RoleSwitcher from "./RoleSwitcher";

const LeadershipHeader = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-4 border-b border-border bg-background/80 backdrop-blur-lg">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Enterprise</span>
        <span>/</span>
        <span className="text-foreground font-medium">Leadership Overview</span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Role Switcher */}
        <RoleSwitcher />

        {/* Date Selector */}
        <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 border border-border text-sm">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span className="text-foreground">Q4 2024</span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={cn(
              "relative p-2 rounded-lg",
              "bg-muted/50 border border-border",
              "hover:bg-muted transition-colors",
              showNotifications && "bg-muted border-primary/50"
            )}
          >
            <Bell className="w-5 h-5 text-muted-foreground" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full flex items-center justify-center text-[10px] text-white font-bold">
                {unreadCount}
              </span>
            )}
          </button>

          <NotificationPopup 
            isOpen={showNotifications} 
            onClose={() => setShowNotifications(false)}
            onMarkAllRead={() => setUnreadCount(0)}
          />
        </div>

        {/* User Profile Dropdown */}
        <UserProfileDropdown 
          userName="Alex Morgan"
          userRole="VP of Strategy"
          userInitials="AM"
        />
      </div>
    </header>
  );
};

export default LeadershipHeader;
