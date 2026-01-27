
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, Database, Zap, Activity, Lock, CircuitBoard, Wifi, Trophy, Gamepad2, Flame } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import GamifiedBackground from "@/components/effects/GamifiedBackground";
import techGamerHero from "@/assets/tech-gamer-hero.png";

const PHASES = [
  { label: "INITIALIZING NEURAL LINK", icon: Cpu, color: "text-secondary" },
  { label: "SYNCING PERFORMANCE DATA", icon: Database, color: "text-primary" },
  { label: "CALIBRATING XP MATRIX", icon: Zap, color: "text-warning" },
  { label: "LOADING PLAYER PROFILE", icon: Activity, color: "text-accent" },
  { label: "ESTABLISHING SECURE TUNNEL", icon: Lock, color: "text-success" },
  { label: "ARENA READY", icon: Trophy, color: "text-foreground" },
];

const TERMINAL_LINES = [
  "> init_neural_link --secure",
  "> auth.verify_session(token)",
  "> db.sync_performance_data()",
  "> load_xp_matrix --calibrate",
  "> cache.preload_assets()",
  "> tunnel.establish('arena-west')",
  "> SYSTEM READY ✓",
];

const TIPS = [
  "Complete daily missions for bonus XP multipliers",
  "Top 3 players receive legendary rewards each week",
  "Streaks multiply your earnings—don't break the chain!",
  "Scratch cards refresh every 4 hours",
  "Check the armory for exclusive unlockable relics",
];

