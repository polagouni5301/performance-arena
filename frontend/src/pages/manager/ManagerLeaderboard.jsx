import { useState } from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  Minus,
  Medal,
  Crown,
  Star,
  Zap,
  Flame,
  Target,
  ChevronUp,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { useManagerLeaderboard } from "./hooks.jsx";
import { DashboardSkeleton } from "@/components/ui/PageSkeleton";

const podiumColors = {
  1: { gradient: "from-accent via-yellow-400 to-accent", border: "border-accent/50", shadow: "shadow-accent/30", bg: "from-accent/30 to-accent/10" },
  2: { gradient: "from-gray-300 via-gray-200 to-gray-300", border: "border-gray-300/50", shadow: "shadow-gray-400/30", bg: "from-gray-400/30 to-gray-400/10" },
  3: { gradient: "from-amber-600 via-amber-500 to-amber-600", border: "border-amber-600/50", shadow: "shadow-amber-600/30", bg: "from-amber-600/30 to-amber-600/10" },
};

const getTrendIcon = (trend) => {
  if (trend > 0) return { icon: ChevronUp, color: "text-success", bg: "bg-success/20" };
  if (trend < 0) return { icon: ChevronDown, color: "text-destructive", bg: "bg-destructive/20" };
  return { icon: Minus, color: "text-muted-foreground", bg: "bg-muted" };
};

