const NeonGrid = ({ opacity = 0.15, animated = true }) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Horizontal scanning line */}
      {animated && (
        <div 
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent animate-scan-line"
          style={{ animationDuration: '4s' }}
        />
      )}
      
      {/* Grid pattern */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(hsla(280, 100%, 50%, ${opacity}) 1px, transparent 1px),
            linear-gradient(90deg, hsla(280, 100%, 50%, ${opacity}) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
      
      {/* Perspective grid at bottom */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-64 opacity-30"
        style={{
          background: `
            linear-gradient(transparent, hsla(280, 50%, 10%, 0.8)),
            repeating-linear-gradient(
              90deg,
              hsla(280, 100%, 50%, 0.1) 0px,
              hsla(280, 100%, 50%, 0.1) 1px,
              transparent 1px,
              transparent 60px
            )
          `,
          transform: 'perspective(500px) rotateX(60deg)',
          transformOrigin: 'bottom center'
        }}
      />
    </div>
  );
};

export default NeonGrid;