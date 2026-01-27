/**
 * TechDecorations
 * Lightweight, reusable tech-themed overlays (HUD frame + energy orb)
 * meant to be layered on top of pages without impacting layout.
 */

import { motion, useReducedMotion } from "framer-motion";
import techHud from "@/assets/tech-hologram-hud.png";
import techOrb from "@/assets/tech-data-orb.png";

const floatA = {
  animate: { y: [0, -10, 0], rotate: [0, 2, 0] },
  transition: { duration: 6, repeat: Infinity, ease: "easeInOut" },
};

const floatB = {
  animate: { y: [0, 12, 0], rotate: [0, -2, 0] },
  transition: { duration: 7.5, repeat: Infinity, ease: "easeInOut" },
};

export default function TechDecorations({ variant = "login" }) {
  const reduced = useReducedMotion();

  const isLogin = variant === "login";
  const isLanding = variant === "landing";

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* HUD frame */}
      <motion.img
        src={techHud}
        alt="Futuristic HUD frame"
        loading="lazy"
        className={
          isLogin
            ? "absolute -left-10 top-1/2 -translate-y-1/2 w-[520px] max-w-none opacity-35"
            : "absolute -right-16 top-10 w-[520px] max-w-none opacity-30"
        }
        {...(reduced
          ? {}
          : {
              animate: { opacity: [0.22, 0.38, 0.22] },
              transition: { duration: 3.5, repeat: Infinity, ease: "easeInOut" },
            })}
        style={{
          filter:
            "drop-shadow(0 0 35px hsl(var(--primary) / 0.22)) drop-shadow(0 0 28px hsl(var(--secondary) / 0.18))",
        }}
      />

      {/* Energy orb */}
      <motion.img
        src={techOrb}
        alt="Glowing data orb"
        loading="lazy"
        className={
          isLogin
            ? "absolute left-10 bottom-10 w-44 opacity-90"
            : isLanding
            ? "absolute right-10 bottom-10 w-48 opacity-90"
            : "absolute right-10 bottom-10 w-44 opacity-90"
        }
        {...(reduced ? {} : floatA)}
        style={{
          filter:
            "drop-shadow(0 0 55px hsl(var(--secondary) / 0.35)) drop-shadow(0 0 45px hsl(var(--primary) / 0.25))",
        }}
      />

      {/* Secondary small orb (subtle) */}
      <motion.div
        className={
          isLogin
            ? "absolute right-14 top-20 h-10 w-10 rounded-full opacity-60"
            : "absolute left-10 top-24 h-10 w-10 rounded-full opacity-55"
        }
        {...(reduced ? {} : floatB)}
        style={{
          background:
            "radial-gradient(circle at 30% 30%, hsl(var(--secondary) / 0.9) 0%, hsl(var(--primary) / 0.35) 40%, transparent 70%)",
          boxShadow:
            "0 0 40px hsl(var(--secondary) / 0.25), 0 0 30px hsl(var(--primary) / 0.18)",
        }}
      />
    </div>
  );
}
