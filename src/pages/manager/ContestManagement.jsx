import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Plus,
  History,
  Settings,
  Trophy,
  Clock,
  Calendar,
  Edit,
  Trash2,
  TrendingUp,
  Zap,
  CheckCircle,
  Sparkles,
} from "lucide-react";
import { useContests } from "./hooks.jsx";
import { managerApi } from "@/api";
import { DashboardSkeleton } from "@/components/ui/PageSkeleton";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const ContestManagement = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { data, loading, refetch } = useContests(user?.id);
  const [historyFilter, setHistoryFilter] = useState("all");
  const [deletingContest, setDeletingContest] = useState(null);

  const handleDeleteContest = useCallback(async (contestId) => {
    if (!confirm("Are you sure you want to delete this contest?")) return;
    
    setDeletingContest(contestId);
    try {
      await managerApi.deleteContest(contestId);
      toast.success("Contest deleted successfully");
      refetch?.();
    } catch (error) {
      toast.error("Failed to delete contest");
      console.error("Delete error:", error);
    } finally {
      setDeletingContest(null);
    }
  }, [refetch]);

  // Show loading while auth is loading or if user is not authenticated
  if (authLoading || !user) {
    return <DashboardSkeleton />;
  }

  if (loading) {
    return <DashboardSkeleton />;
  }

  const activeContests = data?.activeContests || [];
  const pastContests = data?.pastContests || [];
  const liveFeed = data?.liveFeed || [];
  const tip = data?.tip;

  const handleStartNewContest = () => {
    navigate("/manager/contests/new");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground" style={{ fontFamily: "'Sora', sans-serif" }}>
            Contest Control Center
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Create, manage, and track performance-based competitions.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-muted/30 border border-border/50 hover:bg-muted transition-colors">
            <History className="w-4 h-4" />
            <span className="text-sm font-medium">History</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-muted/30 border border-border/50 hover:bg-muted transition-colors">
            <Settings className="w-4 h-4" />
            <span className="text-sm font-medium">Rules Config</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-[1fr_340px] gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Live & Upcoming Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold text-foreground">Live & Upcoming</h2>
                <span className="px-3 py-1 rounded-full bg-success/20 text-success text-xs font-medium flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  {activeContests.filter((c) => c.status === "live").length} Active
                </span>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {/* Create New Contest Card */}
              <motion.button
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleStartNewContest}
                className="p-6 rounded-2xl border-2 border-dashed border-primary/40 hover:border-primary transition-all flex flex-col items-center justify-center gap-4 min-h-[260px] group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Plus className="w-8 h-8 text-primary" />
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -top-1 -right-1"
                  >
                    <Sparkles className="w-5 h-5 text-primary" />
                  </motion.div>
                </div>
                <div className="text-center relative">
                  <p className="font-semibold text-foreground text-lg">Start New Contest</p>
                  <p className="text-sm text-muted-foreground mt-1">Launch a sprint wizard</p>
                </div>
              </motion.button>

              {/* Live Contests */}
              {activeContests
                .filter((c) => c.status === "live")
                .map((contest) => (
                  <motion.div
                    key={contest.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 rounded-xl glass-card border border-border/50 relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-2 py-1 rounded-full bg-success/20 text-success text-xs font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                        LIVE
                      </span>
                      <div className="flex items-center gap-1">
                        <button className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                          <Edit className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button 
                          onClick={() => handleDeleteContest(contest.id)}
                          disabled={deletingContest === contest.id}
                          className="p-1.5 rounded-lg hover:bg-destructive/20 transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </button>
                      </div>
                    </div>

                    <h3 className="font-semibold text-foreground mb-1">{contest.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{contest.objective}</p>

                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Team Goal</span>
                        <span className="font-bold text-foreground">{contest.progress}%</span>
                      </div>
                      <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-success rounded-full"
                          style={{ width: `${contest.progress}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs mt-1 text-muted-foreground">
                        <span>${(contest.current / 1000).toFixed(0)}k</span>
                        <span>${(contest.target / 1000).toFixed(0)}K TARGET</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4 text-warning" />
                        <span>{contest.timeRemaining}</span>
                      </div>
                      <button className="px-3 py-1.5 rounded-lg bg-muted/50 text-xs font-medium hover:bg-muted transition-colors">
                        Leaderboard
                      </button>
                    </div>
                  </motion.div>
                ))}

              {/* Upcoming Contests */}
              {activeContests
                .filter((c) => c.status === "upcoming")
                .map((contest) => (
                  <motion.div
                    key={contest.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-5 rounded-xl glass-card border border-border/50"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-2 py-1 rounded-full bg-secondary/20 text-secondary text-xs font-medium flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        UPCOMING
                      </span>
                      <div className="flex items-center gap-1">
                        <button className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                          <Edit className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button 
                          onClick={() => handleDeleteContest(contest.id)}
                          disabled={deletingContest === contest.id}
                          className="p-1.5 rounded-lg hover:bg-destructive/20 transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </button>
                      </div>
                    </div>

                    <h3 className="font-semibold text-foreground mb-1">{contest.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{contest.objective}</p>

                    <div className="p-3 rounded-lg bg-muted/30 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-secondary" />
                        <div>
                          <p className="text-xs text-muted-foreground">Scheduled Start</p>
                          <p className="text-sm font-medium text-foreground">{contest.scheduledStart}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex -space-x-2">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-pink-500 border-2 border-card flex items-center justify-center text-white text-xs font-bold">
                            {String.fromCharCode(65 + i)}
                          </div>
                        ))}
                        <div className="w-7 h-7 rounded-full bg-muted border-2 border-card flex items-center justify-center text-xs text-muted-foreground">
                          +{contest.participants - 3}
                        </div>
                      </div>
                      <button className="text-xs text-primary hover:underline">Edit Details</button>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>

          {/* Past Contests History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Past Contests History</h2>
              <div className="flex gap-2">
                {["All Time", "This Month"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setHistoryFilter(filter.toLowerCase().replace(" ", "-"))}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      historyFilter === filter.toLowerCase().replace(" ", "-")
                        ? "bg-foreground text-background"
                        : "bg-muted/50 text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-xl glass-card border border-border/50 overflow-hidden">
              <div className="grid grid-cols-5 gap-4 p-4 border-b border-border bg-muted/30">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Contest Name</div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Top Winner</div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider text-center">Reward Cost</div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider text-center">Business Impact</div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider text-center">Status</div>
              </div>

              <div className="divide-y divide-border/50">
                {pastContests.map((contest, idx) => (
                  <div key={idx} className="grid grid-cols-5 gap-4 p-4 hover:bg-muted/30 transition-colors">
                    <div>
                      <p className="font-medium text-foreground text-sm">{contest.name}</p>
                      <p className="text-xs text-muted-foreground">{contest.dates}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-warning flex items-center justify-center text-accent-foreground font-bold text-xs relative">
                        {contest.winnerAvatar}
                        <Trophy className="absolute w-3 h-3 -top-1 -right-1 text-accent" />
                      </div>
                      <span className="text-sm text-foreground">{contest.winner}</span>
                    </div>
                    <div className="flex items-center justify-center">
                      <span className="font-mono text-sm text-foreground">${contest.reward.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-center">
                      <span className="px-2 py-1 rounded-lg bg-success/20 text-success text-xs font-medium flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {contest.impact}
                      </span>
                    </div>
                    <div className="flex items-center justify-center">
                      <span className="px-2 py-1 rounded-lg bg-muted text-muted-foreground text-xs font-medium uppercase">
                        Completed
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column - Actions & Feed */}
        <div className="space-y-6">
          {/* Contest Actions */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Contest Actions</h3>

            <button className="w-full p-4 rounded-xl glass-card border border-border/50 hover:border-primary/50 transition-colors text-left flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                <Settings className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">Draft Rules</p>
                <p className="text-xs text-muted-foreground mt-0.5">Setup metrics for next sprint.</p>
              </div>
            </button>

            <button className="w-full p-4 rounded-xl glass-card border border-border/50 hover:border-success/50 transition-colors text-left flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center shrink-0">
                <CheckCircle className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">Approve Prizes</p>
                <p className="text-xs text-muted-foreground mt-0.5">2 pending reward requests.</p>
              </div>
            </button>
          </div>

          {/* Live Activity */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Live Activity</h3>
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            </div>
            <div className="space-y-3">
              {liveFeed.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                    {item.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-foreground">
                      <span className="font-medium">{item.name}</span>{" "}
                      <span className="text-muted-foreground">{item.action}</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gamification Tip */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-accent/20 to-warning/20 border border-accent/30">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-accent" />
              <span className="text-sm font-semibold text-foreground">Gamification Tip</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              {tip || "Shorter sprints (3-5 days) often yield 2x engagement vs monthly ones."}
            </p>
            <button className="w-full py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/90 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContestManagement;