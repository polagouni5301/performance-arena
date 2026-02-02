const FloatingOrbs = ({ count = 5 }) => {
  const orbs = Array.from({ length: count }, (_, i) => ({
    id: i,
    size: 100 + Math.random() * 200,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: 15 + Math.random() * 10,
    delay: Math.random() * 5,
    color: ['purple', 'cyan', 'pink'][Math.floor(Math.random() * 3)],
  }));

  const colorClasses = {
    purple: "bg-purple-500/20",
    cyan: "bg-cyan-500/20", 
    pink: "bg-pink-500/20",
  };

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {orbs.map(orb => (
        <div
          key={orb.id}
          className={`absolute rounded-full ${colorClasses[orb.color]} blur-[80px]`}
          style={{
            width: orb.size,
            height: orb.size,
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            animation: `floatOrb ${orb.duration}s ease-in-out infinite`,
            animationDelay: `${orb.delay}s`,
          }}
        />
      ))}
      
      <style>{`
        @keyframes floatOrb {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.3;
          }
          25% {
            transform: translate(30px, -50px) scale(1.1);
            opacity: 0.5;
          }
          50% {
            transform: translate(-20px, -30px) scale(0.9);
            opacity: 0.4;
          }
          75% {
            transform: translate(40px, 20px) scale(1.05);
            opacity: 0.35;
          }
        }
      `}</style>
    </div>
  );
};

export default FloatingOrbs;