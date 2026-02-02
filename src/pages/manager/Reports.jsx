import { motion } from "framer-motion";
import {
  FileText,
  Download,
  Calendar,
  BarChart3,
  PieChart,
  TrendingUp,
  Users,
  Trophy,
  Clock,
} from "lucide-react";
import { useManagerReports } from "./hooks.jsx";
import { DashboardSkeleton } from "@/components/ui/PageSkeleton";

const iconMap = {
  BarChart3,
  Trophy,
  PieChart,
  Users,
  TrendingUp,
};

const Reports = () => {
  const { data, loading } = useManagerReports();

  if (loading) {
    return <DashboardSkeleton />;
  }

  const reports = data?.reports || [];
  const scheduledReports = data?.scheduledReports || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground" style={{ fontFamily: "'Sora', sans-serif" }}>
            Reports
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Generate and download performance reports
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-primary-foreground"
          style={{
            background: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(330 100% 50%) 100%)",
          }}
        >
          <FileText className="w-4 h-4" />
          Create Custom Report
        </motion.button>
      </div>

      <div className="grid lg:grid-cols-[1fr_340px] gap-6">
        {/* Reports Grid */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Available Reports</h2>
          <div className="grid gap-4">
            {reports.map((report, idx) => {
              const IconComponent = iconMap[report.icon] || BarChart3;
              return (
                <motion.div
                  key={report.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-5 rounded-xl glass-card border border-border/50 hover:border-primary/30 transition-colors flex items-center gap-4"
                >
                  <div className={`w-12 h-12 rounded-xl bg-${report.color}/20 flex items-center justify-center shrink-0`}>
                    <IconComponent className={`w-6 h-6 text-${report.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground">{report.title}</h3>
                      <span className="px-2 py-0.5 rounded bg-muted text-muted-foreground text-xs">
                        {report.type}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{report.description}</p>
                    <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Last generated: {report.lastGenerated}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-4 py-2 rounded-lg bg-muted/50 border border-border text-sm font-medium hover:bg-muted transition-colors">
                      Preview
                    </button>
                    <button className="p-2 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors">
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Scheduled Reports */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Scheduled Reports</h2>
          <div className="space-y-3">
            {scheduledReports.map((report, idx) => (
              <motion.div
                key={report.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-4 rounded-xl glass-card border border-border/50"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-foreground">{report.name}</p>
                  <button className="text-xs text-primary hover:underline">Edit</button>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Calendar className="w-4 h-4" />
                  <span>{report.schedule}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {report.recipients} recipients
                </p>
              </motion.div>
            ))}
          </div>

          <button className="w-full p-4 rounded-xl border-2 border-dashed border-primary/40 hover:border-primary/70 transition-colors flex items-center justify-center gap-2 text-primary">
            <Calendar className="w-5 h-5" />
            <span className="font-medium">Schedule New Report</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reports;