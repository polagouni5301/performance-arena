/**
 * Cyber Page Transition - Glitch/Wipe Effects
 * Wraps page content with animated entry/exit transitions
 */
import { motion } from "framer-motion";

const glitchVariants = {
  initial: {
    opacity: 0,
    filter: "blur(8px) brightness(2)",
    clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)",
  },
  animate: {
    opacity: 1,
    filter: "blur(0px) brightness(1)",
    clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
      filter: { duration: 0.3 },
      clipPath: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    },
  },
  exit: {
    opacity: 0,
    filter: "blur(4px) brightness(1.5)",
    clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const PageTransition = ({ children }) => {
  return (
    <motion.div
      variants={glitchVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="w-full"
    >
      {/* Scan Line Overlay during transition */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-50"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div 
          className="absolute inset-0"
          style={{
            background: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              hsla(var(--primary) / 0.03) 2px,
              hsla(var(--primary) / 0.03) 4px
            )`,
          }}
        />
      </motion.div>
      
      {/* Glitch Bar Effect */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 z-50 bg-gradient-to-r from-primary via-secondary to-accent"
        initial={{ scaleX: 0, transformOrigin: "left" }}
        animate={{ scaleX: [0, 1, 0], transformOrigin: ["left", "left", "right"] }}
        transition={{ duration: 0.6, times: [0, 0.5, 1] }}
      />
      
      {children}
    </motion.div>
  );
};

export default PageTransition;