const ArenaLoading = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [terminalLines, setTerminalLines] = useState([]);
  const [currentTip, setCurrentTip] = useState(0);
  const [targetRoute, setTargetRoute] = useState('/agent');

  useEffect(() => {
    const storedRole = localStorage.getItem('targetRole');
    const role = storedRole || user?.role || 'agent';
    
    const roleRoutes = {
      agent: '/agent',
      manager: '/manager',
      leadership: '/leadership',
      admin: '/admin'
    };
    
    setTargetRoute(roleRoutes[role] || '/agent');
    if (storedRole) localStorage.removeItem('targetRole');
  }, [user]);

  useEffect(() => {
    const duration = 4000;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => navigate(targetRoute), 400);
          return 100;
        }
        return prev + 100 / (duration / 40);
      });
    }, 40);
    return () => clearInterval(interval);
  }, [navigate, targetRoute]);

  useEffect(() => {
    const phaseIndex = Math.min(Math.floor(progress / (100 / PHASES.length)), PHASES.length - 1);
    setCurrentPhase(phaseIndex);
  }, [progress]);

  useEffect(() => {
    const lineIndex = Math.floor((progress / 100) * TERMINAL_LINES.length);
    if (lineIndex > terminalLines.length && lineIndex <= TERMINAL_LINES.length) {
      setTerminalLines((prev) => [...prev, TERMINAL_LINES[lineIndex - 1]]);
    }
  }, [progress, terminalLines.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % TIPS.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-background flex items-center justify-center overflow-hidden">
      {/* Shared Gamified Background */}
      <GamifiedBackground
        variant="intense"
        showGrid={true}
        showOrbs={true}
        showParticles={true}
        showDataStreams={true}
        primaryColor="320, 100%, 55%"
        secondaryColor="195, 100%, 50%"
      />

      {/* Main content */}
      <div className="relative z-10 w-full max-w-lg mx-auto px-4 sm:px-6 text-center">
        {/* Logo & rings */}
        <motion.div className="relative mb-6 sm:mb-8 flex justify-center">
          {/* Outer rings */}
          <motion.div
            className="absolute w-28 h-28 sm:w-36 sm:h-36 rounded-full border border-primary/30"
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          >
            {[0, 90, 180, 270].map((deg) => (
              <motion.div
                key={deg}
                className="absolute w-2 h-2 rounded-full bg-primary"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `rotate(${deg}deg) translateX(56px) translateY(-50%)`,
                }}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: deg / 360 }}
              />
            ))}
          </motion.div>
          
          <motion.div
            className="absolute w-36 h-36 sm:w-44 sm:h-44 rounded-full border border-secondary/20"
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          />

          {/* Core */}
          <motion.div
            className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-primary via-pink-600 to-primary flex items-center justify-center"
            animate={{
              boxShadow: [
                "0 0 30px hsla(320,100%,55%,0.4)",
                "0 0 60px hsla(320,100%,55%,0.6)",
                "0 0 30px hsla(320,100%,55%,0.4)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Gamepad2 className="w-9 h-9 sm:w-11 sm:h-11 text-white" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.h1 
          className="font-display text-2xl sm:text-3xl text-foreground mb-1 tracking-widest"
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          ENTERING ARENA
        </motion.h1>
        
        {/* Phase */}
        <AnimatePresence mode="wait">
          <motion.p
            key={currentPhase}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className={`text-xs sm:text-sm font-mono tracking-wider mb-6 ${PHASES[currentPhase]?.color}`}
          >
            {PHASES[currentPhase]?.label}
          </motion.p>
        </AnimatePresence>

        {/* Progress card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/40 mb-4">
          {/* Progress bar */}
          <div className="relative h-2.5 sm:h-3 bg-muted/40 rounded-full overflow-hidden mb-3">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary via-pink-500 to-secondary rounded-full"
              style={{ width: `${progress}%` }}
            />
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
          </div>

          {/* Stats row */}
          <div className="flex items-center justify-between text-[10px] sm:text-xs font-mono">
            <span className="text-muted-foreground">
              STATUS: <span className="text-success">ONLINE</span>
            </span>
            <span className="font-display text-xl sm:text-2xl text-foreground font-bold">
              {Math.round(progress)}%
            </span>
            <span className="text-muted-foreground">
              PING: <span className="text-secondary">{12 + Math.floor(progress / 10)}ms</span>
            </span>
          </div>
        </div>

        {/* Terminal */}
        <motion.div
          className="p-3 sm:p-4 rounded-xl bg-card/40 backdrop-blur-md border border-border/30 mb-4 text-left"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex gap-1.5 mb-2">
            <span className="w-2 h-2 rounded-full bg-destructive/70" />
            <span className="w-2 h-2 rounded-full bg-warning/70" />
            <span className="w-2 h-2 rounded-full bg-success/70" />
          </div>
          <div className="font-mono text-[9px] sm:text-[10px] text-muted-foreground/80 space-y-0.5 h-16 overflow-hidden">
            {terminalLines.slice(-5).map((line, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className={line.includes("READY") ? "text-success font-semibold" : ""}
              >
                {line}
              </motion.p>
            ))}
            <motion.span 
              className="inline-block w-1.5 h-3 bg-primary"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
          </div>
        </motion.div>

        {/* Tip */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTip}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center justify-center gap-2 text-[10px] sm:text-xs text-muted-foreground/70"
          >
            <Flame className="w-3 h-3 text-warning" />
            <span>{TIPS[currentTip]}</span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Side panels - Desktop */}
      <SidePanels progress={progress} />

      {/* Corner decorations */}
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <motion.div 
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Gamepad2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </motion.div>
        <span className="hidden sm:block font-display font-bold text-sm text-foreground">
          ga<span className="text-primary">ME</span>trix
        </span>
      </div>

      <div className="absolute top-4 right-4 flex items-center gap-2 text-[10px] sm:text-xs">
        <motion.span 
          className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-success"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <span className="text-success font-semibold">CONNECTED</span>
      </div>

      {/* Tech hero silhouette */}
      <motion.img
        src={techGamerHero}
        alt=""
        className="absolute bottom-0 right-0 w-[380px] max-w-[50vw] opacity-15 pointer-events-none"
        style={{ filter: "drop-shadow(0 0 60px hsl(var(--secondary) / 0.15))" }}
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
};

const SidePanels = ({ progress }) => (
  <>
    <motion.div
      className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-3"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
    >
      <StatCard
        icon={CircuitBoard}
        label="Neural Link"
        value={`${Math.min(Math.round(progress * 1.1), 100)}%`}
        color="purple"
        showProgress
        progressValue={Math.min(progress * 1.1, 100)}
      />
      <StatCard
        icon={Lock}
        label="Security"
        value="AES-256"
        color="green"
      />
    </motion.div>

    <motion.div
      className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-3 items-end"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
    >
      <StatCard
        icon={Wifi}
        label="Latency"
        value={`${12 + Math.floor(Math.random() * 4)}ms`}
        color="cyan"
      />
      <StatCard
        icon={Activity}
        label="Throughput"
        value={`${(2.1 + Math.random() * 0.5).toFixed(1)}MB/s`}
        color="pink"
      />
    </motion.div>
  </>
);

const StatCard = ({ icon: Icon, label, value, color, showProgress, progressValue }) => {
  const colors = {
    purple: { border: "border-primary/30", text: "text-primary", bg: "from-primary to-pink-500" },
    green: { border: "border-success/30", text: "text-success", bg: "from-success to-emerald-500" },
    cyan: { border: "border-secondary/30", text: "text-secondary", bg: "from-secondary to-blue-500" },
    pink: { border: "border-pink-500/30", text: "text-pink-400", bg: "from-pink-500 to-rose-500" },
  };

  const c = colors[color];

  return (
    <div className={`p-3 rounded-xl bg-card/40 backdrop-blur-md border ${c.border}`}>
      <div className="flex items-center gap-2 mb-1.5">
        <Icon className={`w-3.5 h-3.5 ${c.text}`} />
        <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider">{label}</span>
      </div>
      {showProgress ? (
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-muted/30 rounded-full overflow-hidden">
            <motion.div
              className={`h-full bg-gradient-to-r ${c.bg} rounded-full`}
              animate={{ width: `${progressValue}%` }}
            />
          </div>
          <span className={`text-xs font-mono ${c.text}`}>{value}</span>
        </div>
      ) : (
        <p className={`font-display text-lg ${c.text}`}>{value}</p>
      )}
    </div>
  );
};

export default ArenaLoading;
