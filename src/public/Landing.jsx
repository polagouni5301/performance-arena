import { useNavigate } from "react-router-dom";
import { ArrowRight, Trophy, Shield, Gift, Zap, Star, Crown, Lock, Sparkles, Users, Timer, Target } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import citySkylineBg from "@/assets/city-skyline-bg.jpg";
import CyberParticles from "@/components/effects/CyberParticles";
import ScanLines from "@/components/effects/ScanLines";
import DataStream from "@/components/effects/DataStream";

const Landing = () => {
  const navigate = useNavigate();
  const { user, loading, isAuthenticated } = useAuth();
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 12, seconds: 45 });

  const handleEnterArena = () => {
    if (loading) return;
    
    if (isAuthenticated) {
      const roleRoutes = {
        admin: '/admin',
        leadership: '/leadership',
        manager: '/manager',
        agent: '/agent'
      };
      navigate(roleRoutes[user.role] || '/login');
    } else {
      navigate('/login');
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        let { hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) { seconds = 59; minutes--; }
        if (minutes < 0) { minutes = 59; hours--; }
        if (hours < 0) { hours = 23; }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (num) => String(num).padStart(2, "0");

  const lootDrops = [
    {
      icon: Trophy,
      title: "Weekly Trophy",
      subtitle: "Dominance in the global leaderboard grants elite status.",
      rarity: "LEGENDARY",
      xpSync: 85,
      stats: "+500 XP",
      borderColor: "border-yellow-500/60",
      progressGradient: "from-yellow-500 via-orange-400 to-pink-500",
      badgeGradient: "from-yellow-600 via-yellow-500 to-amber-400",
      iconBg: "from-yellow-500 to-amber-600",
      glowColor: "rgba(234, 179, 8, 0.4)",
    },
    {
      icon: Shield,
      title: "Elite Guard",
      subtitle: "Showcase your mastery in defensive cyber-skills.",
      rarity: "EPIC",
      xpSync: 42,
      stats: "+15 DEF",
      borderColor: "border-cyan-500/60",
      progressGradient: "from-cyan-500 via-blue-500 to-purple-400",
      badgeGradient: "from-purple-600 via-purple-500 to-pink-500",
      iconBg: "from-blue-500 to-cyan-400",
      glowColor: "rgba(6, 182, 212, 0.4)",
    },
    {
      icon: Gift,
      title: "Mystery Drop",
      subtitle: "Discover rare items and quantum boosts inside.",
      rarity: "UNKNOWN",
      xpSync: 0,
      stats: "???",
      locked: true,
      borderColor: "border-pink-500/40",
      progressGradient: "from-gray-600 to-gray-700",
      badgeGradient: "from-pink-600 via-purple-500 to-pink-500",
      iconBg: "from-pink-500 to-purple-600",
      glowColor: "rgba(236, 72, 153, 0.4)",
    },
  ];

  return (
    <div className="min-h-screen h-screen flex flex-col relative overflow-hidden">
      {/* Cyberpunk City Skyline Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${citySkylineBg})` }}
      />

      {/* Dark gradient overlay for contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsla(260,50%,5%,0.75)] via-[hsla(260,40%,8%,0.6)] to-[hsla(260,50%,3%,0.9)]" />

      {/* Animated Effects */}
      <CyberParticles count={80} color="mixed" speed={0.4} connectDistance={100} />
      <DataStream side="left" speed={25} />
      <DataStream side="right" speed={30} />
      <ScanLines opacity={0.015} />

      {/* Floating orbs for depth */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          className="absolute top-20 left-1/4 w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, hsla(280, 100%, 50%, 0.15) 0%, transparent 70%)" }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-20 right-1/4 w-[400px] h-[400px] rounded-full"
          style={{ background: "radial-gradient(circle, hsla(180, 100%, 50%, 0.12) 0%, transparent 70%)" }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
        />
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center px-4 lg:px-6 py-6 overflow-y-auto">
        {/* System Status Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 px-5 py-2 rounded-full bg-[hsla(180,50%,20%,0.5)] border border-cyan-500/50 mb-6 backdrop-blur-md shadow-[0_0_30px_hsla(180,100%,50%,0.25)]"
        >
          <motion.span 
            className="w-2.5 h-2.5 rounded-full bg-cyan-400"
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span className="text-sm font-medium text-cyan-400 uppercase tracking-widest font-mono">
            System Online // Ready
          </span>
        </motion.div>

        {/* Main Title - Enhanced 3D Effect */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
          className="text-center mb-6 relative"
        >
          {/* Welcome text above */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xs lg:text-sm font-mono text-muted-foreground/60 tracking-[0.4em] uppercase mb-2"
          >
            Welcome To
          </motion.div>

          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-display font-black relative">
            {/* Shadow layers for 3D depth */}
            <span className="absolute inset-0 blur-sm opacity-30 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              gaMEtrix
            </span>
            
            <span className="relative inline-block">
              <span 
                className="bg-clip-text text-transparent"
                style={{
                  background: "linear-gradient(135deg, #06b6d4 0%, #8b5cf6 35%, #ec4899 65%, #f59e0b 100%)",
                  WebkitBackgroundClip: "text",
                  filter: "drop-shadow(0 0 40px hsla(280, 100%, 60%, 0.5))",
                }}
              >
                ga
              </span>
              <span className="text-white drop-shadow-[0_0_25px_hsla(0,0%,100%,0.6)]">ME</span>
              <span 
                className="bg-clip-text text-transparent"
                style={{
                  background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
                  WebkitBackgroundClip: "text",
                }}
              >
                trix
              </span>
            </span>
          </h1>

          {/* Tagline */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg sm:text-xl lg:text-2xl font-mono text-muted-foreground tracking-wider mt-4"
          >
            <span className="text-cyan-400 drop-shadow-[0_0_12px_hsla(180,100%,50%,0.8)]">&gt;</span> PERFORM.{" "}
            <span className="text-purple-400 drop-shadow-[0_0_12px_hsla(280,100%,60%,0.8)]">PLAY.</span>{" "}
            <span className="text-pink-400">PROSPER.</span>
            <motion.span 
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-purple-400"
            >_</motion.span>
          </motion.p>
        </motion.div>

        {/* CTA Row - Enhanced */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-4 lg:gap-6 mb-8 w-full max-w-4xl"
        >
          {/* Live Event Timer */}
          <div className="relative px-5 py-4 rounded-xl bg-[hsla(50,40%,12%,0.6)] border border-yellow-600/50 backdrop-blur-md shadow-[0_0_25px_hsla(45,100%,50%,0.2)]">
            <div className="absolute -top-2.5 left-4 px-3 py-0.5 bg-yellow-600/50 rounded-full text-[10px] font-mono text-yellow-300 tracking-widest">
              LIVE EVENT:
            </div>
            <div className="font-display text-2xl lg:text-3xl font-bold text-yellow-400 tracking-wider mt-1 drop-shadow-[0_0_20px_hsla(45,100%,50%,0.7)]">
              {formatTime(countdown.hours)}:{formatTime(countdown.minutes)}:{formatTime(countdown.seconds)}
            </div>
          </div>

          {/* Enter Arena Button - Premium */}
          <motion.button
            onClick={handleEnterArena}
            disabled={loading}
            whileHover={{ scale: 1.03, boxShadow: "0 0 60px hsla(280, 100%, 60%, 0.6)" }}
            whileTap={{ scale: 0.98 }}
            className={`group relative px-10 lg:px-14 py-5 font-display font-bold text-base lg:text-lg tracking-widest text-white
                       bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 bg-[length:200%_auto]
                       rounded-xl overflow-hidden transition-all duration-500
                       border border-purple-400/50 shadow-[0_0_40px_hsla(280,100%,60%,0.45)]
                       ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-right cursor-pointer'}`}
          >
            {/* Animated shine */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              initial={{ x: "-200%" }}
              animate={{ x: "200%" }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />

            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-purple-300/70" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-purple-300/70" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-purple-300/70" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-purple-300/70" />

            <span className="relative flex items-center gap-3 drop-shadow-[0_0_15px_hsla(0,0%,100%,0.6)]">
              ENTER THE ARENA
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </motion.button>

          {/* Squad Status */}
          <div className="relative px-5 py-4 rounded-xl bg-[hsla(170,40%,12%,0.5)] border border-cyan-500/50 backdrop-blur-md shadow-[0_0_25px_hsla(180,100%,50%,0.15)]">
            <div className="absolute -top-2.5 left-4 px-3 py-0.5 bg-cyan-600/40 rounded-full text-[10px] font-mono text-cyan-300 tracking-widest">
              SQUAD STATUS:
            </div>
            <div className="font-display text-xl lg:text-2xl font-bold mt-1 flex items-center gap-2">
              <span className="text-green-400 drop-shadow-[0_0_15px_hsla(145,100%,50%,0.9)]">ONLINE</span>
              <span className="text-muted-foreground/70 text-lg">(3/4)</span>
            </div>
          </div>
        </motion.div>

        {/* Premium Loot Drops Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="w-full max-w-6xl"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <motion.div 
                className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-[0_0_25px_hsla(280,100%,60%,0.5)]"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <Gift className="w-5 h-5 text-white" />
              </motion.div>
              <h2 className="text-xl lg:text-2xl font-display font-bold text-foreground uppercase tracking-widest">
                Premium Loot Drops
              </h2>
            </div>
            <p className="text-xs font-mono text-muted-foreground/60 hidden sm:block">
              REFRESH_RATE: <span className="text-cyan-400/60">144HZ</span>
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {lootDrops.map((drop, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className={`relative group rounded-2xl overflow-hidden ${drop.borderColor} border-2
                           bg-gradient-to-b from-[hsla(260,35%,14%,0.98)] to-[hsla(260,30%,6%,0.99)]
                           backdrop-blur-xl transition-all duration-300
                           shadow-[0_0_30px_hsla(280,100%,50%,0.15)]`}
                style={{
                  boxShadow: `0 0 40px ${drop.glowColor}`,
                }}
              >
                {/* Tech corner accents */}
                <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-current opacity-40" />
                <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-current opacity-40" />
                <div className="absolute bottom-12 left-0 w-6 h-6 border-b-2 border-l-2 border-current opacity-40" />
                <div className="absolute bottom-12 right-0 w-6 h-6 border-b-2 border-r-2 border-current opacity-40" />

                <div className="p-6 pb-14">
                  {/* Icon with glow */}
                  <div className="flex justify-center mb-5 relative">
                    <motion.div 
                      className="relative"
                      animate={!drop.locked ? { y: [0, -5, 0] } : {}}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      {/* Pulsing glow */}
                      <motion.div
                        className={`absolute inset-0 blur-2xl opacity-60 bg-gradient-to-br ${drop.iconBg} scale-150`}
                        animate={{ scale: [1.4, 1.6, 1.4], opacity: [0.4, 0.6, 0.4] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      />
                      <div className={`relative w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-gradient-to-br ${drop.iconBg} 
                                      flex items-center justify-center shadow-2xl`}>
                        {drop.locked ? (
                          <div className="relative">
                            <Gift className="w-10 h-10 lg:w-12 lg:h-12 text-white/80" />
                            <motion.div 
                              className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center shadow-[0_0_15px_hsla(330,100%,60%,0.9)]"
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            >
                              <span className="text-xs text-white">✨</span>
                            </motion.div>
                          </div>
                        ) : (
                          <drop.icon className="w-10 h-10 lg:w-12 lg:h-12 text-white drop-shadow-2xl" />
                        )}
                      </div>
                    </motion.div>
                  </div>

                  {/* Content */}
                  <div className="text-center mb-5">
                    <h3 className="text-lg lg:text-xl font-display font-bold text-foreground mb-2 flex items-center justify-center gap-2">
                      {drop.title}
                      {drop.locked ? (
                        <span className="text-pink-400 text-lg">?</span>
                      ) : (
                        <Shield className="w-4 h-4 text-cyan-400 drop-shadow-[0_0_8px_hsla(180,100%,50%,0.9)]" />
                      )}
                    </h3>
                    <p className="text-sm text-muted-foreground/80 leading-relaxed">{drop.subtitle}</p>
                  </div>

                  {/* XP Sync Bar */}
                  <div>
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-muted-foreground/70 uppercase tracking-widest font-mono">
                        XP Synchronization
                      </span>
                      <span className={drop.locked ? "text-pink-400" : "text-cyan-400"}>
                        {drop.locked ? "LOCKED" : `${drop.xpSync}%`}
                      </span>
                    </div>
                    <div className="h-2 bg-[hsla(260,30%,15%,0.9)] rounded-full overflow-hidden border border-purple-500/20">
                      <motion.div
                        className={`h-full bg-gradient-to-r ${drop.progressGradient} rounded-full relative`}
                        initial={{ width: 0 }}
                        animate={{ width: drop.locked ? "0%" : `${drop.xpSync}%` }}
                        transition={{ duration: 1.5, delay: 0.8 + index * 0.1 }}
                        style={{ boxShadow: "0 0 15px hsla(280, 100%, 60%, 0.6)" }}
                      >
                        {!drop.locked && (
                          <motion.div 
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                            animate={{ x: ["-100%", "200%"] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          />
                        )}
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Bottom Rarity Badge */}
                <div className={`absolute bottom-0 left-0 right-0 py-3 px-6 bg-gradient-to-r ${drop.badgeGradient}
                                flex items-center justify-between`}>
                  <span className="text-sm font-bold text-white tracking-widest uppercase drop-shadow-lg">
                    {drop.rarity}
                  </span>
                  <span className="text-sm font-bold text-white/90">{drop.stats}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Stats Row */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex items-center gap-8 mt-8 text-sm font-mono text-muted-foreground/50"
        >
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>2,847 Active</span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            <span>12 Contests Live</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>$45K Rewards</span>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Landing;
