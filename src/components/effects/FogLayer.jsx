const FogLayer = () => {
    return (
      <div className="pointer-events-none absolute inset-0 z-[6] overflow-hidden">
        {/* Base dense fog */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            height: "50%",
            background:
              "linear-gradient(to top, rgba(10,5,20,0.95), rgba(90,70,150,0.45), transparent)",
            filter: "blur(120px)",
          }}
        />
  
        {/* Fog layer 1 */}
        <div
          style={{
            position: "absolute",
            bottom: "-25%",
            left: "-30%",
            width: "140%",
            height: "70%",
            background:
              "radial-gradient(ellipse at center, rgba(120,90,200,0.45), transparent 70%)",
            filter: "blur(100px)",
            opacity: 0.6,
            animation: "fogMove1 90s linear infinite",
          }}
        />
  
        {/* Fog layer 2 */}
        <div
          style={{
            position: "absolute",
            bottom: "-30%",
            left: "-15%",
            width: "140%",
            height: "70%",
            background:
              "radial-gradient(ellipse at center, rgba(100,140,220,0.35), transparent 70%)",
            filter: "blur(120px)",
            opacity: 0.45,
            animation: "fogMove2 120s linear infinite",
          }}
        />
  
        {/* Inline keyframes */}
        <style>
          {`
            @keyframes fogMove1 {
              from { transform: translateX(0); }
              to { transform: translateX(25%); }
            }
  
            @keyframes fogMove2 {
              from { transform: translateX(0); }
              to { transform: translateX(15%); }
            }
          `}
        </style>
      </div>
    );
  };
  
  export default FogLayer;
  