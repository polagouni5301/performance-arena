import { motion } from "framer-motion";
import { 
  Users, 
  Trophy, 
  Gift, 
  AlertTriangle,
  TrendingUp,
  Shield,
  SlidersHorizontal,
  Zap,
  Headphones,
  CreditCard,
  Shirt,
  Package
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
import { useAdminOverview } from "./hooks.jsx";
import { DashboardSkeleton } from "@/components/ui/PageSkeleton";

const iconMap = {
  Headphones,
  CreditCard,
  Shirt,
  SlidersHorizontal,
  AlertTriangle,
  Package,
  Zap,
};

const AdminOverview = () => {
  const { data, loading, error } = useAdminOverview();

  if (loading) return <DashboardSkeleton />;
  if (error) return <div className="text-destructive p-4">Error: {error}</div>;
  if (!data) return null;

  const { kpis, systemHealth, lowStockAlerts, recentActivity } = data;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">System Health Overview</h1>
        <p className="text-muted-foreground mt-1">Real-time infrastructure monitoring and system status.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label="Active Users"
          value={kpis.activeUsers.value}
          change={kpis.activeUsers.change}
          changeType={kpis.activeUsers.changeType}
          icon={Users}
          color="primary"
        />
        <KPICard
          label="Active Contests"
          value={kpis.activeContests.value}
          subtitle={kpis.activeContests.subtitle}
          icon={Trophy}
          color="secondary"
        />
        <KPICard
          label="Rewards in Stock"
          value={kpis.rewardsInStock.value}
          alert={kpis.rewardsInStock.alert}
          icon={Gift}
          color="success"
        />
        <KPICard
          label="Critical Warnings"
          value={kpis.criticalWarnings.value}
          subtitle={kpis.criticalWarnings.subtitle}
          icon={AlertTriangle}
          color="destructive"
          highlight
        />
      </div>

      {/* System Health & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* System Health Status */}
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-success" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">System Health Status</h3>
                  <p className="text-sm text-muted-foreground">Real-time infrastructure monitoring</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-success/20 text-success text-sm font-medium flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                {systemHealth.status}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SystemMetric 
                label="API Latency" 
                value={systemHealth.apiLatency.value} 
                status={systemHealth.apiLatency.status} 
                statusColor="success" 
              />
              <SystemMetric 
                label="Last Sync" 
                value={systemHealth.lastSync.value} 
                status={systemHealth.lastSync.status} 
                statusColor="muted" 
                subtitle={systemHealth.lastSync.subtitle} 
              />
              <SystemMetric 
                label="Error Rate" 
                value={systemHealth.errorRate.value} 
                status={systemHealth.errorRate.status} 
                statusColor="success" 
                showProgress 
                progressValue={systemHealth.errorRate.progress} 
              />
            </div>
          </GlassCard>

          {/* Low Stock Alerts */}
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-foreground">Recent Low-Stock Alerts</h3>
                <p className="text-sm text-muted-foreground">Inventory items below minimum threshold</p>
              </div>
              <button className="text-sm text-primary hover:underline">View Inventory</button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ITEM NAME</TableHead>
                  <TableHead>CATEGORY</TableHead>
                  <TableHead className="text-center">STOCK</TableHead>
                  <TableHead className="text-center">STATUS</TableHead>
                  <TableHead className="text-center">ACTION</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lowStockAlerts.map((item) => {
                  const IconComponent = iconMap[item.icon] || Package;
                  return (
                    <TableRow key={item.name}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center">
                            <IconComponent className="w-4 h-4 text-muted-foreground" />
                          </div>
                          <span className="font-medium text-foreground">{item.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{item.category}</TableCell>
                      <TableCell className="text-center">
                        <span className={cn(
                          "font-semibold",
                          item.status === "Critical" ? "text-destructive" : "text-warning"
                        )}>
                          {item.stock}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={cn(
                          "px-2 py-1 rounded text-xs font-medium",
                          item.status === "Critical" 
                            ? "bg-destructive/20 text-destructive" 
                            : "bg-warning/20 text-warning"
                        )}>
                          {item.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <button className="px-3 py-1 rounded bg-muted hover:bg-muted/80 text-sm text-foreground transition-colors">
                          Restock
                        </button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </GlassCard>
        </div>

        {/* Recent Activity Feed */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-foreground">Recent Activity Feed</h3>
            <button className="text-sm text-muted-foreground hover:text-foreground">View All</button>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => {
              const IconComponent = iconMap[activity.icon] || Zap;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex gap-3"
                >
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                    activity.color === "text-primary" ? "bg-primary/20" :
                    activity.color === "text-warning" ? "bg-warning/20" :
                    activity.color === "text-secondary" ? "bg-secondary/20" : "bg-muted"
                  )}>
                    <IconComponent className={cn("w-5 h-5", activity.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{activity.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{activity.desc}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

// KPI Card Component
const KPICard = ({ label, value, change, changeType, subtitle, alert, icon: Icon, color, highlight }) => (
  <GlassCard className={cn(
    "p-5",
    highlight && "border-destructive/50 bg-destructive/5"
  )}>
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className={cn(
          "text-xs font-medium tracking-wide",
          highlight ? "text-destructive" : "text-muted-foreground"
        )}>{label}</p>
        <p className={cn(
          "text-3xl font-display font-bold mt-2",
          highlight ? "text-destructive" : "text-foreground"
        )}>{value}</p>
        {change && (
          <p className={cn(
            "text-sm mt-2 flex items-center gap-1",
            changeType === "positive" ? "text-success" : "text-destructive"
          )}>
            <TrendingUp className="w-3 h-3" />
            {change}
          </p>
        )}
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-2">{subtitle}</p>
        )}
        {alert && (
          <p className="text-sm text-warning mt-2 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            {alert}
          </p>
        )}
      </div>
      <div className={cn(
        "w-12 h-12 rounded-xl flex items-center justify-center",
        color === "primary" ? "bg-primary/20" :
        color === "secondary" ? "bg-secondary/20" :
        color === "success" ? "bg-success/20" :
        color === "destructive" ? "bg-destructive/20" : "bg-muted"
      )}>
        <Icon className={cn(
          "w-6 h-6",
          color === "primary" ? "text-primary" :
          color === "secondary" ? "text-secondary" :
          color === "success" ? "text-success" :
          color === "destructive" ? "text-destructive" : "text-muted-foreground"
        )} />
      </div>
    </div>
  </GlassCard>
);

// System Metric Component
const SystemMetric = ({ label, value, status, statusColor, subtitle, showProgress, progressValue }) => (
  <div className="p-4 rounded-lg bg-muted/30 border border-border">
    <div className="flex items-center justify-between mb-2">
      <p className="text-sm text-muted-foreground">{label}</p>
      <span className={cn(
        "text-xs font-medium",
        statusColor === "success" ? "text-success" : "text-muted-foreground"
      )}>{status}</span>
    </div>
    <p className="text-2xl font-display font-bold text-foreground">{value}</p>
    {subtitle && (
      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
        <span className="w-2 h-2 rounded-full bg-success" />
        {subtitle}
      </p>
    )}
    {showProgress && (
      <div className="mt-2 h-1.5 bg-muted/50 rounded-full overflow-hidden">
        <div 
          className="h-full bg-success rounded-full"
          style={{ width: `${progressValue}%` }}
        />
      </div>
    )}
  </div>
);

export default AdminOverview;
