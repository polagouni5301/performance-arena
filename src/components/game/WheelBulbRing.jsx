import { motion } from "framer-motion";

const WheelBulbRing = ({ count = 28, spinning = false, radius = 175 }) => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {Array.from({ length: count }).map((_, i) => {
        const angle = (360 / count) * i;
        const delay = i * 0.025;
        const isEven = i % 2 === 0;
        
        return (
          <motion.div
            key={i}
            className="absolute left-1/2 top-1/2"
            style={{
              transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-${radius}px)`,
            }}
          >
            {/* Outer glow ring */}
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={
                spinning
                  ? {
                      scale: [1, 1.8, 1],
                      opacity: [0.3, 0.7, 0.3],
                    }
                  : {
                      scale: 1.3,
                      opacity: 0.4,
                    }
              }
              transition={
                spinning
                  ? { duration: 0.6, repeat: Infinity, delay: delay * 0.5 }
                  : { duration: 0.6 }
              }
              style={{
                width: 16,
                height: 16,
                marginLeft: -5,
                marginTop: -5,
                background: isEven 
                  ? "radial-gradient(circle, hsl(var(--primary) / 0.6) 0%, transparent 70%)"
                  : "radial-gradient(circle, hsl(var(--secondary) / 0.6) 0%, transparent 70%)",
                filter: "blur(4px)",
              }}
            />
            
            {/* Main bulb */}
            <motion.div
              className="relative rounded-full border"
              animate={
                spinning
                  ? {
                      opacity: [0.4, 1, 0.4],
                      scale: [0.9, 1.2, 0.9],
                      boxShadow: isEven
                        ? [
                            "0 0 4px hsl(var(--primary) / 0.3), inset 0 0 3px hsl(var(--primary) / 0.2)",
                            "0 0 20px hsl(var(--primary) / 0.8), 0 0 35px hsl(var(--primary) / 0.5), inset 0 0 8px hsl(var(--primary) / 0.6)",
                            "0 0 4px hsl(var(--primary) / 0.3), inset 0 0 3px hsl(var(--primary) / 0.2)",
                          ]
                        : [
                            "0 0 4px hsl(var(--secondary) / 0.3), inset 0 0 3px hsl(var(--secondary) / 0.2)",
                            "0 0 20px hsl(var(--secondary) / 0.8), 0 0 35px hsl(var(--secondary) / 0.5), inset 0 0 8px hsl(var(--secondary) / 0.6)",
                            "0 0 4px hsl(var(--secondary) / 0.3), inset 0 0 3px hsl(var(--secondary) / 0.2)",
                          ],
                    }
                  : {
                      opacity: 0.7,
                      scale: 1,
                      boxShadow: isEven
                        ? "0 0 12px hsl(var(--primary) / 0.4), inset 0 0 4px hsl(var(--primary) / 0.3)"
                        : "0 0 12px hsl(var(--secondary) / 0.4), inset 0 0 4px hsl(var(--secondary) / 0.3)",
                    }
              }
              transition={
                spinning
                  ? { duration: 0.5, repeat: Infinity, delay }
                  : { duration: 0.6 }
              }
              style={{
                width: 10,
                height: 10,
                background: isEven
                  ? "radial-gradient(circle at 30% 30%, hsl(var(--primary-glow)) 0%, hsl(var(--primary)) 50%, hsl(var(--primary) / 0.8) 100%)"
                  : "radial-gradient(circle at 30% 30%, hsl(var(--secondary-glow)) 0%, hsl(var(--secondary)) 50%, hsl(var(--secondary) / 0.8) 100%)",
                borderColor: isEven ? "hsl(var(--primary) / 0.6)" : "hsl(var(--secondary) / 0.6)",
              }}
            >
              {/* Inner highlight */}
              <div 
                className="absolute top-0.5 left-0.5 w-2 h-2 rounded-full"
                style={{
                  background: "radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)",
                }}
              />
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default WheelBulbRing;
