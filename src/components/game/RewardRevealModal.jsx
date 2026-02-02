import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const toneToVars = {
  primary: { ring: "--primary", glow: "--primary-glow" },
  secondary: { ring: "--secondary", glow: "--secondary-glow" },
  accent: { ring: "--accent", glow: "--warning" },
};

const hslVar = (name, alpha = 1) => `hsl(var(${name}) / ${alpha})`;

const RewardRevealModal = ({
  open,
  onClose,
  title = "Reward Unlocked",
  subtitle,
  highlight,
  Icon,
  tone = "primary",
}) => {
  const vars = toneToVars[tone] ?? toneToVars.primary;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-background/80 backdrop-blur-md" />

          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            style={{
              background: `conic-gradient(from 180deg,
                ${hslVar(vars.ring, 0)} 0deg,
                ${hslVar(vars.ring, 0.25)} 35deg,
                ${hslVar(vars.glow, 0.18)} 90deg,
                ${hslVar(vars.ring, 0.25)} 140deg,
                ${hslVar(vars.ring, 0)} 180deg,
                ${hslVar(vars.ring, 0.22)} 240deg,
                ${hslVar(vars.ring, 0)} 360deg)`,
              maskImage:
                "radial-gradient(circle at 50% 50%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 50%, rgba(0,0,0,0) 72%)",
              WebkitMaskImage:
                "radial-gradient(circle at 50% 50%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 50%, rgba(0,0,0,0) 72%)",
            }}
          />

          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 26 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                initial={{ x: "50%", y: "50%", opacity: 0, scale: 0 }}
                animate={{
                  x: `${10 + Math.random() * 80}%`,
                  y: `${10 + Math.random() * 80}%`,
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0.6],
                }}
                transition={{ duration: 1.2, delay: i * 0.02 }}
                style={{
                  width: 4 + Math.random() * 6,
                  height: 4 + Math.random() * 6,
                  background: hslVar(vars.glow, 0.9),
                  boxShadow: `0 0 18px ${hslVar(vars.glow, 0.45)}`,
                }}
              />
            ))}
          </div>

          <motion.div
            className="relative w-full max-w-lg glass-card-hero p-6 sm:p-8"
            initial={{ y: 24, scale: 0.95, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 24, scale: 0.98, opacity: 0 }}
            transition={{ type: "spring", damping: 16, stiffness: 180 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-card/40 border border-border text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-start gap-4">
              <motion.div
                className="relative shrink-0 h-14 w-14 rounded-2xl bg-card/40 border border-border flex items-center justify-center"
                animate={{
                  boxShadow: [
                    `0 0 18px ${hslVar(vars.ring, 0.25)}`,
                    `0 0 32px ${hslVar(vars.glow, 0.35)}`,
                    `0 0 18px ${hslVar(vars.ring, 0.25)}`,
                  ],
                }}
                transition={{ duration: 2.2, repeat: Infinity }}
              >
                {Icon ? <Icon className="h-7 w-7 text-foreground" /> : null}
                <div
                  className="absolute -inset-2 rounded-3xl blur-xl -z-10"
                  style={{
                    background: `radial-gradient(circle, ${hslVar(vars.ring, 0.35)} 0%, transparent 70%)`,
                  }}
                />
              </motion.div>

              <div className="min-w-0">
                <h3 className="text-xl sm:text-2xl font-bold text-foreground">{title}</h3>
                {subtitle ? (
                  <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
                ) : null}
              </div>
            </div>

            {highlight ? (
              <motion.div
                className="mt-6 rounded-2xl bg-card/40 border border-border p-5 text-center"
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.08 }}
                style={{ boxShadow: `0 0 40px ${hslVar(vars.glow, 0.18)}` }}
              >
                <motion.div
                  className="text-4xl sm:text-5xl font-black tracking-tight"
                  animate={{ y: [0, -2, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                  style={{
                    background: `linear-gradient(135deg, ${hslVar(vars.glow, 1)} 0%, ${hslVar(
                      vars.ring,
                      0.95
                    )} 55%, ${hslVar(vars.glow, 0.9)} 100%)`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {highlight}
                </motion.div>
              </motion.div>
            ) : null}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RewardRevealModal;
