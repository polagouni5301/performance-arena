import { cn } from "../../lib/utils";

const NeonButton = ({ 
  children, 
  variant = "primary", 
  size = "default",
  glow = true,
  className,
  ...props 
}) => {
  const variants = {
    primary: "bg-gradient-to-r from-primary to-pink-500 text-primary-foreground hover:from-primary/90 hover:to-pink-500/90",
    secondary: "bg-gradient-to-r from-secondary to-blue-600 text-secondary-foreground hover:from-secondary/90 hover:to-blue-600/90",
    gold: "bg-gradient-to-r from-accent to-yellow-600 text-accent-foreground hover:from-accent/90 hover:to-yellow-600/90",
    outline: "border-2 border-primary bg-transparent text-primary hover:bg-primary/10",
    ghost: "bg-transparent text-foreground hover:bg-muted",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    default: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
    xl: "px-10 py-5 text-xl",
  };

  const glowStyles = {
    primary: "shadow-[0_0_20px_hsla(280,100%,60%,0.4),0_0_40px_hsla(280,100%,60%,0.2)] hover:shadow-[0_0_30px_hsla(280,100%,60%,0.6),0_0_60px_hsla(280,100%,60%,0.3)]",
    secondary: "shadow-[0_0_20px_hsla(195,100%,50%,0.4),0_0_40px_hsla(195,100%,50%,0.2)] hover:shadow-[0_0_30px_hsla(195,100%,50%,0.6),0_0_60px_hsla(195,100%,50%,0.3)]",
    gold: "shadow-[0_0_20px_hsla(45,100%,55%,0.4),0_0_40px_hsla(45,100%,55%,0.2)] hover:shadow-[0_0_30px_hsla(45,100%,55%,0.6),0_0_60px_hsla(45,100%,55%,0.3)]",
    outline: "hover:shadow-[0_0_20px_hsla(280,100%,60%,0.3)]",
    ghost: "",
  };

  return (
    <button
      className={cn(
        "relative font-orbitron font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95",
        variants[variant],
        sizes[size],
        glow && glowStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default NeonButton;
