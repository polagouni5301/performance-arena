import { cn } from "../../lib/utils";
import GlassCard from "./GlassCard";

const MetricCard = ({
  icon: Icon,
  title,
  value,
  target,
  unit = "",
  status = "on-track",
  progress = 0,
  trend,
  className,
}) => {
  const statusColors = {
    excellent: {
      bg: "bg-success/20",
      text: "text-success",
      border: "border-success/30",
      bar: "bg-success",
      label: "Excellent",
    },
    "on-track": {
      bg: "bg-secondary/20",
      text: "text-secondary",
      border: "border-secondary/30",
      bar: "bg-secondary",
      label: "On Track",
    },
    "at-risk": {
      bg: "bg-warning/20",
      text: "text-warning",
      border: "border-warning/30",
      bar: "bg-warning",
      label: "At Risk",
    },
    critical: {
      bg: "bg-destructive/20",
      text: "text-destructive",
      border: "border-destructive/30",
      bar: "bg-destructive",
      label: "Critical",
    },
    push: {
      bg: "bg-warning/20",
      text: "text-warning",
      border: "border-warning/30",
      bar: "bg-warning",
      label: "Push",
    },
    perfect: {
      bg: "bg-accent/20",
      text: "text-accent",
      border: "border-accent/30",
      bar: "bg-accent",
      label: "Perfect",
    },
    superb: {
      bg: "bg-pink-500/20",
      text: "text-pink-400",
      border: "border-pink-500/30",
      bar: "bg-pink-500",
      label: "Superb",
    },
  };

  const statusStyle = statusColors[status] || statusColors["on-track"];

  return (
    <GlassCard className={cn("relative overflow-hidden", className)} hover>
      {/* Status badge */}
      <div className="flex items-center justify-between mb-4">
        <div className={cn("p-2 rounded-lg", statusStyle.bg)}>
          {Icon && <Icon className={cn("w-5 h-5", statusStyle.text)} />}
        </div>
        <span 
          className={cn(
            "px-2 py-1 rounded-full text-xs font-medium",
            statusStyle.bg,
            statusStyle.text,
            statusStyle.border,
            "border"
          )}
        >
          {trend ? (trend > 0 ? "↑" : "↓") : "✓"} {statusStyle.label}
        </span>
      </div>

      {/* Title */}
      <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
        {title}
      </h4>

      {/* Value */}
      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-3xl font-orbitron font-bold text-foreground">
          {value}
        </span>
        {target && (
          <span className="text-sm text-muted-foreground">
            / {target} {unit}
          </span>
        )}
        {!target && unit && (
          <span className="text-sm text-muted-foreground">{unit}</span>
        )}
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-1000", statusStyle.bar)}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>

      {/* Trend indicator */}
      {trend !== undefined && (
        <p className={cn("mt-2 text-sm", trend > 0 ? "text-success" : "text-destructive")}>
          {trend > 0 ? "+" : ""}{trend}% from yesterday
        </p>
      )}
    </GlassCard>
  );
};

export default MetricCard;
