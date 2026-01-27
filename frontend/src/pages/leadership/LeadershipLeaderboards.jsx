import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  TrendingUp, 
  TrendingDown,
  Minus,
  Filter,
  Search,
  ChevronDown,
  Crown,
  Star,
  Zap,
  Flame,
  Target,
  Trophy,
  Medal,
  Shield,
  Gift,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Info,
  Users,
} from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useLeadershipLeaderboards } from "./hooks.jsx";
import { TableSkeleton } from "@/components/ui/PageSkeleton";

const LeadershipLeaderboards = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState("Weekly");
  const [selectedViewLevel, setSelectedViewLevel] = useState("All Champions");
  const [selectedRankBy, setSelectedRankBy] = useState("XP Earned");
  const [selectedLevel, setSelectedLevel] = useState("All Levels");
  const [searchQuery, setSearchQuery] = useState("");
  const [showRules, setShowRules] = useState(false);
  const [showPromotionConfetti, setShowPromotionConfetti] = useState(false);
  const [promotedUser, setPromotedUser] = useState(null);

  const { data, loading, error } = useLeadershipLeaderboards({
    timeRange: selectedTimeRange,
    viewLevel: selectedViewLevel,
    rankBy: selectedRankBy,
  });

  // Simulate promotion celebration (demo purpose)
  const triggerPromotionCelebration = (user) => {
    setPromotedUser(user);
    setShowPromotionConfetti(true);
    setTimeout(() => {
      setShowPromotionConfetti(false);
      setPromotedUser(null);
    }, 4000);
  };

  if (loading) return <TableSkeleton />;
  if (error) return <div className="text-destructive p-4">Error: {error}</div>;
  if (!data) return null;

  const { filters, leaderboard, levelTiers, weeklyRewards, promotionRules, currentUser, currentWeek, monthStartDate } = data;

  // Filter by level and search
  const filteredData = (leaderboard || []).filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = selectedLevel === "All Levels" || item.level === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  // Get level info
  const getLevelInfo = (levelName) => {
    return levelTiers?.find(t => t.name === levelName) || levelTiers?.[4];
  };

  const getRankBadgeStyle = (rank) => {
    if (rank === 1) return "bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500 text-white shadow-[0_0_20px_hsla(45,100%,50%,0.5)]";
    if (rank === 2) return "bg-gradient-to-br from-gray-300 via-slate-400 to-gray-500 text-white shadow-[0_0_15px_hsla(0,0%,70%,0.4)]";
    if (rank === 3) return "bg-gradient-to-br from-amber-600 via-orange-600 to-amber-700 text-white shadow-[0_0_15px_hsla(30,80%,50%,0.4)]";
    return "bg-muted/50 text-muted-foreground";
  };

  const getTrendIcon = (type) => {
    if (type === "up") return <TrendingUp className="w-3 h-3" />;
    if (type === "down") return <TrendingDown className="w-3 h-3" />;
    return <Minus className="w-3 h-3" />;
  };

  const getTrendColor = (type) => {
    if (type === "up") return "text-success";
    if (type === "down") return "text-destructive";
    return "text-muted-foreground";
  };

  const getZoneStatus = (rank, total) => {
    const percentile = (rank / total) * 100;
    if (percentile <= 20) return { zone: "promotion", color: "bg-success/20 text-success border-success/40", label: "🚀 Promotion Zone" };
    if (percentile <= 45) return { zone: "safe", color: "bg-secondary/20 text-secondary border-secondary/40", label: "✓ Safe Zone" };
    return { zone: "demotion", color: "bg-destructive/20 text-destructive border-destructive/40", label: "⚠️ Demotion Risk" };
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
      {/* Promotion Confetti */}
      <AnimatePresence>
        {showPromotionConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {Array.from({ length: 100 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: -30, x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1000), rotate: 0, opacity: 1, scale: Math.random() * 0.6 + 0.4 }}
                animate={{ y: (typeof window !== "undefined" ? window.innerHeight : 800) + 100, rotate: Math.random() * 1440, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2.5 + Math.random() * 1.5, delay: Math.random() * 0.5 }}
                className="absolute rounded-sm"
                style={{
                  width: Math.random() * 12 + 6,
                  height: Math.random() * 12 + 6,
                  backgroundColor: ["hsl(var(--success))", "hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--secondary))", "hsl(var(--warning))"][Math.floor(Math.random() * 5)],
                }}
              />
            ))}
            {/* Promotion Banner */}
            {promotedUser && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5, y: -50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 p-8 rounded-2xl bg-gradient-to-br from-success/90 to-secondary/90 border-2 border-success shadow-2xl z-60 text-center"
              >
                <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 0.5, repeat: 3 }}>
                  <Sparkles className="w-16 h-16 text-white mx-auto mb-4" />
                </motion.div>
                <h2 className="text-3xl font-bold text-white mb-2">🎉 Level Up!</h2>
                <p className="text-lg text-white/90">{promotedUser.name} promoted to</p>
                <p className="text-2xl font-bold text-white flex items-center justify-center gap-2 mt-2">
                  {getLevelInfo(promotedUser.nextLevel)?.icon} {promotedUser.nextLevel}
                </p>
              </motion.div>
            )}
          </div>
        )}
      </AnimatePresence>

      {/* Page Header with Gamified Style */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3" style={{ fontFamily: "'Sora', sans-serif" }}>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Trophy className="w-6 h-6 text-primary-foreground" />
            </div>
            Champions Arena
          </h1>
          <p className="text-muted-foreground mt-2">
            XP-powered rankings • <span className="text-secondary font-medium">{currentWeek}</span> • Resets monthly from {monthStartDate}
          </p>
        </div>
        
        {/* Current User Quick Stats */}
        {currentUser && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border border-primary/30"
          >
            <div className="text-center">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Your Rank</p>
              <p className="text-2xl font-bold text-foreground">#{currentUser.rank}</p>
              {currentUser.rankChange && (
                <span className={cn("text-xs font-medium", currentUser.rankChange.startsWith("+") ? "text-success" : "text-destructive")}>
                  {currentUser.rankChange}
                </span>
              )}
            </div>
            <div className="h-12 w-px bg-border" />
            <div className="text-center">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Your XP</p>
              <p className="text-2xl font-bold text-secondary">{currentUser.xp?.toLocaleString()}</p>
              <span className="text-xs text-success">+{currentUser.weeklyXPGain} this week</span>
            </div>
            <div className="h-12 w-px bg-border" />
            <div className="text-center">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Level</p>
              <p className="text-lg font-bold text-accent flex items-center gap-1">
                {getLevelInfo(currentUser.level)?.icon} {currentUser.level}
              </p>
              <span className="text-xs text-muted-foreground">{currentUser.xpToNextLevel} XP to {currentUser.nextLevel}</span>
            </div>
            {/* Demo Promotion Button */}
            <button
              onClick={() => triggerPromotionCelebration(currentUser)}
              className="ml-2 px-3 py-1.5 rounded-lg bg-success/20 text-success text-xs font-medium hover:bg-success/30 transition-colors"
            >
              🎉 Demo Promotion
            </button>
          </motion.div>
        )}
      </div>

      {/* Weekly Rewards Banner */}
      {weeklyRewards && (
        <GlassCard className="p-5 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-warning/5 via-accent/5 to-success/5" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <Gift className="w-5 h-5 text-accent" />
              <h3 className="font-bold text-foreground">This Week's Champion Rewards</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Top 3 */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="p-4 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-500/10 border border-amber-500/40"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="w-5 h-5 text-amber-500" />
                  <span className="font-bold text-amber-500">Top 3 Champions</span>
                </div>
                <div className="space-y-1 text-sm">
                  <p className="text-foreground"><span className="text-accent font-bold">+{weeklyRewards.top3.points}</span> Points</p>
                  <p className="text-foreground"><span className="text-secondary font-bold">{weeklyRewards.top3.scratchCards}</span> Scratch Cards</p>
                  <p className="text-foreground"><span className="text-primary font-bold">+{weeklyRewards.top3.xp}</span> Bonus XP</p>
                  {weeklyRewards.top3.badge && (
                    <p className="text-warning font-medium">🏆 {weeklyRewards.top3.badge}</p>
                  )}
                </div>
              </motion.div>

              {/* Top 10 */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="p-4 rounded-xl bg-gradient-to-br from-secondary/20 to-blue-500/10 border border-secondary/40"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Medal className="w-5 h-5 text-secondary" />
                  <span className="font-bold text-secondary">Top 10 Warriors</span>
                </div>
                <div className="space-y-1 text-sm">
                  <p className="text-foreground"><span className="text-accent font-bold">+{weeklyRewards.top10.points}</span> Points</p>
                  <p className="text-foreground"><span className="text-secondary font-bold">{weeklyRewards.top10.scratchCards}</span> Scratch Cards</p>
                  <p className="text-foreground"><span className="text-primary font-bold">+{weeklyRewards.top10.xp}</span> Bonus XP</p>
                </div>
              </motion.div>

              {/* Top 25% */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="p-4 rounded-xl bg-gradient-to-br from-success/20 to-emerald-500/10 border border-success/40"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-5 h-5 text-success" />
                  <span className="font-bold text-success">Top 25% Challengers</span>
                </div>
                <div className="space-y-1 text-sm">
                  <p className="text-foreground"><span className="text-accent font-bold">+{weeklyRewards.top25Percent.points}</span> Points</p>
                  <p className="text-foreground"><span className="text-secondary font-bold">{weeklyRewards.top25Percent.scratchCards}</span> Scratch Card</p>
                  <p className="text-foreground"><span className="text-primary font-bold">+{weeklyRewards.top25Percent.xp}</span> Bonus XP</p>
                </div>
              </motion.div>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Level Tiers Display */}
      {levelTiers && (
        <div className="flex flex-wrap gap-3">
          {levelTiers.map((tier, idx) => (
            <motion.button
              key={tier.name}
              whileHover={{ scale: 1.05 }}
              onClick={() => setSelectedLevel(selectedLevel === tier.name ? "All Levels" : tier.name)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl border transition-all",
                selectedLevel === tier.name 
                  ? `bg-gradient-to-r ${tier.color} text-white border-transparent shadow-lg`
                  : "bg-card/50 border-border/50 hover:border-primary/30"
              )}
            >
              <span className="text-lg">{tier.icon}</span>
              <span className="font-medium">{tier.name}</span>
              <span className="text-xs opacity-70">≥{tier.minXP} XP</span>
            </motion.button>
          ))}
        </div>
      )}

      {/* Rules Accordion */}
      <div className="rounded-xl border border-border/50 overflow-hidden">
        <button
          onClick={() => setShowRules(!showRules)}
          className="w-full flex items-center justify-between p-4 bg-muted/30 hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-primary" />
            <span className="font-medium text-foreground">Arena Rules & Promotion System</span>
          </div>
          <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", showRules && "rotate-180")} />
        </button>
        <AnimatePresence>
          {showRules && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 bg-card/50 border-t border-border/50 grid md:grid-cols-3 gap-4">
                {promotionRules && (
                  <>
                    <div className="p-3 rounded-lg bg-success/10 border border-success/30">
                      <div className="flex items-center gap-2 mb-2">
                        <ArrowUp className="w-4 h-4 text-success" />
                        <span className="font-bold text-success">Promotion Zone</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{promotionRules.promoted.description}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-secondary/10 border border-secondary/30">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-4 h-4 text-secondary" />
                        <span className="font-bold text-secondary">Safe Zone</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{promotionRules.safeZone.description}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30">
                      <div className="flex items-center gap-2 mb-2">
                        <ArrowDown className="w-4 h-4 text-destructive" />
                        <span className="font-bold text-destructive">Demotion Zone</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{promotionRules.demotionZone.description}</p>
                    </div>
                  </>
                )}
              </div>
              <div className="p-4 bg-muted/20 border-t border-border/50">
                <p className="text-xs text-muted-foreground">
                  <strong>XP Calculation:</strong> 10 Points = 1 XP • XP resets to 0 every month • Past XP converts to points for spin wheels
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Filters Bar */}
      <GlassCard className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search champions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-muted/30 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
            />
          </div>

          {/* Time Range */}
          <div>
            <div className="flex rounded-lg border border-border overflow-hidden">
              {filters?.timeRanges?.map((range) => (
                <button
                  key={range}
                  onClick={() => setSelectedTimeRange(range)}
                  className={cn(
                    "px-4 py-2 text-sm font-medium transition-colors",
                    selectedTimeRange === range
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/30 text-muted-foreground hover:bg-muted"
                  )}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          {/* Last Updated */}
          <div className="text-right hidden md:block">
            <p className="text-xs text-muted-foreground">Last updated</p>
            <p className="text-sm text-foreground font-medium">{data.lastUpdated}</p>
          </div>
        </div>
      </GlassCard>

      {/* Top 3 Podium */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Crown className="w-5 h-5 text-warning" />
          <h3 className="font-bold text-foreground">Top Champions</h3>
        </div>
        
        <div className="flex items-end justify-center gap-4 mb-6">
          {/* 2nd Place */}
          {filteredData[1] && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col items-center"
            >
              <div className={cn("w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold border-4 border-gray-400 shadow-lg bg-gradient-to-br from-gray-300 via-slate-400 to-gray-500 text-white")}>
                {filteredData[1].avatar}
              </div>
              <span className="text-sm font-medium text-foreground mt-2">{filteredData[1].name}</span>
              <span className="text-xs text-secondary font-bold">{filteredData[1].xp?.toLocaleString()} XP</span>
              <span className="text-[10px] text-muted-foreground">{filteredData[1].level}</span>
              <div className="w-16 h-16 mt-2 rounded-t-lg bg-gradient-to-b from-gray-400/40 to-gray-600/40 flex items-center justify-center text-3xl font-bold text-gray-400 border-t border-x border-gray-400/30">
                2
              </div>
            </motion.div>
          )}

          {/* 1st Place */}
          {filteredData[0] && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center"
            >
              <div className="relative">
                <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold border-4 border-yellow-400 shadow-[0_0_30px_hsla(45,100%,50%,0.5)] bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500 text-white">
                  {filteredData[0].avatar}
                </div>
                <motion.div 
                  className="absolute -top-3 left-1/2 -translate-x-1/2"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <span className="text-2xl">👑</span>
                </motion.div>
              </div>
              <span className="text-base font-bold text-accent mt-2">{filteredData[0].name}</span>
              <span className="text-sm text-secondary font-bold">{filteredData[0].xp?.toLocaleString()} XP</span>
              <span className="text-xs text-accent">{filteredData[0].level}</span>
              <div className="w-20 h-24 mt-2 rounded-t-lg bg-gradient-to-b from-yellow-500/50 to-amber-600/50 flex items-center justify-center text-4xl font-bold text-accent border-t border-x border-yellow-500/50 shadow-[0_0_20px_hsla(45,100%,50%,0.3)]">
                1
              </div>
            </motion.div>
          )}

          {/* 3rd Place */}
          {filteredData[2] && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center"
            >
              <div className={cn("w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold border-4 border-amber-600 shadow-lg bg-gradient-to-br from-amber-600 via-orange-600 to-amber-700 text-white")}>
                {filteredData[2].avatar}
              </div>
              <span className="text-sm font-medium text-foreground mt-2">{filteredData[2].name}</span>
              <span className="text-xs text-secondary font-bold">{filteredData[2].xp?.toLocaleString()} XP</span>
              <span className="text-[10px] text-muted-foreground">{filteredData[2].level}</span>
              <div className="w-16 h-12 mt-2 rounded-t-lg bg-gradient-to-b from-amber-600/40 to-amber-800/40 flex items-center justify-center text-3xl font-bold text-amber-500 border-t border-x border-amber-600/30">
                3
              </div>
            </motion.div>
          )}
        </div>
      </GlassCard>

      {/* Full Leaderboard Table */}
      <GlassCard className="overflow-hidden">
        <div className="p-4 border-b border-border/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-foreground">All Champions ({filteredData.length})</h3>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-16">Rank</TableHead>
                <TableHead>Champion</TableHead>
                <TableHead>Level</TableHead>
                <TableHead className="text-right">XP</TableHead>
                <TableHead className="text-right">Points</TableHead>
                <TableHead className="text-right">Trend</TableHead>
                <TableHead className="text-right">Zone</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item, idx) => {
                const levelInfo = getLevelInfo(item.level);
                const zoneStatus = getZoneStatus(item.rank, filteredData.length);
                
                return (
                  <motion.tr
                    key={item.rank}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className={cn(
                      "group transition-colors",
                      item.isCurrentUser && "bg-primary/10 border-l-2 border-l-primary"
                    )}
                  >
                    <TableCell>
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm",
                        getRankBadgeStyle(item.rank)
                      )}>
                        {item.rank}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center text-white font-bold bg-gradient-to-br",
                          levelInfo?.color || "from-gray-400 to-slate-500"
                        )}>
                          {item.avatar}
                        </div>
                        <div>
                          <p className={cn("font-medium text-foreground", item.isCurrentUser && "text-primary")}>
                            {item.name} {item.isCurrentUser && <span className="text-xs text-primary">(You)</span>}
                          </p>
                          <p className="text-xs text-muted-foreground">{item.department}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={cn(
                        "inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-gradient-to-r",
                        levelInfo?.color || "from-gray-400 to-slate-500",
                        "text-white"
                      )}>
                        {levelInfo?.icon} {item.level}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-bold text-secondary">{item.xp?.toLocaleString()}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="text-muted-foreground">{item.points?.toLocaleString()}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={cn("flex items-center justify-end gap-1", getTrendColor(item.trendType))}>
                        {getTrendIcon(item.trendType)}
                        {item.trend}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={cn(
                        "inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium border",
                        zoneStatus.color
                      )}>
                        {zoneStatus.label}
                      </span>
                    </TableCell>
                  </motion.tr>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </GlassCard>
    </div>
  );
};

export default LeadershipLeaderboards;
