import { cn } from "../../lib/utils";

const GlassCard = ({ 
  children, 
  className, 
  glow = false, 
  hover = false,
  neonBorder = false,
  ...props 
}) => {
  return (
    <div
      className={cn(
        "glass-card p-6",
        hover && "transition-all duration-300 hover:scale-[1.02] hover:border-primary/50",
        glow && "animate-border-glow",
        neonBorder && "neon-border",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;
