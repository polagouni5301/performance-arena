import { useState } from "react";
import { Bell, RefreshCw, FileText } from "lucide-react";
import { cn } from "../../lib/utils";
import NotificationPopup from "./NotificationPopup";
import UserProfileDropdown from "./UserProfileDropdown";
import RoleSwitcher from "./RoleSwitcher";

const AdminHeader = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-4 border-b border-border bg-background/80 backdrop-blur-lg">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Home</span>
        <span>›</span>
        <span>Admin</span>
        <span>›</span>
        <span className="text-foreground font-medium">Overview</span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Role Switcher */}
        <RoleSwitcher />

        {/* Refresh Button */}
        <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 border border-border text-sm text-foreground hover:bg-muted transition-colors">
          <RefreshCw className="w-4 h-4" />
          <span className="hidden md:inline">Refresh Data</span>
        </button>

        {/* Generate Report Button */}
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
          <FileText className="w-4 h-4" />
          <span className="hidden md:inline">Generate Report</span>
        </button>

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
          userName="Sarah Jenkins"
          userRole="Super Admin"
          userInitials="SJ"
        />
      </div>
    </header>
  );
};

export default AdminHeader;
