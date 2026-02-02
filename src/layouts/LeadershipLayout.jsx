import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import LeadershipSidebar from "../components/navigation/LeadershipSidebar";
import LeadershipHeader from "../components/navigation/LeadershipHeader";
import CyberParticles from "@/components/effects/CyberParticles";
import CursorParticles from "@/components/effects/CursorParticles";
import { useSidebar } from "@/contexts/SidebarContext";
import { cn } from "@/lib/utils";

const pageVariants = {
  initial: {
    opacity: 0,
    y: 15,
    filter: "blur(6px)",
  },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    filter: "blur(4px)",
    transition: {
      duration: 0.25,
    },
  },
};

const LeadershipLayout = () => {
  const location = useLocation();
  const { collapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-background">
      {/* Cursor Particle Effects */}
      <CursorParticles />
      
      {/* Subtle background effects - Fixed */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <CyberParticles count={20} color="purple" speed={0.1} connectDistance={50} showConnections={false} />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-[120px]" />
      </div>
      
      {/* Fixed Sidebar */}
      <div className="fixed left-0 top-0 h-screen z-30">
        <LeadershipSidebar />
      </div>
      
      {/* Main Content - Uses margin-left with width calc for proper fill */}
      <div 
        className="flex flex-col min-h-screen relative z-10 transition-all duration-300"
        style={{
          marginLeft: collapsed ? '4rem' : '16rem',
          width: collapsed ? 'calc(100% - 4rem)' : 'calc(100% - 16rem)'
        }}
      >
        {/* Fixed Header */}
        <div className="sticky top-0 z-20">
          <LeadershipHeader />
        </div>
        
        {/* Glitch bar on page change */}
        <AnimatePresence>
          <motion.div
            key={`bar-${location.pathname}`}
            className="fixed top-0 left-0 right-0 h-0.5 z-50 bg-gradient-to-r from-primary via-secondary to-accent"
            initial={{ scaleX: 0, transformOrigin: "left" }}
            animate={{ scaleX: [0, 1, 0], transformOrigin: ["left", "left", "right"] }}
            transition={{ duration: 0.5, times: [0, 0.5, 1] }}
          />
        </AnimatePresence>
        
        {/* Scrollable Page Content with transitions */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default LeadershipLayout;