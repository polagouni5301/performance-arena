import { motion } from "framer-motion";
import { 
  TrendingUp, 
  TrendingDown,
  Users, 
  DollarSign, 
  Target,
  Settings,
  Download,
  Lightbulb,
  MoreHorizontal,
  ArrowUpRight
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
} from "recharts";
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
import { useLeadershipOverview } from "./hooks.jsx";
import { DashboardSkeleton } from "@/components/ui/PageSkeleton";

const LeadershipOverview = () => {
  const { data, loading, error } = useLeadershipOverview();

  if (loading) return <DashboardSkeleton />;
  if (error) return <div className="text-destructive p-4">Error: {error}</div>;
  if (!data) return null;

  const { kpis, trendData, topDepartments, recentCampaigns, insights } = data;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Strategic Performance Dashboard</h1>
          <p className="text-muted-foreground mt-1">Real-time executive summary of organizational impact and financial efficiency.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50 border border-border text-sm text-foreground hover:bg-muted transition-colors">
            <Settings className="w-4 h-4" />
            Configure
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
            <Download className="w-4 h-4" />
            Download PDF Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label="OVERALL PERFORMANCE SCORE"
          value={kpis.performanceScore.value}
          change={kpis.performanceScore.change}
          changeType={kpis.performanceScore.changeType}
          subtitle={kpis.performanceScore.subtitle}
          icon={Target}
        />
        <KPICard
          label="PARTICIPATION RATE"
          value={kpis.participationRate.value}
          change={kpis.participationRate.change}
          changeType={kpis.participationRate.changeType}
          subtitle={kpis.participationRate.subtitle}
          icon={Users}
        />
        <KPICard
          label="TOTAL REWARDS SPENT"
          value={kpis.rewardsSpent.value}
          subtitle={kpis.rewardsSpent.subtitle}
          progress={kpis.rewardsSpent.progress}
          icon={DollarSign}
        />
        <KPICard
          label="REVENUE UPLIFT"
          value={kpis.revenueUplift.value}
          badge={kpis.revenueUplift.badge}
          subtitle={kpis.revenueUplift.subtitle}
          icon={TrendingUp}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Departments */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-foreground">TOP 5 DEPARTMENTS</h3>
              <p className="text-sm text-muted-foreground">By Revenue Impact (YTD)</p>
            </div>
            <button className="p-2 rounded-lg hover:bg-muted/50 transition-colors">
              <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
          <div className="space-y-4">
            {topDepartments.map((dept, index) => (
              <div key={dept.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">{dept.name}</span>
                  <span className="text-sm font-semibold text-foreground">{dept.revenue}</span>
                </div>
                <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${dept.progress}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Trends Analysis Chart */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-foreground">TRENDS ANALYSIS</h3>
              <p className="text-sm text-muted-foreground">Performance vs Participation (Last 90 Days)</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-muted-foreground">Performance</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-success" />
                <span className="text-muted-foreground">Participation</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsla(270, 30%, 25%, 0.3)" />
              <XAxis dataKey="day" stroke="hsl(260, 15%, 55%)" fontSize={12} />
              <YAxis stroke="hsl(260, 15%, 55%)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(260, 30%, 8%)',
                  border: '1px solid hsl(270, 30%, 20%)',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="performance" 
                stroke="hsl(280, 100%, 60%)" 
                strokeWidth={2}
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="participation" 
                stroke="hsl(145, 70%, 45%)" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      {/* Executive Insights */}
      <GlassCard className="p-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-accent">
            <Lightbulb className="w-5 h-5" />
            <span className="font-bold text-sm">EXECUTIVE INSIGHTS</span>
          </div>
          <div className="h-6 w-px bg-border" />
          <div className="flex-1 flex items-center gap-6 overflow-x-auto">
            {insights.map((insight, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-success" />
                <span dangerouslySetInnerHTML={{ __html: insight.replace(/(\d+\.?\d*[x%]?)/g, '<strong class="text-foreground">$1</strong>') }} />
              </div>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Recent Campaign Financials */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-foreground">RECENT CAMPAIGN FINANCIALS</h3>
          <button className="text-sm text-primary hover:underline flex items-center gap-1">
            View Detailed Report
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>CAMPAIGN</TableHead>
              <TableHead>OWNER</TableHead>
              <TableHead className="text-center">BUDGET UTILIZATION</TableHead>
              <TableHead className="text-right">REVENUE IMPACT</TableHead>
              <TableHead className="text-right">ROI STATUS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentCampaigns.map((campaign) => (
              <TableRow key={campaign.name}>
                <TableCell className="font-medium text-foreground">{campaign.name}</TableCell>
                <TableCell className="text-muted-foreground">{campaign.owner}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-24 h-2 bg-muted/50 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${campaign.budgetUtil}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground">{campaign.budgetUtil}%</span>
                  </div>
                </TableCell>
                <TableCell className="text-right font-semibold text-foreground">{campaign.revenueImpact}</TableCell>
                <TableCell className="text-right">
                  <span className={cn(
                    "px-2 py-1 rounded text-xs font-medium",
                    campaign.roiStatus === "Exceeding" 
                      ? "bg-success/20 text-success" 
                      : "bg-secondary/20 text-secondary"
                  )}>
                    {campaign.roiStatus}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </GlassCard>
    </div>
  );
};

// KPI Card Component
const KPICard = ({ label, value, change, changeType, subtitle, icon: Icon, progress, badge }) => (
  <GlassCard className="p-5">
    <div className="flex items-start justify-between mb-3">
      <p className="text-xs font-medium text-muted-foreground tracking-wide">{label}</p>
      {Icon && <Icon className="w-5 h-5 text-muted-foreground" />}
    </div>
    <div className="flex items-baseline gap-2">
      <span className="text-3xl font-display font-bold text-foreground">{value}</span>
      {change && (
        <span className={cn(
          "text-sm font-medium flex items-center gap-1",
          changeType === "positive" ? "text-success" : "text-destructive"
        )}>
          {changeType === "positive" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {change}
        </span>
      )}
      {badge && (
        <span className={cn(
          "px-2 py-0.5 rounded text-xs font-medium",
          badge.color === "success" ? "bg-success/20 text-success" : "bg-primary/20 text-primary"
        )}>
          {badge.label}
        </span>
      )}
    </div>
    {subtitle && (
      <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
    )}
    {progress !== undefined && (
      <div className="mt-3 h-2 bg-muted/50 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
    )}
  </GlassCard>
);

export default LeadershipOverview;
