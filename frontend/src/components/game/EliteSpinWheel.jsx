import { useEffect, useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Gift, Zap, Crown, Box, Lock, ChevronLeft, ChevronRight } from "lucide-react";
import WheelBulbRing from "./WheelBulbRing";
import RewardRevealModal from "./RewardRevealModal";

const hsl = (name, alpha = 1) => `hsl(var(${name}) / ${alpha})`;

const EliteSpinWheel = ({ onSpin, isLocked = false, onUnlock }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [pointerTick, setPointerTick] = useState(0);

  const segments = useMemo(
    () => [
      { label: "+500", sublabel: "PTS", tone: "primary", icon: Star },
      { label: "+100", sublabel: "XP", tone: "secondary", icon: Zap },
      { label: "x2", sublabel: "Multiplier", tone: "primary", icon: Crown },
      { label: "+250", sublabel: "PTS", tone: "primary", icon: Star },
      { label: "Mystery", sublabel: "Box", tone: "secondary", icon: Box },
      { label: "x3", sublabel: "Multiplier", tone: "primary", icon: Crown },
      { label: "+50", sublabel: "XP", tone: "secondary", icon: Zap },
      { label: "Elite", sublabel: "Gift", tone: "accent", icon: Gift },
    ],
    []
  );

  const segmentAngle = 360 / segments.length;

  useEffect(() => {
    if (!isSpinning) return;
    const id = window.setInterval(() => {
      setPointerTick((p) => (p === 0 ? -10 : 0));
    }, 110);
    return () => window.clearInterval(id);
  }, [isSpinning]);

  const handleSpin = useCallback(() => {
    if (isSpinning || isLocked) return;

    setIsSpinning(true);
    setShowResult(false);
    setResult(null);

    // Random segment and rotations
    const randomSegment = Math.floor(Math.random() * segments.length);
    const baseRotations = 5 + Math.floor(Math.random() * 3);
    const finalRotation = baseRotations * 360 + (segments.length - 1 - randomSegment) * segmentAngle + segmentAngle / 2;

    setRotation(prev => prev + finalRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setResult(segments[randomSegment]);
      setShowResult(true);
      onSpin?.(segments[randomSegment]);
    }, 5000);
  }, [isSpinning, isLocked, segments, segmentAngle, onSpin]);

  return (
    <div className="relative flex flex-col items-center">
      <RewardRevealModal
        open={showResult && !!result}
        onClose={() => setShowResult(false)}
        title="You Won"
        subtitle="Loot delivered to your vault"
        highlight={result ? `${result.label} ${result.sublabel}` : undefined}
        Icon={result?.icon}
        tone={result?.tone ?? "primary"}
      />

      {/* Wheel Container */}
      <div className="relative glass-card-hero p-5 sm:p-7">
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 lg:w-[26rem] lg:h-[26rem]">
          <div
            className="absolute -inset-8 rounded-full blur-2xl opacity-60"
            style={{
              background: `radial-gradient(circle, ${hsl("--primary", 0.25)} 0%, transparent 65%)`,
            }}
          />

          <WheelBulbRing count={28} spinning={isSpinning} radius={175} />
          {/* Spinning Wheel */}
          <motion.div
            className="absolute inset-0 rounded-full overflow-hidden"
            animate={{ rotate: rotation }}
            transition={{ 
              duration: 5, 
              ease: [0.2, 0.8, 0.2, 1],
            }}
            style={{
              boxShadow: "inset 0 0 30px hsl(var(--background) / 0.65)",
            }}
          >
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <defs>
                {/* Segment Gradients */}
                {segments.map((seg, i) => (
                  <linearGradient key={`grad-${i}`} id={`segGrad${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    {seg.tone === "secondary" ? (
                      <>
                        <stop offset="0%" stopColor="hsl(var(--secondary))" />
                        <stop offset="100%" stopColor="hsl(var(--secondary-glow))" />
                      </>
                    ) : seg.tone === "accent" ? (
                      <>
                        <stop offset="0%" stopColor="hsl(var(--accent))" />
                        <stop offset="100%" stopColor="hsl(var(--warning))" />
                      </>
                    ) : (
                      <>
                        <stop offset="0%" stopColor="hsl(var(--primary))" />
                        <stop offset="100%" stopColor="hsl(var(--primary-glow))" />
                      </>
                    )}
                  </linearGradient>
                ))}
                
                {/* Glow Filter */}
                <filter id="segmentGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="2" result="glow" />
                  <feMerge>
                    <feMergeNode in="glow" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                <radialGradient id="centerGrad" cx="40%" cy="40%">
                  <stop offset="0%" stopColor="hsl(var(--foreground))" stopOpacity="0.9" />
                  <stop offset="55%" stopColor="hsl(var(--muted))" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="hsl(var(--background))" stopOpacity="0.95" />
                </radialGradient>
              </defs>

              {/* Segments */}
              {segments.map((segment, i) => {
                const startAngle = i * segmentAngle - 90;
                const endAngle = (i + 1) * segmentAngle - 90;
                const startRad = (startAngle * Math.PI) / 180;
                const endRad = (endAngle * Math.PI) / 180;
                
                const x1 = 100 + 95 * Math.cos(startRad);
                const y1 = 100 + 95 * Math.sin(startRad);
                const x2 = 100 + 95 * Math.cos(endRad);
                const y2 = 100 + 95 * Math.sin(endRad);

                const largeArc = segmentAngle > 180 ? 1 : 0;

                const midAngle = (startAngle + endAngle) / 2;
                const midRad = (midAngle * Math.PI) / 180;
                const textRadius = 65;
                const textX = 100 + textRadius * Math.cos(midRad);
                const textY = 100 + textRadius * Math.sin(midRad);

                return (
                  <g key={i}>
                    {/* Segment Path */}
                    <path
                      d={`M 100 100 L ${x1} ${y1} A 95 95 0 ${largeArc} 1 ${x2} ${y2} Z`}
                      fill={`url(#segGrad${i})`}
                      stroke={hsl("--border", 1)}
                      strokeWidth="0.5"
                    />
                    
                    {/* Segment Divider Line */}
                    <line
                      x1="100"
                      y1="100"
                      x2={x1}
                      y2={y1}
                      stroke={hsl("--secondary", 0.8)}
                      strokeWidth="2"
                      filter="url(#segmentGlow)"
                    />

                    {/* Text Labels */}
                    <g transform={`translate(${textX}, ${textY}) rotate(${midAngle + 90})`}>
                      <text
                        textAnchor="middle"
                        fill={hsl("--foreground", 1)}
                        fontSize="12"
                        fontWeight="bold"
                        fontFamily="Sora, sans-serif"
                        dy="-4"
                        style={{ filter: "drop-shadow(0 0 10px hsl(var(--foreground) / 0.25))" }}
                      >
                        {segment.label}
                      </text>
                      <text
                        textAnchor="middle"
                        fill={hsl("--muted-foreground", 1)}
                        fontSize="7"
                        fontFamily="Sora, sans-serif"
                        dy="6"
                      >
                        {segment.sublabel}
                      </text>
                    </g>
                  </g>
                );
              })}

              {/* Center Hub */}
              <circle cx="100" cy="100" r="20" fill="url(#centerGrad)" />
              <circle
                cx="100"
                cy="100"
                r="15"
                fill={hsl("--background", 0.9)}
                stroke={hsl("--border", 1)}
                strokeWidth="1"
              />
              <circle cx="100" cy="100" r="8" fill={hsl("--foreground", 0.7)} />
            </svg>
          </motion.div>

          {/* Side Arrows */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-6">
            <motion.div
              animate={{ x: [-2, 2, -2] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="p-2 rounded-lg bg-gradient-to-r from-purple-600 to-purple-800 shadow-[0_0_15px_hsla(280,100%,50%,0.5)]"
            >
              <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6 text-purple-300" />
            </motion.div>
          </div>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-6">
            <motion.div
              animate={{ x: [2, -2, 2] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="p-2 rounded-lg bg-gradient-to-r from-purple-800 to-purple-600 shadow-[0_0_15px_hsla(280,100%,50%,0.5)]"
            >
              <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6 text-purple-300" />
            </motion.div>
          </div>

          {/* Pointer/Picker (top) */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20">
            <motion.div
              animate={isSpinning ? { scale: [1, 1.08, 1], rotate: pointerTick } : { rotate: 0 }}
              transition={{ duration: 0.12, repeat: isSpinning ? Infinity : 0 }}
              className="relative"
            >
              {/* Diamond pointer */}
              <div 
                className="w-6 h-8 lg:w-8 lg:h-10"
                style={{
                  background: `linear-gradient(180deg, ${hsl("--secondary", 1)} 0%, ${hsl(
                    "--secondary",
                    0.85
                  )} 55%, ${hsl("--secondary", 0.7)} 100%)`,
                  clipPath: "polygon(50% 100%, 0 0, 100% 0)",
                  boxShadow: `0 0 20px ${hsl("--secondary", 0.55)}`,
                }}
              />
            </motion.div>
          </div>

          {/* Lock Overlay */}
          <AnimatePresence>
            {isLocked && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 rounded-full flex items-center justify-center z-30"
                style={{
                  background: "hsl(var(--background) / 0.7)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <motion.div
                  className="text-center"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Lock className="w-12 h-12 lg:w-16 lg:h-16 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm lg:text-base font-bold text-muted-foreground">LOCKED</p>
                  <p className="text-xs text-muted-foreground/70 mt-1">Complete goals to unlock</p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Light Burst Effect */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 30%, ${hsl("--foreground", 0.08)} 0%, transparent 55%)`,
          }}
        />
      </div>

      {/* Spin Button */}
      <motion.button
        onClick={isLocked ? onUnlock : handleSpin}
        disabled={isSpinning}
        whileHover={{ scale: isSpinning ? 1 : 1.02 }}
        whileTap={{ scale: isSpinning ? 1 : 0.98 }}
        className="mt-5 lg:mt-7 relative px-12 lg:px-20 py-4 lg:py-5 rounded-xl overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed border border-border"
        style={{
          background: "var(--gradient-primary)",
          boxShadow: "var(--shadow-neon-primary)",
        }}
      >
        {/* Button shine */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          animate={{ x: ["-200%", "200%"] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
        
        <span 
          className="relative text-xl lg:text-2xl font-bold text-primary-foreground tracking-wider"
          style={{ 
            fontFamily: "'Sora', sans-serif",
            textShadow: "0 0 20px hsl(var(--foreground) / 0.35)"
          }}
        >
          {isSpinning ? "SPINNING..." : isLocked ? "UNLOCK" : "SPIN TO WIN"}
        </span>
      </motion.button>

      {/* Next Spin Timer */}
      <p className="mt-3 text-sm text-muted-foreground font-mono">
        Next Spin in <span className="text-secondary font-bold">12h 45m</span>
      </p>
    </div>
  );
};

export default EliteSpinWheel;
