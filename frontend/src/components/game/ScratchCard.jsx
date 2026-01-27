import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Sparkles, Star } from "lucide-react";

const ScratchCard = ({
  reward = "+500 PTS",
  onReveal,
  revealed = false,
  width = 320,
  height = 200,
}) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isScratching, setIsScratching] = useState(false);
  const [scratchPercent, setScratchPercent] = useState(0);
  const [isRevealed, setIsRevealed] = useState(revealed);
  const [showDust, setShowDust] = useState(false);
  const [dustPosition, setDustPosition] = useState({ x: 0, y: 0 });
  const lastPosRef = useRef({ x: 0, y: 0 });
  const isInitializedRef = useRef(false);

  // Reward is intentionally masked until reveal
  const maskedReward = "+ ???";

  // Sync external revealed prop
  useEffect(() => {
    if (revealed && !isRevealed) {
      setIsRevealed(true);
    }
  }, [revealed, isRevealed]);

  // Initialize canvas with premium holographic foil
  useEffect(() => {
    if (isRevealed || isInitializedRef.current) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Premium holographic gradient with more vibrant colors
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "hsl(260, 35%, 65%)");
    gradient.addColorStop(0.15, "hsl(290, 40%, 72%)");
    gradient.addColorStop(0.3, "hsl(200, 45%, 78%)");
    gradient.addColorStop(0.45, "hsl(180, 40%, 75%)");
    gradient.addColorStop(0.6, "hsl(320, 35%, 70%)");
    gradient.addColorStop(0.75, "hsl(280, 38%, 68%)");
    gradient.addColorStop(0.9, "hsl(240, 35%, 65%)");
    gradient.addColorStop(1, "hsl(260, 30%, 62%)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Add metallic noise texture for realism
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 22;
      data[i] += noise;
      data[i + 1] += noise;
      data[i + 2] += noise;
    }
    ctx.putImageData(imageData, 0, 0);

    // Holographic shine lines - more prominent
    ctx.strokeStyle = "rgba(255, 255, 255, 0.18)";
    ctx.lineWidth = 1.5;
    for (let i = -height; i < width + height; i += 12) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + height, height);
      ctx.stroke();
    }

    // Additional diagonal lines for rainbow effect
    ctx.strokeStyle = "rgba(200, 180, 255, 0.1)";
    ctx.lineWidth = 1;
    for (let i = -height; i < width + height; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i + 10, 0);
      ctx.lineTo(i + height + 10, height);
      ctx.stroke();
    }

    // "SCRATCH HERE" text with enhanced shadow
    ctx.font = "bold 18px 'Sora', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(40, 40, 60, 0.25)";
    ctx.fillText("✦ SCRATCH TO REVEAL ✦", width / 2 + 2, height / 2 + 2);
    ctx.fillStyle = "rgba(60, 60, 90, 0.5)";
    ctx.fillText("✦ SCRATCH TO REVEAL ✦", width / 2, height / 2);

    // Decorative coin icon below text
    ctx.beginPath();
    ctx.arc(width / 2, height / 2 + 35, 14, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 215, 0, 0.25)";
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 215, 0, 0.35)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.font = "bold 16px sans-serif";
    ctx.fillStyle = "rgba(255, 215, 0, 0.5)";
    ctx.fillText("★", width / 2, height / 2 + 37);

    isInitializedRef.current = true;
  }, [width, height, isRevealed]);

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
      const brushSize = 48;

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

      if (percent > 45 && !isRevealed) {
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

  // Manual scratch trigger from button/click - INSTANT REVEAL
  const triggerScratch = useCallback(() => {
    if (isRevealed) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;

    // Instant reveal animation - faster and more dramatic
    let frame = 0;
    const totalFrames = 15; // Reduced for instant feel
    const centerX = width / 2;
    const centerY = height / 2;

    const animateScratch = () => {
      frame++;
      const progress = frame / totalFrames;
      const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
      const radius = Math.max(width, height) * easeProgress * 1.2;

      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();

      // Add scratchy radial lines for dramatic effect
      for (let i = 0; i < 16; i++) {
        const angle = (i / 16) * Math.PI * 2 + progress * 4;
        const startR = radius * 0.1;
        const endR = radius * 1.2;
        ctx.beginPath();
        ctx.moveTo(centerX + Math.cos(angle) * startR, centerY + Math.sin(angle) * startR);
        ctx.lineTo(centerX + Math.cos(angle) * endR, centerY + Math.sin(angle) * endR);
        ctx.lineWidth = 30;
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

  // Expose triggerScratch via ref
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.triggerScratch = triggerScratch;
    }
  }, [triggerScratch]);

  return (
    <div
      ref={containerRef}
      className="relative rounded-2xl overflow-hidden select-none cursor-pointer"
      style={{ width, height }}
      onClick={!isScratching && !isRevealed ? triggerScratch : undefined}
    >
      {/* Outer glow border */}
      <div
        className="absolute -inset-1 rounded-2xl pointer-events-none"
        style={{
          background: isRevealed
            ? "linear-gradient(135deg, hsl(var(--accent) / 0.4) 0%, hsl(var(--warning) / 0.3) 100%)"
            : "linear-gradient(135deg, hsl(var(--primary) / 0.25) 0%, hsl(var(--secondary) / 0.2) 100%)",
          filter: "blur(8px)",
        }}
      />

      {/* Reward Layer (underneath) */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-border/50"
        style={{
          background:
            "linear-gradient(135deg, hsl(var(--primary) / 0.15) 0%, hsl(var(--card)) 50%, hsl(var(--secondary) / 0.1) 100%)",
        }}
      >
        <motion.div
          initial={false}
          animate={isRevealed ? { scale: [0.6, 1.2, 1], rotate: [0, 15, -10, 0] } : {}}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center"
        >
          <motion.div
            animate={isRevealed ? { y: [0, -8, 0], rotate: [0, 5, -5, 0] } : {}}
            transition={{ duration: 2.5, repeat: Infinity }}
            style={{ filter: !isRevealed ? "blur(8px)" : undefined, opacity: !isRevealed ? 0.7 : 1 }}
          >
            <Trophy className="w-16 h-16 lg:w-20 lg:h-20 mx-auto mb-3 text-accent drop-shadow-[0_0_40px_hsl(var(--accent))]" />
          </motion.div>
          <p
            className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight select-none"
            style={{
              background: "linear-gradient(135deg, hsl(var(--accent)) 0%, hsl(var(--warning)) 50%, hsl(var(--accent)) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: isRevealed ? "0 0 40px hsl(var(--accent) / 0.6)" : "none",
              filter: !isRevealed ? "blur(12px)" : "none",
              opacity: !isRevealed ? 0.55 : 1,
            }}
          >
            {isRevealed ? reward : maskedReward}
          </p>
          <p className="text-sm text-muted-foreground mt-2 font-medium">
            {isRevealed ? "Daily Bonus Claimed!" : "Scratch to reveal"}
          </p>
        </motion.div>
      </div>

      {/* Canvas Scratch Layer */}
      {!isRevealed && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 cursor-crosshair touch-none z-10 rounded-2xl"
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

      {/* Animated Shimmer Overlay - Primary */}
      {!isRevealed && (
        <motion.div
          className="absolute inset-0 pointer-events-none z-20 rounded-2xl"
          style={{
            background:
              "linear-gradient(110deg, transparent 20%, hsl(var(--primary) / 0.25) 45%, hsl(var(--secondary) / 0.2) 55%, transparent 80%)",
          }}
          animate={{ x: ["-150%", "150%"] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
        />
      )}

      {/* Secondary shimmer - opposite direction */}
      {!isRevealed && (
        <motion.div
          className="absolute inset-0 pointer-events-none z-20 rounded-2xl"
          style={{
            background:
              "linear-gradient(250deg, transparent 25%, hsl(var(--accent) / 0.15) 48%, hsl(var(--warning) / 0.1) 52%, transparent 75%)",
          }}
          animate={{ x: ["150%", "-150%"] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "linear", delay: 1 }}
        />
      )}

      {/* Rainbow shimmer */}
      {!isRevealed && (
        <motion.div
          className="absolute inset-0 pointer-events-none z-20 rounded-2xl opacity-60"
          style={{
            background:
              "linear-gradient(135deg, transparent 30%, hsl(180, 60%, 70%, 0.15) 45%, hsl(280, 60%, 70%, 0.15) 55%, transparent 70%)",
          }}
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
      )}

      {/* Dust Particles - Enhanced */}
      <AnimatePresence>
        {showDust &&
          Array.from({ length: 24 }).map((_, i) => (
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
                x: dustPosition.x + (Math.random() - 0.5) * 100,
                y: dustPosition.y + (Math.random() - 0.5) * 100,
                opacity: 0,
                scale: 0.1,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              style={{
                width: 3 + Math.random() * 6,
                height: 3 + Math.random() * 6,
                background: [
                  `hsl(${200 + Math.random() * 40}, 45%, ${70 + Math.random() * 20}%)`,
                  `hsl(${280 + Math.random() * 40}, 40%, ${65 + Math.random() * 20}%)`,
                  `hsl(${320 + Math.random() * 30}, 35%, ${72 + Math.random() * 15}%)`,
                ][Math.floor(Math.random() * 3)],
              }}
            />
          ))}
      </AnimatePresence>

      {/* Reveal Flash - More dramatic */}
      <AnimatePresence>
        {isRevealed && (
          <motion.div
            className="absolute inset-0 bg-white pointer-events-none z-40 rounded-2xl"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          />
        )}
      </AnimatePresence>

      {/* Confetti Burst on Reveal */}
      <AnimatePresence>
        {isRevealed && (
          <>
            {/* Confetti particles - spreading from center */}
            {Array.from({ length: 60 }).map((_, i) => {
              const angle = (i / 60) * Math.PI * 2;
              const velocity = 60 + Math.random() * 100;
              const size = 4 + Math.random() * 8;
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
                    rotate: 0 
                  }}
                  animate={{
                    x: Math.cos(angle) * velocity,
                    y: Math.sin(angle) * velocity + 30,
                    opacity: 0,
                    scale: 1,
                    rotate: Math.random() * 720 - 360,
                  }}
                  transition={{ 
                    duration: 1 + Math.random() * 0.5, 
                    delay: Math.random() * 0.15, 
                    ease: "easeOut" 
                  }}
                  style={{
                    width: size,
                    height: size * (0.5 + Math.random() * 0.5),
                    backgroundColor: colors[Math.floor(Math.random() * colors.length)],
                    borderRadius: Math.random() > 0.5 ? "50%" : "2px",
                  }}
                />
              );
            })}
            
            {/* Sparkle icons burst */}
            {Array.from({ length: 16 }).map((_, i) => (
              <motion.div
                key={`sparkle-${i}`}
                className="absolute left-1/2 top-1/2 z-50 pointer-events-none"
                initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
                animate={{
                  x: Math.cos((i * 22.5 * Math.PI) / 180) * (70 + Math.random() * 40),
                  y: Math.sin((i * 22.5 * Math.PI) / 180) * (70 + Math.random() * 40),
                  opacity: 0,
                  scale: 1.2,
                }}
                transition={{ duration: 0.8, delay: i * 0.02, ease: "easeOut" }}
              >
                {i % 2 === 0 ? (
                  <Sparkles className="w-5 h-5 text-accent drop-shadow-[0_0_12px_hsl(var(--accent))]" />
                ) : (
                  <Star className="w-4 h-4 text-warning drop-shadow-[0_0_10px_hsl(var(--warning))]" />
                )}
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Golden ring pulse on reveal */}
      <AnimatePresence>
        {isRevealed && (
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none z-35"
            initial={{ boxShadow: "inset 0 0 0 0 hsl(var(--accent))", opacity: 1 }}
            animate={{
              boxShadow: [
                "inset 0 0 40px hsl(var(--accent) / 0.6)",
                "inset 0 0 60px hsl(var(--warning) / 0.4)",
                "inset 0 0 0 0 transparent",
              ],
              opacity: [1, 1, 0],
            }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>

      {/* Outer ring explosion */}
      <AnimatePresence>
        {isRevealed && (
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none z-30"
            initial={{ scale: 1, opacity: 0.8 }}
            animate={{ scale: 1.3, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{
              border: "3px solid hsl(var(--accent))",
              boxShadow: "0 0 30px hsl(var(--accent) / 0.5)",
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ScratchCard;
