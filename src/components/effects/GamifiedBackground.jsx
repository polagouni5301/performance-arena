/**
 * Gamified Background Component
 * Shared immersive background across Landing, Login, and Loading pages
 * Features performance-friendly toggles for reduced motion and low power mode
 */
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";

// Check for user preference for reduced motion
const prefersReducedMotion = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

// Detect low power / battery saver mode (heuristic)
const isLowPowerMode = () => {
  if (typeof navigator === "undefined") return false;
  // Check for battery API
  if ("getBattery" in navigator) {
    return false; // Will be updated async
  }
  return false;
};

const GamifiedBackground = ({
  variant = "default", // "default" | "minimal" | "intense"
  showGrid = true,
  showOrbs = true,
  showParticles = true,
  showDataStreams = false,
  backgroundImage = null,
  backgroundOpacity = 0.3,
  primaryColor = "320, 100%, 55%", // HSL values without hsl()
  secondaryColor = "195, 100%, 50%",
  className = "",
}) => {
  const [reducedMotion, setReducedMotion] = useState(prefersReducedMotion);
  const [lowPower, setLowPower] = useState(false);

  // Listen for reduced motion preference changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = (e) => setReducedMotion(e.matches);
    
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Check battery status for low power mode
  useEffect(() => {
    if (typeof navigator === "undefined" || !("getBattery" in navigator)) return;
    
    const checkBattery = async () => {
      try {
        const battery = await navigator.getBattery();
        setLowPower(battery.level < 0.2 && !battery.charging);
        
        battery.addEventListener("levelchange", () => {
          setLowPower(battery.level < 0.2 && !battery.charging);
        });
      } catch (e) {
        // Battery API not supported
      }
    };
    
    checkBattery();
  }, []);

  // Performance mode: disable animations in reduced motion or low power
  const performanceMode = reducedMotion || lowPower;
  
  // Adjust particle count based on variant and performance
  const particleCount = useMemo(() => {
    if (performanceMode) return 0;
    switch (variant) {
      case "minimal": return 8;
      case "intense": return 25;
      default: return 15;
    }
  }, [variant, performanceMode]);

  const orbCount = useMemo(() => {
    if (performanceMode) return 1;
    switch (variant) {
      case "minimal": return 1;
      case "intense": return 3;
      default: return 2;
    }
  }, [variant, performanceMode]);

  const streamCount = useMemo(() => {
    if (performanceMode) return 0;
    return variant === "intense" ? 12 : 8;
  }, [variant, performanceMode]);

  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden ${className}`}>
      {/* Background Image Layer */}
      {backgroundImage && (
        <img
          src={backgroundImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: backgroundOpacity }}
        />
      )}

      {/* Base Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background" />

      {/* Grid Pattern */}
      {showGrid && (
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(hsla(${primaryColor}, 0.4) 1px, transparent 1px), linear-gradient(90deg, hsla(${primaryColor}, 0.4) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
      )}

      {/* Animated Gradient Orbs */}
      {showOrbs && (
        <>
          {Array.from({ length: orbCount }).map((_, i) => (
            <motion.div
              key={`orb-${i}`}
              className="absolute rounded-full"
              style={{
                width: 350 + i * 100,
                height: 350 + i * 100,
                background: `radial-gradient(circle, hsla(${i % 2 === 0 ? primaryColor : secondaryColor}, ${0.12 - i * 0.02}) 0%, transparent 60%)`,
                top: i % 2 === 0 ? "10%" : "60%",
                left: i % 2 === 0 ? "60%" : "10%",
              }}
              animate={
                performanceMode
                  ? {}
                  : {
                      scale: [1, 1.15, 1],
                      opacity: [0.4, 0.7, 0.4],
                    }
              }
              transition={{
                duration: 6 + i * 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </>
      )}

      {/* Floating Particles */}
      {showParticles && particleCount > 0 && (
        <>
          {Array.from({ length: particleCount }).map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute rounded-full"
              style={{
                width: 2 + Math.random() * 4,
                height: 2 + Math.random() * 4,
                background: `hsla(${i % 2 === 0 ? primaryColor : secondaryColor}, 0.6)`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                boxShadow: `0 0 8px hsla(${i % 2 === 0 ? primaryColor : secondaryColor}, 0.4)`,
              }}
              animate={{
                y: [0, -40 - Math.random() * 30, 0],
                x: [0, (Math.random() - 0.5) * 20, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 4 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 4,
                ease: "easeInOut",
              }}
            />
          ))}
        </>
      )}

      {/* Data Streams (vertical lines) */}
      {showDataStreams && !performanceMode && (
        <DataStreams count={streamCount} primaryColor={primaryColor} />
      )}

      {/* Vignette Effect */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 0%, hsl(var(--background)) 85%)",
          opacity: 0.6,
        }}
      />
    </div>
  );
};

// Data Streams Sub-component
const DataStreams = ({ count = 8, primaryColor = "320, 100%, 55%" }) => {
  const [streams, setStreams] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setStreams((prev) => {
        const newStreams = [
          ...prev,
          { id: Date.now(), x: Math.random() * 100, delay: Math.random() * 0.3 },
        ];
        return newStreams.slice(-count);
      });
    }, 250);
    return () => clearInterval(interval);
  }, [count]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {streams.map((stream) => (
        <motion.div
          key={stream.id}
          className="absolute w-px h-10"
          style={{
            background: `linear-gradient(to bottom, hsla(${primaryColor}, 0.7), hsla(${primaryColor}, 0.3), transparent)`,
            left: `${stream.x}%`,
          }}
          initial={{ top: -40, opacity: 0.6 }}
          animate={{ top: "100%", opacity: 0 }}
          transition={{ duration: 1.5, ease: "linear", delay: stream.delay }}
        />
      ))}
    </div>
  );
};

export default GamifiedBackground;
