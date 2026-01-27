import { cn } from "../../lib/utils";

const ProgressRing = ({ 
  value = 0, 
  max = 100, 
  size = 120, 
  strokeWidth = 8,
  showValue = true,
  label,
  color = "primary",
  className 
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = Math.min(Math.max(value / max, 0), 1);
  const strokeDashoffset = circumference - progress * circumference;

  const colorClasses = {
    primary: "stroke-primary",
    secondary: "stroke-secondary",
    success: "stroke-success",
    warning: "stroke-warning",
    destructive: "stroke-destructive",
  };

  const glowColors = {
    primary: "drop-shadow-[0_0_10px_hsla(280,100%,60%,0.6)]",
    secondary: "drop-shadow-[0_0_10px_hsla(195,100%,50%,0.6)]",
    success: "drop-shadow-[0_0_10px_hsla(145,70%,45%,0.6)]",
    warning: "drop-shadow-[0_0_10px_hsla(35,100%,55%,0.6)]",
    destructive: "drop-shadow-[0_0_10px_hsla(0,75%,55%,0.6)]",
  };

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsla(270, 30%, 20%, 0.5)"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className={cn(colorClasses[color], glowColors[color])}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{
            transition: "stroke-dashoffset 1s ease-out",
          }}
        />
      </svg>
      
      {showValue && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-orbitron font-bold text-foreground">
            {Math.round(value)}
          </span>
          {label && (
            <span className="text-xs text-muted-foreground uppercase tracking-wider">
              {label}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default ProgressRing;
