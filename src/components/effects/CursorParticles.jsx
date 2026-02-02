import { useEffect, useState, useCallback, useRef } from "react";

const CursorParticles = () => {
  const [particles, setParticles] = useState([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const particleIdRef = useRef(0);

  const createParticle = useCallback((x, y) => {
    const particle = {
      id: particleIdRef.current++,
      x,
      y,
      size: Math.random() * 6 + 3,
      color: ['hsl(280, 100%, 60%)', 'hsl(180, 100%, 50%)', 'hsl(320, 100%, 60%)', 'hsl(45, 100%, 55%)'][Math.floor(Math.random() * 4)],
      vx: (Math.random() - 0.5) * 3,
      vy: (Math.random() - 0.5) * 3,
      life: 1,
      decay: 0.02 + Math.random() * 0.02
    };
    return particle;
  }, []);

  useEffect(() => {
    let lastTime = 0;
    const throttleMs = 30;

    const handleMouseMove = (e) => {
      const now = Date.now();
      if (now - lastTime < throttleMs) return;
      lastTime = now;

      setMousePos({ x: e.clientX, y: e.clientY });
      
      // Create 2-4 particles per move
      const newParticles = [];
      const count = Math.floor(Math.random() * 3) + 2;
      for (let i = 0; i < count; i++) {
        newParticles.push(createParticle(e.clientX, e.clientY));
      }
      setParticles(prev => [...prev.slice(-50), ...newParticles]);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [createParticle]);

  useEffect(() => {
    const animate = () => {
      setParticles(prev => 
        prev
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            life: p.life - p.decay,
            vy: p.vy + 0.1 // gravity
          }))
          .filter(p => p.life > 0)
      );
    };

    const interval = setInterval(animate, 16);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {/* Cursor glow */}
      <div 
        className="absolute w-32 h-32 rounded-full pointer-events-none transition-opacity duration-100"
        style={{
          left: mousePos.x - 64,
          top: mousePos.y - 64,
          background: 'radial-gradient(circle, hsla(280, 100%, 60%, 0.15) 0%, transparent 70%)',
          filter: 'blur(20px)'
        }}
      />
      
      {/* Particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            opacity: particle.life,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
    </div>
  );
};

export default CursorParticles;