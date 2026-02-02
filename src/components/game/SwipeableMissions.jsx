/**
 * SwipeableMissions - Mobile swipe navigation for daily missions
 * Shows one active mission at a time with gesture controls
 */
import { useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import { 
  ChevronLeft, 
  ChevronRight, 
  Target, 
  CheckCircle, 
  Flame, 
  Star,
  Zap,
  Shield,
  TrendingUp,
  Clock,
} from "lucide-react";
import { cn } from "../../lib/utils";

const iconMap = {
  target: Target,
  flame: Flame,
  star: Star,
  zap: Zap,
  shield: Shield,
  trending: TrendingUp,
};

const SwipeableMissions = ({ 
  missions = [], 
  onMissionComplete,
  className 
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const containerRef = useRef(null);
  const dragX = useMotionValue(0);

  const defaultMissions = [
    { id: 1, title: "Revenue Target", description: "Hit $500 in sales", progress: 75, target: 100, icon: "trending", reward: 100, completed: false },
    { id: 2, title: "Call Volume", description: "Complete 25 calls", progress: 18, target: 25, icon: "target", reward: 75, completed: false },
    { id: 3, title: "NPS Score", description: "Maintain 70+ NPS", progress: 100, target: 100, icon: "star", reward: 50, completed: true },
    { id: 4, title: "Quality Score", description: "Keep QA above 80%", progress: 85, target: 100, icon: "shield", reward: 80, completed: false },
  ];

  const displayMissions = missions.length > 0 ? missions : defaultMissions;

  const handleDragEnd = (event, info) => {
    const threshold = 50;
    if (info.offset.x > threshold && activeIndex > 0) {
      setDirection(-1);
      setActiveIndex(prev => prev - 1);
    } else if (info.offset.x < -threshold && activeIndex < displayMissions.length - 1) {
      setDirection(1);
      setActiveIndex(prev => prev + 1);
    }
    animate(dragX, 0);
  };

  const goToMission = (index) => {
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
  };

  const goNext = () => {
    if (activeIndex < displayMissions.length - 1) {
      setDirection(1);
      setActiveIndex(prev => prev + 1);
    }
  };

  const goPrev = () => {
    if (activeIndex > 0) {
      setDirection(-1);
      setActiveIndex(prev => prev - 1);
    }
  };

  const currentMission = displayMissions[activeIndex];
  const Icon = iconMap[currentMission?.icon] || Target;
  const isComplete = currentMission?.completed || currentMission?.progress >= currentMission?.target;

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
  };

  return (
    <div className={cn("relative", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-secondary" />
          <h3 className="font-oxanium text-sm font-bold text-foreground tracking-wider">
            ACTIVE OBJECTIVES
          </h3>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs text-muted-foreground font-mono">
            {activeIndex + 1}/{displayMissions.length}
          </span>
        </div>
      </div>

      {/* Swipe Container */}
      <div 
        ref={containerRef}
        className="relative overflow-hidden rounded-xl"
        style={{ touchAction: 'pan-y' }}
      >
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={activeIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            style={{ x: dragX }}
            className="cursor-grab active:cursor-grabbing"
          >
            <div className={cn(
              "arena-panel-hero p-5 border-2 transition-colors",
              isComplete 
                ? "border-success/40 bg-gradient-to-br from-success/5 to-transparent"
                : "border-secondary/30"
            )}>
              {/* Mission Status Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className={cn(
                  "px-3 py-1 rounded text-[10px] font-oxanium tracking-widest uppercase",
                  isComplete 
                    ? "bg-success/20 text-success border border-success/30"
                    : "bg-secondary/20 text-secondary border border-secondary/30"
                )}>
                  {isComplete ? "COMPLETE" : "IN PROGRESS"}
                </span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-accent" />
                  <span className="font-display text-sm text-accent">+{currentMission.reward}</span>
                </div>
              </div>

              {/* Mission Icon & Title */}
              <div className="flex items-start gap-4 mb-4">
                <div className={cn(
                  "w-14 h-14 rounded-xl flex items-center justify-center transition-all",
                  isComplete 
                    ? "bg-gradient-to-br from-success to-emerald-600 shadow-[0_0_20px_hsla(160,100%,40%,0.4)]"
                    : "bg-gradient-to-br from-secondary to-blue-600 shadow-[0_0_15px_hsla(195,100%,50%,0.3)]"
                )}>
                  {isComplete ? (
                    <CheckCircle className="w-7 h-7 text-white" />
                  ) : (
                    <Icon className="w-7 h-7 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-display text-lg text-foreground mb-1">{currentMission.title}</h4>
                  <p className="text-xs text-muted-foreground font-mono">{currentMission.description}</p>
                </div>
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-muted-foreground font-mono">Progress</span>
                  <span className={cn(
                    "font-display font-bold",
                    isComplete ? "text-success" : "text-secondary"
                  )}>
                    {Math.round((currentMission.progress / currentMission.target) * 100)}%
                  </span>
                </div>
                <div className="energy-meter h-3">
                  <motion.div 
                    className={cn(
                      "energy-meter-fill",
                      isComplete && "success"
                    )}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((currentMission.progress / currentMission.target) * 100, 100)}%` }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
              </div>

              {/* Swipe Hint */}
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <ChevronLeft className={cn(
                  "w-4 h-4 transition-opacity",
                  activeIndex === 0 && "opacity-30"
                )} />
                <span className="text-[10px] font-oxanium tracking-widest">SWIPE TO NAVIGATE</span>
                <ChevronRight className={cn(
                  "w-4 h-4 transition-opacity",
                  activeIndex === displayMissions.length - 1 && "opacity-30"
                )} />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Dots */}
      <div className="flex items-center justify-center gap-2 mt-4">
        {displayMissions.map((mission, index) => {
          const missionComplete = mission.completed || mission.progress >= mission.target;
          
          return (
            <button
              key={mission.id}
              onClick={() => goToMission(index)}
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-all",
                index === activeIndex 
                  ? missionComplete 
                    ? "bg-success w-6 shadow-[0_0_10px_hsla(160,100%,40%,0.5)]"
                    : "bg-secondary w-6 shadow-[0_0_10px_hsla(195,100%,50%,0.5)]"
                  : missionComplete
                    ? "bg-success/40"
                    : "bg-muted/50"
              )}
            />
          );
        })}
      </div>

      {/* Arrow Navigation (for desktop/accessibility) */}
      <button
        onClick={goPrev}
        disabled={activeIndex === 0}
        className={cn(
          "absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-background/80 border border-border/50 flex items-center justify-center transition-all hover:border-primary/40 hidden md:flex",
          activeIndex === 0 && "opacity-30 cursor-not-allowed"
        )}
      >
        <ChevronLeft className="w-5 h-5 text-muted-foreground" />
      </button>
      <button
        onClick={goNext}
        disabled={activeIndex === displayMissions.length - 1}
        className={cn(
          "absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-10 h-10 rounded-full bg-background/80 border border-border/50 flex items-center justify-center transition-all hover:border-primary/40 hidden md:flex",
          activeIndex === displayMissions.length - 1 && "opacity-30 cursor-not-allowed"
        )}
      >
        <ChevronRight className="w-5 h-5 text-muted-foreground" />
      </button>
    </div>
  );
};

export default SwipeableMissions;
