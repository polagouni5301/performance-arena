/**
 * Glitch Overlay - Visual distortion effect during page transitions
 */
import { motion } from "framer-motion";

const GlitchOverlay = () => {
  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-[100]"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      exit={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Horizontal glitch bars */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute left-0 right-0 bg-primary/30"
          style={{
            top: `${15 + i * 18}%`,
            height: `${2 + Math.random() * 4}px`,
          }}
          initial={{ scaleX: 0, x: i % 2 === 0 ? "-100%" : "100%" }}
          animate={{ 
            scaleX: [0, 1, 1, 0],
            x: [i % 2 === 0 ? "-100%" : "100%", "0%", "0%", i % 2 === 0 ? "100%" : "-100%"],
          }}
          transition={{ 
            duration: 0.5,
            delay: i * 0.05,
            times: [0, 0.3, 0.7, 1],
          }}
        />
      ))}
      
      {/* RGB split effect */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          background: `linear-gradient(
            90deg,
            hsla(0, 100%, 50%, 0.1) 0%,
            transparent 33%,
            hsla(120, 100%, 50%, 0.1) 66%,
            hsla(240, 100%, 50%, 0.1) 100%
          )`,
          mixBlendMode: "screen",
        }}
      />
      
      {/* Noise texture */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0.3 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          mixBlendMode: "overlay",
        }}
      />
    </motion.div>
  );
};

export default GlitchOverlay;
