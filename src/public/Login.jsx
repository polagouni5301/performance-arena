import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Lock, HelpCircle, Headphones, Zap, Hexagon, Star, Box, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import NeonButton from "../../components/ui/NeonButton";
import NeonInput from "../../components/ui/NeonInput";
import GlassCard from "../../components/ui/GlassCard";
import CyberParticles from "@/components/effects/CyberParticles";
import NeonGlow from "@/components/effects/NeonGlow";
import NeonGrid from "@/components/effects/NeonGrid";
import ScanLines from "@/components/effects/ScanLines";
import DataStream from "@/components/effects/DataStream";
import { authApi } from "@/api";
import { useAuth } from "@/contexts/AuthContext";

// Animation variants for form transitions
const formVariants = {
  initial: { opacity: 0, x: 20, scale: 0.98 },
  animate: { opacity: 1, x: 0, scale: 1 },
  exit: { opacity: 0, x: -20, scale: 0.98 },
};

const cardVariants = {
  login: { height: "auto" },
  register: { height: "auto" },
};

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("agent");
  const [department, setDepartment] = useState("");
  const [guideId, setGuideId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isUltraSmallScreen, setIsUltraSmallScreen] = useState(false);

  // Detect ultra-small screens (under 360px height)
  useEffect(() => {
    const checkScreenSize = () => {
      setIsUltraSmallScreen(window.innerHeight < 360);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      if (isLogin) {
        const response = await authApi.login({ email, password });
        
        // Use AuthContext login function
        await login(response.user, response.token);

        // Navigate to Arena Loading page first - it will redirect to role-based dashboard
        // Store the target role for ArenaLoading to use
        localStorage.setItem('targetRole', response.user.role);
        navigate('/arena-loading');
      } else {
        const registrationData = {
          name,
          email,
          password,
          role,
          department
        };
        
        if (role === 'agent') {
          registrationData.guide_id = guideId;
        }
        
        const response = await authApi.register(registrationData);
        
        setSuccess("Registration successful! You can now login.");
        setIsLogin(true);
        setName("");
        setDepartment("");
        setGuideId("");
        setRole("agent");
      }
    } catch (err) {
      setError(err.message || `${isLogin ? 'Login' : 'Registration'} failed`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col relative overflow-hidden bg-[hsl(260,30%,4%)]">
      {/* Animated Effects - Reduced for mobile performance */}
      <CyberParticles count={30} color="mixed" speed={0.3} connectDistance={60} />
      <NeonGrid opacity={0.08} />
      <ScanLines opacity={0.02} />
      <div className="hidden md:block">
        <DataStream side="left" speed={35} />
        <DataStream side="right" speed={40} />
      </div>
      
      {/* Neon Glows */}
      <NeonGlow position="center" color="purple" size="large" />
      <div className="hidden md:block">
        <NeonGlow position="top-right" color="cyan" size="medium" />
        <NeonGlow position="bottom-left" color="pink" size="medium" />
      </div>

      {/* 3D Floating Objects - Hidden on small screens */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden hidden lg:block">
        {/* 3D Rotating Hexagon - Left */}
        <div className="absolute top-1/4 left-[8%] animate-[float_7s_ease-in-out_infinite]" style={{ perspective: '600px' }}>
          <div className="w-24 h-24 xl:w-32 xl:h-32 relative" style={{ transformStyle: 'preserve-3d', animation: 'spin 18s linear infinite' }}>
            <Hexagon className="w-full h-full text-purple-500/25 drop-shadow-[0_0_25px_hsla(280,100%,60%,0.4)]" strokeWidth={1} />
          </div>
        </div>
        
        {/* 3D Spinning Diamond - Right */}
        <div className="absolute top-1/3 right-[10%] animate-[float_8s_ease-in-out_infinite_1s]" style={{ perspective: '500px' }}>
          <div className="w-20 h-20 xl:w-28 xl:h-28 rotate-45 border-2 border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-transparent backdrop-blur-sm
                          shadow-[0_0_35px_hsla(180,100%,50%,0.25)] animate-[spin_15s_linear_infinite_reverse]" />
        </div>
        
        {/* 3D Glowing Sphere - Bottom Left */}
        <div className="absolute bottom-1/4 left-[12%] animate-[float_6s_ease-in-out_infinite_0.5s]">
          <div className="w-16 h-16 xl:w-20 xl:h-20 rounded-full bg-gradient-to-br from-pink-500/25 to-purple-600/25 
                          shadow-[inset_-6px_-6px_25px_hsla(320,100%,70%,0.3),0_0_40px_hsla(320,100%,60%,0.3)]
                          border border-pink-500/25" />
        </div>
        
        {/* 3D Ring - Top Right */}
        <div className="absolute top-[20%] right-[25%] animate-[float_9s_ease-in-out_infinite_2s]" style={{ perspective: '500px' }}>
          <div className="w-20 h-20 xl:w-28 xl:h-28 rounded-full border-4 border-purple-500/20 
                          shadow-[0_0_30px_hsla(280,100%,60%,0.2)]
                          animate-[spin_20s_linear_infinite]" 
               style={{ transform: 'rotateX(60deg)' }} />
        </div>
        
        {/* 3D Cube - Bottom Right */}
        <div className="absolute bottom-[25%] right-[15%] animate-[float_10s_ease-in-out_infinite_3s]" style={{ perspective: '800px' }}>
          <div className="w-16 h-16 xl:w-24 xl:h-24 relative" style={{ transformStyle: 'preserve-3d', animation: 'spin 14s linear infinite' }}>
            <div className="absolute inset-0 border-2 border-amber-500/25 bg-amber-500/5" style={{ transform: 'translateZ(12px)' }} />
            <div className="absolute inset-0 border-2 border-amber-500/15" style={{ transform: 'translateZ(-12px)' }} />
          </div>
        </div>
        
        {/* Floating Star Particles */}
        <div className="absolute top-[15%] left-[30%]">
          <Star className="w-4 h-4 text-cyan-400/40 animate-pulse drop-shadow-[0_0_10px_hsla(180,100%,50%,0.5)]" />
        </div>
        <div className="absolute top-[40%] right-[35%]">
          <Star className="w-3 h-3 text-purple-400/40 animate-pulse drop-shadow-[0_0_10px_hsla(280,100%,60%,0.5)]" style={{ animationDelay: '1s' }} />
        </div>
        <div className="absolute bottom-[35%] left-[40%]">
          <Star className="w-5 h-5 text-pink-400/40 animate-pulse drop-shadow-[0_0_10px_hsla(320,100%,60%,0.5)]" style={{ animationDelay: '0.5s' }} />
        </div>
        
        {/* 3D Box */}
        <div className="absolute top-[55%] left-[5%] animate-[float_8s_ease-in-out_infinite_1.5s]">
          <Box className="w-10 h-10 xl:w-14 xl:h-14 text-cyan-500/20 drop-shadow-[0_0_15px_hsla(180,100%,50%,0.3)] animate-[spin_25s_linear_infinite]" />
        </div>
      </div>

      {/* Header */}
      <header className="relative z-20 flex items-center justify-between px-4 md:px-6 py-3 md:py-4 shrink-0">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-[0_0_20px_hsla(280,100%,60%,0.5)] group-hover:shadow-[0_0_30px_hsla(280,100%,60%,0.8)] transition-shadow">
            <Zap className="w-4 h-4 md:w-5 md:h-5 text-white" />
          </div>
          <span className="font-display font-bold text-base md:text-lg text-foreground">
            gaMEtrix
          </span>
        </Link>
        
        <div className="flex items-center gap-2 text-xs md:text-sm">
          <span className="text-muted-foreground hidden sm:inline">System Status:</span>
          <span className="text-green-400 font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_hsla(145,100%,50%,1)]" />
            Online
          </span>
        </div>
      </header>

      {/* Main Content - No scroll, fit to viewport */}
      <main className="flex-1 flex items-center justify-center px-4 py-2 relative z-10 min-h-0">
        <div className="w-full max-w-6xl grid lg:grid-cols-[1fr_auto_1fr] gap-4 lg:gap-6 items-center">
          
          {/* Left Status Panel - Hidden on mobile/tablet */}
          <div className="hidden lg:block space-y-4 xl:space-y-6">
            <GlassCard className="p-3 xl:p-4 shadow-[0_0_25px_hsla(280,100%,60%,0.1)]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs xl:text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Encryption Level:
                </span>
                <span className="text-xs xl:text-sm font-bold text-red-400 drop-shadow-[0_0_8px_hsla(0,100%,60%,0.8)]">MAX</span>
              </div>
              <div className="space-y-2">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded shadow-[0_0_5px_hsla(280,100%,60%,0.5)]"
                    style={{ 
                      width: `${60 + Math.random() * 40}%`,
                      opacity: 0.5 + Math.random() * 0.5
                    }}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-3 text-[10px] xl:text-xs text-muted-foreground">
                <span>SECURITY: <span className="text-primary drop-shadow-[0_0_5px_hsla(280,100%,60%,0.8)]">100%</span></span>
                <span>MAX</span>
              </div>
              <div className="text-[10px] xl:text-xs text-muted-foreground mt-2">
                <p>LATEST_CHECK: <span className="text-green-400 drop-shadow-[0_0_5px_hsla(145,100%,50%,0.8)]">100%</span></p>
                <p>INTRUSION_LOCK: <span className="text-cyan-400 drop-shadow-[0_0_5px_hsla(180,100%,50%,0.8)]">DEMO_ONLY</span></p>
              </div>
            </GlassCard>

            <GlassCard className="p-3 xl:p-4 shadow-[0_0_25px_hsla(180,100%,50%,0.1)]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs xl:text-sm font-medium text-muted-foreground">Server Latency:</span>
                <span className="text-xs xl:text-sm font-bold text-cyan-400 drop-shadow-[0_0_8px_hsla(180,100%,50%,0.8)]">18ms</span>
              </div>
              <div className="mb-3">
                <span className="text-xs xl:text-sm text-muted-foreground">System Status: </span>
                <span className="text-xs xl:text-sm font-bold text-green-400 drop-shadow-[0_0_8px_hsla(145,100%,50%,0.8)]">ONLINE</span>
              </div>
              {/* Mini waveform */}
              <div className="flex items-end gap-0.5 h-10 xl:h-12">
                {[...Array(30)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-gradient-to-t from-cyan-500 to-purple-500 rounded-t transition-all duration-300 shadow-[0_0_3px_hsla(180,100%,50%,0.5)]"
                    style={{ 
                      height: `${20 + Math.sin(i * 0.5) * 30 + Math.random() * 20}%`,
                      opacity: 0.5 + Math.random() * 0.5
                    }}
                  />
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Center Login Card - Compact to fit viewport */}
          <div className="w-full max-w-sm lg:max-w-md mx-auto">
            <GlassCard className={`relative shadow-[0_0_40px_hsla(280,100%,60%,0.2)] ${isLogin ? 'p-4 md:p-5 lg:p-6' : 'p-3 md:p-4 lg:p-5'}`}>
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 border-t-2 border-l-2 border-purple-500 shadow-[0_0_10px_hsla(280,100%,60%,0.5)]" />
              <div className="absolute top-0 right-0 w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 border-t-2 border-r-2 border-purple-500 shadow-[0_0_10px_hsla(280,100%,60%,0.5)]" />
              <div className="absolute bottom-0 left-0 w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 border-b-2 border-l-2 border-purple-500 shadow-[0_0_10px_hsla(280,100%,60%,0.5)]" />
              <div className="absolute bottom-0 right-0 w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 border-b-2 border-r-2 border-purple-500 shadow-[0_0_10px_hsla(280,100%,60%,0.5)]" />

              {/* Ultra-small screen collapsible header */}
              {isUltraSmallScreen && (
                <button
                  type="button"
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="w-full flex items-center justify-between mb-2 p-2 rounded-lg bg-purple-500/10 border border-purple-500/30"
                >
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-bold text-foreground">
                      {isLogin ? 'Login' : 'Register'}
                    </span>
                  </div>
                  {isCollapsed ? (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronUp className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
              )}

              {/* Collapsible content for ultra-small screens */}
              <AnimatePresence mode="wait">
                <motion.div 
                  key={isLogin ? 'login' : 'register'}
                  variants={formVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className={isUltraSmallScreen && isCollapsed ? 'hidden' : 'block'}
                >
                  {/* Logo - Hidden on ultra-small or compact for registration */}
                  {!isUltraSmallScreen && (
                    <motion.div 
                      className={`text-center ${isLogin ? 'mb-3' : 'mb-2'}`}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      <div className="inline-block relative mb-1">
                        <motion.div 
                          className={`rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center mx-auto shadow-[0_0_30px_hsla(280,100%,60%,0.4)] ${isLogin ? 'w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14' : 'w-8 h-8 md:w-10 md:h-10'}`}
                          animate={{ scale: isLogin ? 1 : 0.85 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className={`rounded-full bg-card flex items-center justify-center ${isLogin ? 'w-7 h-7 md:w-9 md:h-9 lg:w-10 lg:h-10' : 'w-5 h-5 md:w-7 md:h-7'}`}>
                            <Zap className={`text-purple-400 drop-shadow-[0_0_10px_hsla(280,100%,60%,0.8)] ${isLogin ? 'w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6' : 'w-3 h-3 md:w-4 md:h-4'}`} />
                          </div>
                        </motion.div>
                        {/* Orbital ring - only show for login */}
                        {isLogin && (
                          <motion.div 
                            className="absolute inset-0 rounded-full border border-purple-500/40 animate-spin-slow"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          />
                        )}
                      </div>
                      
                      <h1 className={`font-display font-bold ${isLogin ? 'text-base md:text-lg lg:text-xl' : 'text-sm md:text-base'}`}>
                        ga<span className="text-purple-400 drop-shadow-[0_0_10px_hsla(280,100%,60%,0.8)]">ME</span>trix
                      </h1>
                    </motion.div>
                  )}

                  {/* Title - Compact with animation */}
                  <motion.div 
                    className={`text-center ${isLogin ? 'mb-3' : 'mb-2'}`}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.15 }}
                  >
                    <h2 className={`font-display font-bold text-foreground uppercase tracking-wider ${isLogin ? 'text-xs md:text-sm lg:text-base mb-0.5' : 'text-[10px] md:text-xs'}`}>
                      {isLogin ? 'Command Console Access' : 'New User Registration'}
                    </h2>
                    {isLogin && (
                      <p className="text-[10px] md:text-xs text-muted-foreground">
                        Authenticate to continue
                      </p>
                    )}
                  </motion.div>

                {/* Toggle between Login/Register */}
                <div className="text-center mb-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setError("");
                      setSuccess("");
                    }}
                    className="text-[10px] md:text-xs text-cyan-400 hover:text-cyan-300 transition-colors underline"
                  >
                    {isLogin ? 'Need to register?' : 'Already have an account?'}
                  </button>
                </div>

                {/* Error/Success Messages */}
                {error && (
                  <div className="mb-2 p-1.5 rounded-lg bg-destructive/20 border border-destructive/50 text-destructive text-[9px] md:text-[10px]">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="mb-2 p-1.5 rounded-lg bg-success/20 border border-success/50 text-success text-[9px] md:text-[10px]">
                    {success}
                  </div>
                )}

                {/* Form - Optimized spacing for registration */}
                <form onSubmit={handleSubmit} className={`${isLogin ? 'space-y-2 md:space-y-2.5' : 'space-y-1.5 md:space-y-2'}`}>
                  {!isLogin && (
                    <NeonInput
                      label="Full Name"
                      placeholder="Enter your full name"
                      icon={User}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      compact
                    />
                  )}

                  <NeonInput
                    label="Work Email"
                    type="email"
                    placeholder="your.email@company.com"
                    icon={User}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    compact={!isLogin}
                  />

                  <NeonInput
                    label="Password"
                    type="password"
                    placeholder="••••••••••••"
                    icon={Lock}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    compact={!isLogin}
                  />

                  {!isLogin && (
                    <>
                      {/* Role and Department side by side on larger screens */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[9px] md:text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                            Role
                          </label>
                          <select
                            value={role}
                            onChange={(e) => {
                              setRole(e.target.value);
                              if (e.target.value !== 'agent') {
                                setGuideId("");
                              }
                            }}
                            className="w-full px-2 py-1.5 md:py-2 bg-card border border-border rounded-md text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required
                          >
                            <option value="agent">Agent</option>
                            <option value="manager">Manager</option>
                            <option value="leadership">Leadership</option>
                            <option value="admin">Admin</option>
                          </select>
                        </div>

                        <NeonInput
                          label="Department"
                          placeholder="e.g., Sales"
                          value={department}
                          onChange={(e) => setDepartment(e.target.value)}
                          required
                          compact
                        />
                      </div>

                      {role === 'agent' && (
                        <NeonInput
                          label="Guide ID"
                          placeholder="Enter your guide ID"
                          value={guideId}
                          onChange={(e) => setGuideId(e.target.value)}
                          required
                          compact
                        />
                      )}
                    </>
                  )}

                  <NeonButton
                    type="submit"
                    variant="primary"
                    size="lg"
                    className={`w-full shadow-[0_0_30px_hsla(280,100%,60%,0.4)] hover:shadow-[0_0_50px_hsla(280,100%,60%,0.6)] ${isLogin ? 'text-sm md:text-base py-2.5 md:py-3' : 'text-xs md:text-sm py-2 md:py-2.5'}`}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4 md:h-5 md:w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>{isLogin ? 'Authenticating...' : 'Registering...'}</span>
                      </span>
                    ) : (
                      <span>{isLogin ? 'ACCESS SYSTEM' : 'CREATE ACCOUNT'}</span>
                    )}
                  </NeonButton>
                </form>

                {/* Help Links - Only show for login or non-ultra-small screens */}
                {(isLogin || !isUltraSmallScreen) && (
                  <div className="flex items-center justify-center gap-4 mt-2 pt-2 border-t border-border/50">
                    <button className="flex items-center gap-1 text-[9px] text-muted-foreground hover:text-primary transition-colors">
                      <HelpCircle className="w-3 h-3" />
                      <span>Help</span>
                    </button>
                    <button className="flex items-center gap-1 text-[9px] text-muted-foreground hover:text-primary transition-colors">
                      <Headphones className="w-3 h-3" />
                      <span>Support</span>
                    </button>
                  </div>
                )}
                </motion.div>
              </AnimatePresence>
            </GlassCard>
          </div>

          {/* Right Panel - Hidden on mobile/tablet */}
          <div className="hidden lg:block space-y-4 xl:space-y-6">
            <GlassCard className="p-3 xl:p-4 shadow-[0_0_25px_hsla(320,100%,60%,0.1)]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs xl:text-sm font-medium text-muted-foreground">Active Users:</span>
                <span className="text-xs xl:text-sm font-bold text-pink-400 drop-shadow-[0_0_8px_hsla(320,100%,60%,0.8)]">2,847</span>
              </div>
              <div className="flex -space-x-2 mb-3">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 border-2 border-card flex items-center justify-center text-white text-xs font-bold"
                    style={{ zIndex: 6 - i }}
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <p className="text-[10px] xl:text-xs text-muted-foreground">
                +2,841 more players online
              </p>
            </GlassCard>

            <GlassCard className="p-3 xl:p-4 shadow-[0_0_25px_hsla(45,100%,50%,0.1)]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs xl:text-sm font-medium text-muted-foreground">Today's Highlights:</span>
              </div>
              <div className="space-y-2 text-[10px] xl:text-xs">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-500/10 border border-amber-500/30">
                  <span className="text-amber-400">🏆</span>
                  <span className="text-muted-foreground">New leaderboard champion!</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-green-500/10 border border-green-500/30">
                  <span className="text-green-400">📈</span>
                  <span className="text-muted-foreground">15% avg. performance boost</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-purple-500/10 border border-purple-500/30">
                  <span className="text-purple-400">🎮</span>
                  <span className="text-muted-foreground">New contest launching soon</span>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </main>

      {/* Footer - Minimal */}
      <footer className="relative z-20 px-4 py-2 border-t border-border/30 shrink-0">
        <div className="flex items-center justify-between text-[9px] md:text-[10px] text-muted-foreground">
          <span>© 2026 gaMEtrix</span>
          <div className="flex items-center gap-3">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Login;
