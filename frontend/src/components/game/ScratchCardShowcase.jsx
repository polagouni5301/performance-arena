/**
 * Scratch Card Showcase Component
 * Google Pay style rewards showcase with collected cards, real-time expiry countdown, and status
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Gift,
  Clock,
  AlertCircle,
  ArrowRight,
  CheckCircle,
  Star,
  Sparkles,
  ChevronRight,
  Zap,
  Timer,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

// Helper function to parse expiry string and convert to seconds
const parseExpiryToSeconds = (expiresIn) => {
  if (!expiresIn) return 0;
  const match = expiresIn.match(/(\d+)h\s*(\d+)?m?/);
  if (match) {
    const hours = parseInt(match[1]) || 0;
    const minutes = parseInt(match[2]) || 0;
    return hours * 3600 + minutes * 60;
  }
  return 0;
};

// Real-time countdown hook
const useCountdown = (initialSeconds) => {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    setSeconds(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = setInterval(() => {
      setSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [seconds > 0]);

  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return {
    hours,
    mins,
    secs,
    isExpired: seconds <= 0,
    isUrgent: seconds < 3600, // Less than 1 hour
    formatted: `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`,
  };
};

// Individual Card with Countdown - Sleek Google Pay Style Design
const PendingCard = ({ card, idx, onScratch, styles }) => {
  const initialSeconds = parseExpiryToSeconds(card.expiresIn);
  const countdown = useCountdown(initialSeconds);
  const StatusIcon = styles.icon;
  const cardDesign = card.cardDesign;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.1 }}
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onScratch?.(card.id)}
      className={cn(
        "relative flex flex-col p-4 rounded-2xl border cursor-pointer transition-all overflow-hidden shadow-lg hover:shadow-xl",
        "bg-gradient-to-br",
        cardDesign?.gradient || "from-yellow-600 to-orange-500",
        "border-white/20"
      )}
    >
      {/* Shimmer Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"
        animate={{ x: ["-100%", "100%"] }}
        transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 2 }}
      />

      {/* Icon - Large and Centered */}
      <motion.div
        className="relative text-5xl mb-2"
        animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 3, repeat: Infinity, repeatDelay: 4 }}
      >
        {cardDesign?.icon || "🎁"}
      </motion.div>

      {/* Card Content */}
      <div className="relative z-10 flex-1 flex flex-col">
        <h3 className="font-bold text-white text-sm mb-1">{card.name}</h3>
        <p className="text-xs text-white/80 mb-2">{cardDesign?.hint || 'Tap to reveal'}</p>
        
        {/* Urgent indicator dot */}
        {countdown.isUrgent && !countdown.isExpired && (
          <motion.span
            className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-destructive"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 0.6, repeat: Infinity }}
          />
        )}
      </div>

      {/* Date & Timer */}
      <div className="relative z-10 mt-3 flex items-center justify-between text-xs">
        <span className="text-white/70 font-mono">{card.date}</span>
        {card.status === "pending" && (
          <span className={cn(
            "font-bold",
            countdown.isExpired ? "text-red-400" : countdown.isUrgent ? "text-yellow-300" : "text-white/70"
          )}>
            {countdown.formatted}
          </span>
        )}
      </div>
    </motion.div>
  );
};

