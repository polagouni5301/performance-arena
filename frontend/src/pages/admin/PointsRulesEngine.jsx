import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Clock, 
  CheckCircle, 
  DollarSign, 
  BarChart3,
  Dices,
  Trophy,
  Gem,
  Ticket,
  RotateCcw,
  Play,
  Save,
  CheckCircle2
} from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { usePointsRules } from "./hooks.jsx";
import { DashboardSkeleton } from "@/components/ui/PageSkeleton";

const iconMap = {
  Clock,
  CheckCircle,
  DollarSign,
};

const PointsRulesEngine = () => {
  const { data, loading, saving, actions } = usePointsRules();
  const [activeTab, setActiveTab] = useState("config");
  
  // Local state for editing
  const [metrics, setMetrics] = useState([]);
  const [caps, setCaps] = useState({
    daily: { enabled: true, value: 5000 },
    weekly: { enabled: true, value: 25000 },
    monthly: { enabled: false, value: null }
  });
  const [probabilities, setProbabilities] = useState([]);
  const [multipliers, setMultipliers] = useState({
    topTier: 1.5,
    midTier: 1.0,
    standard: 0.8
  });
  const [manualAudit, setManualAudit] = useState(false);

  // Initialize local state from API data
  useEffect(() => {
    if (data) {
      // Transform KPI weightage to metrics format
      const metricsData = [
        { 
          id: 1, 
          name: "Average Handle Time (AHT)", 
          type: "Efficiency Metric",
          icon: Clock,
          iconBg: "bg-secondary/20",
          iconColor: "text-secondary",
          weightage: data.kpiWeightage?.find(k => k.id === "aht")?.value || 25,
          target: 400,
          targetUnit: "sec",
          currentAvg: "412s"
        },
        { 
          id: 2, 
          name: "Quality Assurance (QA)", 
          type: "Quality Metric",
          icon: CheckCircle,
          iconBg: "bg-success/20",
          iconColor: "text-success",
          weightage: data.kpiWeightage?.find(k => k.id === "qa")?.value || 45,
          target: 95,
          targetUnit: "%",
          currentAvg: "92%"
        },
        { 
          id: 3, 
          name: "Revenue Generated", 
          type: "Growth Metric",
          icon: DollarSign,
          iconBg: "bg-primary/20",
          iconColor: "text-primary",
          weightage: data.kpiWeightage?.find(k => k.id === "revenue")?.value || 30,
          target: 5000,
          targetUnit: "$",
          currentAvg: "$4,820"
        },
      ];
      setMetrics(metricsData);

      if (data.globalCaps) {
        setCaps({
          daily: { enabled: data.globalCaps.daily?.enabled ?? true, value: data.globalCaps.daily?.value || 5000 },
          weekly: { enabled: data.globalCaps.weekly?.enabled ?? true, value: data.globalCaps.weekly?.value || 25000 },
          monthly: { enabled: data.globalCaps.monthly?.enabled ?? false, value: data.globalCaps.monthly?.value || null }
        });
      }

      if (data.rewardProbability) {
        setProbabilities([
          { id: 1, name: "Mega Reward", desc: "High value drop", icon: Trophy, color: "text-warning", percentage: data.rewardProbability.find(r => r.id === "mega")?.probability || 5 },
          { id: 2, name: "Rare Bonus", desc: "Medium value drop", icon: Gem, color: "text-primary", percentage: data.rewardProbability.find(r => r.id === "rare")?.probability || 25 },
          { id: 3, name: "Common Ticket", desc: "Standard drop", icon: Ticket, color: "text-muted-foreground", percentage: data.rewardProbability.find(r => r.id === "common")?.probability || 70 },
        ]);
      }

      if (data.tierMultipliers) {
        setMultipliers({
          topTier: data.tierMultipliers.topTier?.multiplier || 1.5,
          midTier: data.tierMultipliers.midTier?.multiplier || 1.0,
          standard: data.tierMultipliers.standard?.multiplier || 0.8
        });
      }
    }
  }, [data]);

  if (loading) {
    return <DashboardSkeleton />;
  }

  const totalWeightage = metrics.reduce((sum, m) => sum + m.weightage, 0);

  const updateMetricWeightage = (id, newValue) => {
    setMetrics(prev => prev.map(m => 
      m.id === id ? { ...m, weightage: newValue[0] } : m
    ));
  };

  const handleSave = async () => {
    await actions.save({
      kpiWeightage: metrics.map(m => ({ id: m.id, value: m.weightage })),
      globalCaps: caps,
      tierMultipliers: multipliers,
      rewardProbability: probabilities.map(p => ({ id: p.id, percentage: p.percentage })),
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <span>Home</span>
            <span>›</span>
            <span>Admin</span>
            <span>›</span>
            <span className="text-foreground">Logic Configuration</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Points Rules Engine</h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50 border border-border text-sm text-foreground hover:bg-muted transition-colors">
            <RotateCcw className="w-4 h-4" />
            Reset Defaults
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50 border border-border text-sm text-foreground hover:bg-muted transition-colors">
            <Play className="w-4 h-4" />
            Simulate
          </button>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column - Metric Configuration */}
        <div className="xl:col-span-2 space-y-6">
          {/* Metric Configuration Card */}
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-foreground">Metric Configuration</h3>
                <p className="text-sm text-muted-foreground">Set weightage and target goals for KPI evaluation.</p>
              </div>
              <div className={cn(
                "px-3 py-1.5 rounded-full text-sm font-medium",
                totalWeightage === 100 
                  ? "bg-success/20 text-success" 
                  : "bg-warning/20 text-warning"
              )}>
                Total Weight: {totalWeightage}%
              </div>
            </div>

            <div className="space-y-6">
              {metrics.map((metric) => (
                <motion.div
                  key={metric.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-muted/20 border border-border"
                >
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                      metric.iconBg
                    )}>
                      <metric.icon className={cn("w-6 h-6", metric.iconColor)} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div>
                          <h4 className="font-semibold text-foreground">{metric.name}</h4>
                          <p className="text-xs text-muted-foreground">{metric.type}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground mb-1">Target ({metric.targetUnit === "$" ? "Amount" : metric.targetUnit === "sec" ? "Seconds" : "Score"})</p>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={metric.targetUnit === "$" ? `$ ${metric.target}` : metric.target}
                              className="w-24 px-3 py-1.5 rounded-lg bg-muted/50 border border-border text-sm text-foreground text-right focus:outline-none focus:border-primary"
                              readOnly
                            />
                            {metric.targetUnit !== "$" && (
                              <span className="text-sm text-muted-foreground">{metric.targetUnit}</span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">Current avg: {metric.currentAvg}</p>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">Weightage</span>
                          <span className="text-sm font-semibold text-primary">{metric.weightage}%</span>
                        </div>
                        <Slider
                          value={[metric.weightage]}
                          onValueChange={(val) => updateMetricWeightage(metric.id, val)}
                          max={100}
                          step={5}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>

          {/* Points Engine Logic Card */}
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-foreground">Points Engine Logic</h3>
                <p className="text-sm text-muted-foreground">Configure base accumulation, probability, and tiered multipliers.</p>
              </div>
              <div className="flex items-center gap-1 p-1 rounded-lg bg-muted/30 border border-border">
                <button
                  onClick={() => setActiveTab("config")}
                  className={cn(
                    "px-4 py-1.5 rounded-md text-sm font-medium transition-colors",
                    activeTab === "config" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Config
                </button>
                <button
                  onClick={() => setActiveTab("rules")}
                  className={cn(
                    "px-4 py-1.5 rounded-md text-sm font-medium transition-colors",
                    activeTab === "rules" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Rules
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Score-to-Points Mapping */}
              <div className="p-4 rounded-xl bg-muted/20 border border-border">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    <h4 className="font-semibold text-foreground">Score-to-Points Mapping</h4>
                  </div>
                  <span className="text-xs text-muted-foreground">Multipliers</span>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-sm font-medium text-foreground">Top Tier</p>
                        <p className="text-xs text-muted-foreground">(Top 10%)</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Slider
                          value={[multipliers.topTier * 100]}
                          onValueChange={(val) => setMultipliers(prev => ({ ...prev, topTier: val[0] / 100 }))}
                          max={200}
                          min={50}
                          step={10}
                          className="w-24"
                        />
                        <span className="w-12 px-2 py-1 rounded bg-muted/50 border border-border text-sm text-center">
                          {multipliers.topTier}x
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-sm font-medium text-foreground">Mid Tier</p>
                        <p className="text-xs text-muted-foreground">(Top 50%)</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Slider
                          value={[multipliers.midTier * 100]}
                          onValueChange={(val) => setMultipliers(prev => ({ ...prev, midTier: val[0] / 100 }))}
                          max={200}
                          min={50}
                          step={10}
                          className="w-24"
                        />
                        <span className="w-12 px-2 py-1 rounded bg-muted/50 border border-border text-sm text-center">
                          {multipliers.midTier}x
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-sm font-medium text-foreground">Standard</p>
                        <p className="text-xs text-muted-foreground">(Baseline)</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Slider
                          value={[multipliers.standard * 100]}
                          onValueChange={(val) => setMultipliers(prev => ({ ...prev, standard: val[0] / 100 }))}
                          max={200}
                          min={50}
                          step={10}
                          className="w-24"
                        />
                        <span className="w-12 px-2 py-1 rounded bg-muted/50 border border-border text-sm text-center">
                          {multipliers.standard}x
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Probability Distribution */}
              <div className="p-4 rounded-xl bg-muted/20 border border-border">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Dices className="w-5 h-5 text-warning" />
                    <h4 className="font-semibold text-foreground">Probability Distribution</h4>
                  </div>
                  <span className="text-xs text-muted-foreground">Random Rewards</span>
                </div>

                <div className="space-y-3">
                  {probabilities.map((prob) => (
                    <div key={prob.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border">
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center",
                        prob.id === 1 ? "bg-warning/20" : prob.id === 2 ? "bg-primary/20" : "bg-muted/50"
                      )}>
                        <prob.icon className={cn("w-4 h-4", prob.color)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{prob.name}</p>
                        <p className="text-xs text-muted-foreground">{prob.desc}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={prob.percentage}
                          onChange={(e) => setProbabilities(prev => 
                            prev.map(p => p.id === prob.id ? { ...p, percentage: parseInt(e.target.value) || 0 } : p)
                          )}
                          className="w-12 px-2 py-1 rounded bg-muted/50 border border-border text-sm text-center text-foreground focus:outline-none focus:border-primary"
                        />
                        <span className="text-sm text-muted-foreground">%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Right Column - Caps & Status */}
        <div className="space-y-6">
          {/* Global Point Caps */}
          <GlassCard className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Trophy className="w-5 h-5 text-warning" />
              <h3 className="text-lg font-bold text-foreground">Global Point Caps</h3>
            </div>

            <div className="space-y-4">
              {/* Daily Cap */}
              <div className="p-4 rounded-xl bg-muted/20 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">DAILY CAP</span>
                  <Switch
                    checked={caps.daily.enabled}
                    onCheckedChange={(checked) => setCaps(prev => ({ 
                      ...prev, 
                      daily: { ...prev.daily, enabled: checked }
                    }))}
                  />
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {caps.daily.enabled ? caps.daily.value?.toLocaleString() : "Unlimited"}
                </p>
                <p className="text-xs text-muted-foreground">Points / 24h</p>
              </div>

              {/* Weekly Cap */}
              <div className="p-4 rounded-xl bg-muted/20 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">WEEKLY CAP</span>
                  <Switch
                    checked={caps.weekly.enabled}
                    onCheckedChange={(checked) => setCaps(prev => ({ 
                      ...prev, 
                      weekly: { ...prev.weekly, enabled: checked }
                    }))}
                  />
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {caps.weekly.enabled ? caps.weekly.value?.toLocaleString() : "Unlimited"}
                </p>
                <p className="text-xs text-muted-foreground">Points / 7 days</p>
              </div>

              {/* Monthly Cap */}
              <div className="p-4 rounded-xl bg-muted/20 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">MONTHLY CAP</span>
                  <Switch
                    checked={caps.monthly.enabled}
                    onCheckedChange={(checked) => setCaps(prev => ({ 
                      ...prev, 
                      monthly: { ...prev.monthly, enabled: checked }
                    }))}
                  />
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {caps.monthly.enabled ? (caps.monthly.value?.toLocaleString() || "Set Cap") : "Unlimited"}
                </p>
                <p className="text-xs text-muted-foreground">Points / 30 days</p>
              </div>
            </div>
          </GlassCard>

          {/* System Status */}
          <GlassCard className="p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">System Status</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-success/10 border border-success/30">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                  <span className="text-sm font-medium text-foreground">Engine Active</span>
                </div>
                <span className="text-xs text-success">Running</span>
              </div>

              <div className="p-3 rounded-lg bg-muted/20 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Last Updated</span>
                  <span className="text-sm text-foreground">{data?.lastUpdated || "2 hours ago"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Updated By</span>
                  <span className="text-sm text-foreground">{data?.lastUpdatedBy || "Admin User"}</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border">
                <div>
                  <p className="text-sm font-medium text-foreground">Manual Audit Mode</p>
                  <p className="text-xs text-muted-foreground">Require approval for changes</p>
                </div>
                <Switch
                  checked={manualAudit}
                  onCheckedChange={setManualAudit}
                />
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default PointsRulesEngine;