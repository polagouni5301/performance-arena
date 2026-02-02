/**
 * Neural Sync Loader - Immersive loading component with diagnostics
 */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, Database, Zap, Activity, Lock, Server, Wifi, Shield, Terminal, Binary, CircuitBoard } from "lucide-react";

const DIAGNOSTICS = [
  "> init_neural_link --secure",
  "> auth.verify_session(token)",
  "> db.sync_performance_data()",
  "> load_xp_matrix --calibrate",
  "> decrypt_player_profile(AES-256)",
  "> cache.preload_assets()",
  "> tunnel.establish('arena-west')",
  "> render.optimize_pipeline()",
  "> SYSTEM READY",
];

const TIPS = [
  "Complete daily missions for bonus XP multipliers",
  "Top 3 players receive legendary rewards each week",
  "Streaks multiply your earnings—don't break the chain!",
  "Scratch cards refresh every 4 hours",
  "Check the armory for exclusive unlockable relics",
];

const NeuralSyncLoader = ({ onComplete, duration = 4000, showDiagnostics = true, showTips = true }) => {
  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [terminalLines, setTerminalLines] = useState([]);
  const [currentTip, setCurrentTip] = useState(0);

  const phases = [
    { label: "INITIALIZING NEURAL LINK", icon: Cpu, color: "text-secondary" },
    { label: "SYNCING PERFORMANCE DATA", icon: Database, color: "text-primary" },
    { label: "CALIBRATING XP MATRIX", icon: Zap, color: "text-warning" },
    { label: "LOADING PLAYER PROFILE", icon: Activity, color: "text-accent" },
    { label: "ESTABLISHING SECURE TUNNEL", icon: Lock, color: "text-success" },
    { label: "ARENA READY", icon: Server, color: "text-foreground" },
  ];

  // Progress timer
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          onComplete?.();
          return 100;
        }
        return prev + 100 / (duration / 50);
      });
    }, 50);
    return () => clearInterval(interval);
  }, [duration, onComplete]);

  // Phase updates
  useEffect(() => {
    const phaseIndex = Math.min(Math.floor(progress / (100 / phases.length)), phases.length - 1);
    setCurrentPhase(phaseIndex);
  }, [progress, phases.length]);

  // Terminal output
  useEffect(() => {
    if (!showDiagnostics) return;
    const lineIndex = Math.floor((progress / 100) * DIAGNOSTICS.length);
    if (lineIndex > terminalLines.length && lineIndex <= DIAGNOSTICS.length) {
      setTerminalLines((prev) => [...prev, DIAGNOSTICS[lineIndex - 1]]);
    }
  }, [progress, showDiagnostics, terminalLines.length]);

  // Tip rotation
  useEffect(() => {
    if (!showTips) return;
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % TIPS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [showTips]);

  const CurrentIcon = phases[currentPhase]?.icon || Cpu;

  return (
    <div className="fixed inset-0 z-[100] bg-background flex items-center justify-center overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, hsl(var(--primary)) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(var(--primary)) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Data streams */}
      <DataStreams />

      {/* Central glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[180px] bg-primary/10" />

      {/* Main content */}
      <div className="relative z-10 max-w-lg mx-auto px-6 text-center">
        {/* Animated core */}
        <motion.div className="relative mb-8 flex justify-center">
          {/* Rotating rings */}
          <motion.div
            className="absolute w-28 h-28 rounded-full border border-primary/20"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute w-36 h-36 rounded-full border border-secondary/15"
            animate={{ rotate: -360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          />

          {/* Core icon */}
          <motion.div
            className="relative w-20 h-20 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center"
            animate={{
              boxShadow: [
                "0 0 30px hsla(320,100%,55%,0.4)",
                "0 0 50px hsla(320,100%,55%,0.6)",
                "0 0 30px hsla(320,100%,55%,0.4)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <CurrentIcon className="w-9 h-9 text-white" />
          </motion.div>
        </motion.div>

        {/* Title */}
        <h2 className="font-display text-2xl text-foreground mb-3 tracking-widest">NEURAL SYNC</h2>

        {/* Phase label */}
        <AnimatePresence mode="wait">
          <motion.p
            key={currentPhase}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`font-oxanium text-sm tracking-wider mb-6 ${phases[currentPhase]?.color}`}
          >
            {phases[currentPhase]?.label}
          </motion.p>
        </AnimatePresence>

        {/* Progress bar */}
        <div className="arena-panel p-4 mb-6">
          <div className="relative h-3 bg-muted/30 rounded-full overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary via-secondary to-accent rounded-full"
              style={{ width: `${progress}%` }}
            />
            {/* Shimmer */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            {/* Progress dot */}
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white shadow-[0_0_12px_white] border-2 border-primary"
              style={{ left: `calc(${Math.min(progress, 96)}% - 8px)` }}
            />
          </div>

          <div className="flex justify-between mt-3 text-[10px] font-mono text-muted-foreground">
            <span>
              SYNC: <span className="text-success">ACTIVE</span>
            </span>
            <span className="font-display text-lg text-foreground">{Math.round(progress)}%</span>
            <span>
              BUFFER: <span className="text-secondary">STABLE</span>
            </span>
          </div>
        </div>

        {/* Terminal (diagnostics) */}
        {showDiagnostics && (
          <motion.div
            className="arena-panel p-3 mb-4 text-left max-h-24 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex gap-1.5 mb-2">
              <span className="w-2 h-2 rounded-full bg-destructive/60" />
              <span className="w-2 h-2 rounded-full bg-warning/60" />
              <span className="w-2 h-2 rounded-full bg-success/60" />
            </div>
            <div className="font-mono text-[9px] text-muted-foreground/70 space-y-0.5">
              {terminalLines.slice(-4).map((line, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={line.includes("READY") ? "text-success" : ""}
                >
                  {line}
                </motion.p>
              ))}
              <span className="inline-block w-2 h-3 bg-secondary animate-pulse" />
            </div>
          </motion.div>
        )}

        {/* Tips carousel */}
        {showTips && (
          <AnimatePresence mode="wait">
            <motion.p
              key={currentTip}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-xs text-muted-foreground/60 font-mono"
            >
              💡 {TIPS[currentTip]}
            </motion.p>
          </AnimatePresence>
        )}
      </div>

      {/* Side diagnostics */}
      <SideDiagnostics progress={progress} />
    </div>
  );
};

// Data stream animation
const DataStreams = () => {
  const [streams, setStreams] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setStreams((prev) => {
        const newStreams = [
          ...prev,
          {
            id: Date.now(),
            x: Math.random() * 100,
            delay: Math.random() * 0.5,
          },
        ];
        return newStreams.slice(-15);
      });
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {streams.map((stream) => (
        <motion.div
          key={stream.id}
          className="absolute w-0.5 h-8 bg-gradient-to-b from-secondary via-secondary to-transparent"
          initial={{ top: -32, left: `${stream.x}%`, opacity: 0.7 }}
          animate={{ top: "100%", opacity: 0 }}
          transition={{ duration: 1.5, ease: "linear", delay: stream.delay }}
        />
      ))}
    </div>
  );
};

// Side diagnostic panels
const SideDiagnostics = ({ progress }) => (
  <>
    {/* Left panel */}
    <motion.div
      className="absolute left-4 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-3"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="arena-panel p-2.5 border border-secondary/30 w-40">
        <div className="flex items-center gap-2 mb-1.5">
          <CircuitBoard className="w-3.5 h-3.5 text-secondary" />
          <span className="text-[9px] font-mono text-muted-foreground uppercase">Neural Sync</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1 bg-muted/30 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-secondary to-primary rounded-full"
              animate={{ width: `${Math.min(progress * 1.2, 100)}%` }}
            />
          </div>
          <span className="text-[10px] font-mono text-secondary">{Math.min(Math.round(progress * 1.2), 100)}%</span>
        </div>
      </div>

      <div className="arena-panel p-2 border border-success/30 flex items-center gap-2">
        <Shield className="w-3.5 h-3.5 text-success" />
        <span className="text-[9px] font-mono text-success">AES-256 ACTIVE</span>
      </div>
    </motion.div>

    {/* Right panel */}
    <motion.div
      className="absolute right-4 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-3 items-end"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="arena-panel p-2.5 border border-secondary/30">
        <div className="flex items-center gap-2 mb-1.5">
          <Wifi className="w-3.5 h-3.5 text-secondary" />
          <span className="text-[9px] font-mono text-muted-foreground uppercase">Latency</span>
        </div>
        <p className="font-display text-xl text-secondary">
          {12 + Math.floor(Math.random() * 5)}
          <span className="text-xs text-secondary/70">ms</span>
        </p>
      </div>

      <div className="arena-panel p-2.5 border border-primary/30">
        <div className="flex items-center gap-2 mb-1.5">
          <Activity className="w-3.5 h-3.5 text-primary" />
          <span className="text-[9px] font-mono text-muted-foreground uppercase">Data Rate</span>
        </div>
        <p className="font-display text-xl text-primary">
          {(2.2 + Math.random() * 0.6).toFixed(1)}
          <span className="text-xs text-primary/70">MB/s</span>
        </p>
      </div>
    </motion.div>
  </>
);

export default NeuralSyncLoader;