// Scratched Card Display
const ScratchCardShowcase = ({ 
  cards = [], 
  onScratchCard,
  onViewDetails,
  meetsThreshold = true,
  todaysMetric = null,
}) => {
  const [selectedCard, setSelectedCard] = useState(null);

  const defaultCards = [
    {
      id: 1,
      date: "Today",
      status: "pending",
      reward: "???",
      expiresIn: "23h 45m",
      source: "Daily Performance",
      metric: { name: "Revenue", value: "$520", target: "$500", met: true },
    },
    {
      id: 2,
      date: "Yesterday",
      status: "pending",
      reward: "???",
      expiresIn: "12h 30m",
      source: "QA Excellence",
      metric: { name: "QA Score", value: "95%", target: "90%", met: true },
    },
    {
      id: 3,
      date: "2 days ago",
      status: "scratched",
      reward: "+250 PTS",
      source: "NPS Achievement",
      claimedAt: "Jan 25, 2:30 PM",
    },
    {
      id: 4,
      date: "3 days ago",
      status: "scratched",
      reward: "+450 PTS",
      source: "NRPC Target Hit",
      claimedAt: "Jan 24, 3:15 PM",
    },
    {
      id: 5,
      date: "4 days ago",
      status: "expired",
      reward: "Expired",
      source: "Daily Streak",
      expiredAt: "Jan 23",
    },
    {
      id: 6,
      date: "5 days ago",
      status: "scratched",
      reward: "+500 PTS",
      source: "Weekly Bonus",
      claimedAt: "Jan 22, 11:15 AM",
    },
  ];

  const displayCards = cards.length > 0 ? cards : defaultCards;
  
  const pendingCards = displayCards.filter(c => c.status === "pending");
  const scratchedCards = displayCards.filter(c => c.status === "scratched");
  const expiredCards = displayCards.filter(c => c.status === "expired");

  const getStatusStyles = (status) => {
    switch (status) {
      case "pending":
        return {
          bg: "bg-gradient-to-br from-accent/20 to-warning/20",
          border: "border-accent/40",
          glow: "shadow-[0_0_20px_hsl(var(--accent)/0.2)]",
          icon: Sparkles,
          iconColor: "text-accent",
          label: "Scratch Me!",
          labelColor: "bg-accent/20 text-accent",
        };
      case "scratched":
        return {
          bg: "bg-success/10",
          border: "border-success/30",
          glow: "",
          icon: CheckCircle,
          iconColor: "text-success",
          label: "Claimed",
          labelColor: "bg-success/20 text-success",
        };
      case "expired":
        return {
          bg: "bg-muted/30",
          border: "border-border/50",
          glow: "",
          icon: AlertCircle,
          iconColor: "text-destructive/60",
          label: "Expired",
          labelColor: "bg-destructive/20 text-destructive",
        };
      default:
        return {
          bg: "bg-muted/30",
          border: "border-border/50",
          glow: "",
          icon: Gift,
          iconColor: "text-muted-foreground",
          label: "Unknown",
          labelColor: "bg-muted text-muted-foreground",
        };
    }
  };

  return (
    <div className="space-y-3">
      {/* Header Stats - Compact */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2 font-oxanium tracking-wide">
            <Gift className="w-4 h-4 text-accent" />
            SCRATCH REWARDS
          </h3>
          <p className="text-[10px] text-muted-foreground font-mono">
            Meet daily targets to earn
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="px-2 py-1 rounded-lg bg-accent/10 border border-accent/30">
            <span className="text-lg font-display text-accent">{pendingCards.length}</span>
            <span className="text-[9px] text-accent/70 ml-1">Pending</span>
          </div>
          <div className="px-2 py-1 rounded-lg bg-success/10 border border-success/30">
            <span className="text-lg font-display text-success">{scratchedCards.length}</span>
            <span className="text-[9px] text-success/70 ml-1">Claimed</span>
          </div>
        </div>
      </div>

      {/* Today's Performance Card (Conditional Display - Only if threshold met) */}
      {todaysMetric && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn(
            "p-4 rounded-xl border-2",
            meetsThreshold
              ? "bg-gradient-to-r from-success/10 to-accent/10 border-success/40"
              : "bg-muted/30 border-border/50"
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                className={cn(
                  "w-14 h-14 rounded-xl flex items-center justify-center",
                  meetsThreshold ? "bg-success/20" : "bg-muted/50"
                )}
                animate={meetsThreshold ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {meetsThreshold ? (
                  <Sparkles className="w-7 h-7 text-success" />
                ) : (
                  <Timer className="w-7 h-7 text-muted-foreground" />
                )}
              </motion.div>
              <div>
                <h4 className="font-bold text-foreground">Today's Performance</h4>
                <p className="text-sm text-muted-foreground">
                  {todaysMetric.name}: <span className={meetsThreshold ? "text-success font-medium" : "text-muted-foreground"}>
                    {todaysMetric.value}
                  </span> / {todaysMetric.target} target
                </p>
              </div>
            </div>
            
            {meetsThreshold ? (
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px hsla(var(--accent), 0.5)" }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("Scratch Now clicked - triggering modal");
                  if (onScratchCard) {
                    onScratchCard({ id: 'today', status: 'pending', reward: '???', date: 'Today' });
                  }
                }}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-accent via-warning to-accent text-accent-foreground font-bold text-sm uppercase tracking-wider shadow-lg shadow-accent/40 hover:shadow-accent/60 transition-all animate-pulse"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Scratch Now!
                </span>
              </motion.button>
            ) : (
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Keep going!</p>
                <p className="text-xs text-warning">
                  Need {todaysMetric.remaining} more to unlock
                </p>
              </div>
            )}
          </div>
        </motion.div>
      )}

     

      {/* Claimed & Expired Cards (Timeline View) */}
      <div className="space-y-3">
        <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
          <Clock className="w-4 h-4 text-secondary" />
          Card History
        </h4>
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-5 rounded-2xl border bg-gradient-to-r from-accent/10 via-card to-warning/10 border-accent/30"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-accent" />
                <h3 className="text-lg font-bold text-foreground">Your Rewards</h3>
                <span className="px-2 py-0.5 rounded-full bg-success/20 text-success text-[10px] font-bold">THRESHOLD MET ✓</span>
              </div>
              <Link to="/agent/play" className="text-sm text-primary hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
              {/* Pending Cards */}
              {[1, 2, 3].map((idx) => (
                <Link to="/agent/play" key={`pending-${idx}`}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="aspect-square rounded-xl bg-gradient-to-br from-accent/20 to-warning/20 border-2 border-accent/40 flex flex-col items-center justify-center p-3 cursor-pointer relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                    <Gift className="w-8 h-8 text-accent mb-2 group-hover:animate-bounce" />
                    <span className="text-[10px] text-accent font-bold uppercase">Scratch Me</span>
                    <span className="text-[9px] text-muted-foreground mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {23 - idx * 5}h left
                    </span>
                  </motion.div>
                </Link>
              ))}

              {/* Today's Card */}
              <Link to="/agent/play">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="aspect-square rounded-xl bg-gradient-to-br from-success/20 to-secondary/20 border-2 border-success/50 flex flex-col items-center justify-center p-3 cursor-pointer relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent animate-shimmer" />
                  <Sparkles className="w-8 h-8 text-success mb-2" />
                  <span className="text-[10px] text-success font-bold uppercase">New Today!</span>
                </motion.div>
              </Link>

              {/* Claimed Cards */}
              {[1, 2].map((idx) => (
                <motion.div
                  key={`claimed-${idx}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (idx + 3) * 0.1 }}
                  className="aspect-square rounded-xl bg-muted/30 border border-border/50 flex flex-col items-center justify-center p-3 opacity-60"
                >
                  <CheckCircle className="w-6 h-6 text-success/60 mb-2" />
                  <span className="text-[10px] text-muted-foreground font-medium">+{idx * 250} PTS</span>
                  <span className="text-[9px] text-muted-foreground">Claimed</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        <div className="space-y-2">
          {[...scratchedCards, ...expiredCards]
            .sort((a, b) => b.id - a.id)
            .map((card, idx) => {
              const styles = getStatusStyles(card.status);
              const StatusIcon = styles.icon;

              return (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={cn(
                    "flex items-center gap-4 p-3 rounded-xl border transition-all",
                    styles.bg,
                    styles.border,
                    "hover:border-opacity-60"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    card.status === "scratched" ? "bg-success/20" : "bg-muted/50"
                  )}>
                    <StatusIcon className={cn("w-5 h-5", styles.iconColor)} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground">{card.source}</p>
                      <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold", styles.labelColor)}>
                        {styles.label}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {card.status === "scratched" ? card.claimedAt : card.expiredAt}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className={cn(
                      "font-bold",
                      card.status === "scratched" ? "text-success" : "text-muted-foreground line-through"
                    )}>
                      {card.reward}
                    </p>
                  </div>
                </motion.div>
              );
            })}
        </div>
      </div>

      {/* Empty State */}
      {displayCards.length === 0 && (
        <div className="text-center py-12">
          <Gift className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground">No scratch cards yet</p>
          <p className="text-sm text-muted-foreground/70">Meet your daily targets to earn cards!</p>
        </div>
      )}

      {/* View More Rewards Button */}
      {displayCards.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="pt-4 mt-4 border-t border-border/30"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.location.href = '/agent/rewards'}
            className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-accent/20 to-primary/20 border border-accent/40 text-accent hover:from-accent/30 hover:to-primary/30 text-sm font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
          >
            <Gift className="w-4 h-4" />
            View More Rewards & Achievements
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default ScratchCardShowcase;
