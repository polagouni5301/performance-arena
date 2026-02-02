/**
 * Spin Wheel Modal - Full-screen immersive spin wheel experience
 * Features token deduction, animated claiming, and backend sync
 */
import { useState, useCallback, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Gift, Zap, Crown, Box, Lock, X, ChevronLeft, ChevronRight, Trophy, TrendingUp, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import WheelBulbRing from "./WheelBulbRing";
import AnimatedPointsCounter from "./AnimatedPointsCounter";
import { Portal } from "@/components/ui/Portal";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";

const hsl = (name, alpha = 1) => `hsl(var(${name}) / ${alpha})`;

const SpinWheelModal = ({ 
  isOpen, 
  onClose, 
  onSpin, 
  onClaimReward,
  tokenBalance = 0,
  tokenCost = 100,
  currentPoints = 0,
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [pointerTick, setPointerTick] = useState(0);
  const [isClaiming, setIsClaiming] = useState(false);
  const [showPointsAnimation, setShowPointsAnimation] = useState(false);
  const [claimComplete, setClaimComplete] = useState(false);
  const [error, setError] = useState(null);
  const [spinResult, setSpinResult] = useState(null);

  const segments = useMemo(
    () => [
      { label: "+500", sublabel: "PTS", tone: "primary", icon: Star, points: 500, xp: 0 },
      { label: "+100", sublabel: "XP", tone: "secondary", icon: Zap, points: 0, xp: 100 },
      { label: "x2", sublabel: "Multiplier", tone: "primary", icon: Crown, points: 200, xp: 50 },
      { label: "+250", sublabel: "PTS", tone: "primary", icon: Star, points: 250, xp: 0 },
      { label: "Mystery", sublabel: "Box", tone: "secondary", icon: Box, points: 300, xp: 75 },
      { label: "x3", sublabel: "Multiplier", tone: "primary", icon: Crown, points: 400, xp: 100 },
      { label: "+50", sublabel: "XP", tone: "secondary", icon: Zap, points: 0, xp: 50 },
      { label: "Elite", sublabel: "Gift", tone: "accent", icon: Gift, points: 1000, xp: 200 },
    ],
    []
  );

  const segmentAngle = 360 / segments.length;
  const canSpin = tokenBalance >= tokenCost;

  useLockBodyScroll(!!isOpen);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setShowResult(false);
      setResult(null);
      setIsClaiming(false);
      setShowPointsAnimation(false);
      setClaimComplete(false);
      setError(null);
      setSpinResult(null);
    }
  }, [isOpen]);

  // Pointer tick animation during spin
  useEffect(() => {
    if (!isSpinning) return;
    const id = window.setInterval(() => {
      setPointerTick((p) => (p === 0 ? -10 : 0));
    }, 110);
    return () => window.clearInterval(id);
  }, [isSpinning]);

  const handleSpin = useCallback(async () => {
    if (isSpinning || !canSpin) return;

    setIsSpinning(true);
    setShowResult(false);
    setResult(null);
    setError(null);

    try {
      // Call backend to spin and deduct tokens
      const backendResult = await onSpin(tokenCost);
      
      if (!backendResult?.success) {
        throw new Error(backendResult?.error?.message || 'Spin failed');
      }

      setSpinResult(backendResult);
      
      // Use the segment index from backend or randomize
      const segmentIndex = backendResult.segmentIndex ?? Math.floor(Math.random() * segments.length);
      const baseRotations = 5 + Math.floor(Math.random() * 3);
      const finalRotation = baseRotations * 360 + (segments.length - 1 - segmentIndex) * segmentAngle + segmentAngle / 2;

      setRotation(prev => prev + finalRotation);

      // Wait for spin animation to complete
      setTimeout(() => {
        setIsSpinning(false);
        setResult(backendResult.reward || segments[segmentIndex]);
        setShowResult(true);
      }, 5000);
    } catch (err) {
      setIsSpinning(false);
      setError(err.message || 'Failed to spin');
    }
  }, [isSpinning, canSpin, onSpin, tokenCost, segments, segmentAngle]);

  const handleClaimReward = useCallback(async () => {
    if (!result || isClaiming) return;

    setIsClaiming(true);
    try {
      await onClaimReward({ reward: result });
      setShowPointsAnimation(true);
    } catch (err) {
      console.error('Failed to claim reward:', err);
      setIsClaiming(false);
    }
  }, [result, isClaiming, onClaimReward]);

  const rewardPoints = result?.points || 0;
  const rewardXP = result?.xp || 0;

  // Auto-close after claim complete
  useEffect(() => {
    if (!isOpen) return;
    if (claimComplete) {
      const timer = setTimeout(() => {
        onClose?.();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [claimComplete, onClose]);

  if (!isOpen) return null;

  return (
    <Portal>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-[9999] flex items-center justify-center overflow-hidden"
          style={{ margin: 0, padding: 0 }}
          onClick={onClose}
        >
          {/* Background Effects */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
              style={{
                background: `radial-gradient(circle, hsl(var(--primary) / 0.3) 0%, transparent 70%)`,
              }}
              animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-accent/50"
                initial={{
                  x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1000),
                  y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 800),
                }}
                animate={{
                  y: [null, -30, 30, -15, 15],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  duration: 4 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          {/* Main Content - Perfectly centered */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative flex flex-col items-center max-w-md mx-auto px-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button - Always visible */}
            <motion.button
              onClick={onClose}
              className="absolute -top-2 -right-2 sm:right-0 p-2.5 rounded-full bg-card border border-border shadow-lg hover:bg-muted transition-colors z-50"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-5 h-5 text-foreground" />
            </motion.button>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-4"
          >
            <h2 className="font-display text-2xl lg:text-3xl text-foreground tracking-widest flex items-center gap-2 justify-center">
              <Sparkles className="w-6 h-6 text-accent" />
              ELITE SPIN WHEEL
              <Sparkles className="w-6 h-6 text-accent" />
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {showResult ? "You won a reward!" : `Cost: ${tokenCost} tokens per spin`}
            </p>
          </motion.div>

          {/* Token Balance Display */}
          <motion.div
            className={cn(
              "px-4 py-2 rounded-xl border mb-4 flex items-center gap-2",
              canSpin 
                ? "bg-success/20 border-success/40" 
                : "bg-destructive/20 border-destructive/40"
            )}
            animate={!canSpin ? { scale: [1, 1.02, 1] } : {}}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <Zap className={cn("w-5 h-5", canSpin ? "text-success" : "text-destructive")} />
            <span className="font-bold text-lg">
              {tokenBalance.toLocaleString()} tokens
            </span>
            {!canSpin && (
              <span className="text-sm text-destructive">
                (Need {tokenCost - tokenBalance} more)
              </span>
            )}
          </motion.div>

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 px-4 py-2 rounded-lg bg-destructive/20 border border-destructive/40 text-destructive text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Wheel Container */}
          <div className="relative glass-card-hero p-5 sm:p-7">
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80">
              <div
                className="absolute -inset-8 rounded-full blur-2xl opacity-60"
                style={{
                  background: `radial-gradient(circle, ${hsl("--primary", 0.25)} 0%, transparent 65%)`,
                }}
              />

              <WheelBulbRing count={28} spinning={isSpinning} radius={145} />

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
                    {segments.map((seg, i) => (
                      <linearGradient key={`grad-${i}`} id={`modalSegGrad${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
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
                    <filter id="modalSegmentGlow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="2" result="glow" />
                      <feMerge>
                        <feMergeNode in="glow" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                    <radialGradient id="modalCenterGrad" cx="40%" cy="40%">
                      <stop offset="0%" stopColor="hsl(var(--foreground))" stopOpacity="0.9" />
                      <stop offset="55%" stopColor="hsl(var(--muted))" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="hsl(var(--background))" stopOpacity="0.95" />
                    </radialGradient>
                  </defs>

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
                        <path
                          d={`M 100 100 L ${x1} ${y1} A 95 95 0 ${largeArc} 1 ${x2} ${y2} Z`}
                          fill={`url(#modalSegGrad${i})`}
                          stroke={hsl("--border", 1)}
                          strokeWidth="0.5"
                        />
                        <line
                          x1="100"
                          y1="100"
                          x2={x1}
                          y2={y1}
                          stroke={hsl("--secondary", 0.8)}
                          strokeWidth="2"
                          filter="url(#modalSegmentGlow)"
                        />
                        <g transform={`translate(${textX}, ${textY}) rotate(${midAngle + 90})`}>
                          <text
                            textAnchor="middle"
                            fill={hsl("--foreground", 1)}
                            fontSize="11"
                            fontWeight="bold"
                            fontFamily="Sora, sans-serif"
                            dy="-4"
                          >
                            {segment.label}
                          </text>
                          <text
                            textAnchor="middle"
                            fill={hsl("--muted-foreground", 1)}
                            fontSize="6"
                            fontFamily="Sora, sans-serif"
                            dy="5"
                          >
                            {segment.sublabel}
                          </text>
                        </g>
                      </g>
                    );
                  })}

                  <circle cx="100" cy="100" r="20" fill="url(#modalCenterGrad)" />
                  <circle cx="100" cy="100" r="15" fill={hsl("--background", 0.9)} stroke={hsl("--border", 1)} strokeWidth="1" />
                  <circle cx="100" cy="100" r="8" fill={hsl("--foreground", 0.7)} />
                </svg>
              </motion.div>

              {/* Side Arrows */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4">
                <motion.div
                  animate={{ x: [-2, 2, -2] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="p-2 rounded-lg bg-gradient-to-r from-primary to-secondary shadow-lg"
                >
                  <ChevronLeft className="w-5 h-5 text-primary-foreground" />
                </motion.div>
              </div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4">
                <motion.div
                  animate={{ x: [2, -2, 2] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="p-2 rounded-lg bg-gradient-to-r from-secondary to-primary shadow-lg"
                >
                  <ChevronRight className="w-5 h-5 text-primary-foreground" />
                </motion.div>
              </div>

              {/* Pointer */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20">
                <motion.div
                  animate={isSpinning ? { scale: [1, 1.08, 1], rotate: pointerTick } : { rotate: 0 }}
                  transition={{ duration: 0.12, repeat: isSpinning ? Infinity : 0 }}
                  className="relative"
                >
                  <div 
                    className="w-6 h-8"
                    style={{
                      background: `linear-gradient(180deg, ${hsl("--secondary", 1)} 0%, ${hsl("--secondary", 0.7)} 100%)`,
                      clipPath: "polygon(50% 100%, 0 0, 100% 0)",
                      boxShadow: `0 0 20px ${hsl("--secondary", 0.55)}`,
                    }}
                  />
                </motion.div>
              </div>

              {/* Lock Overlay */}
              <AnimatePresence>
                {!canSpin && !showResult && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 rounded-full flex items-center justify-center z-30"
                    style={{
                      background: "hsl(var(--background) / 0.8)",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <motion.div
                      className="text-center"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Lock className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-base font-bold text-muted-foreground">INSUFFICIENT TOKENS</p>
                      <p className="text-xs text-muted-foreground/70 mt-1">
                        Need {tokenCost} tokens to spin
                      </p>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Result Display */}
          <AnimatePresence>
            {showResult && result && !showPointsAnimation && !claimComplete && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="mt-6 text-center"
              >
                <motion.div
                  className="flex items-center justify-center gap-3 mb-4"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Trophy className="w-10 h-10 text-accent drop-shadow-[0_0_20px_hsl(var(--accent))]" />
                  <div>
                    <p className="text-3xl font-black text-accent">
                      {result.label} {result.sublabel}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {rewardPoints > 0 && `+${rewardPoints} PTS`}
                      {rewardPoints > 0 && rewardXP > 0 && ' • '}
                      {rewardXP > 0 && `+${rewardXP} XP`}
                    </p>
                  </div>
                </motion.div>

                <motion.button
                  onClick={handleClaimReward}
                  disabled={isClaiming}
                  className={cn(
                    "px-8 py-4 rounded-xl bg-gradient-to-r from-accent to-warning text-accent-foreground font-bold text-lg uppercase tracking-wider shadow-lg shadow-accent/40",
                    isClaiming && "opacity-70 cursor-not-allowed"
                  )}
                  whileHover={!isClaiming ? { scale: 1.05 } : {}}
                  whileTap={!isClaiming ? { scale: 0.95 } : {}}
                >
                  {isClaiming ? (
                    <>
                      <motion.div
                        className="w-5 h-5 inline-block mr-2 border-2 border-current border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      CLAIMING...
                    </>
                  ) : (
                    <>
                      <TrendingUp className="w-5 h-5 inline mr-2" />
                      CLAIM REWARD
                    </>
                  )}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Animated Points Counter */}
          <AnimatePresence>
            {showPointsAnimation && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="mt-6"
              >
                <AnimatedPointsCounter
                  startValue={currentPoints}
                  endValue={currentPoints + rewardPoints}
                  duration={2500}
                  isActive={showPointsAnimation}
                  onComplete={() => {
                    setClaimComplete(true);
                    setShowPointsAnimation(false);
                    setIsClaiming(false);
                  }}
                  label="YOUR NEW BALANCE"
                  showCelebration={true}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Claim Complete */}
          <AnimatePresence>
            {claimComplete && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 text-center"
              >
                <motion.button
                  onClick={onClose}
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-success to-accent text-white font-bold text-lg uppercase tracking-wider shadow-lg shadow-success/40"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 10 }}
                >
                  <Trophy className="w-5 h-5 inline mr-2" />
                  AWESOME! CLOSE
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Spin Button */}
          {!showResult && !isSpinning && (
            <motion.button
              onClick={handleSpin}
              disabled={isSpinning || !canSpin}
              whileHover={{ scale: canSpin ? 1.02 : 1 }}
              whileTap={{ scale: canSpin ? 0.98 : 1 }}
              className={cn(
                "mt-5 relative px-12 py-4 rounded-xl overflow-hidden border border-border",
                canSpin
                  ? "cursor-pointer"
                  : "opacity-50 cursor-not-allowed"
              )}
              style={canSpin ? {
                background: "var(--gradient-primary)",
                boxShadow: "var(--shadow-neon-primary)",
              } : {
                background: "hsl(var(--muted))",
              }}
            >
              {canSpin && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: ["-200%", "200%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              )}
              
              <span className="relative text-xl font-bold text-primary-foreground tracking-wider">
                {isSpinning ? "SPINNING..." : `SPIN (${tokenCost} TOKENS)`}
              </span>
            </motion.button>
          )}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </Portal>
  );
};

export default SpinWheelModal;