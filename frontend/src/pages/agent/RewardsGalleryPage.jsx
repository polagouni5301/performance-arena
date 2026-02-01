import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Star, Sparkles, Crown, Eye, X, ChevronLeft, ChevronRight, Gem, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

import cheersPoints from '@/assets/rewardsimgs/cheers-points.png';
import coffeeMug from '@/assets/rewardsimgs/coffee-mug.png';
import headset from '@/assets/rewardsimgs/headset.png';
import hoodie from '@/assets/rewardsimgs/hoodie.png';
import laptopBag from '@/assets/rewardsimgs/laptop-bag.png';
import points from '@/assets/rewardsimgs/points.png';
import tShirt from '@/assets/rewardsimgs/t-shirt.png';
import xps from '@/assets/rewardsimgs/xps.png';
import earbuds from '@/assets/rewardsimgs/earbuds.png';
import whitehoodie from '@/assets/rewardsimgs/white-hoodie.png';
import sipper from '@/assets/rewardsimgs/sipper.png';

const rewards = [
  { id: 'sipper', name: 'Premium Sipper', key: 'sipper', points: 500, rarity: 'common', description: 'Stay hydrated in style' },
  { id: 'headset', name: 'Gaming Headset', key: 'headset', points: 2500, rarity: 'epic', description: 'Crystal clear audio experience' },
  { id: 'coffee-mug', name: 'Coffee Mug', key: 'coffee-mug', points: 300, rarity: 'common', description: 'Start your day right' },
  { id: 't-shirt', name: 'Company T-Shirt', key: 't-shirt', points: 800, rarity: 'rare', description: 'Show your team spirit' },
  { id: 'laptop-bag', name: 'Laptop Bag', key: 'laptop-bag', points: 3500, rarity: 'legendary', description: 'Premium carry for your gear' },
  { id: 'hoodie', name: 'Tech Hoodie', key: 'hoodie', points: 1500, rarity: 'rare', description: 'Comfortable & stylish' },
  { id: 'earbuds', name: 'Wireless Earbuds', key: 'earbuds', points: 2000, rarity: 'epic', description: 'Premium wireless audio' },
  { id: 'white-hoodie', name: 'White Hoodie', key: 'white-hoodie', points: 1800, rarity: 'rare', description: 'Limited edition design' },
  { id: 'bonus-xps', name: 'Bonus XPS', key: 'bonus-xps', points: 1000, rarity: 'epic', description: '+500 XP boost' },
  { id: 'bonus-points', name: 'Bonus Points', key: 'bonus-points', points: 750, rarity: 'rare', description: '+1000 points boost' },
  { id: 'cheers', name: 'Cheers Recognition', key: 'cheers', points: 200, rarity: 'common', description: 'Celebrate achievements' },
];

const images = {
  'sipper': sipper,
  'headset': headset,
  'bonus-xps': xps,
  'bonus-points': points,
  'coffee-mug': coffeeMug,
  't-shirt': tShirt,
  'cheers': cheersPoints,
  'laptop-bag': laptopBag,
  'hoodie': hoodie,
  'white-hoodie': whitehoodie,
  'earbuds': earbuds,
};

const rarityConfig = {
  common: { 
    gradient: "from-slate-500/20 to-slate-600/20", 
    border: "border-slate-400/30",
    glow: "",
    label: "COMMON",
    labelBg: "bg-slate-500/20",
    labelColor: "text-slate-300",
    iconColor: "text-slate-400"
  },
  rare: { 
    gradient: "from-secondary/20 to-blue-600/20", 
    border: "border-secondary/40",
    glow: "shadow-[0_0_30px_hsla(195,100%,50%,0.2)]",
    label: "RARE",
    labelBg: "bg-secondary/20",
    labelColor: "text-secondary",
    iconColor: "text-secondary"
  },
  epic: { 
    gradient: "from-primary/20 to-pink-600/20", 
    border: "border-primary/40",
    glow: "shadow-[0_0_35px_hsla(320,100%,55%,0.25)]",
    label: "EPIC",
    labelBg: "bg-primary/20",
    labelColor: "text-primary",
    iconColor: "text-primary"
  },
  legendary: { 
    gradient: "from-accent/25 via-yellow-500/20 to-warning/25", 
    border: "border-accent/50",
    glow: "shadow-[0_0_40px_hsla(45,100%,50%,0.3)]",
    label: "LEGENDARY",
    labelBg: "bg-accent/20",
    labelColor: "text-accent",
    iconColor: "text-accent"
  },
};

const RewardCard = ({ reward, image, onClick, index }) => {
  const rarity = rarityConfig[reward.rarity] || rarityConfig.common;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "relative group cursor-pointer rounded-2xl overflow-hidden transition-all duration-300",
        "bg-gradient-to-br border backdrop-blur-sm",
        rarity.gradient,
        rarity.border,
        rarity.glow,
        "hover:shadow-2xl"
      )}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-3xl opacity-0 group-hover:opacity-60 transition-opacity duration-500" />
      
      {/* Shimmer Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"
        animate={{ x: ["-100%", "200%"] }}
        transition={{ duration: 3, repeat: Infinity, repeatDelay: 4 }}
      />

      {/* Rarity Badge */}
      <div className="absolute top-3 left-3 z-10">
        <span className={cn(
          "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
          rarity.labelBg,
          rarity.labelColor
        )}>
          {rarity.label}
        </span>
      </div>

      {/* View Icon */}
      <div className="absolute top-3 right-3 z-10">
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="w-8 h-8 rounded-full bg-background/50 backdrop-blur-sm border border-border/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Eye className="w-4 h-4 text-foreground" />
        </motion.div>
      </div>

      {/* Image Container */}
      <div className="relative h-40 flex items-center justify-center p-6 overflow-hidden">
        {image ? (
          <motion.img
            src={image}
            alt={reward.name}
            className="max-h-full max-w-full object-contain drop-shadow-2xl"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          />
        ) : (
          <div className={cn("w-20 h-20 rounded-2xl flex items-center justify-center bg-muted/30", rarity.border)}>
            <Gift className={cn("w-10 h-10", rarity.iconColor)} />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="relative p-4 pt-2 space-y-3 bg-gradient-to-t from-background/80 to-transparent">
        <div>
          <h3 className="font-bold text-foreground text-base mb-1">{reward.name}</h3>
          <p className="text-xs text-muted-foreground line-clamp-1">{reward.description}</p>
        </div>

        {/* Points */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Star className="w-4 h-4 text-accent" />
            <span className="font-bold text-accent">{reward.points.toLocaleString()}</span>
            <span className="text-xs text-muted-foreground">pts</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all",
              "bg-primary/20 border-primary/40 text-primary hover:bg-primary/30"
            )}
          >
            Redeem
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const RewardModal = ({ reward, image, onClose, rarity }) => {
  const rarityStyle = rarityConfig[rarity] || rarityConfig.common;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "relative w-full max-w-md rounded-3xl overflow-hidden border-2 bg-gradient-to-br from-card to-background",
          rarityStyle.border,
          rarityStyle.glow
        )}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-muted transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-[80px]" />
        </div>

        {/* Rarity Badge */}
        <div className="absolute top-4 left-4 z-10">
          <span className={cn(
            "px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5",
            rarityStyle.labelBg,
            rarityStyle.labelColor
          )}>
            <Gem className="w-3.5 h-3.5" />
            {rarityStyle.label}
          </span>
        </div>

        {/* Image */}
        <div className="relative h-64 flex items-center justify-center p-8 bg-gradient-to-b from-muted/20 to-transparent">
          {image ? (
            <motion.img
              src={image}
              alt={reward.name}
              className="max-h-full max-w-full object-contain drop-shadow-2xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            />
          ) : (
            <Gift className={cn("w-24 h-24", rarityStyle.iconColor)} />
          )}
        </div>

        {/* Content */}
        <div className="relative p-6 space-y-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-2">{reward.name}</h2>
            <p className="text-muted-foreground">{reward.description}</p>
          </div>

          {/* Points Display */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-accent/10 border border-accent/30">
              <Star className="w-6 h-6 text-accent" />
              <span className="text-2xl font-bold text-accent">{reward.points.toLocaleString()}</span>
              <span className="text-sm text-accent/70">points</span>
            </div>
          </div>

          {/* Redeem Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-lg shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-shadow"
          >
            Redeem Now
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const RewardsGalleryPage = () => {
  const [selectedReward, setSelectedReward] = useState(null);
  const [filter, setFilter] = useState('all');
  
  const filteredRewards = filter === 'all' 
    ? rewards 
    : rewards.filter(r => r.rarity === filter);

  const filters = [
    { id: 'all', label: 'All Rewards', icon: Gift },
    { id: 'legendary', label: 'Legendary', icon: Crown },
    { id: 'epic', label: 'Epic', icon: Sparkles },
    { id: 'rare', label: 'Rare', icon: Star },
    { id: 'common', label: 'Common', icon: Trophy },
  ];

  return (
    <div className="min-h-screen relative">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-card to-background" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[200px] bg-primary/5" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-[180px] bg-accent/5" />
        {/* Floating particles */}
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-accent/30"
            animate={{ y: [0, -100, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 6 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 5 }}
            style={{ left: `${Math.random() * 100}%`, top: `${60 + Math.random() * 40}%` }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto p-6 space-y-6">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent to-warning flex items-center justify-center shadow-lg shadow-accent/30">
                <Gift className="w-7 h-7 text-white" />
              </div>
              <motion.div
                className="absolute -inset-1 rounded-xl bg-gradient-to-r from-accent to-warning opacity-20"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight" style={{ fontFamily: "'Sora', sans-serif" }}>
                Rewards Gallery
              </h1>
              <p className="text-sm text-muted-foreground">
                Browse and redeem your earned rewards
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-accent/10 border border-accent/30">
              <p className="text-[10px] text-accent/70 uppercase tracking-wider">Total Rewards</p>
              <p className="text-lg font-bold text-accent">{rewards.length}</p>
            </div>
            <div className="px-4 py-2 rounded-xl bg-primary/10 border border-primary/30">
              <p className="text-[10px] text-primary/70 uppercase tracking-wider">Your Balance</p>
              <p className="text-lg font-bold text-primary">5,250 pts</p>
            </div>
          </div>
        </motion.header>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-2 flex-wrap"
        >
          {filters.map((f) => (
            <motion.button
              key={f.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setFilter(f.id)}
              className={cn(
                "px-4 py-2.5 rounded-xl font-medium text-sm border transition-all flex items-center gap-2",
                filter === f.id
                  ? "bg-primary/20 border-primary/50 text-primary shadow-lg"
                  : "bg-muted/20 border-border/50 text-muted-foreground hover:text-foreground hover:border-border"
              )}
            >
              <f.icon className="w-4 h-4" />
              {f.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Rewards Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
        >
          <AnimatePresence mode="popLayout">
            {filteredRewards.map((reward, index) => (
              <RewardCard
                key={reward.id}
                reward={reward}
                image={images[reward.key]}
                onClick={() => setSelectedReward(reward)}
                index={index}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredRewards.length === 0 && (
          <div className="text-center py-16">
            <Gift className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">No rewards found in this category</p>
          </div>
        )}
      </div>

      {/* Reward Modal */}
      <AnimatePresence>
        {selectedReward && (
          <RewardModal
            reward={selectedReward}
            image={images[selectedReward.key]}
            rarity={selectedReward.rarity}
            onClose={() => setSelectedReward(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default RewardsGalleryPage;
