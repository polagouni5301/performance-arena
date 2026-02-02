import { useState } from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  DollarSign,
  Download,
  Calendar
} from "lucide-react";
import { 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  ReferenceLine,
  Cell
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
import { useLeadershipROI } from "./hooks.jsx";
import { DashboardSkeleton } from "@/components/ui/PageSkeleton";

const LeadershipROI = () => {
  const [fiscalYear, setFiscalYear] = useState("FY2024");
  const { data, loading, error, actions } = useLeadershipROI(fiscalYear);

  if (loading) return <DashboardSkeleton />;
  if (error) return <div className="text-destructive p-4">Error: {error}</div>;
  if (!data) return null;

  const { totalSpent, totalGain, roiMultiplier, scatterData, quarterlyData, contestROI } = data;

  const getStatusColor = (status) => {
    switch (status) {
      case "Excellent": return "bg-success/20 text-success";
      case "Strong": return "bg-primary/20 text-primary";
      case "Good": return "bg-secondary/20 text-secondary";
      default: return "bg-muted/20 text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Executive ROI & Impact Analytics</h1>
          <p className="text-muted-foreground mt-1">Financial impact analysis of incentive reward spending on net revenue.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg bg-success/20 text-success text-sm font-medium">
            Data Updated: Today, 09:00 AM
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 border border-border text-sm">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground">{fiscalYear}</span>
          </div>
          <button 
            onClick={() => actions.export('pdf')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm text-foreground hover:bg-muted transition-colors"
          >
            <Download className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="p-6">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-xs text-muted-foreground">TOTAL REWARDS SPENT</p>
              <p className="text-[10px] text-muted-foreground">YTD Direct Cost</p>
            </div>
            <DollarSign className="w-5 h-5 text-muted-foreground" />
          </div>
          <p className="text-4xl font-display font-bold text-foreground mt-4">
            ₹{(totalSpent / 1000).toFixed(0)}K
          </p>
          <div className="mt-3 flex items-center gap-2">
            <span className="px-2 py-1 rounded text-xs bg-muted/50 text-muted-foreground">On Budget</span>
            <span className="text-xs text-muted-foreground">98% utilization</span>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-xs text-muted-foreground">ATTRIBUTED REVENUE</p>
              <p className="text-[10px] text-muted-foreground">YTD Business Gain</p>
            </div>
            <TrendingUp className="w-5 h-5 text-muted-foreground" />
          </div>
          <p className="text-4xl font-display font-bold text-foreground mt-4">
            ₹{(totalGain / 100000).toFixed(1)}L
          </p>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-success text-sm font-medium">↑ 12.4%</span>
            <span className="text-xs text-muted-foreground">vs prev. period</span>
          </div>
        </GlassCard>

        <GlassCard className="p-6 relative overflow-hidden">
          <div className="absolute top-4 right-4">
            <span className="px-2 py-1 rounded text-xs bg-success/20 text-success font-medium">Excellent</span>
          </div>
          <div className="mb-2">
            <p className="text-xs text-muted-foreground">ROI MULTIPLIER</p>
            <p className="text-[10px] text-muted-foreground">Return on Ad Spend (ROAS) equiv.</p>
          </div>
          <p className="text-5xl font-display font-bold text-foreground mt-4">
            {roiMultiplier}x
          </p>
          <p className="text-sm text-muted-foreground mt-3">
            For every <strong className="text-foreground">₹1</strong> spent on rewards, the organization realized <strong className="text-foreground">₹{roiMultiplier.toFixed(2)}</strong> in incremental revenue.
          </p>
          {/* Decorative sparkles */}
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-success/10 rounded-full blur-2xl" />
        </GlassCard>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scatter Plot */}
        <GlassCard className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-foreground">Points vs Business Outcome</h3>
              <p className="text-sm text-muted-foreground">Higher points strongly correlate with higher revenue.</p>
            </div>
            <div className="flex items-center gap-2 px-2 py-1 rounded bg-muted/50">
              <div className="w-2 h-2 rounded-full bg-success" />
              <span className="text-xs text-muted-foreground">R² = {data.correlationR2 || 0.84}</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsla(270, 30%, 25%, 0.3)" />
              <XAxis 
                type="number" 
                dataKey="points" 
                name="Points" 
                stroke="hsl(260, 15%, 55%)" 
                fontSize={12}
                tickFormatter={(value) => `${value / 1000}k`}
                label={{ value: 'Pts', position: 'right', fill: 'hsl(260, 15%, 55%)' }}
              />
              <YAxis 
                type="number" 
                dataKey="revenue" 
                name="Revenue" 
                stroke="hsl(260, 15%, 55%)" 
                fontSize={12}
                tickFormatter={(value) => `${value / 1000}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(260, 30%, 8%)',
                  border: '1px solid hsl(270, 30%, 20%)',
                  borderRadius: '8px'
                }}
                formatter={(value, name) => [
                  name === 'Points' ? value.toLocaleString() : `₹${(value / 1000).toFixed(0)}K`,
                  name
                ]}
              />
              <Scatter name="Performers" data={scatterData} fill="hsl(195, 100%, 50%)">
                {scatterData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.revenue > 200000 ? "hsl(280, 100%, 60%)" : "hsl(195, 100%, 50%)"} />
                ))}
              </Scatter>
              {/* Trend line approximation */}
              <ReferenceLine 
                stroke="hsla(280, 100%, 60%, 0.5)" 
                strokeDasharray="5 5"
                segment={[{ x: 0, y: 0 }, { x: 12000, y: 260000 }]}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Bar Chart - Quarterly Spend vs Uplift */}
        <GlassCard className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-foreground">Rewards vs. Revenue Uplift</h3>
              <p className="text-sm text-muted-foreground">Direct comparison of spend vs gain (Quarterly).</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-primary" />
                <span className="text-muted-foreground">Spend</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-success" />
                <span className="text-muted-foreground">Uplift</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={quarterlyData} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="hsla(270, 30%, 25%, 0.3)" />
              <XAxis dataKey="quarter" stroke="hsl(260, 15%, 55%)" fontSize={12} />
              <YAxis 
                stroke="hsl(260, 15%, 55%)" 
                fontSize={12}
                tickFormatter={(value) => `₹${value / 1000}K`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(260, 30%, 8%)',
                  border: '1px solid hsl(270, 30%, 20%)',
                  borderRadius: '8px'
                }}
                formatter={(value) => [`₹${(value / 1000).toFixed(0)}K`]}
              />
              <Bar dataKey="spend" name="Spend" fill="hsl(280, 100%, 60%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="uplift" name="Uplift" fill="hsl(145, 70%, 45%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      {/* Contest ROI Table */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-foreground">Contest ROI Analysis</h3>
            <p className="text-sm text-muted-foreground">Detailed performance breakdown by contest initiative.</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm text-foreground hover:bg-muted transition-colors">
            <Download className="w-4 h-4" />
            Download CSV
          </button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>CONTEST NAME</TableHead>
              <TableHead className="text-right">REWARDS SPENT</TableHead>
              <TableHead className="text-right">REVENUE GENERATED</TableHead>
              <TableHead className="text-right">ROI</TableHead>
              <TableHead className="text-right">STATUS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contestROI.map((contest, index) => (
              <motion.tr
                key={contest.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="border-b border-border/50 hover:bg-muted/20 transition-colors"
              >
                <TableCell className="font-medium text-foreground">{contest.name}</TableCell>
                <TableCell className="text-right text-muted-foreground">{contest.spend}</TableCell>
                <TableCell className="text-right font-semibold text-foreground">{contest.revenue}</TableCell>
                <TableCell className="text-right">
                  <span className="font-display font-bold text-success">{contest.roi}</span>
                </TableCell>
                <TableCell className="text-right">
                  <span className={cn(
                    "px-2 py-1 rounded text-xs font-medium",
                    getStatusColor(contest.status)
                  )}>
                    {contest.status}
                  </span>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </GlassCard>
    </div>
  );
};

export default LeadershipROI;
