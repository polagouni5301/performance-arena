/**
 * SpinWheelWrapper - Modal wrapper for the SpinningWheel component
 * Provides themed modal behavior with isOpen/onClose props
 */
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Zap } from "lucide-react";
import { Portal } from "@/components/ui/Portal";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import SpinningWheel from "./SpinningWheel";

const SpinWheelWrapper = ({
  isOpen,
  onClose,
  onSpin,
  onClaimReward,
  tokenBalance = 0,
  tokenCost = 100,
  currentPoints = 0,
  onClaimSuccess,
}) => {
  useLockBodyScroll(isOpen);

  // Handle escape key to close
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose?.();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <Portal>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
          style={{
            background: "linear-gradient(135deg, hsl(240 20% 3% / 0.98), hsl(270 25% 8% / 0.98), hsl(240 20% 3% / 0.98))",
          }}
        >
          {/* Animated Background Effects */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Primary glow orb */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
              style={{
                background: "radial-gradient(circle, hsl(320 100% 55% / 0.15) 0%, transparent 70%)",
              }}
              animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            {/* Secondary glow orb */}
            <motion.div
              className="absolute top-1/4 right-1/4 w-[400px] h-[400px] rounded-full"
              style={{
                background: "radial-gradient(circle, hsl(185 100% 50% / 0.12) 0%, transparent 70%)",
              }}
              animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1 }}
            />
            {/* Accent glow */}
            <motion.div
              className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] rounded-full"
              style={{
                background: "radial-gradient(circle, hsl(42 100% 50% / 0.1) 0%, transparent 70%)",
              }}
              animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 5, repeat: Infinity, delay: 2 }}
            />
            {/* Floating particles */}
            {Array.from({ length: 15 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full"
                style={{
                  backgroundColor: ["hsl(320 100% 55%)", "hsl(185 100% 50%)", "hsl(42 100% 50%)"][i % 3],
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0.3, 0.7, 0.3],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          {/* Header with Token Balance */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-4 left-0 right-0 px-4 flex items-center justify-between z-50"
          >
            {/* Title */}
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent" />
              <h2 className="font-display text-lg lg:text-xl text-foreground tracking-wider">
                ELITE SPIN WHEEL
              </h2>
            </div>

            {/* Token Balance + Close */}
            <div className="flex items-center gap-3">
              <div className="px-3 py-1.5 rounded-lg bg-card/80 border border-primary/30 flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                <span className="font-display text-sm text-primary">
                  {tokenBalance.toLocaleString()}
                </span>
                <span className="text-[10px] text-muted-foreground uppercase">tokens</span>
              </div>

              <motion.button
                onClick={onClose}
                className="p-2 rounded-full bg-card/80 border border-border hover:bg-muted transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5 text-foreground" />
              </motion.button>
            </div>
          </motion.div>

          {/* Spin Wheel Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative z-10 w-full max-w-xl mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <SpinningWheel
              onSpin={onSpin}
              onClaimReward={(data) => {
                onClaimReward?.(data);
                onClaimSuccess?.();
              }}
              tokenCost={tokenCost}
            />
          </motion.div>

          {/* Bottom Hint */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute bottom-4 left-0 right-0 text-center z-50"
          >
            <p className="text-xs text-muted-foreground">
              <span className="text-primary">{tokenCost}</span> tokens per spin • Win up to <span className="text-accent">1000 PTS</span>
            </p>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </Portal>
  );
};

export default SpinWheelWrapper;
