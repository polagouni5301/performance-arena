/**
 * Earning History Component
 * Timeline view of spin wheel and scratch card earnings
 */

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Clock,
  Gift,
  Star,
  Zap,
  TrendingUp,
  Filter,
  ChevronDown,
  Trophy,
  Target,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const EarningHistory = ({ 
  history = [],
  onViewAll,
}) => {
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState(false);

  const defaultHistory = [
    {
      id: 1,
      type: "spin-wheel",
      title: "Lucky Spin Win",
      reward: "+500 PTS",
      tokens: 10,
      timestamp: "Today, 2:30 PM",
      icon: Star,
      color: "text-warning",
      bgColor: "bg-warning/20",
    },
    {
      id: 2,
      type: "scratch-card",
      title: "Daily Scratch Card",
      reward: "+250 PTS",
      tokens: 5,
      timestamp: "Today, 10:15 AM",
      icon: Gift,
      color: "text-accent",
      bgColor: "bg-accent/20",
    },
    {
      id: 3,
      type: "challenge",
      title: "Weekly Challenge: NPS",
      reward: "+20 TOKENS",
      tokens: 20,
      timestamp: "Yesterday, 5:00 PM",
      icon: Target,
      color: "text-secondary",
      bgColor: "bg-secondary/20",
    },
    {
      id: 4,
      type: "streak",
      title: "7-Day Streak Bonus",
      reward: "+100 PTS",
      tokens: 15,
      timestamp: "Yesterday, 9:00 AM",
      icon: TrendingUp,
      color: "text-success",
      bgColor: "bg-success/20",
    },
    {
      id: 5,
      type: "spin-wheel",
      title: "Spin Wheel - Mystery Box",
      reward: "🎁 Mystery Reward",
      tokens: 0,
      timestamp: "2 days ago",
      icon: Sparkles,
      color: "text-primary",
      bgColor: "bg-primary/20",
    },
    {
      id: 6,
      type: "scratch-card",
      title: "Performance Scratch Card",
      reward: "+750 PTS",
      tokens: 8,
      timestamp: "2 days ago",
      icon: Gift,
      color: "text-accent",
      bgColor: "bg-accent/20",
    },
    {
      id: 7,
      type: "challenge",
      title: "Weekly Challenge: QA",
      reward: "+10 TOKENS",
      tokens: 10,
      timestamp: "3 days ago",
      icon: Target,
      color: "text-secondary",
      bgColor: "bg-secondary/20",
    },
    {
      id: 8,
      type: "spin-wheel",
      title: "Lucky Spin - Double Points",
      reward: "+1000 PTS",
      tokens: 20,
      timestamp: "4 days ago",
      icon: Star,
      color: "text-warning",
      bgColor: "bg-warning/20",
    },
  ];

  const displayHistory = defaultHistory;
  
  const filteredHistory = filter === "all" 
    ? displayHistory 
    : displayHistory.filter(h => h.type === filter);

  const displayedHistory = expanded ? filteredHistory : filteredHistory.slice(0, 5);

  const totalPoints = displayHistory
    .filter(h => h.reward && h.reward.includes("PTS"))
    .reduce((sum, h) => {
      const match = h.reward.match(/\+(\d+)/);
      return sum + (match ? parseInt(match[1]) : 0);
    }, 0);

  const totalTokens = displayHistory.reduce((sum, h) => sum + (h.tokens || 0), 0);

  const filters = [
    { id: "all", label: "All", icon: Clock },
    { id: "spin-wheel", label: "Spins", icon: Star },
    { id: "scratch-card", label: "Scratches", icon: Gift },
    { id: "challenge", label: "Challenges", icon: Target },
    { id: "streak", label: "Streaks", icon: TrendingUp },
  ];

  return (
    <div className="space-y-4">
      {/* Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-2 font-oxanium tracking-wide">
          <Clock className="w-4 h-4 text-secondary" />
          EARNING HISTORY
        </h3>
        
        {/* Stats Summary */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-[9px] text-muted-foreground uppercase">Week</p>
            <p className="text-sm font-display text-success">+{totalPoints.toLocaleString()}</p>
          </div>
          <div className="h-6 w-px bg-border/50" />
          <div className="text-right">
            <p className="text-[9px] text-muted-foreground uppercase">Tokens</p>
            <p className="text-sm font-display text-warning">+{totalTokens}</p>
          </div>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => {
          const FilterIcon = f.icon;
          return (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                filter === f.id
                  ? "bg-primary/20 text-primary border border-primary/40"
                  : "bg-muted/30 text-muted-foreground border border-transparent hover:border-border/50"
              )}
            >
              <FilterIcon className="w-3.5 h-3.5" />
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Horizontal Card Grid - Full width layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        {displayedHistory.map((entry, idx) => {
          const Icon = entry.icon || Star;

          return (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              className={cn(
                "p-4 rounded-xl border transition-all hover:scale-[1.02]",
                "bg-gradient-to-br from-card/80 to-card/40",
                "border-border/50 hover:border-primary/40"
              )}
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                  entry.bgColor
                )}>
                  <Icon className={cn("w-5 h-5", entry.color)} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm truncate">{entry.title}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{entry.timestamp}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={cn("font-bold text-sm", entry.color)}>{entry.reward}</span>
                    {entry.tokens > 0 && (
                      <span className="text-[10px] text-warning bg-warning/10 px-1.5 py-0.5 rounded">+{entry.tokens} tokens</span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Show More / Less */}
      {filteredHistory.length > 5 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full py-2.5 rounded-lg bg-muted/30 border border-border/50 text-sm text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all flex items-center justify-center gap-2"
        >
          {expanded ? "Show Less" : `Show ${filteredHistory.length - 5} More`}
          <ChevronDown className={cn("w-4 h-4 transition-transform", expanded && "rotate-180")} />
        </button>
      )}

      {/* Empty State */}
      {filteredHistory.length === 0 && (
        <div className="text-center py-8">
          <Clock className="w-10 h-10 mx-auto text-muted-foreground/50 mb-3" />
          <p className="text-muted-foreground">No earnings yet for this filter</p>
        </div>
      )}
    </div>
  );
};

export default EarningHistory;
