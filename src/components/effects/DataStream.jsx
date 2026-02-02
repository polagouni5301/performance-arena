import { useEffect, useState } from "react";

const DataStream = ({ side = "left", speed = 30 }) => {
  const [streams, setStreams] = useState([]);

  useEffect(() => {
    const chars = "01アイウエオカキクケコ10サシスセソタチツテト";
    const streamCount = 8;
    
    const newStreams = Array.from({ length: streamCount }, (_, i) => ({
      id: i,
      chars: Array.from({ length: 15 + Math.floor(Math.random() * 10) }, () => 
        chars[Math.floor(Math.random() * chars.length)]
      ),
      x: (i / streamCount) * 100,
      speed: speed + Math.random() * 20,
      delay: Math.random() * 5,
    }));
    
    setStreams(newStreams);
  }, [speed]);

  return (
    <div 
      className={`absolute ${side === 'left' ? 'left-0' : 'right-0'} top-0 bottom-0 w-16 overflow-hidden pointer-events-none opacity-30`}
    >
      {streams.map(stream => (
        <div
          key={stream.id}
          className="absolute text-cyan-500/60 font-mono text-xs whitespace-nowrap"
          style={{
            left: side === 'left' ? `${stream.x}%` : 'auto',
            right: side === 'right' ? `${stream.x}%` : 'auto',
            animation: `dataFall ${stream.speed}s linear infinite`,
            animationDelay: `${stream.delay}s`,
          }}
        >
          {stream.chars.map((char, i) => (
            <div 
              key={i} 
              className="leading-4"
              style={{ 
                opacity: 1 - (i / stream.chars.length) * 0.7,
                textShadow: i === 0 ? '0 0 10px currentColor' : 'none'
              }}
            >
              {char}
            </div>
          ))}
        </div>
      ))}
      
      <style>{`
        @keyframes dataFall {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
      `}</style>
    </div>
  );
};

export default DataStream;