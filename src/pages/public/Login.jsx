
import { useState, forwardRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Lock, HelpCircle, Headphones, ArrowRight, Gamepad2, Shield, Trophy, Flame, Mail, Building, IdCard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { authApi } from "@/api";
import { useAuth } from "@/contexts/AuthContext";
import GamifiedBackground from "@/components/effects/GamifiedBackground";
import techGamerHero from "@/assets/tech-gamer-hero.png";

const formVariants = {
  initial: { opacity: 0, x: 20, scale: 0.98 },
  animate: { opacity: 1, x: 0, scale: 1 },
  exit: { opacity: 0, x: -20, scale: 0.98 },
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
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      if (isLogin) {
        const response = await authApi.login({ email, password });
        await login(response.user, response.token);
        localStorage.setItem('targetRole', response.user.role);
        navigate('/arena-loading');
      } else {
        const registrationData = { name, email, password, role, department };
        if (role === 'agent') registrationData.guide_id = guideId;
        
        await authApi.register(registrationData);
        setSuccess("Account created! You can now login.");
        setIsLogin(true);
        setName(""); setDepartment(""); setGuideId(""); setRole("agent");
      }
    } catch (err) {
      setError(err.message || `${isLogin ? 'Login' : 'Registration'} failed`);
    } finally {
      setIsLoading(false);
    }
  };

  const stats = [
    { icon: Trophy, value: "250K+", label: "Players" },
    { icon: Flame, value: "12", label: "Live" },
    { icon: Shield, value: "$45K", label: "Prizes" },
  ];

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col lg:flex-row relative bg-background">
      {/* Shared Gamified Background */}
      <GamifiedBackground
        variant="default"
        showGrid={true}
        showOrbs={true}
        showParticles={true}
        showDataStreams={false}
        primaryColor="320, 100%, 55%"
        secondaryColor="195, 100%, 50%"
      />

      {/* Left Panel - Branding with Tech Hero (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-[48%] relative flex-col items-center justify-center p-6 xl:p-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />

        <div className="relative z-10 text-center max-w-lg flex flex-col items-center">
          {/* Logo */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center shadow-[0_0_40px_hsla(320,100%,55%,0.5)]">
              <Gamepad2 className="w-7 h-7 text-white" />
              <motion.div 
                className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary to-pink-500"
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ filter: 'blur(12px)' }}
              />
            </div>
            <span className="font-display font-black text-3xl text-foreground tracking-wide">
              ga<span className="text-primary">ME</span>trix
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-4xl xl:text-5xl font-display font-black text-foreground mb-3"
          >
            ENTER THE{" "}
            <span className="bg-gradient-to-r from-primary via-pink-500 to-secondary bg-clip-text text-transparent">
              ARENA
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-lg mb-6"
          >
            Compete, conquer, and claim legendary rewards
          </motion.p>

          {/* Stats */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-6 mb-8"
          >
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <stat.icon className="w-5 h-5 text-primary mx-auto mb-1" />
                <p className="font-display font-bold text-xl text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </motion.div>

          {/* Tech Gamer Hero Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="relative w-full flex justify-center"
          >
            <motion.img
              src={techGamerHero}
              alt="Tech Gaming Setup"
              className="w-full max-w-[380px] xl:max-w-[420px] h-auto max-h-[42vh] object-contain rounded-2xl"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              style={{ 
                filter: "drop-shadow(0 0 50px hsla(320,100%,55%,0.3))",
              }}
            />
            {/* Glow effect under image */}
            <div
              className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-16 blur-2xl rounded-full"
              style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.3) 0%, transparent 70%)" }}
            />
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
        {/* Header */}
        <header className="flex items-center justify-between px-4 sm:px-6 py-3 shrink-0">
          <Link to="/" className="flex items-center gap-2 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center shadow-[0_0_15px_hsla(320,100%,55%,0.4)]">
              <Gamepad2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-base text-foreground">
              ga<span className="text-primary">ME</span>trix
            </span>
          </Link>
          <Link to="/" className="hidden lg:block text-sm text-muted-foreground hover:text-primary transition-colors">
            ← Back to Home
          </Link>
          <span className="text-green-400 font-medium text-xs flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Online
          </span>
        </header>

        {/* Form Container */}
        <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-2 overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-sm"
          >
            {/* Card */}
            <div className="relative p-5 sm:p-6 rounded-2xl bg-card/60 backdrop-blur-xl border border-border/50 shadow-[0_0_40px_hsla(320,100%,55%,0.08)]">
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary/50 rounded-tl-lg" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary/50 rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary/50 rounded-bl-lg" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary/50 rounded-br-lg" />

              {/* Header */}
              <div className="text-center mb-4">
                <h2 className="text-xl sm:text-2xl font-display font-bold text-foreground">
                  {isLogin ? 'Welcome Back' : 'Join the Arena'}
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  {isLogin ? 'Sign in to continue your journey' : 'Create your warrior account'}
                </p>
              </div>

              {/* Toggle */}
              <div className="flex justify-center mb-4">
                <div className="inline-flex p-0.5 rounded-lg bg-muted/30 border border-border/50">
                  {['Sign In', 'Register'].map((label, i) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => { setIsLogin(i === 0); setError(""); setSuccess(""); }}
                      className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
                        (i === 0 ? isLogin : !isLogin)
                          ? 'bg-primary text-white shadow-[0_0_12px_hsla(320,100%,55%,0.4)]' 
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Messages */}
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-3 p-2 rounded-lg bg-destructive/20 border border-destructive/50 text-destructive text-xs"
                  >
                    {error}
                  </motion.div>
                )}
                {success && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-3 p-2 rounded-lg bg-success/20 border border-success/50 text-success text-xs"
                  >
                    {success}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form */}
              <AnimatePresence mode="wait">
                <motion.form 
                  key={isLogin ? 'login' : 'register'}
                  variants={formVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.25 }}
                  onSubmit={handleSubmit} 
                  className="space-y-3"
                >
                  {!isLogin && (
                    <InputField
                      icon={User}
                      label="Full Name"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  )}

                  <InputField
                    icon={Mail}
                    label="Email"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />

                  <InputField
                    icon={Lock}
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    showPasswordToggle
                    showPassword={showPassword}
                    onTogglePassword={() => setShowPassword(!showPassword)}
                  />

                  {!isLogin && (
                    <>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                            <Shield className="w-3 h-3" /> Role
                          </label>
                          <select
                            value={role}
                            onChange={(e) => { setRole(e.target.value); if (e.target.value !== 'agent') setGuideId(""); }}
                            className="w-full px-2.5 py-2 bg-muted/50 border border-border rounded-lg text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                            required
                          >
                            <option value="agent">Agent</option>
                            <option value="manager">Manager</option>
                            <option value="leadership">Leadership</option>
                            <option value="admin">Admin</option>
                          </select>
                        </div>

                        <InputField
                          icon={Building}
                          label="Department"
                          placeholder="e.g., Sales"
                          value={department}
                          onChange={(e) => setDepartment(e.target.value)}
                          required
                          compact
                        />
                      </div>

                      {role === 'agent' && (
                        <InputField
                          icon={IdCard}
                          label="Guide ID"
                          placeholder="Your guide ID"
                          value={guideId}
                          onChange={(e) => setGuideId(e.target.value)}
                          required
                        />
                      )}
                    </>
                  )}

                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-primary via-pink-600 to-primary bg-[length:200%_auto] text-white font-bold text-sm shadow-[0_0_25px_hsla(320,100%,55%,0.4)] hover:shadow-[0_0_35px_hsla(320,100%,55%,0.6)] hover:bg-right transition-all duration-500 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>{isLogin ? 'Entering...' : 'Creating...'}</span>
                      </>
                    ) : (
                      <>
                        <span>{isLogin ? 'ENTER ARENA' : 'CREATE ACCOUNT'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>
                </motion.form>
              </AnimatePresence>

              {/* Help */}
              <div className="flex items-center justify-center gap-4 mt-4 pt-3 border-t border-border/30">
                <button className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-primary transition-colors">
                  <HelpCircle className="w-3 h-3" /> Help
                </button>
                <button className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-primary transition-colors">
                  <Headphones className="w-3 h-3" /> Support
                </button>
              </div>
            </div>

            {/* Mobile stats */}
            <div className="lg:hidden mt-4 flex items-center justify-center gap-6 text-center">
              {stats.map((stat, i) => (
                <div key={i}>
                  <p className="font-display font-bold text-lg text-foreground">{stat.value}</p>
                  <p className="text-[10px] text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </main>

        {/* Footer */}
        <footer className="px-4 sm:px-6 py-2 shrink-0 border-t border-border/20">
          <div className="flex items-center justify-between text-[10px] text-muted-foreground">
            <span>© 2026 gaMEtrix</span>
            <div className="flex items-center gap-3">
              <a href="#" className="hover:text-primary transition-colors">Privacy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

// Compact Input Component (forwardRef to avoid ref warnings)
const InputField = forwardRef(
  (
    {
      icon: Icon,
      label,
      type = "text",
      compact = false,
      showPasswordToggle,
      showPassword,
      onTogglePassword,
      ...props
    },
    ref
  ) => {
    return (
      <div className="space-y-1">
        <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
          {Icon && <Icon className="w-3 h-3" />} {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            type={type}
            className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground text-xs placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
            {...props}
          />
          {showPasswordToggle && (
            <button
              type="button"
              onClick={onTogglePassword}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          )}
        </div>
      </div>
    );
  }
);

InputField.displayName = "InputField";

export default Login;

