import { forwardRef, useState } from "react";
import { cn } from "../../lib/utils";
import { Eye, EyeOff } from "lucide-react";

const NeonInput = forwardRef(({ 
  className, 
  type = "text", 
  icon: Icon,
  label,
  error,
  compact = false,
  ...props 
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <div className={compact ? "space-y-0.5" : "space-y-1.5 md:space-y-2"}>
      {label && (
        <label className={cn(
          "block font-medium text-muted-foreground uppercase tracking-wider",
          compact ? "text-[9px] md:text-[10px]" : "text-xs md:text-sm"
        )}>
          {label}
        </label>
      )}
      <div className="relative group">
        {/* Glow effect */}
        <div 
          className={cn(
            "absolute -inset-0.5 rounded-lg opacity-0 transition-opacity duration-300 blur-sm",
            "bg-gradient-to-r from-primary via-pink-500 to-secondary",
            isFocused && "opacity-50"
          )}
        />
        
        {/* Input container */}
        <div 
          className={cn(
            "relative flex items-center rounded-lg",
            "bg-card/80 border border-card-border",
            "transition-all duration-300",
            compact ? "gap-1.5 px-2 py-1.5 md:py-2" : "gap-2 md:gap-3 px-3 md:px-4 py-2.5 md:py-3",
            isFocused && "border-primary/50",
            error && "border-destructive/50"
          )}
        >
          {Icon && (
            <Icon className={cn(
              "text-secondary shrink-0",
              compact ? "w-3.5 h-3.5" : "w-4 h-4 md:w-5 md:h-5"
            )} />
          )}
          
          <input
            ref={ref}
            type={inputType}
            className={cn(
              "flex-1 bg-transparent border-none outline-none",
              "text-foreground placeholder:text-muted-foreground/50",
              compact ? "text-xs" : "font-mono text-sm",
              className
            )}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />

          {type === "password" && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? (
                <EyeOff className={compact ? "w-3.5 h-3.5" : "w-4 h-4 md:w-5 md:h-5"} />
              ) : (
                <Eye className={compact ? "w-3.5 h-3.5" : "w-4 h-4 md:w-5 md:h-5"} />
              )}
            </button>
          )}
        </div>
      </div>
      
      {error && (
        <p className={cn(
          "text-destructive",
          compact ? "text-[9px] md:text-[10px]" : "text-xs md:text-sm"
        )}>{error}</p>
      )}
    </div>
  );
});

NeonInput.displayName = "NeonInput";

export default NeonInput;
