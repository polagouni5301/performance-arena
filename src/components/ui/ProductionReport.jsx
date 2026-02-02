import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Zap, Target, Award, Calendar, Clock, CheckCircle, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const ProductionReport = ({ mandays = 0, guidesProcessed = 0, period = 'This Month' }) => {
  const mandaysTarget = 25;
  const hoursTarget = 200;
  const mandaysPercentage = Math.min((mandays / hoursTarget) * 100, 100);
  const guidesPercentage = Math.min((guidesProcessed / 25) * 100, 100);
  const completedHours = Math.round((mandaysPercentage / 100) * hoursTarget);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="relative overflow-hidden rounded-2xl group"
    >
      {/* Complex Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-card via-primary/5 to-card" />
      
      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" className="text-primary">
          <defs>
            <pattern id="productionGrid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#productionGrid)" />
        </svg>
      </div>

      {/* Glow Effects */}
      <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-secondary/10 to-accent/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-700 -z-10" />
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-60 h-60 bg-secondary/10 rounded-full blur-3xl -z-10" />

      {/* Border */}
      <div className="absolute inset-0 rounded-2xl border border-primary/20" />
      
      {/* Top Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/0 via-primary/60 to-primary/0" />

      {/* Content */}
      <div className="relative z-10 p-6 lg:p-8">
        {/* Header Section */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <motion.div
                className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <BarChart3 className="w-5 h-5 text-primary" />
              </motion.div>
              <div>
                <p className="text-xs text-primary font-bold uppercase tracking-widest">Production Report</p>
                <p className="text-xs text-muted-foreground font-mono">{period}</p>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
            className="relative"
          >
            <div className="absolute inset-0 bg-success/30 rounded-xl blur-lg" />
            <div className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl bg-success/15 border border-success/40 backdrop-blur">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <CheckCircle className="w-4 h-4 text-success" />
              </motion.div>
              <span className="text-sm font-bold text-success">On Track</span>
            </div>
          </motion.div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Target Days", value: mandaysTarget, icon: Calendar, color: "primary" },
            { label: "Hours Target", value: `${hoursTarget}h`, icon: Clock, color: "secondary" },
            { label: "Completed", value: `${completedHours}h`, icon: CheckCircle, color: "success" },
            { label: "Efficiency", value: `${Math.round(mandaysPercentage)}%`, icon: TrendingUp, color: "accent" },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + idx * 0.05 }}
              className={cn(
                "p-4 rounded-xl border backdrop-blur-sm",
                `bg-${stat.color}/5 border-${stat.color}/20`
              )}
              style={{
                background: `linear-gradient(135deg, hsl(var(--${stat.color}) / 0.08), transparent)`,
                borderColor: `hsl(var(--${stat.color}) / 0.25)`
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className={cn("w-4 h-4", `text-${stat.color}`)} style={{ color: `hsl(var(--${stat.color}))` }} />
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{stat.label}</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Mandays Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="relative group/card"
          >
            <div className="absolute inset-0 bg-primary/10 rounded-xl blur-xl opacity-0 group-hover/card:opacity-100 transition-opacity" />
            <div className="relative p-5 rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 to-transparent hover:border-primary/50 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="w-4 h-4 text-primary" />
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Mandays Progress</p>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-primary">{mandaysTarget}</span>
                    <span className="text-lg text-muted-foreground">Days</span>
                  </div>
                </div>
                <motion.div
                  className="p-3 rounded-xl bg-primary/20 border border-primary/40"
                  whileHover={{ rotate: 10, scale: 1.1 }}
                >
                  <Calendar className="w-6 h-6 text-primary" />
                </motion.div>
              </div>

              {/* Progress bar */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Progress</span>
                  <span className="text-xs font-bold text-primary flex items-center gap-1">
                    <ArrowUpRight className="w-3 h-3" />
                    {Math.round(mandaysPercentage)}%
                  </span>
                </div>
                <div className="h-3 bg-muted/30 rounded-full overflow-hidden border border-primary/20">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-primary via-primary/80 to-secondary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${mandaysPercentage}%` }}
                    transition={{ delay: 0.6, duration: 1, ease: "easeOut" }}
                    style={{ boxShadow: "0 0 20px hsl(var(--primary) / 0.4)" }}
                  />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-primary/20 flex justify-between text-xs">
                <span className="text-muted-foreground">Target: <span className="text-primary font-semibold">{hoursTarget} Hours</span></span>
                <span className="text-muted-foreground">Completed: <span className="text-success font-semibold">{completedHours} Hours</span></span>
              </div>
            </div>
          </motion.div>

          {/* Guides Achieved Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="relative group/card"
          >
            <div className="absolute inset-0 bg-secondary/10 rounded-xl blur-xl opacity-0 group-hover/card:opacity-100 transition-opacity" />
            <div className="relative p-5 rounded-xl border border-secondary/30 bg-gradient-to-br from-secondary/10 to-transparent hover:border-secondary/50 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Award className="w-4 h-4 text-secondary" />
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Guides Achieved</p>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-secondary">23</span>
                    <span className="text-lg text-muted-foreground">Days</span>
                  </div>
                </div>
                <motion.div
                  className="p-3 rounded-xl bg-secondary/20 border border-secondary/40"
                  whileHover={{ rotate: -10, scale: 1.1 }}
                >
                  <Award className="w-6 h-6 text-secondary" />
                </motion.div>
              </div>

              {/* Progress bar */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Achievement Rate</span>
                  <span className="text-xs font-bold text-secondary flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    92%
                  </span>
                </div>
                <div className="h-3 bg-muted/30 rounded-full overflow-hidden border border-secondary/20">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-secondary via-secondary/80 to-accent rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "92%" }}
                    transition={{ delay: 0.7, duration: 1, ease: "easeOut" }}
                    style={{ boxShadow: "0 0 20px hsl(var(--secondary) / 0.4)" }}
                  />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-secondary/20 flex justify-between text-xs">
                <span className="text-muted-foreground">Target: <span className="text-secondary font-semibold">25 Days</span></span>
                <span className="text-muted-foreground">Achieved: <span className="text-success font-semibold">23 Days</span></span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Insight Footer */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-6 p-4 rounded-xl border border-primary/20 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <TrendingUp className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground mb-0.5">Performance Insight</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Your production metrics are tracking well above target. Current efficiency rate suggests you'll exceed monthly goals by approximately 8%.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProductionReport;
