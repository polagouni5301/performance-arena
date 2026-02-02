import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Palette,
  Database,
  Zap,
  Moon,
  Sun,
  Globe,
  Mail,
  Smartphone,
  Lock,
  Eye,
  EyeOff,
  Check,
  ChevronRight,
  Download,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { DashboardSkeleton } from "@/components/ui/PageSkeleton";

const settingsSections = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "security", label: "Security", icon: Shield },
  { id: "integrations", label: "Integrations", icon: Database },
  { id: "gamification", label: "Gamification", icon: Zap },
];

// Simulated settings API hook
const useSettings = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    setData({
      profile: {
        firstName: "Alex",
        lastName: "Morgan",
        email: "alex.morgan@company.com",
        phone: "+1 555-123-4567",
        role: "Manager",
        team: "Sales Alpha",
        avatar: "A",
      },
      notifications: {
        email: true,
        push: true,
        contests: true,
        teamUpdates: true,
        rewards: false,
      },
      appearance: {
        darkMode: true,
        accentColor: "Purple",
        language: "English (US)",
      },
      integrations: [
        { name: "Slack", status: "connected", desc: "Team notifications" },
        { name: "Salesforce", status: "connected", desc: "CRM sync" },
        { name: "Google Workspace", status: "disconnected", desc: "Calendar & email" },
        { name: "Microsoft Teams", status: "disconnected", desc: "Team collaboration" },
      ],
      gamification: {
        pointsPerRevenue: 100,
        pointsPerQA: 50,
        monthlyBudget: 50000,
      },
    });
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, refetch: fetchData };
};

