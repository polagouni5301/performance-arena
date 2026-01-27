const NeonGlow = ({ 
  position = "top-center", 
  color = "purple",
  size = "large",
  animated = true 
}) => {
  const positions = {
    "top-left": "top-0 left-0 -translate-x-1/2 -translate-y-1/2",
    "top-center": "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2",
    "top-right": "top-0 right-0 translate-x-1/2 -translate-y-1/2",
    "center": "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
    "bottom-left": "bottom-0 left-0 -translate-x-1/2 translate-y-1/2",
    "bottom-center": "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2",
    "bottom-right": "bottom-0 right-0 translate-x-1/2 translate-y-1/2",
  };

  const colors = {
    purple: "from-purple-600/40 via-pink-500/20 to-transparent",
    cyan: "from-cyan-500/40 via-blue-500/20 to-transparent",
    pink: "from-pink-500/40 via-purple-500/20 to-transparent",
    mixed: "from-purple-600/30 via-cyan-500/20 to-pink-500/10",
  };

  const sizes = {
    small: "w-64 h-64",
    medium: "w-[400px] h-[400px]",
    large: "w-[600px] h-[600px]",
    xlarge: "w-[800px] h-[800px]",
  };

  return (
    <div 
      className={`absolute ${positions[position]} ${sizes[size]} 
                  rounded-full bg-gradient-radial ${colors[color]} 
                  blur-[100px] pointer-events-none
                  ${animated ? 'animate-pulse-glow' : ''}`}
    />
  );
};

export default NeonGlow;