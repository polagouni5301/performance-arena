/**
 * Scratch Card Reveal Modal - Full-Screen Immersive Experience
 * Dramatically larger scratch card with enhanced animations
 * Now with animated points claiming and backend integration
 */
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Sparkles, Star, X, Zap, Crown, Gift, Diamond, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import AnimatedPointsCounter from "./AnimatedPointsCounter";
import { Portal } from "@/components/ui/Portal";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";

const ScratchCardRevealModal = ({
  isOpen,
  onClose,
  reward = "+500 PTS",
  rewardType = "points", // points, spin, mystery, jackpot
  onReveal,
  onClaimReward, // New: callback to claim reward with backend
  currentBalance = 0, // New: current points balance
}) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isScratching, setIsScratching] = useState(false);
  const [scratchPercent, setScratchPercent] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [showDust, setShowDust] = useState(false);
  const [dustPosition, setDustPosition] = useState({ x: 0, y: 0 });
  const lastPosRef = useRef({ x: 0, y: 0 });
  const isInitializedRef = useRef(false);
  
  // New states for animated claiming
  const [isClaiming, setIsClaiming] = useState(false);
  const [showPointsAnimation, setShowPointsAnimation] = useState(false);
  const [claimComplete, setClaimComplete] = useState(false);
  const [rewardPoints, setRewardPoints] = useState(0);

  // Card dimensions - MUCH larger
  const width = 380;
  const height = 280;

  useLockBodyScroll(!!isOpen);

  const tokenColor = useCallback((varName, fallback = "") => {
    if (typeof window === "undefined") return fallback;
    const raw = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
    // variables are stored like: "260 85% 60%"
    return raw ? `hsl(${raw})` : fallback;
  }, []);

  // Parse reward points from reward string
  useEffect(() => {
    if (reward) {
      const match = reward.match(/\+?(\d+)/);
      if (match) {
        setRewardPoints(parseInt(match[1], 10));
      }
    }
  }, [reward]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsRevealed(false);
      setScratchPercent(0);
      setShowDust(false);
      setIsClaiming(false);
      setShowPointsAnimation(false);
      setClaimComplete(false);
      isInitializedRef.current = false;
    }
  }, [isOpen]);

  // Get reward icon and colors based on type
  const getRewardConfig = () => {
    switch (rewardType) {
      case "jackpot":
        return {
          icon: Crown,
          gradient: "from-amber-400 via-yellow-500 to-orange-500",
          glow: "hsla(45, 100%, 50%, 0.6)",
          text: "JACKPOT!",
        };
      case "spin":
        return {
          icon: Diamond,
          gradient: "from-primary via-pink-500 to-secondary",
          glow: "hsla(320, 100%, 55%, 0.6)",
          text: "SPIN TOKEN!",
        };
      case "mystery":
        return {
          icon: Gift,
          gradient: "from-purple-500 via-violet-500 to-indigo-500",
          glow: "hsla(280, 100%, 60%, 0.6)",
          text: "MYSTERY BOX!",
        };
      default:
        return {
          icon: Trophy,
          gradient: "from-accent via-warning to-accent",
          glow: "hsla(45, 100%, 50%, 0.5)",
          text: "REWARD CLAIMED!",
        };
    }
  };

  const config = getRewardConfig();
  const RewardIcon = config.icon;
  const maskedReward = "+ ???";

  // Initialize canvas with premium holographic foil
  useEffect(() => {
    if (!isOpen || isRevealed || isInitializedRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Premium holographic gradient (theme-token driven)
    const c1 = tokenColor("--primary", "hsl(260 60% 60%)");
    const c2 = tokenColor("--secondary", "hsl(200 70% 60%)");
    const c3 = tokenColor("--accent", "hsl(320 70% 60%)");
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, c1);
    gradient.addColorStop(0.35, c3);
    gradient.addColorStop(0.7, c2);
    gradient.addColorStop(1, c1);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Add metallic noise texture
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 25;
      data[i] += noise;
      data[i + 1] += noise;
      data[i + 2] += noise;
    }
    ctx.putImageData(imageData, 0, 0);

    // Holographic shine lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
    ctx.lineWidth = 2;
    for (let i = -height; i < width + height; i += 15) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + height, height);
      ctx.stroke();
    }

    // Diagonal sparkle lines (subtle)
    ctx.strokeStyle = "rgba(255, 255, 255, 0.10)";
    ctx.lineWidth = 1.5;
    for (let i = -height; i < width + height; i += 25) {
      ctx.beginPath();
      ctx.moveTo(i + 12, 0);
      ctx.lineTo(i + height + 12, height);
      ctx.stroke();
    }

    // "SCRATCH TO REVEAL" text
    ctx.font = "bold 24px 'Orbitron', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(10, 10, 20, 0.25)";
    ctx.fillText("✦ SCRATCH TO REVEAL ✦", width / 2 + 2, height / 2 + 2);
    ctx.fillStyle = "rgba(255, 255, 255, 0.22)";
    ctx.fillText("✦ SCRATCH TO REVEAL ✦", width / 2, height / 2);

    // Decorative elements
    ctx.beginPath();
    ctx.arc(width / 2, height / 2 + 50, 20, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 255, 255, 0.14)";
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.22)";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.font = "bold 22px sans-serif";
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.fillText("★", width / 2, height / 2 + 52);

    isInitializedRef.current = true;
  }, [isOpen, isRevealed, width, height, tokenColor]);

  const getPos = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  }, []);

  const scratch = useCallback(
    (e) => {
      if (isRevealed) return;
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!ctx || !canvas) return;

      const pos = getPos(e);
      const { x: lastX, y: lastY } = lastPosRef.current;
      const brushSize = 60;

      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = brushSize;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();

      lastPosRef.current = pos;
      setDustPosition({ x: pos.x, y: pos.y });
      setShowDust(true);

      // Calculate scratch percentage
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let cleared = 0;
      for (let i = 3; i < imageData.data.length; i += 4) {
        if (imageData.data[i] === 0) cleared++;
      }
      const percent = (cleared / (imageData.data.length / 4)) * 100;
      setScratchPercent(percent);

      if (percent > 40 && !isRevealed) {
        setIsRevealed(true);
        onReveal?.();
      }
    },
    [getPos, isRevealed, onReveal]
  );

  const handleStart = useCallback(
    (e) => {
      e.preventDefault();
      if (isRevealed) return;
      setIsScratching(true);
      const pos = getPos(e);
      lastPosRef.current = pos;
      setDustPosition(pos);
    },
    [getPos, isRevealed]
  );

  const handleMove = useCallback(
    (e) => {
      if (!isScratching || isRevealed) return;
      e.preventDefault();
      scratch(e);
    },
    [isScratching, scratch, isRevealed]
  );

  const handleEnd = useCallback(() => {
    setIsScratching(false);
    setShowDust(false);
  }, []);

  // Instant reveal on click
  const triggerInstantReveal = useCallback(() => {
    if (isRevealed) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;

    let frame = 0;
    const totalFrames = 18;
    const centerX = width / 2;
    const centerY = height / 2;

    const animateScratch = () => {
      frame++;
      const progress = frame / totalFrames;
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const radius = Math.max(width, height) * easeProgress * 1.3;

      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();

      // Radial scratch lines for drama
      for (let i = 0; i < 20; i++) {
        const angle = (i / 20) * Math.PI * 2 + progress * 5;
        const startR = radius * 0.1;
        const endR = radius * 1.3;
        ctx.beginPath();
        ctx.moveTo(centerX + Math.cos(angle) * startR, centerY + Math.sin(angle) * startR);
        ctx.lineTo(centerX + Math.cos(angle) * endR, centerY + Math.sin(angle) * endR);
        ctx.lineWidth = 35;
        ctx.lineCap = "round";
        ctx.stroke();
      }

      if (frame < totalFrames) {
        requestAnimationFrame(animateScratch);
      } else {
        setIsRevealed(true);
        onReveal?.();
      }
    };

    setShowDust(true);
    setDustPosition({ x: centerX, y: centerY });
    requestAnimationFrame(animateScratch);
  }, [width, height, isRevealed, onReveal]);

  // Auto-close after claim complete
  useEffect(() => {
    if (claimComplete) {
      const timer = setTimeout(() => {
        onClose?.();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [claimComplete, onClose]);

  // Don't render if not open
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
          {/* Radial glow */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
            style={{
              background: `radial-gradient(circle, ${config.glow} 0%, transparent 70%)`,
            }}
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          {/* Floating particles */}
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-accent/60"
              initial={{
                x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1000),
                y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 800),
              }}
              animate={{
                y: [null, -20, 20, -10, 10],
                x: [null, 10, -10, 5, -5],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Main Card Container - Perfectly centered */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md mx-auto px-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button - Always visible */}
          <motion.button
            onClick={onClose}
            className="absolute -top-2 -right-2 sm:right-2 p-2.5 rounded-full bg-card border border-border shadow-lg hover:bg-muted transition-colors z-50"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-5 h-5 text-foreground" />
          </motion.button>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-6"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-accent" />
              <h2 className="font-display text-2xl text-foreground tracking-widest">
                SCRATCH CARD
              </h2>
              <Sparkles className="w-5 h-5 text-accent" />
            </div>
            <p className="text-sm text-muted-foreground font-oxanium">
              {isRevealed ? config.text : "Scratch or tap to reveal your reward!"}
            </p>
          </motion.div>

          {/* Card Container */}
          <div
            ref={containerRef}
            className="relative rounded-3xl overflow-hidden select-none cursor-pointer mx-auto"
            style={{ width, height }}
            onClick={!isScratching && !isRevealed ? triggerInstantReveal : undefined}
          >
            {/* Outer animated border */}
            <motion.div
              className="absolute -inset-1 rounded-3xl pointer-events-none"
              style={{
                background: isRevealed
                  ? `linear-gradient(135deg, hsl(var(--accent)) 0%, hsl(var(--warning)) 50%, hsl(var(--accent)) 100%)`
                  : `linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--secondary)) 50%, hsl(var(--primary)) 100%)`,
              }}
              animate={{
                opacity: [0.5, 1, 0.5],
                scale: isRevealed ? [1, 1.02, 1] : 1,
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            {/* Inner glow */}
            <div
              className="absolute -inset-2 rounded-3xl pointer-events-none blur-xl"
              style={{
                background: isRevealed
                  ? `radial-gradient(circle, ${config.glow} 0%, transparent 70%)`
                  : "radial-gradient(circle, hsl(var(--primary) / 0.3) 0%, transparent 70%)",
              }}
            />

            {/* Reward Layer */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl border-2 border-border/50"
              style={{
                background: `linear-gradient(135deg, hsl(var(--primary) / 0.1) 0%, hsl(var(--card)) 50%, hsl(var(--secondary) / 0.1) 100%)`,
              }}
            >
              <motion.div
                initial={false}
                animate={isRevealed ? { scale: [0.5, 1.3, 1], rotate: [0, 10, -5, 0] } : {}}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-center"
              >
                <motion.div
                  animate={
                    isRevealed
                      ? { y: [0, -10, 0], rotate: [0, 5, -5, 0] }
                      : { y: [0, -4, 0] }
                  }
                  transition={{ duration: 2.5, repeat: Infinity }}
                  style={{ filter: !isRevealed ? "blur(10px)" : undefined, opacity: !isRevealed ? 0.65 : 1 }}
                >
                  <RewardIcon
                    className={cn(
                      "w-24 h-24 mx-auto mb-4",
                      `text-transparent bg-clip-text bg-gradient-to-br ${config.gradient}`
                    )}
                    style={{
                      filter: isRevealed ? `drop-shadow(0 0 30px ${config.glow})` : "none",
                    }}
                  />
                </motion.div>

                {/* Reward text is intentionally masked until reveal */}
                <motion.p
                  className="text-5xl sm:text-6xl font-black tracking-tight mb-2 select-none"
                  style={{
                    background: `linear-gradient(135deg, hsl(var(--accent)) 0%, hsl(var(--warning)) 50%, hsl(var(--accent)) 100%)`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    textShadow: isRevealed ? `0 0 50px ${config.glow}` : "none",
                    filter: !isRevealed ? "blur(14px)" : "none",
                    opacity: !isRevealed ? 0.55 : 1,
                  }}
                  animate={isRevealed ? { scale: [1, 1.05, 1] } : {}}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  {isRevealed ? reward : maskedReward}
                </motion.p>

                {!isRevealed ? (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/40 border border-border/60 text-xs text-muted-foreground font-mono">
                    <span className="w-2 h-2 rounded-full bg-warning/70" />
                    CLASSIFIED LOOT
                  </div>
                ) : (
                  <p className="text-base text-muted-foreground font-medium">Added to your balance!</p>
                )}
              </motion.div>
            </div>

            {/* Canvas Scratch Layer */}
            {!isRevealed && (
              <canvas
                ref={canvasRef}
                className="absolute inset-0 cursor-crosshair touch-none z-10 rounded-3xl"
                style={{ width, height }}
                onMouseDown={handleStart}
                onMouseMove={handleMove}
                onMouseUp={handleEnd}
                onMouseLeave={handleEnd}
                onTouchStart={handleStart}
                onTouchMove={handleMove}
                onTouchEnd={handleEnd}
              />
            )}

            {/* Shimmer overlays */}
            {!isRevealed && (
              <>
                <motion.div
                  className="absolute inset-0 pointer-events-none z-20 rounded-3xl"
                  style={{
                    background:
                      "linear-gradient(110deg, transparent 20%, hsl(var(--primary) / 0.3) 45%, hsl(var(--secondary) / 0.25) 55%, transparent 80%)",
                  }}
                  animate={{ x: ["-150%", "150%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                  className="absolute inset-0 pointer-events-none z-20 rounded-3xl"
                  style={{
                    background:
                      "linear-gradient(250deg, transparent 25%, hsl(var(--accent) / 0.2) 48%, hsl(var(--warning) / 0.15) 52%, transparent 75%)",
                  }}
                  animate={{ x: ["150%", "-150%"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 0.8 }}
                />
              </>
            )}

            {/* Dust Particles */}
            <AnimatePresence>
              {showDust &&
                Array.from({ length: 30 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full pointer-events-none z-30"
                    initial={{
                      x: dustPosition.x,
                      y: dustPosition.y,
                      opacity: 1,
                      scale: 1,
                    }}
                    animate={{
                      x: dustPosition.x + (Math.random() - 0.5) * 120,
                      y: dustPosition.y + (Math.random() - 0.5) * 120,
                      opacity: 0,
                      scale: 0.1,
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    style={{
                      width: 4 + Math.random() * 8,
                      height: 4 + Math.random() * 8,
                      background: [
                        "hsl(var(--primary) / 0.85)",
                        "hsl(var(--secondary) / 0.8)",
                        "hsl(var(--accent) / 0.8)",
                        "hsl(var(--warning) / 0.75)",
                      ][Math.floor(Math.random() * 4)],
                    }}
                  />
                ))}
            </AnimatePresence>

            {/* Reveal Flash */}
            <AnimatePresence>
              {isRevealed && (
                <motion.div
                  className="absolute inset-0 bg-white pointer-events-none z-40 rounded-3xl"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7 }}
                />
              )}
            </AnimatePresence>

            {/* Confetti Burst */}
            <AnimatePresence>
              {isRevealed && (
                <>
                  {Array.from({ length: 80 }).map((_, i) => {
                    const angle = (i / 80) * Math.PI * 2;
                    const velocity = 80 + Math.random() * 140;
                    const size = 5 + Math.random() * 10;
                    const colors = [
                      "hsl(var(--primary))",
                      "hsl(var(--secondary))",
                      "hsl(var(--accent))",
                      "hsl(var(--warning))",
                      "hsl(var(--success))",
                    ];
                    return (
                      <motion.div
                        key={`confetti-${i}`}
                        className="absolute left-1/2 top-1/2 z-50 pointer-events-none"
                        initial={{
                          x: 0,
                          y: 0,
                          opacity: 1,
                          scale: 0,
                          rotate: 0,
                        }}
                        animate={{
                          x: Math.cos(angle) * velocity,
                          y: Math.sin(angle) * velocity + 40,
                          opacity: 0,
                          scale: 1,
                          rotate: Math.random() * 1080 - 540,
                        }}
                        transition={{
                          duration: 1.2 + Math.random() * 0.6,
                          delay: Math.random() * 0.2,
                          ease: "easeOut",
                        }}
                        style={{
                          width: size,
                          height: size * (0.5 + Math.random() * 0.5),
                          backgroundColor: colors[Math.floor(Math.random() * colors.length)],
                          borderRadius: Math.random() > 0.5 ? "50%" : "3px",
                        }}
                      />
                    );
                  })}

                  {/* Sparkle icons */}
                  {Array.from({ length: 20 }).map((_, i) => (
                    <motion.div
                      key={`sparkle-${i}`}
                      className="absolute left-1/2 top-1/2 z-50 pointer-events-none"
                      initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
                      animate={{
                        x: Math.cos((i * 18 * Math.PI) / 180) * (90 + Math.random() * 50),
                        y: Math.sin((i * 18 * Math.PI) / 180) * (90 + Math.random() * 50),
                        opacity: 0,
                        scale: 1.5,
                      }}
                      transition={{ duration: 1, delay: i * 0.02, ease: "easeOut" }}
                    >
                      {i % 2 === 0 ? (
                        <Sparkles className="w-6 h-6 text-accent drop-shadow-[0_0_15px_hsl(var(--accent))]" />
                      ) : (
                        <Star className="w-5 h-5 text-warning drop-shadow-[0_0_12px_hsl(var(--warning))]" />
                      )}
                    </motion.div>
                  ))}
                </>
              )}
            </AnimatePresence>

            {/* Golden ring pulse */}
            <AnimatePresence>
              {isRevealed && (
                <motion.div
                  className="absolute inset-0 rounded-3xl pointer-events-none z-35"
                  initial={{ boxShadow: "inset 0 0 0 0 hsl(var(--accent))", opacity: 1 }}
                  animate={{
                    boxShadow: [
                      "inset 0 0 60px hsl(var(--accent) / 0.7)",
                      "inset 0 0 80px hsl(var(--warning) / 0.5)",
                      "inset 0 0 0 0 transparent",
                    ],
                    opacity: [1, 1, 0],
                  }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Animated Points Counter - Shows during claiming */}
          <AnimatePresence>
            {showPointsAnimation && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="mt-6"
              >
                <AnimatedPointsCounter
                  startValue={currentBalance}
                  endValue={currentBalance + rewardPoints}
                  duration={2500}
                  isActive={showPointsAnimation}
                  onComplete={() => {
                    setClaimComplete(true);
                    setShowPointsAnimation(false);
                  }}
                  label="YOUR NEW BALANCE"
                  showCelebration={true}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center mt-6"
          >
            {claimComplete ? (
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
            ) : isRevealed ? (
              <motion.button
                onClick={async () => {
                  setIsClaiming(true);
                  
                  // Call backend to record the reward
                  if (onClaimReward) {
                    try {
                      await onClaimReward({ reward, points: rewardPoints });
                    } catch (error) {
                      console.error('Failed to claim reward:', error);
                    }
                  }
                  
                  // Start the points animation
                  setShowPointsAnimation(true);
                  setIsClaiming(false);
                }}
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
                    CLAIM {reward}
                  </>
                )}
              </motion.button>
            ) : (
              <p className="text-sm text-muted-foreground font-mono animate-pulse">
                TAP CARD TO INSTANTLY REVEAL
              </p>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
    </Portal>
  );
};

export default ScratchCardRevealModal;
