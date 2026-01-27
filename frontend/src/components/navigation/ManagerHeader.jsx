import { Bell, Search, Calendar, Plus, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import RoleSwitcher from "./RoleSwitcher";

const ManagerHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="h-16 border-b border-border bg-card/80 backdrop-blur-xl flex items-center justify-between px-6">
      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search agents, contests..."
            className="pl-10 pr-4 py-2 w-48 lg:w-64 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Role Switcher */}
        <RoleSwitcher />

        {/* Date */}
        <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/50 border border-border">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>

        {/* New Campaign Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/manager/contests/new")}
          className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-primary-foreground"
          style={{
            background: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(330 100% 50%) 100%)",
            boxShadow: "0 0 20px hsl(var(--primary) / 0.3)",
          }}
        >
          <Sparkles className="w-4 h-4" />
          New Contest
        </motion.button>

        {/* Notifications */}
        <button className="relative p-2.5 rounded-xl hover:bg-muted/50 transition-colors border border-transparent hover:border-border">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary animate-pulse" />
        </button>

        {/* Profile */}
        <div className="flex items-center gap-3 pl-3 border-l border-border">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center text-white font-bold text-sm">
              A
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-success border-2 border-card" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default ManagerHeader;
