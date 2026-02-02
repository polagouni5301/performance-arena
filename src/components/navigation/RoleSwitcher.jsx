import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { User, Users, ChevronDown, Check, Zap, Crown, Settings } from "lucide-react";

const roles = [
  { id: "agent", label: "Agent View", icon: User, path: "/agent", color: "from-primary to-pink-500", desc: "Personal dashboard" },
  { id: "manager", label: "Manager View", icon: Users, path: "/manager", color: "from-secondary to-cyan-500", desc: "Team management" },
  { id: "leadership", label: "Leadership View", icon: Crown, path: "/leadership", color: "from-amber-500 to-orange-600", desc: "Executive insights" },
  { id: "admin", label: "Admin View", icon: Settings, path: "/admin", color: "from-pink-500 to-rose-600", desc: "System configuration" },
];

const RoleSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const currentRole = location.pathname.startsWith("/manager") ? "manager" : 
                       location.pathname.startsWith("/leadership") ? "leadership" : 
                       location.pathname.startsWith("/admin") ? "admin" : "agent";
  const activeRole = roles.find(r => r.id === currentRole) || roles[0];

  const handleSwitch = (role) => {
    setIsOpen(false);
    navigate(role.path);
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2 rounded-xl bg-muted/50 border border-border hover:border-primary/50 transition-all"
      >
        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${activeRole.color} flex items-center justify-center`}>
          <activeRole.icon className="w-4 h-4 text-white" />
        </div>
        <div className="text-left hidden sm:block">
          <p className="text-xs text-muted-foreground">Viewing as</p>
          <p className="text-sm font-medium text-foreground">{activeRole.label}</p>
        </div>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40"
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-64 p-2 rounded-2xl bg-card/95 backdrop-blur-xl border border-border shadow-2xl z-50"
            >
              <div className="px-3 py-2 mb-2">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Switch View</p>
              </div>

              {roles.map((role) => (
                <motion.button
                  key={role.id}
                  whileHover={{ x: 4 }}
                  onClick={() => handleSwitch(role)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-colors ${
                    currentRole === role.id
                      ? "bg-primary/20 text-primary"
                      : "text-foreground hover:bg-muted/50"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${role.color} flex items-center justify-center`}>
                    <role.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium">{role.label}</p>
                    <p className="text-xs text-muted-foreground">{role.desc}</p>
                  </div>
                  {currentRole === role.id && (
                    <Check className="w-5 h-5 text-primary" />
                  )}
                </motion.button>
              ))}

              <div className="mt-2 pt-2 border-t border-border">
                <div className="px-3 py-2 flex items-center gap-2 text-xs text-muted-foreground">
                  <Zap className="w-3 h-3" />
                  <span>Quick switch: Press <kbd className="px-1.5 py-0.5 rounded bg-muted font-mono">R</kbd></span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RoleSwitcher;
