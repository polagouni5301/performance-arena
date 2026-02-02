import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Download,
  Shield,
  Clock,
  ThumbsUp,
  Flag
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  ReferenceLine,
  ReferenceDot
} from "recharts";
import GlassCard from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";
import { useLeadershipReports } from "./hooks.jsx";
import { DashboardSkeleton } from "@/components/ui/PageSkeleton";

const reportTabs = ["Revenue", "Efficiency", "Culture"];

const LeadershipReports = () => {
  const [activeTab, setActiveTab] = useState("Revenue");
  const { data, loading, error, actions } = useLeadershipReports(activeTab);

  if (loading) return <DashboardSkeleton />;
  if (error) return <div className="text-destructive p-4">Error: {error}</div>;
  if (!data) return null;

  const { revenueData, departmentRevenue, kpiMetrics } = data;

  const iconMap = {
    Shield,
    Clock,
    ThumbsUp,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Organization Outcome Reports</h1>
          <p className="text-muted-foreground mt-1">Detailed business performance reports for enterprise leadership.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Report Tabs */}
          <div className="flex rounded-lg border border-border overflow-hidden">
            {reportTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 py-2 text-sm font-medium transition-colors",
                  activeTab === tab
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/30 text-muted-foreground hover:bg-muted"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
          <button 
            onClick={() => actions.export('pdf', 'pdf')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm text-foreground hover:bg-muted transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Revenue Impact Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <GlassCard className="lg:col-span-2 p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-foreground">Revenue Impact</h3>
              <p className="text-sm text-muted-foreground">Monthly Recurring Revenue (MRR) trend analysis</p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-muted-foreground">Revenue Trend</span>
              </div>
              <div className="flex items-center gap-2">
                <Flag className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">System Launch</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(280, 100%, 60%)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(280, 100%, 60%)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsla(270, 30%, 25%, 0.3)" />
              <XAxis dataKey="month" stroke="hsl(260, 15%, 55%)" fontSize={12} />
              <YAxis 
                stroke="hsl(260, 15%, 55%)" 
                fontSize={12}
                tickFormatter={(value) => `₹${value}Cr`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(260, 30%, 8%)',
                  border: '1px solid hsl(270, 30%, 20%)',
                  borderRadius: '8px'
                }}
                formatter={(value) => [`₹${value}Cr`, 'Revenue']}
              />
              <ReferenceLine x="JUN" stroke="hsl(260, 15%, 55%)" strokeDasharray="5 5" />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="hsl(280, 100%, 60%)" 
                strokeWidth={2}
                fill="url(#revenueGradient)"
              />
              <ReferenceDot x="JUN" y={2.7} r={6} fill="hsl(280, 100%, 60%)" stroke="white" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="mt-4 flex items-center justify-center">
            <div className="px-3 py-1.5 rounded-lg bg-success/20 text-success text-sm font-medium">
              +32% Growth post System Launch
            </div>
          </div>
        </GlassCard>

        {/* Revenue by Department */}
        <GlassCard className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-foreground">Revenue by Department</h3>
            <p className="text-sm text-muted-foreground">Contribution by vertical</p>
          </div>
          <div className="space-y-5">
            {departmentRevenue.map((dept, index) => (
              <motion.div
                key={dept.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{dept.name}</span>
                  <span className="text-sm font-bold text-foreground">{dept.revenue}</span>
                </div>
                <div className="h-3 bg-muted/30 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${dept.progress}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className={cn("h-full rounded-full bg-gradient-to-r", dept.color)}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {kpiMetrics.map((metric, index) => {
          const IconComponent = iconMap[metric.icon] || Shield;
          return (
            <GlassCard key={metric.label} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground tracking-wide">{metric.label}</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-display font-bold text-foreground">{metric.value}</span>
                    <span className={cn(
                      "text-sm font-medium",
                      metric.changeType === "positive" ? "text-success" : "text-destructive"
                    )}>
                      {metric.change}
                    </span>
                  </div>
                </div>
                <IconComponent className="w-5 h-5 text-muted-foreground" />
              </div>

              {/* Mini Sparkline */}
              <div className="h-16 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={metric.sparkData.map((v) => ({ value: v }))}>
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="hsl(145, 70%, 45%)" 
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Team Breakdown */}
              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground mb-3">TEAM VS AVG</p>
                <div className="space-y-2">
                  {metric.teams.map((team) => (
                    <div key={team.name} className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground w-8">{team.name}</span>
                      <div className="flex-1 h-1.5 bg-muted/30 rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full rounded-full",
                            team.value.startsWith("+") || (team.value.startsWith("-") && team.value.includes("s") && !team.value.startsWith("+"))
                              ? "bg-success" 
                              : team.value.startsWith("-") 
                                ? "bg-destructive"
                                : "bg-success"
                          )}
                          style={{ width: `${team.progress}%` }}
                        />
                      </div>
                      <span className={cn(
                        "text-xs font-medium w-12 text-right",
                        team.value.startsWith("+") ? "text-success" : team.value.startsWith("-") && !team.value.includes("s") ? "text-destructive" : "text-success"
                      )}>
                        {team.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
};

export default LeadershipReports;
