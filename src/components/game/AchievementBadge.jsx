import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Trophy, Zap, Crown, Shield, Gift, Flame, Target, Award, Diamond, Lock } from "lucide-react";
import { cn } from "../../lib/utils";

const iconMap = {
  star: Star,
  trophy: Trophy,
  zap: Zap,
  crown: Crown,
  shield: Shield,
  gift: Gift,
  flame: Flame,
  target: Target,
  award: Award,
  diamond: Diamond,
};

const rarityConfig = {
  common: {
    gradient: "from-gray-400 to-gray-600",
    glow: "hsla(0, 0%, 60%, 0.4)",
    border: "border-gray-500/50",
    label: "COMMON",
  },
  rare: {
    gradient: "from-blue-400 to-blue-600",
    glow: "hsla(210, 100%, 50%, 0.5)",
    border: "border-blue-500/50",
    label: "RARE",
  },
  epic: {
    gradient: "from-purple-400 to-purple-600",
    glow: "hsla(280, 100%, 60%, 0.5)",
    border: "border-purple-500/50",
    label: "EPIC",
  },
  legendary: {
    gradient: "from-amber-400 to-orange-500",
    glow: "hsla(45, 100%, 55%, 0.6)",
    border: "border-amber-500/50",
    label: "LEGENDARY",
  },
  mythic: {
    gradient: "from-pink-400 via-purple-400 to-cyan-400",
    glow: "hsla(300, 100%, 60%, 0.6)",
    border: "border-pink-500/50",
    label: "MYTHIC",
  },
};

const AchievementBadge = ({
  name,
  description,
  icon = "star",
  rarity = "common",
  unlocked = false,
  progress = 0,
  maxProgress = 100,
  onUnlock,
  size = "md",
}) => {
  const [showParticles, setShowParticles] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);

  const IconComponent = iconMap[icon] || Star;
  const config = rarityConfig[rarity] || rarityConfig.common;

  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  };

  const iconSizes = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  const handleClick = () => {
    if (!unlocked && progress >= maxProgress) {
      setIsUnlocking(true);
      setShowParticles(true);
      
      setTimeout(() => {
        setIsUnlocking(false);
        onUnlock?.();
      }, 1500);
      
      setTimeout(() => setShowParticles(false), 2500);
    }
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* Particle Effects */}
      <AnimatePresence>
        {showParticles && (
          <>
            {/* Circular burst particles */}
            {[...Array(16)].map((_, i) => (
              <motion.div
                key={`burst-${i}`}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  background: `linear-gradient(135deg, ${i % 2 === 0 ? '#fbbf24' : '#a855f7'}, ${i % 2 === 0 ? '#f97316' : '#ec4899'})`,
                }}
                initial={{ 
                  scale: 0, 
                  x: 0, 
                  y: 0,
                  opacity: 1 
                }}
                animate={{ 
                  scale: [0, 1.5, 0],
                  x: Math.cos((i * 22.5 * Math.PI) / 180) * 80,
                  y: Math.sin((i * 22.5 * Math.PI) / 180) * 80,
                  opacity: [1, 1, 0]
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, delay: i * 0.02 }}
              />
            ))}

            {/* Sparkle effects */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`sparkle-${i}`}
                className="absolute"
                initial={{ scale: 0, opacity: 1 }}
                animate={{ 
                  scale: [0, 1.5, 0],
                  opacity: [0, 1, 0],
                  rotate: [0, 180]
                }}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
                style={{
                  left: `${30 + Math.random() * 40}%`,
                  top: `${30 + Math.random() * 40}%`,
                }}
              >
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              </motion.div>
            ))}

            {/* Ring explosion */}
            <motion.div
              className={`absolute ${sizeClasses[size]} rounded-full border-2`}
              style={{ borderColor: config.glow }}
              initial={{ scale: 0.5, opacity: 1 }}
              animate={{ scale: 3, opacity: 0 }}
              transition={{ duration: 0.8 }}
            />
            <motion.div
              className={`absolute ${sizeClasses[size]} rounded-full border-4`}
              style={{ borderColor: config.glow }}
              initial={{ scale: 0.5, opacity: 0.8 }}
              animate={{ scale: 2.5, opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            />
          </>
        )}
      </AnimatePresence>

      {/* Badge Container */}
      <motion.div
        onClick={handleClick}
        className={cn(
          "relative cursor-pointer",
          sizeClasses[size],
          !unlocked && progress < maxProgress && "grayscale opacity-50"
        )}
        whileHover={{ scale: unlocked ? 1.05 : 1 }}
        whileTap={{ scale: 0.95 }}
        animate={isUnlocking ? {
          scale: [1, 1.2, 1],
          rotate: [0, -10, 10, 0],
        } : {}}
        transition={{ duration: 0.5 }}
      >
        {/* Outer Glow Ring */}
        {unlocked && (
          <motion.div
            className={`absolute inset-0 rounded-full bg-gradient-to-r ${config.gradient} opacity-30 blur-md`}
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}

        {/* Badge Background */}
        <div
          className={cn(
            "absolute inset-0 rounded-full border-2",
            config.border,
            unlocked ? `bg-gradient-to-br ${config.gradient}` : "bg-slate-800"
          )}
          style={{
            boxShadow: unlocked ? `0 0 30px ${config.glow}, inset 0 0 20px ${config.glow}` : 'none',
          }}
        >
          {/* Inner shine */}
          {unlocked && (
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/20 to-transparent" />
          )}
        </div>

        {/* Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          {!unlocked && progress < maxProgress ? (
            <Lock className={cn(iconSizes[size], "text-slate-500")} />
          ) : (
            <motion.div
              animate={unlocked ? { 
                filter: ["drop-shadow(0 0 8px white)", "drop-shadow(0 0 15px white)", "drop-shadow(0 0 8px white)"]
              } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <IconComponent className={cn(iconSizes[size], "text-white drop-shadow-lg")} />
            </motion.div>
          )}
        </div>

        {/* Progress Ring (when not unlocked) */}
        {!unlocked && (
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="hsla(270, 30%, 30%, 0.5)"
              strokeWidth="4"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke={unlocked ? "hsl(145, 70%, 50%)" : "hsl(280, 100%, 60%)"}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={289}
              initial={{ strokeDashoffset: 289 }}
              animate={{ strokeDashoffset: 289 - (289 * progress) / maxProgress }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </svg>
        )}
      </motion.div>

      {/* Badge Info */}
      <div className="mt-3 text-center">
        <p className={cn(
          "font-bold text-sm",
          unlocked ? "text-foreground" : "text-muted-foreground"
        )}>
          {name}
        </p>
        {unlocked && (
          <motion.span
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "text-[10px] font-bold uppercase tracking-wider",
              rarity === "legendary" && "text-amber-400",
              rarity === "epic" && "text-purple-400",
              rarity === "rare" && "text-blue-400",
              rarity === "mythic" && "text-pink-400",
              rarity === "common" && "text-gray-400"
            )}
          >
            {config.label}
          </motion.span>
        )}
        {!unlocked && (
          <p className="text-[10px] text-muted-foreground/70">
            {progress}/{maxProgress}
          </p>
        )}
      </div>
    </div>
  );
};

export default AchievementBadge;
