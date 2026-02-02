const ScanLines = ({ opacity = 0.03, animated = true }) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
      {/* CRT scanlines effect */}
      <div 
        className="absolute inset-0"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 0, 0, ${opacity}) 2px,
            rgba(0, 0, 0, ${opacity}) 4px
          )`,
        }}
      />
      
      {/* Horizontal scan beam */}
      {animated && (
        <div 
          className="absolute left-0 right-0 h-32 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent"
          style={{
            animation: 'scanBeam 8s linear infinite',
          }}
        />
      )}
      
      {/* Vignette effect */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, transparent 50%, rgba(0,0,0,0.4) 100%)',
        }}
      />
      
      <style>{`
        @keyframes scanBeam {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
      `}</style>
    </div>
  );
};

export default ScanLines;