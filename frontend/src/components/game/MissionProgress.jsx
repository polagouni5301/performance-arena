/**
 * Mission Progress Component
 * Gamified view of daily missions/challenges at the top of PlayZone
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target,
  CheckCircle,
  Clock,
  Star,
  Zap,
  Trophy,
  Gift,
  Flame,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const MissionProgress = ({ 
  missions = [],
  completedCount = 0,
  totalCount = 5,
  bonusReward = "+100 Bonus PTS",
  onMissionClick,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const defaultMissions = [
    {
      id: 1,
      title: "Complete 10 calls",
      progress: 100,
      completed: true,
      reward: "+50 PTS",
      icon: "📞",
    },
    {
      id: 2,
      title: "Revenue > $200",
      progress: 100,
      completed: true,
      reward: "+75 PTS",
      icon: "💰",
      current: "$250",
      target: "$200",
    },
    {
      id: 3,
      title: "QA Score > 90%",
      progress: 85,
      completed: false,
      reward: "+50 PTS",
      icon: "✅",
      current: "85%",
      target: "90%",
    },
    {
      id: 4,
      title: "First Call Resolution",
      progress: 60,
      completed: false,
      reward: "+100 PTS",
      icon: "🎯",
      current: "3",
      target: "5",
    },
    {
      id: 5,
      title: "Customer Compliment",
      progress: 0,
      completed: false,
      reward: "+150 PTS",
      icon: "⭐",
      current: "0",
      target: "1",
    },
  ];

  const displayMissions = missions.length > 0 ? missions : defaultMissions;
  const completed = displayMissions.filter(m => m.completed).length;
  const total = displayMissions.length;
  const overallProgress = displayMissions.length > 0 ? displayMissions.reduce((sum, m) => sum + (m.progress || 0), 0) / displayMissions.length : 0;
  const allCompleted = completed === total;

  return (
    <div className="space-y-4">
      {/* Main Progress Card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "relative p-4 lg:p-5 rounded-2xl border overflow-hidden",
          allCompleted
            ? "bg-gradient-to-r from-success/15 via-secondary/15 to-accent/15 border-success/40"
            : "bg-gradient-to-r from-primary/10 via-card to-secondary/10 border-primary/30"
        )}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: "radial-gradient(circle, hsl(var(--primary)) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }} />
        </div>

        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            {/* Title & Count */}
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center",
                allCompleted
                  ? "bg-success/20 shadow-lg shadow-success/20"
                  : "bg-primary/20"
              )}>
                {allCompleted ? (
                  <Trophy className="w-6 h-6 text-success" />
                ) : (
                  <Target className="w-6 h-6 text-primary" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground" style={{ fontFamily: "'Sora', sans-serif" }}>
                  Daily Missions
                </h3>
                <p className="text-sm text-muted-foreground">
                  <span className={allCompleted ? "text-success font-bold" : "text-secondary font-bold"}>
                    {completed}/{total}
                  </span> completed
                </p>
              </div>
            </div>

            {/* Bonus Reward Indicator */}
            <div className={cn(
              "px-4 py-2 rounded-xl border flex items-center gap-2",
              allCompleted
                ? "bg-success/20 border-success/40"
                : "bg-warning/10 border-warning/30"
            )}>
              <Gift className={cn("w-5 h-5", allCompleted ? "text-success" : "text-warning")} />
              <div className="text-right">
                <p className="text-[10px] text-muted-foreground uppercase">All Clear Bonus</p>
                <p className={cn("font-bold text-sm", allCompleted ? "text-success" : "text-warning")}>
                  {bonusReward}
                </p>
              </div>
            </div>
          </div>

          {/* Mission Pills */}
          <div className="flex flex-wrap gap-2 mb-4">
            {displayMissions.map((mission, idx) => (
              <motion.button
                key={mission.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => onMissionClick?.(mission.id)}
                className={cn(
                  "group relative flex items-center gap-2 px-3 py-2 rounded-xl border transition-all",
                  mission.completed
                    ? "bg-success/15 border-success/40 hover:border-success/60"
                    : mission.progress > 0
                    ? "bg-primary/10 border-primary/30 hover:border-primary/50"
                    : "bg-muted/30 border-border/50 hover:border-border"
                )}
              >
                <span className="text-lg">{mission.icon}</span>
                <span className={cn(
                  "text-xs font-medium",
                  mission.completed ? "text-success" : "text-foreground"
                )}>
                  {mission.title}
                </span>
                {mission.completed ? (
                  <CheckCircle className="w-4 h-4 text-success" />
                ) : (
                  <span className="text-[10px] text-muted-foreground">
                    {mission.progress}%
                  </span>
                )}

                {/* Tooltip on hover */}
                {!mission.completed && mission.current && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-lg bg-popover border border-border text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20 shadow-lg">
                    {mission.current} / {mission.target}
                  </div>
                )}
              </motion.button>
            ))}
          </div>

          {/* Overall Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Overall Progress</span>
              <span className={allCompleted ? "text-success font-bold" : "text-secondary font-bold"}>
                {Math.round(overallProgress)}%
              </span>
            </div>
            <div className="h-3 bg-muted/50 rounded-full overflow-hidden">
              <motion.div
                className={cn(
                  "h-full rounded-full relative",
                  allCompleted
                    ? "bg-gradient-to-r from-success via-secondary to-success"
                    : "bg-gradient-to-r from-primary via-secondary to-accent"
                )}
                initial={{ width: 0 }}
                animate={{ width: `${overallProgress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                style={{
                  boxShadow: allCompleted
                    ? "0 0 15px hsl(var(--success) / 0.5)"
                    : "0 0 10px hsl(var(--primary) / 0.4)",
                }}
              >
                {/* Animated shine */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
                />
              </motion.div>
            </div>
          </div>

          {/* All Complete Celebration */}
          <AnimatePresence>
            {allCompleted && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 p-3 rounded-xl bg-success/20 border border-success/40 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-success" />
                  <div>
                    <p className="font-bold text-success text-sm">All Missions Complete!</p>
                    <p className="text-xs text-success/70">Claim your bonus reward</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 rounded-lg bg-success text-success-foreground font-bold text-sm shadow-lg shadow-success/30"
                >
                  Claim Bonus
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default MissionProgress;