const Settings = () => {
  const { data, loading } = useSettings();
  const [activeSection, setActiveSection] = useState("profile");
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    contests: true,
    teamUpdates: true,
    rewards: false,
  });

  // Initialize from API data
  useEffect(() => {
    if (data) {
      setDarkMode(data.appearance?.darkMode ?? true);
      setNotifications(data.notifications || {
        email: true,
        push: true,
        contests: true,
        teamUpdates: true,
        rewards: false,
      });
    }
  }, [data]);

  if (loading) {
    return <DashboardSkeleton />;
  }

  const profile = data?.profile || {};

  const renderSectionContent = () => {
    switch (activeSection) {
      case "profile":
        return (
          <div className="space-y-6">
            {/* Profile Header */}
            <div className="flex items-center gap-6 p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20">
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center text-white text-3xl font-bold">
                  {profile.avatar || "A"}
                </div>
                <button className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors">
                  <Palette className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">{profile.firstName} {profile.lastName}</h3>
                <p className="text-muted-foreground">Team Lead • {profile.team}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2 py-1 rounded-lg bg-primary/20 text-primary text-xs font-medium">{profile.role}</span>
                  <span className="px-2 py-1 rounded-lg bg-success/20 text-success text-xs font-medium">Verified</span>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">First Name</label>
                <input
                  type="text"
                  defaultValue={profile.firstName}
                  className="w-full px-4 py-3 rounded-xl bg-muted/30 border border-border/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Last Name</label>
                <input
                  type="text"
                  defaultValue={profile.lastName}
                  className="w-full px-4 py-3 rounded-xl bg-muted/30 border border-border/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                <input
                  type="email"
                  defaultValue={profile.email}
                  className="w-full px-4 py-3 rounded-xl bg-muted/30 border border-border/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
                <input
                  type="tel"
                  defaultValue={profile.phone}
                  className="w-full px-4 py-3 rounded-xl bg-muted/30 border border-border/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 rounded-xl font-medium text-primary-foreground"
              style={{
                background: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(330 100% 50%) 100%)",
              }}
            >
              Save Changes
            </motion.button>
          </div>
        );

      case "notifications":
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              {[
                { key: "email", label: "Email Notifications", desc: "Receive updates via email", icon: Mail },
                { key: "push", label: "Push Notifications", desc: "Browser and mobile alerts", icon: Smartphone },
                { key: "contests", label: "Contest Updates", desc: "New contests and results", icon: Zap },
                { key: "teamUpdates", label: "Team Updates", desc: "Performance changes and alerts", icon: User },
                { key: "rewards", label: "Reward Alerts", desc: "Points and redemption notifications", icon: Bell },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-4 rounded-xl bg-muted/20 border border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                    className={`w-12 h-6 rounded-full transition-colors relative ${
                      notifications[item.key] ? "bg-primary" : "bg-muted"
                    }`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                      notifications[item.key] ? "left-7" : "left-1"
                    }`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case "appearance":
        return (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-muted/20 border border-border/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    {darkMode ? <Moon className="w-5 h-5 text-primary" /> : <Sun className="w-5 h-5 text-primary" />}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Dark Mode</p>
                    <p className="text-sm text-muted-foreground">Toggle dark/light theme</p>
                  </div>
                </div>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    darkMode ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    darkMode ? "left-7" : "left-1"
                  }`} />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-3">Accent Color</label>
              <div className="flex gap-3">
                {[
                  { name: "Purple", color: "bg-purple-500" },
                  { name: "Blue", color: "bg-blue-500" },
                  { name: "Cyan", color: "bg-cyan-500" },
                  { name: "Pink", color: "bg-pink-500" },
                  { name: "Orange", color: "bg-orange-500" },
                ].map((c) => (
                  <button
                    key={c.name}
                    className={`w-10 h-10 rounded-xl ${c.color} flex items-center justify-center ring-2 ring-offset-2 ring-offset-background ring-transparent hover:ring-primary transition-all`}
                  >
                    {c.name === (data?.appearance?.accentColor || "Purple") && <Check className="w-5 h-5 text-white" />}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-3">Language</label>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <select className="w-full pl-12 pr-4 py-3 rounded-xl bg-muted/30 border border-border/50 text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50">
                  <option>English (US)</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                </select>
                <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground rotate-90" />
              </div>
            </div>
          </div>
        );

      case "security":
        return (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-muted/20 border border-border/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Lock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">Add extra security to your account</p>
                  </div>
                </div>
                <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium">
                  Enable
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-foreground">Change Password</label>
              <input
                type="password"
                placeholder="Current password"
                className="w-full px-4 py-3 rounded-xl bg-muted/30 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <input
                type="password"
                placeholder="New password"
                className="w-full px-4 py-3 rounded-xl bg-muted/30 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <input
                type="password"
                placeholder="Confirm new password"
                className="w-full px-4 py-3 rounded-xl bg-muted/30 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium">
                Update Password
              </button>
            </div>

            <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/30">
              <div className="flex items-center gap-3">
                <Trash2 className="w-5 h-5 text-destructive" />
                <div>
                  <p className="font-medium text-destructive">Danger Zone</p>
                  <p className="text-sm text-muted-foreground">Delete account and all data</p>
                </div>
              </div>
            </div>
          </div>
        );

      case "integrations":
        return (
          <div className="space-y-4">
            {(data?.integrations || []).map((integration) => (
              <div key={integration.name} className="flex items-center justify-between p-4 rounded-xl bg-muted/20 border border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Database className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{integration.name}</p>
                    <p className="text-sm text-muted-foreground">{integration.desc}</p>
                  </div>
                </div>
                <button className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  integration.status === "connected"
                    ? "bg-success/20 text-success"
                    : "bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground"
                }`}>
                  {integration.status === "connected" ? "Connected" : "Connect"}
                </button>
              </div>
            ))}
          </div>
        );

      case "gamification":
        return (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-gradient-to-br from-accent/20 to-warning/20 border border-accent/30">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-accent" />
                <span className="font-medium text-foreground">Gamification Settings</span>
              </div>
              <p className="text-sm text-muted-foreground">Configure point systems and rewards for your team.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Points per $1k Revenue</label>
                <input
                  type="number"
                  defaultValue={data?.gamification?.pointsPerRevenue || 100}
                  className="w-full px-4 py-3 rounded-xl bg-muted/30 border border-border/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Points per QA Score Point</label>
                <input
                  type="number"
                  defaultValue={data?.gamification?.pointsPerQA || 50}
                  className="w-full px-4 py-3 rounded-xl bg-muted/30 border border-border/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Monthly Point Budget</label>
                <input
                  type="number"
                  defaultValue={data?.gamification?.monthlyBudget || 50000}
                  className="w-full px-4 py-3 rounded-xl bg-muted/30 border border-border/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>

            <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium">
              <RefreshCw className="w-4 h-4" />
              Reset to Defaults
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground" style={{ fontFamily: "'Sora', sans-serif" }}>
            Settings
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your account preferences and configurations
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-[280px_1fr] gap-6">
        {/* Sidebar Navigation */}
        <div className="space-y-2">
          {settingsSections.map((section) => (
            <motion.button
              key={section.id}
              whileHover={{ x: 4 }}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                activeSection === section.id
                  ? "bg-primary/20 text-primary border border-primary/30"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              }`}
            >
              <section.icon className="w-5 h-5" />
              <span className="font-medium">{section.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Content Area */}
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-6 rounded-2xl bg-card/50 backdrop-blur border border-border/50"
        >
          <h2 className="text-xl font-bold text-foreground mb-6" style={{ fontFamily: "'Sora', sans-serif" }}>
            {settingsSections.find(s => s.id === activeSection)?.label}
          </h2>
          {renderSectionContent()}
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;