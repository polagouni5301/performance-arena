import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import MatrixBackground from "../components/effects/MatrixBackground";

const pageVariants = {
  initial: {
    opacity: 0,
    filter: "blur(8px) brightness(1.5)",
  },
  animate: {
    opacity: 1,
    filter: "blur(0px) brightness(1)",
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    filter: "blur(4px) brightness(1.3)",
    transition: {
      duration: 0.25,
    },
  },
};

const PublicLayout = () => {
  const location = useLocation();
  
  // Skip layout effects for loading page to prevent interference
  const isLoadingPage = location.pathname === "/loading" || location.pathname === "/arena-loading";

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Only show matrix background on non-loading pages */}
      {!isLoadingPage && <MatrixBackground />}
      
      {/* Glitch transition bar */}
      {!isLoadingPage && (
        <AnimatePresence>
          <motion.div
            key={`bar-${location.pathname}`}
            className="fixed top-0 left-0 right-0 h-1 z-50 bg-gradient-to-r from-primary via-secondary to-accent"
            initial={{ scaleX: 0, transformOrigin: "left" }}
            animate={{ scaleX: [0, 1, 0], transformOrigin: ["left", "left", "right"] }}
            transition={{ duration: 0.6, times: [0, 0.5, 1] }}
          />
        </AnimatePresence>
      )}
      
      {isLoadingPage ? (
        <Outlet />
      ) : (
        <AnimatePresence mode="wait">
          <motion.div 
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative z-10"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default PublicLayout;