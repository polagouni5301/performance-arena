import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, Zap, Trophy, Target, Gift, Star } from "lucide-react";

const defaultTips = [
  {
    icon: Zap,
    title: "Quick Tip",
    text: "Complete daily challenges to earn bonus XP and climb the leaderboard faster!",
    color: "text-yellow-400",
  },
  {
    icon: Trophy,
    title: "Pro Tip",
    text: "Maintain a streak of 7 days to unlock exclusive rewards and multipliers.",
    color: "text-purple-400",
  },
  {
    icon: Target,
    title: "Strategy",
    text: "Focus on your strongest metrics first to build momentum in competitions.",
    color: "text-cyan-400",
  },
  {
    icon: Gift,
    title: "Did You Know?",
    text: "Scratch cards refresh every 24 hours. Don't miss your daily chance to win!",
    color: "text-pink-400",
  },
  {
    icon: Star,
    title: "Achievement Unlocked",
    text: "Elite players earn 2x XP during weekend events. Plan your gameplay!",
    color: "text-green-400",
  },
  {
    icon: Lightbulb,
    title: "Insider Tip",
    text: "Check the Rewards Vault regularly for limited-time redemption offers.",
    color: "text-orange-400",
  },
];

const LoadingTipsCarousel = ({ tips = defaultTips, interval = 4000 }) => {
  const [currentTip, setCurrentTip] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, interval);

    return () => clearInterval(timer);
  }, [tips.length, interval]);

  const tip = tips[currentTip];
  const IconComponent = tip.icon;

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Tip Card */}
      <div className="relative p-4 rounded-xl bg-[hsla(260,30%,12%,0.8)] border border-purple-500/30 backdrop-blur-sm">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTip}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex items-start gap-3"
          >
            <div className={`p-2 rounded-lg bg-[hsla(260,30%,20%,0.8)] ${tip.color}`}>
              <IconComponent className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${tip.color}`}>
                {tip.title}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {tip.text}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dot Indicators */}
      <div className="flex justify-center gap-1.5 mt-3">
        {tips.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentTip(idx)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              idx === currentTip
                ? "bg-cyan-400 w-6 shadow-[0_0_10px_hsla(180,100%,50%,0.8)]"
                : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default LoadingTipsCarousel;
