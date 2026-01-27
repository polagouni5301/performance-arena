import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Clock, 
  CheckCircle, 
  DollarSign, 
  Star,
  Calendar,
  Edit,
  Plus,
  History,
  Save
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
import { useMetrics } from "./hooks.jsx";
import { TableSkeleton } from "@/components/ui/PageSkeleton";

const iconMap = {
  Clock,
  CheckCircle,
  DollarSign,
  Star,
  Calendar,
};

const MetricConfiguration = () => {
  const { data, loading, error, actions } = useMetrics();

  if (loading) return <TableSkeleton />;
  if (error) return <div className="text-destructive p-4">Error: {error}</div>;
  if (!data) return null;

  const { metrics, summary } = data;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <span>Home</span>
            <span>›</span>
            <span>Admin</span>
            <span>›</span>
            <span className="text-foreground">Metric Configuration</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Metric & Weightage Rules Engine</h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50 border border-border text-sm text-foreground hover:bg-muted transition-colors">
            <History className="w-4 h-4" />
            Audit Log
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
            <Save className="w-4 h-4" />
            Publish Rules
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <GlassCard className="p-6">
        <div className="flex flex-wrap items-center gap-8">
          <div className="flex items-center gap-3">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">TOTAL WEIGHTAGE</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-3xl font-display font-bold text-foreground">{summary.totalWeightage}%</span>
                {summary.totalWeightage === 100 && (
                  <CheckCircle className="w-5 h-5 text-success" />
                )}
              </div>
            </div>
          </div>
          <div className="w-px h-12 bg-border" />
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">ACTIVE KPIs</p>
            <span className="text-3xl font-display font-bold text-foreground">{summary.activeKPIs}</span>
          </div>
          <div className="w-px h-12 bg-border" />
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">METRIC TYPES</p>
            <span className="text-lg font-medium text-foreground">{summary.operationalCount} Operational • {summary.businessCount} Business</span>
          </div>
          <div className="ml-auto">
            <button 
              onClick={() => actions.create({})}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add New Metric
            </button>
          </div>
        </div>
      </GlassCard>

      {/* Metrics Table */}
      <GlassCard className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-foreground">Active KPIs Configuration</h3>
          <p className="text-sm text-muted-foreground">Manage scoring logic, target values and caps for all system metrics.</p>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">METRIC NAME</TableHead>
              <TableHead>TARGET VALUE</TableHead>
              <TableHead>WEIGHTAGE %</TableHead>
              <TableHead>CAP LIMITS</TableHead>
              <TableHead>METRIC TYPE</TableHead>
              <TableHead>STATUS</TableHead>
              <TableHead className="text-right">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {metrics.map((metric, index) => {
              const IconComponent = iconMap[metric.icon] || Clock;
              return (
                <motion.tr
                  key={metric.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className={cn(
                    "border-b border-border/50 transition-colors",
                    metric.status === "Disabled" ? "opacity-50" : "hover:bg-muted/20"
                  )}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-9 h-9 rounded-lg flex items-center justify-center",
                        metric.status === "Enabled" ? "bg-muted/50" : "bg-muted/30"
                      )}>
                        <IconComponent className={cn("w-4 h-4", metric.color || "text-muted-foreground")} />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{metric.name}</p>
                        <p className="text-xs text-muted-foreground">{metric.category}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{metric.target}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-2 bg-muted/30 rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full rounded-full transition-all",
                            metric.status === "Enabled" ? "bg-primary" : "bg-muted-foreground"
                          )}
                          style={{ width: `${metric.weightage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-foreground w-10">{metric.weightage}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{metric.cap}</TableCell>
                  <TableCell>
                    <span className={cn(
                      "px-2 py-1 rounded text-xs font-medium",
                      metric.type === "Operational" 
                        ? "bg-muted/50 text-muted-foreground" 
                        : "bg-primary/20 text-primary"
                    )}>
                      {metric.type}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={cn(
                      "flex items-center gap-1.5 text-sm",
                      metric.status === "Enabled" ? "text-success" : "text-muted-foreground"
                    )}>
                      <span className={cn(
                        "w-2 h-2 rounded-full",
                        metric.status === "Enabled" ? "bg-success" : "bg-muted-foreground"
                      )} />
                      {metric.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <button 
                      onClick={() => actions.update(metric.id, metric)}
                      className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </TableCell>
                </motion.tr>
              );
            })}
          </TableBody>
        </Table>
      </GlassCard>
    </div>
  );
};

export default MetricConfiguration;
