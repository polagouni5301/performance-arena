import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Search,
  UserPlus,
  TrendingUp,
  TrendingDown,
  Star,
  MessageSquare,
  Calendar,
  Activity,
  Target,
  X,
} from "lucide-react";
import { useMyTeam } from "./hooks.jsx";
import { DashboardSkeleton } from "@/components/ui/PageSkeleton";

const getStatusColor = (status) => {
  switch (status) {
    case "online": return "bg-success";
    case "away": return "bg-warning";
    case "offline": return "bg-muted-foreground";
    default: return "bg-muted";
  }
};

const getPerformanceColor = (perf) => {
  if (perf >= 90) return "text-success";
  if (perf >= 75) return "text-secondary";
  if (perf >= 60) return "text-warning";
  return "text-destructive";
};

const getPerformanceGradient = (perf) => {
  if (perf >= 90) return "from-success/20 to-success/5";
  if (perf >= 75) return "from-secondary/20 to-secondary/5";
  if (perf >= 60) return "from-warning/20 to-warning/5";
  return "from-destructive/20 to-destructive/5";
};

const MyTeam = () => {
  const { data, loading, selectedMember, setSelectedMember } = useMyTeam();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  if (loading) {
    return <DashboardSkeleton />;
  }

  const teamMembers = data?.teamMembers || [];

  const filteredMembers = teamMembers.filter((member) => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || member.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: teamMembers.length,
    online: teamMembers.filter(m => m.status === "online").length,
    avgPerformance: Math.round(teamMembers.reduce((acc, m) => acc + m.performance, 0) / (teamMembers.length || 1)),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground" style={{ fontFamily: "'Sora', sans-serif" }}>
            My Team
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage and monitor your team of {stats.total} agents
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-primary-foreground"
          style={{
            background: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(330 100% 50%) 100%)",
            boxShadow: "0 0 20px hsl(var(--primary) / 0.3)",
          }}
        >
          <UserPlus className="w-4 h-4" />
          Add Team Member
        </motion.button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/30 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Total Members</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 rounded-2xl bg-gradient-to-br from-success/20 to-success/5 border border-success/20"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-success/30 flex items-center justify-center">
              <Activity className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.online}</p>
              <p className="text-xs text-muted-foreground">Currently Online</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 rounded-2xl bg-gradient-to-br from-secondary/20 to-secondary/5 border border-secondary/20"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary/30 flex items-center justify-center">
              <Target className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.avgPerformance}%</p>
              <p className="text-xs text-muted-foreground">Avg Performance</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search team members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-muted/30 border border-border/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div className="flex items-center gap-2">
          {["all", "online", "away", "offline"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-xl text-xs font-medium capitalize transition-all ${
                filterStatus === status
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                  : "bg-muted/30 text-muted-foreground hover:bg-muted border border-border/50"
              }`}
            >
              {status === "all" ? `All (${stats.total})` : status}
            </button>
          ))}
        </div>
      </div>

      {/* Team Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredMembers.map((member, idx) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            onClick={() => setSelectedMember(member)}
            className={`relative p-5 rounded-2xl cursor-pointer transition-all overflow-hidden
              bg-gradient-to-br ${getPerformanceGradient(member.performance)}
              border border-border/50 hover:border-primary/30
              backdrop-blur-sm
            `}
          >
            {/* Decorative glow */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-full blur-2xl" />

            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary/30">
                      {member.avatar}
                    </div>
                    <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-card ${getStatusColor(member.status)}`} />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.role}</p>
                  </div>
                </div>
              </div>

              {/* Mini Stats */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="text-center p-2 rounded-lg bg-card/50">
                  <p className="text-xs text-muted-foreground">Calls</p>
                  <p className="font-bold text-foreground">{member.calls}</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-card/50">
                  <p className="text-xs text-muted-foreground">AHT</p>
                  <p className="font-bold text-foreground">{member.aht}</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-card/50">
                  <p className="text-xs text-muted-foreground">NPS</p>
                  <p className="font-bold text-foreground">{member.nps}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border/30">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-accent" />
                  <span className={`font-bold ${getPerformanceColor(member.performance)}`}>
                    {member.performance}%
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {member.trend === "up" && <TrendingUp className="w-4 h-4 text-success" />}
                  {member.trend === "down" && <TrendingDown className="w-4 h-4 text-destructive" />}
                  <span className={`text-xs font-medium ${
                    member.trend === "up" ? "text-success" : member.trend === "down" ? "text-destructive" : "text-muted-foreground"
                  }`}>
                    {member.trend === "up" ? "↑ Up" : member.trend === "down" ? "↓ Down" : "Stable"}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Member Detail Modal */}
      <AnimatePresence>
        {selectedMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedMember(null)}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg p-6 rounded-3xl bg-card border border-border shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-foreground">Agent Details</h3>
                <button
                  onClick={() => setSelectedMember(null)}
                  className="p-2 rounded-xl hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center text-white font-bold text-2xl">
                  {selectedMember.avatar}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-foreground">{selectedMember.name}</h4>
                  <p className="text-muted-foreground">{selectedMember.role}</p>
                  <p className="text-sm text-muted-foreground">{selectedMember.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3 mb-6">
                <div className="text-center p-3 rounded-xl bg-muted/30">
                  <p className="text-2xl font-bold text-foreground">{selectedMember.performance}%</p>
                  <p className="text-xs text-muted-foreground">Performance</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-muted/30">
                  <p className="text-2xl font-bold text-foreground">{selectedMember.calls}</p>
                  <p className="text-xs text-muted-foreground">Calls</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-muted/30">
                  <p className="text-2xl font-bold text-foreground">{selectedMember.aht}</p>
                  <p className="text-xs text-muted-foreground">Avg Handle</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-muted/30">
                  <p className="text-2xl font-bold text-foreground">{selectedMember.nps}</p>
                  <p className="text-xs text-muted-foreground">NPS</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground font-medium">
                  <MessageSquare className="w-4 h-4" />
                  Send Message
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-muted text-foreground font-medium">
                  <Calendar className="w-4 h-4" />
                  Schedule 1:1
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyTeam;