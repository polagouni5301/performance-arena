import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, Clock, Zap, CheckCircle, Gift, Star, Flame, TrendingUp, Phone, Users, Award } from "lucide-react";
import { cn } from "../../lib/utils";

const DailyChallenges = () => {
  const [challenges, setChallenges] = useState([
    {
      id: 1,
      title: "Revenue Champion",
      description: "Complete 10 more orders today",
      icon: Phone,
      progress: 15,
      target: 25,
      reward: 150,
      category: "Order",
      completed: false,
    },
    {
      id: 2,
      title: "NPS Rockstar",
      description: "Get  3 more promoter to be elite member",
      icon: Users,
      progress: 3,
      target: 6,
      reward: 100,
      category: "teamwork",
      completed: true,
    },
    {
      id: 3,
      title: "Hot Streak",
      description: "Win 5 games in a row",
      icon: Flame,
      progress: 3,
      target: 5,
      reward: 200,
      category: "games",
      completed: false,
    },
    
  ]);

  const [claimedRewards, setClaimedRewards] = useState(new Set([2]));
  const [showBonusAnimation, setShowBonusAnimation] = useState(false);

  const completedCount = challenges.filter(c => c.completed || c.progress >= c.target).length;
  const allCompleted = completedCount === challenges.length;
  const bonusReward = 500;

  const handleClaim = (id) => {
    if (!claimedRewards.has(id)) {
      setClaimedRewards(new Set([...claimedRewards, id]));
    }
  };

  const handleClaimBonus = () => {
    if (allCompleted && !showBonusAnimation) {
      setShowBonusAnimation(true);
      setTimeout(() => setShowBonusAnimation(false), 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative rounded-2xl overflow-hidden"
      style={{
        background: "linear-gradient(135deg, hsla(260, 40%, 10%, 0.9) 0%, hsla(280, 30%, 8%, 0.95) 100%)",
        border: "1px solid hsla(280, 50%, 30%, 0.3)",
      }}
    >
      {/* Header */}
      <div className="p-4 lg:p-6 border-b border-purple-500/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-[0_0_20px_hsla(195,100%,50%,0.4)]">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-foreground">Daily Challenges</h3>
              <p className="text-xs text-muted-foreground">Complete all for bonus rewards</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-500/20 border border-purple-500/30">
            <Clock className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-mono text-purple-400">23:45:12</span>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-3 bg-slate-800/80 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(completedCount / challenges.length) * 100}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              style={{
                boxShadow: "0 0 20px hsla(280, 100%, 60%, 0.5)",
              }}
            />
          </div>
          <span className="text-sm font-bold text-foreground">
            {completedCount}/{challenges.length}
          </span>
        </div>
      </div>

      {/* Challenge List */}
      <div className="p-4 lg:p-6 space-y-3">
        {challenges.map((challenge, index) => {
          const isComplete = challenge.completed || challenge.progress >= challenge.target;
          const isClaimed = claimedRewards.has(challenge.id);
          const progressPercent = Math.min((challenge.progress / challenge.target) * 100, 100);

          return (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "relative p-4 rounded-xl border transition-all duration-300",
                isComplete 
                  ? "bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border-emerald-500/30"
                  : "bg-slate-900/50 border-slate-700/50 hover:border-purple-500/30"
              )}
            >
              <div className="flex items-center gap-4">
                {/* Icon */}
                <div className={cn(
                  "p-2.5 rounded-xl transition-all duration-300",
                  isComplete 
                    ? "bg-gradient-to-br from-emerald-500 to-cyan-500 shadow-[0_0_15px_hsla(160,100%,50%,0.4)]"
                    : "bg-slate-800 border border-slate-700"
                )}>
                  {isComplete ? (
                    <CheckCircle className="w-5 h-5 text-white" />
                  ) : (
                    <challenge.icon className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className={cn(
                      "font-bold text-sm",
                      isComplete ? "text-emerald-400" : "text-foreground"
                    )}>
                      {challenge.title}
                    </h4>
                    {isComplete && !isClaimed && (
                      <motion.span
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold"
                      >
                        CLAIM
                      </motion.span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{challenge.description}</p>
                  
                  {/* Progress Bar */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        className={cn(
                          "h-full rounded-full",
                          isComplete 
                            ? "bg-gradient-to-r from-emerald-400 to-cyan-400"
                            : "bg-gradient-to-r from-purple-500 to-pink-500"
                        )}
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ duration: 0.8, delay: index * 0.1 }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {challenge.progress}/{challenge.target}
                    </span>
                  </div>
                </div>

                {/* Reward / Claim Button */}
                <div className="flex flex-col items-end">
                  {isComplete && !isClaimed ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleClaim(challenge.id)}
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-sm shadow-[0_0_20px_hsla(45,100%,50%,0.4)] hover:shadow-[0_0_30px_hsla(45,100%,50%,0.6)] transition-all"
                    >
                      +{challenge.reward}
                    </motion.button>
                  ) : isClaimed ? (
                    <div className="flex items-center gap-1 text-emerald-400">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-xs font-bold">Claimed</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50">
                      <Star className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-sm font-bold text-amber-400">+{challenge.reward}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bonus Reward Section */}
      <div className="p-4 lg:p-6 border-t border-purple-500/20">
        <motion.div
          className={cn(
            "relative p-4 rounded-xl overflow-hidden transition-all duration-500",
            allCompleted 
              ? "bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-pink-500/20 border border-amber-500/40"
              : "bg-slate-900/50 border border-slate-700/30"
          )}
          animate={allCompleted ? {
            boxShadow: ["0 0 20px hsla(45, 100%, 50%, 0.2)", "0 0 40px hsla(45, 100%, 50%, 0.4)", "0 0 20px hsla(45, 100%, 50%, 0.2)"]
          } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {/* Bonus Particles */}
          <AnimatePresence>
            {showBonusAnimation && (
              <>
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full bg-amber-400"
                    initial={{ 
                      x: "50%", 
                      y: "50%",
                      scale: 0 
                    }}
                    animate={{ 
                      x: `${Math.random() * 100}%`,
                      y: `${Math.random() * 100}%`,
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0]
                    }}
                    transition={{ duration: 1, delay: i * 0.05 }}
                  />
                ))}
              </>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <motion.div
                className={cn(
                  "p-3 rounded-xl",
                  allCompleted 
                    ? "bg-gradient-to-br from-amber-400 to-orange-500 shadow-[0_0_25px_hsla(45,100%,50%,0.5)]"
                    : "bg-slate-800 border border-slate-700"
                )}
                animate={allCompleted ? { rotate: [0, 5, -5, 0] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Gift className={cn("w-6 h-6", allCompleted ? "text-white" : "text-muted-foreground")} />
              </motion.div>
              <div>
                <h4 className={cn(
                  "font-bold",
                  allCompleted ? "text-amber-400" : "text-muted-foreground"
                )}>
                  Completion Bonus
                </h4>
                <p className="text-xs text-muted-foreground">
                  Complete all challenges to unlock
                </p>
              </div>
            </div>

            <motion.button
              whileHover={allCompleted ? { scale: 1.05 } : {}}
              whileTap={allCompleted ? { scale: 0.95 } : {}}
              onClick={handleClaimBonus}
              disabled={!allCompleted}
              className={cn(
                "px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all",
                allCompleted
                  ? "bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 text-white shadow-[0_0_30px_hsla(45,100%,50%,0.5)] hover:shadow-[0_0_50px_hsla(45,100%,50%,0.7)]"
                  : "bg-slate-800 text-muted-foreground border border-slate-700 cursor-not-allowed"
              )}
            >
              <Award className="w-5 h-5" />
              <span>+{bonusReward} PTS</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DailyChallenges;