const ManagerLeaderboard = () => {
  const [sortBy, setSortBy] = useState("points");
  const [timeRange, setTimeRange] = useState("month");
  const { data, loading } = useManagerLeaderboard(sortBy, timeRange);

  if (loading) {
    return <DashboardSkeleton />;
  }

  const leaderboardData = data?.leaderboard || [];

  const sortedData = [...leaderboardData].sort((a, b) => {
    if (sortBy === "points") return b.points - a.points;
    if (sortBy === "revenue") return b.revenue - a.revenue;
    if (sortBy === "nps") return b.nps - a.nps;
    return 0;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground" style={{ fontFamily: "'Sora', sans-serif" }}>
            Team Leaderboard
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Track rankings and celebrate top performers
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-muted/30 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
          </select>
        </div>
      </div>

      {/* Podium Section */}
      {sortedData.length >= 3 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative p-8 rounded-3xl bg-gradient-to-br from-card/80 to-card/40 border border-border/50 backdrop-blur-xl overflow-hidden"
        >
          {/* Background decorations */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
          </div>

          <div className="relative grid grid-cols-3 gap-4 max-w-3xl mx-auto items-end">
            {/* 2nd Place */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center"
            >
              <div className={`p-6 rounded-3xl bg-gradient-to-br ${podiumColors[2].bg} border ${podiumColors[2].border} backdrop-blur-sm w-full text-center`}>
                <div className="relative w-20 h-20 mx-auto mb-4">
                  <div className={`w-full h-full rounded-2xl bg-gradient-to-br ${podiumColors[2].gradient} flex items-center justify-center text-gray-800 font-bold text-2xl shadow-xl ${podiumColors[2].shadow}`}>
                    {sortedData[1]?.avatar}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-400 flex items-center justify-center text-gray-800 font-bold text-sm border-2 border-card shadow-lg">
                    2
                  </div>
                </div>
                <Medal className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                <p className="font-bold text-foreground">{sortedData[1]?.name}</p>
                <p className="text-xs text-muted-foreground mb-3">{sortedData[1]?.dept}</p>
                <p className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Sora', sans-serif" }}>
                  {sortedData[1]?.points.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">points</p>
              </div>
              <div className="h-16 w-full bg-gradient-to-t from-gray-500/30 to-transparent rounded-t-xl mt-2" />
            </motion.div>

            {/* 1st Place */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col items-center -mt-8"
            >
              <div className={`p-8 rounded-3xl bg-gradient-to-br ${podiumColors[1].bg} border ${podiumColors[1].border} backdrop-blur-sm w-full text-center relative overflow-hidden`}>
                {/* Crown animation */}
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  className="absolute top-2 left-1/2 -translate-x-1/2"
                >
                  <Crown className="w-8 h-8 text-accent drop-shadow-lg" />
                </motion.div>

                {/* Sparkles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
                      transition={{ delay: 0.8 + i * 0.15, duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
                      className="absolute"
                      style={{
                        left: `${20 + i * 15}%`,
                        top: `${10 + (i % 3) * 30}%`,
                      }}
                    >
                      <Sparkles className="w-4 h-4 text-accent" />
                    </motion.div>
                  ))}
                </div>

                <div className="relative w-24 h-24 mx-auto mb-4 mt-4">
                  <motion.div
                    animate={{ boxShadow: ["0 0 20px hsl(var(--accent) / 0.3)", "0 0 40px hsl(var(--accent) / 0.5)", "0 0 20px hsl(var(--accent) / 0.3)"] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className={`w-full h-full rounded-2xl bg-gradient-to-br ${podiumColors[1].gradient} flex items-center justify-center text-accent-foreground font-bold text-3xl`}
                  >
                    {sortedData[0]?.avatar}
                  </motion.div>
                  <div className="absolute -top-2 -right-2 w-9 h-9 rounded-full bg-gradient-to-br from-accent to-yellow-400 flex items-center justify-center text-accent-foreground font-bold text-sm border-2 border-card shadow-lg">
                    1
                  </div>
                </div>
                <Trophy className="w-7 h-7 text-accent mx-auto mb-2" />
                <p className="font-bold text-foreground text-lg">{sortedData[0]?.name}</p>
                <p className="text-xs text-muted-foreground mb-3">{sortedData[0]?.dept}</p>
                <p className="text-3xl font-bold text-accent" style={{ fontFamily: "'Sora', sans-serif" }}>
                  {sortedData[0]?.points.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">points</p>

                {/* Streak badge */}
                <div className="mt-3 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent/20 text-accent">
                  <Flame className="w-4 h-4" />
                  <span className="text-xs font-bold">{sortedData[0]?.streak} day streak</span>
                </div>
              </div>
              <div className="h-24 w-full bg-gradient-to-t from-accent/30 to-transparent rounded-t-xl mt-2" />
            </motion.div>

            {/* 3rd Place */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col items-center mt-4"
            >
              <div className={`p-5 rounded-3xl bg-gradient-to-br ${podiumColors[3].bg} border ${podiumColors[3].border} backdrop-blur-sm w-full text-center`}>
                <div className="relative w-16 h-16 mx-auto mb-3">
                  <div className={`w-full h-full rounded-2xl bg-gradient-to-br ${podiumColors[3].gradient} flex items-center justify-center text-white font-bold text-xl shadow-xl ${podiumColors[3].shadow}`}>
                    {sortedData[2]?.avatar}
                  </div>
                  <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white font-bold text-xs border-2 border-card shadow-lg">
                    3
                  </div>
                </div>
                <Star className="w-5 h-5 text-amber-500 mx-auto mb-2" />
                <p className="font-bold text-foreground text-sm">{sortedData[2]?.name}</p>
                <p className="text-xs text-muted-foreground mb-2">{sortedData[2]?.dept}</p>
                <p className="text-xl font-bold text-foreground" style={{ fontFamily: "'Sora', sans-serif" }}>
                  {sortedData[2]?.points.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">points</p>
              </div>
              <div className="h-10 w-full bg-gradient-to-t from-amber-600/30 to-transparent rounded-t-xl mt-2" />
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Sort Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center justify-center gap-2"
      >
        {[
          { key: "points", label: "Points", icon: Star },
          { key: "revenue", label: "Revenue", icon: Zap },
          { key: "nps", label: "NPS", icon: Target },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSortBy(tab.key)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              sortBy === tab.key
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                : "bg-muted/30 text-muted-foreground hover:bg-muted border border-border/50"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* Full Leaderboard Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-3xl bg-card/50 backdrop-blur border border-border/50 overflow-hidden"
      >
        {/* Table Header */}
        <div className="grid grid-cols-6 gap-4 p-5 border-b border-border bg-muted/30">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Rank</div>
          <div className="col-span-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Agent</div>
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider text-center">Points</div>
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider text-center">Revenue</div>
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider text-center">Movement</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-border/30">
          {sortedData.map((agent, idx) => {
            const trendInfo = getTrendIcon(agent.trend);
            const TrendIcon = trendInfo.icon;

            return (
              <motion.div
                key={agent.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + idx * 0.03 }}
                whileHover={{ backgroundColor: "hsl(var(--muted) / 0.3)" }}
                className="grid grid-cols-6 gap-4 p-5 transition-colors"
              >
                {/* Rank */}
                <div className="flex items-center">
                  {idx < 3 ? (
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${podiumColors[idx + 1].gradient} flex items-center justify-center font-bold text-sm ${idx === 0 ? "text-accent-foreground" : idx === 1 ? "text-gray-800" : "text-white"} shadow-lg`}>
                      {idx + 1}
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center font-bold text-sm text-muted-foreground">
                      {idx + 1}
                    </div>
                  )}
                </div>

                {/* Agent Info */}
                <div className="col-span-2 flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-primary/20">
                    {agent.avatar}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{agent.name}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-muted-foreground">{agent.dept}</p>
                      {agent.streak >= 5 && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-500 text-[10px] font-medium">
                          <Flame className="w-3 h-3" />
                          {agent.streak}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Points */}
                <div className="flex items-center justify-center">
                  <span className={`font-bold text-lg ${idx === 0 ? "text-accent" : "text-foreground"}`}>
                    {agent.points.toLocaleString()}
                  </span>
                </div>

                {/* Revenue */}
                <div className="flex items-center justify-center">
                  <span className="text-success font-medium">${(agent.revenue / 1000).toFixed(1)}k</span>
                </div>

                {/* Trend */}
                <div className="flex items-center justify-center">
                  <div className={`flex items-center gap-1 px-3 py-1.5 rounded-lg ${trendInfo.bg}`}>
                    <TrendIcon className={`w-4 h-4 ${trendInfo.color}`} />
                    {agent.trend !== 0 && (
                      <span className={`text-xs font-medium ${trendInfo.color}`}>
                        {Math.abs(agent.trend)}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default ManagerLeaderboard;