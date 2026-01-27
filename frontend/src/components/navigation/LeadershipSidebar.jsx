import { NavLink, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Trophy, 
  BarChart3, 
  DollarSign,
  ChevronLeft, 
  ChevronRight,
  LogOut,
  Sparkles
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useSidebar } from "@/contexts/SidebarContext";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { path: "/leadership", icon: LayoutDashboard, label: "Overview", end: true },
  { path: "/leadership/leaderboards", icon: Trophy, label: "Leaderboards" },
  { path: "/leadership/reports", icon: BarChart3, label: "Performance Reports" },
  { path: "/leadership/roi", icon: DollarSign, label: "ROI Analysis" },
];

const SIDEBAR_COLLAPSED_WIDTH = "w-16";
const SIDEBAR_EXPANDED_WIDTH = "w-64";

const LeadershipSidebar = () => {
  const { collapsed, toggle } = useSidebar();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Get user display info from auth context
  const userName = user?.name || user?.email?.split('@')[0] || "Leader";
  const userInitial = userName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  const userRole = user?.role || "leadership";
  const roleLabel = userRole === 'leadership' ? 'VP of Strategy' : userRole.charAt(0).toUpperCase() + userRole.slice(1);

  return (
    <aside
      className={cn(
        "h-screen flex flex-col relative transition-all duration-300",
        "bg-sidebar-background border-r border-sidebar-border",
        collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_EXPANDED_WIDTH
      )}
    >
      {/* Logo Section */}
      <div className="h-16 flex items-center gap-3 px-4 border-b border-sidebar-border bg-gradient-to-r from-primary/10 to-transparent">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <span className="font-display text-lg font-bold text-foreground tracking-tight">
              EXEC.VIEW
            </span>
            <p className="text-[10px] text-muted-foreground tracking-widest uppercase">
              Leadership Suite
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 overflow-y-auto">
        {!collapsed && (
          <p className="px-2 mb-2 text-[10px] font-semibold text-muted-foreground tracking-widest uppercase">
            Strategic
          </p>
        )}
        <ul className="space-y-1">
          {navItems.map(({ path, icon: Icon, label, end }) => (
            <li key={path}>
              <NavLink
                to={path}
                end={end}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                    "hover:bg-sidebar-accent group",
                    isActive
                      ? "bg-gradient-to-r from-primary/20 to-transparent text-primary border-l-2 border-primary"
                      : "text-sidebar-foreground"
                  )
                }
              >
                <Icon className={cn(
                  "w-5 h-5 shrink-0 transition-colors",
                  "group-hover:text-primary"
                )} />
                {!collapsed && (
                  <span className="text-sm font-medium truncate">{label}</span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Profile Card - Now uses AuthContext data */}
      <div className="p-3 border-t border-sidebar-border">
        <div className={cn(
          "flex items-center gap-3 p-2 rounded-lg bg-sidebar-accent/50",
          collapsed && "justify-center"
        )}>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
            {userInitial}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{userName}</p>
              <p className="text-xs text-muted-foreground truncate">{roleLabel}</p>
            </div>
          )}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className={cn(
            "w-full mt-2 flex items-center gap-3 px-3 py-2 rounded-lg",
            "text-muted-foreground hover:text-destructive hover:bg-destructive/10",
            "transition-all duration-200",
            collapsed && "justify-center"
          )}
        >
          <LogOut className="w-4 h-4" />
          {!collapsed && <span className="text-sm">Logout</span>}
        </button>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={toggle}
        className={cn(
          "absolute -right-3 top-20 z-50",
          "w-6 h-6 rounded-full",
          "bg-sidebar-background border border-sidebar-border",
          "flex items-center justify-center",
          "hover:bg-primary hover:border-primary hover:text-white",
          "transition-all duration-200 shadow-lg"
        )}
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>
    </aside>
  );
};

export default LeadershipSidebar;
