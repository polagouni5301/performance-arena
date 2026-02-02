/**
 * Animated Points Counter
 * Cinematic points animation when claiming rewards
 */
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Star, Trophy, Zap, Crown, TrendingUp } from "lucide-react";

const AnimatedPointsCounter = ({
  startValue = 0,
  endValue = 0,
  duration = 2500,
  onComplete,
  isActive = false,
  label = "POINTS",
  showCelebration = true,
}) => {
  const [displayValue, setDisplayValue] = useState(startValue);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const animationRef = useRef(null);
  const difference = endValue - startValue;

  useEffect(() => {
    if (!isActive || difference === 0) return;

    setIsAnimating(true);
    setShowFlash(true);
    setTimeout(() => setShowFlash(false), 300);

    const startTime = performance.now();
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for dramatic effect
      const easeOutExpo = 1 - Math.pow(2, -10 * progress);
      
      const currentValue = Math.floor(startValue + difference * easeOutExpo);
      setDisplayValue(currentValue);

      // Show particles at certain thresholds
      if (progress > 0.3 && progress < 0.9) {
        setShowParticles(true);
      }

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(endValue);
        setIsAnimating(false);
        setShowParticles(false);
        onComplete?.();
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, startValue, endValue, duration, difference, onComplete]);

  const formattedValue = displayValue.toLocaleString();
  const pointsGained = difference > 0 ? `+${difference.toLocaleString()}` : difference.toLocaleString();

  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* Flash Effect */}
      <AnimatePresence>
        {showFlash && (
          <motion.div
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: 0, scale: 2 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-accent/50 rounded-full blur-3xl pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Main Counter */}
      <motion.div
        className="relative z-10"
        animate={isAnimating ? {
          scale: [1, 1.05, 1],
        } : {}}
        transition={{ duration: 0.3, repeat: isAnimating ? Infinity : 0 }}
      >
        {/* Points Gained Label */}
        <AnimatePresence>
          {isActive && difference > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.5 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute -top-8 left-1/2 -translate-x-1/2 flex items-center gap-1"
            >
              <TrendingUp className="w-4 h-4 text-success" />
              <span className="text-lg font-bold text-success drop-shadow-[0_0_10px_hsl(var(--success))]">
                {pointsGained}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Value */}
        <motion.div
          className="flex items-center gap-2"
          animate={isAnimating ? {
            textShadow: [
              "0 0 20px hsl(var(--accent) / 0.5)",
              "0 0 40px hsl(var(--accent) / 0.8)",
              "0 0 20px hsl(var(--accent) / 0.5)",
            ],
          } : {}}
          transition={{ duration: 0.5, repeat: isAnimating ? Infinity : 0 }}
        >
          <Star className="w-8 h-8 text-accent animate-pulse" />
          <span
            className="font-display text-5xl md:text-6xl font-black tracking-tight"
            style={{
              background: isAnimating 
                ? "linear-gradient(135deg, hsl(var(--accent)) 0%, hsl(var(--warning)) 50%, hsl(var(--success)) 100%)"
                : "linear-gradient(135deg, hsl(var(--accent)) 0%, hsl(var(--warning)) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {formattedValue}
          </span>
        </motion.div>

        {/* Label */}
        <motion.p
          className="text-center text-sm text-muted-foreground font-medium mt-1 tracking-widest"
          animate={isAnimating ? { opacity: [0.7, 1, 0.7] } : {}}
          transition={{ duration: 0.5, repeat: isAnimating ? Infinity : 0 }}
        >
          {label}
        </motion.p>
      </motion.div>

      {/* Flying Particles */}
      <AnimatePresence>
        {showParticles && showCelebration && (
          <>
            {Array.from({ length: 20 }).map((_, i) => {
              const angle = (i / 20) * Math.PI * 2;
              const radius = 60 + Math.random() * 40;
              const delay = Math.random() * 0.3;
              
              return (
                <motion.div
                  key={`particle-${i}`}
                  className="absolute pointer-events-none z-20"
                  initial={{ 
                    x: 0, 
                    y: 0, 
                    opacity: 1, 
                    scale: 0 
                  }}
                  animate={{
                    x: Math.cos(angle) * radius,
                    y: Math.sin(angle) * radius - 20,
                    opacity: 0,
                    scale: 1,
                    rotate: Math.random() * 360,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ 
                    duration: 1 + Math.random() * 0.5, 
                    delay,
                    ease: "easeOut" 
                  }}
                >
                  {i % 4 === 0 ? (
                    <Sparkles className="w-4 h-4 text-accent drop-shadow-[0_0_8px_hsl(var(--accent))]" />
                  ) : i % 4 === 1 ? (
                    <Star className="w-3 h-3 text-warning drop-shadow-[0_0_8px_hsl(var(--warning))]" />
                  ) : i % 4 === 2 ? (
                    <Zap className="w-3 h-3 text-success drop-shadow-[0_0_8px_hsl(var(--success))]" />
                  ) : (
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: ["hsl(var(--accent))", "hsl(var(--warning))", "hsl(var(--success))"][Math.floor(Math.random() * 3)],
                      }}
                    />
                  )}
                </motion.div>
              );
            })}
          </>
        )}
      </AnimatePresence>

      {/* Orbiting Icons */}
      <AnimatePresence>
        {isAnimating && showCelebration && (
          <>
            {[Trophy, Crown, Star].map((Icon, i) => (
              <motion.div
                key={`orbit-${i}`}
                className="absolute pointer-events-none"
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0.5, 1, 0.5],
                  rotate: [0, 360],
                  x: [0, Math.cos(i * (Math.PI * 2 / 3)) * 80, 0],
                  y: [0, Math.sin(i * (Math.PI * 2 / 3)) * 80, 0],
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              >
                <Icon className="w-6 h-6 text-accent drop-shadow-[0_0_15px_hsl(var(--accent))]" />
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Pulse Rings */}
      <AnimatePresence>
        {isAnimating && showCelebration && (
          <>
            {[0, 1, 2].map((i) => (
              <motion.div
                key={`ring-${i}`}
                className="absolute rounded-full border-2 border-accent/30 pointer-events-none"
                initial={{ width: 20, height: 20, opacity: 0.8 }}
                animate={{
                  width: [20, 200],
                  height: [20, 200],
                  opacity: [0.8, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.5,
                  ease: "easeOut",
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AnimatedPointsCounter;
