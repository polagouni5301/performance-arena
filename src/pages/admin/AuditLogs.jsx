import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Search, 
  Filter,
  Settings,
  Bell,
  Download,
  Calendar,
  FileText,
  Database,
  MoreHorizontal
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
import { useAuditLogs } from "./hooks.jsx";
import { TableSkeleton } from "@/components/ui/PageSkeleton";

const iconMap = {
  Calendar,
  FileText,
  Database,
};

const AuditLogs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data, loading, error, actions } = useAuditLogs();

  if (loading) return <TableSkeleton />;
  if (error) return <div className="text-destructive p-4">Error: {error}</div>;
  if (!data) return null;

  const { claimLogs, emailTriggers, downloadReports, pagination } = data;

  const getStatusColor = (status) => {
    switch (status) {
      case "Fulfilled": return "bg-success/20 text-success";
      case "Pending Approval": return "bg-warning/20 text-warning";
      case "Shipped": return "bg-secondary/20 text-secondary";
      case "Scheduled": return "bg-primary/20 text-primary";
      case "Rejected": return "bg-destructive/20 text-destructive";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">System Notifications & Audit Logs</h1>
          <p className="text-muted-foreground mt-1">Monitor reward claims, configure alerts, and download reports.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50 border border-border text-sm text-foreground hover:bg-muted transition-colors">
            <Settings className="w-4 h-4" />
            SMTP Settings
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
            <Bell className="w-4 h-4" />
            New Trigger Rule
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Claim Logs Table */}
        <GlassCard className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-foreground">Reward Claim Logs</h3>
              <p className="text-sm text-muted-foreground">Detailed audit trail of all redemption activities.</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search logs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-48 pl-10 pr-4 py-2 rounded-lg bg-muted/30 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                />
              </div>
              <button className="p-2 rounded-lg border border-border hover:bg-muted transition-colors">
                <Filter className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Agent Name</TableHead>
                <TableHead>Reward Item</TableHead>
                <TableHead className="text-right">Points</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {claimLogs.map((log, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                >
                  <TableCell className="text-muted-foreground text-sm">{log.date}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold",
                        log.color || "bg-primary"
                      )}>
                        {log.initials}
                      </div>
                      <span className="font-medium text-foreground">{log.agent}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{log.reward}</TableCell>
                  <TableCell className="text-right text-destructive font-medium">
                    {log.points.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <span className={cn(
                      "px-2 py-1 rounded text-xs font-medium",
                      getStatusColor(log.status)
                    )}>
                      {log.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <button className="p-1.5 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Showing {pagination.showing} of {pagination.total.toLocaleString()} records
            </p>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 rounded-lg border border-border text-sm hover:bg-muted transition-colors">
                Previous
              </button>
              <button className="px-3 py-1.5 rounded-lg border border-border text-sm hover:bg-muted transition-colors">
                Next
              </button>
            </div>
          </div>
        </GlassCard>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Email Trigger Rules */}
          <GlassCard className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Bell className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-bold text-foreground">Email Trigger Rules</h3>
            </div>
            <div className="space-y-4">
              {emailTriggers.map((trigger, index) => (
                <div key={index} className="p-3 rounded-lg bg-muted/30 border border-border">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-foreground">{trigger.name}</span>
                    <div 
                      onClick={() => actions.toggleTrigger(trigger.name, !trigger.enabled)}
                      className={cn(
                        "w-10 h-5 rounded-full relative transition-colors cursor-pointer",
                        trigger.enabled ? "bg-primary" : "bg-muted"
                      )}
                    >
                      <div className={cn(
                        "absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform",
                        trigger.enabled ? "translate-x-5" : "translate-x-0.5"
                      )} />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{trigger.desc}</p>
                  <button className="text-xs text-primary hover:underline mt-2">Edit Template</button>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Download Reports */}
          <GlassCard className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Download className="w-5 h-5 text-secondary" />
              <h3 className="text-lg font-bold text-foreground">Download Reports</h3>
            </div>
            <div className="space-y-3">
              {downloadReports.map((report, index) => {
                const IconComponent = iconMap[report.icon] || FileText;
                return (
                  <button 
                    key={index}
                    className="w-full flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center">
                      <IconComponent className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-foreground">{report.name}</p>
                      <p className="text-xs text-muted-foreground">{report.desc}</p>
                    </div>
                    <Download className="w-4 h-4 text-muted-foreground" />
                  </button>
                );
              })}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;
