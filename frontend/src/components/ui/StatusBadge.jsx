import { cn } from "../../lib/utils";

const StatusBadge = ({ status, size = "default", className }) => {
  const statusStyles = {
    online: {
      bg: "bg-success/20",
      text: "text-success",
      dot: "bg-success",
      label: "Online",
    },
    offline: {
      bg: "bg-muted",
      text: "text-muted-foreground",
      dot: "bg-muted-foreground",
      label: "Offline",
    },
    active: {
      bg: "bg-secondary/20",
      text: "text-secondary",
      dot: "bg-secondary",
      label: "Active",
    },
    locked: {
      bg: "bg-destructive/20",
      text: "text-destructive",
      dot: "bg-destructive",
      label: "Locked",
    },
    claimed: {
      bg: "bg-success/20",
      text: "text-success",
      dot: "bg-success",
      label: "Claimed",
    },
    pending: {
      bg: "bg-warning/20",
      text: "text-warning",
      dot: "bg-warning",
      label: "Pending",
    },
    ready: {
      bg: "bg-primary/20",
      text: "text-primary",
      dot: "bg-primary animate-pulse",
      label: "Ready",
    },
  };

  const sizes = {
    sm: "text-xs px-2 py-0.5",
    default: "text-sm px-3 py-1",
    lg: "text-base px-4 py-1.5",
  };

  const style = statusStyles[status] || statusStyles.offline;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        style.bg,
        style.text,
        sizes[size],
        className
      )}
    >
      <span className={cn("w-2 h-2 rounded-full", style.dot)} />
      {style.label}
    </span>
  );
};

export default StatusBadge;
