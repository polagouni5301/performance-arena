import { motion } from "framer-motion";
import {
  Download,
  Calendar,
  BarChart3,
  Users,
  TrendingDown,
  Lightbulb,
  MessageSquare,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { useTeamPerformance } from "./hooks.jsx";
import { DashboardSkeleton } from "@/components/ui/PageSkeleton";
import { useAuth } from "@/contexts/AuthContext";

const getStatusColor = (status) => {
  switch (status) {
    case "exceeding":
      return "bg-success/20 text-success border-success/30";
    case "on-target":
      return "bg-secondary/20 text-secondary border-secondary/30";
    case "at-risk":
      return "bg-warning/20 text-warning border-warning/30";
    case "below":
    case "critical":
      return "bg-destructive/20 text-destructive border-destructive/30";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getStatusBg = (status) => {
  switch (status) {
    case "exceeding":
      return "bg-success/10";
    case "on-target":
      return "bg-secondary/10";
    case "at-risk":
      return "bg-warning/10 border border-warning/40";
    case "below":
    case "critical":
      return "bg-destructive/10";
    default:
      return "bg-muted/10";
  }
};

const TeamPerformance = () => {
  const { user, loading: authLoading } = useAuth();
  const { data, loading, selectedAgent, setSelectedAgent } = useTeamPerformance(user?.id);

  // Show loading while auth is loading or if user is not authenticated
  if (authLoading || !user) {
    return <DashboardSkeleton />;
  }

  if (loading) {
    return <DashboardSkeleton />;
  }

  const agents = data?.agents || [];
  const insight = data?.selectedAgentInsight;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground" style={{ fontFamily: "'Sora', sans-serif" }}>
            Team Metric Heatmap
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Identify performance gaps and coaching opportunities across your team.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50 border border-border hover:bg-muted transition-colors">
          <Download className="w-4 h-4" />
          <span className="text-sm font-medium">Export Report</span>
        </button>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center gap-4"
      >
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50 border border-border">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm">Last 7 Days</span>
          <div className="w-8 h-5 rounded bg-primary/30" />
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50 border border-border">
          <BarChart3 className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm">All Metrics</span>
          <div className="w-8 h-5 rounded bg-primary/30" />
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50 border border-border">
          <Users className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm">Sales Team Alpha</span>
          <div className="w-8 h-5 rounded bg-primary/30" />
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 ml-auto text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-success" />
            <span className="text-muted-foreground">Exceeding</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-warning" />
            <span className="text-muted-foreground">At Risk</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-destructive" />
            <span className="text-muted-foreground">Below Target</span>
          </div>
        </div>
      </motion.div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-[1fr_340px] gap-6">
        {/* Heatmap Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl glass-card border border-border/50 overflow-hidden"
        >
          {/* Table Header */}
          <div className="grid grid-cols-4 gap-4 p-4 border-b border-border bg-muted/30">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Agent Name</div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider text-center">AHT (sec)</div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider text-center">QA Score %</div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider text-center">Revenue $</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-border/50">
            {agents.map((agent, idx) => (
              <motion.div
                key={agent.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => setSelectedAgent(agent)}
                className={`grid grid-cols-4 gap-4 p-4 cursor-pointer transition-colors hover:bg-muted/30 ${
                  selectedAgent?.name === agent.name ? "bg-primary/10" : ""
                }`}
              >
                {/* Agent Info */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                    {agent.avatar}
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">{agent.name}</p>
                    <p className="text-xs text-muted-foreground">{agent.role}</p>
                  </div>
                </div>

                {/* AHT */}
                <div className="flex items-center justify-center">
                  <div className={`px-4 py-2 rounded-lg text-center ${getStatusBg(agent.aht?.status)}`}>
                    <p className={`font-bold ${agent.aht?.status === "exceeding" ? "text-success" : agent.aht?.status === "critical" ? "text-destructive" : "text-foreground"}`}>
                      {agent.aht?.value}s
                    </p>
                    <p className="text-xs text-muted-foreground">{agent.aht?.label}</p>
                  </div>
                </div>

                {/* QA Score */}
                <div className="flex items-center justify-center">
                  <div className={`px-4 py-2 rounded-lg text-center ${getStatusBg(agent.qa?.status)}`}>
                    <p className={`font-bold ${agent.qa?.status === "exceeding" ? "text-success" : agent.qa?.status === "at-risk" ? "text-warning" : agent.qa?.status === "below" ? "text-destructive" : "text-foreground"}`}>
                      {agent.qa?.value}%
                    </p>
                    <p className="text-xs text-muted-foreground">{agent.qa?.label}</p>
                  </div>
                </div>

                {/* Revenue */}
                <div className="flex items-center justify-center">
                  <div className={`px-4 py-2 rounded-lg text-center ${getStatusBg(agent.revenue?.status)}`}>
                    <p className={`font-bold ${agent.revenue?.status === "exceeding" ? "text-success" : agent.revenue?.status === "below" ? "text-destructive" : "text-foreground"}`}>
                      ${agent.revenue?.value?.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">{agent.revenue?.label}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right Panel - Insights */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-5"
        >
          {/* Header */}
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-semibold text-foreground">Insights & Coaching</h3>
          </div>

          {/* Selected Agent Card */}
          <div className="p-4 rounded-xl glass-card border border-border/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center text-white font-bold">
                  {selectedAgent?.avatar || agents[0]?.avatar}
                </div>
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Selected Agent</p>
                <p className="font-semibold text-foreground">{selectedAgent?.name || agents[0]?.name}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-secondary" />
              </div>
            </div>

            {/* Metric Analysis */}
            <div className="mb-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Metric Analysis</p>
              <p className="text-2xl font-bold text-warning" style={{ fontFamily: "'Sora', sans-serif" }}>
                {insight?.analysis || `QA Score: ${selectedAgent?.qa?.value || agents[0]?.qa?.value}%`}{" "}
                <TrendingDown className="inline w-5 h-5" />
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {insight?.details || "18% below team target. Major gaps identified in 'empathy' and 'solution accuracy' criteria."}
              </p>
            </div>
          </div>

          {/* Recommended Actions */}
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Recommended Actions</p>

            {(insight?.recommendedActions || [
              { type: "coaching", title: "Schedule 1:1 Coaching", desc: "Review last 3 failed calls together." },
              { type: "training", title: "Assign Training Module", desc: '"Advanced Empathy & Tone" (15m)' },
            ]).map((action, idx) => (
              <button key={idx} className="w-full p-4 rounded-xl glass-card border border-border/50 hover:border-primary/50 transition-colors text-left flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg ${action.type === "coaching" ? "bg-primary/20" : "bg-secondary/20"} flex items-center justify-center shrink-0`}>
                  {action.type === "coaching" ? (
                    <MessageSquare className="w-5 h-5 text-primary" />
                  ) : (
                    <BookOpen className="w-5 h-5 text-secondary" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">{action.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{action.desc}</p>
                </div>
              </button>
            ))}
          </div>

          {/* AI Pattern Detection */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-primary/20 to-pink-500/20 border border-primary/30">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">AI Pattern Detection</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {insight?.pattern || `${selectedAgent?.name || agents[0]?.name}'s QA scores drop significantly on calls longer than 8 minutes. Focus coaching on call control techniques.`}
            </p>
          </div>

          {/* History */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">History</p>
            {(insight?.history || [{ action: 'Sent "Kudos" for NPS', time: "2 days ago", by: "AM" }]).map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                  {item.by}
                </div>
                <div>
                  <p className="text-sm text-foreground">{item.action}</p>
                  <p className="text-xs text-muted-foreground">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TeamPerformance;