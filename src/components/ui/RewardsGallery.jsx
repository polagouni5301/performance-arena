import React from 'react';
import { motion } from 'framer-motion';

const defaultRewards = [
  { id: 1, name: 'Sipper', key: 'sippe' },
  { id: 2, name: 'Headset', key: 'headset' },
  { id: 3, name: 'Bonus XPS', key: 'bonus-xps' },
  { id: 4, name: 'Bonus Points', key: 'bonus-points' },
  { id: 5, name: 'Coffee Mug', key: 'coffee-mug' },
  { id: 6, name: 'T-Shirt', key: 't-shirt' },
  { id: 7, name: 'Cheers', key: 'cheers' },
  { id: 8, name: 'Laptop Bag', key: 'laptop-bag' },
  { id: 9, name: 'Hoodie', key: 'hoodie' },
  { id: 10, name: 'White-Hoodie', key: 'white-hoodie' },
  { id: 11, name: 'EarBuds', key: 'earbuds' }
];

const RewardsGallery = ({ rewards = defaultRewards, images = {} }) => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-2 gap-10 p-8">
        {rewards.map((r, idx) => (
          <motion.div 
            key={r.id} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex flex-col items-center group"
          >
            {/* Image Container with rounded border */}
            <motion.div 
              whileHover={{ scale: 1.08 }}
              className="relative mb-6 rounded-3xl overflow-hidden border-4 border-primary/50 hover:border-primary/90 transition-all duration-300 shadow-2xl hover:shadow-[0_0_50px_rgba(var(--primary-rgb),0.5)] bg-gradient-to-br from-slate-800/40 to-slate-900/60 backdrop-blur-md p-4 w-full max-w-xs"
            >
              {images[r.key] ? (
                <div className="relative rounded-2xl overflow-hidden bg-slate-900/50 h-full flex items-center justify-center min-h-[380px] w-full">
                  <img 
                    src={images[r.key]} 
                    alt={r.name} 
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 filter drop-shadow-2xl" 
                  />
                </div>
              ) : (
                <div className="h-96 w-full rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                  <span className="text-xl font-semibold text-muted-foreground text-center px-4">{r.name}</span>
                </div>
              )}
              
              {/* Premium badge */}
              <div className="absolute top-6 right-6 px-4 py-2 rounded-full bg-gradient-to-r from-primary/90 to-secondary/90 text-white text-xs font-bold uppercase tracking-widest shadow-xl">
                Premium
              </div>

              
            </motion.div>

            {/* Text label below image */}
            <motion.div 
              className="text-center w-full"
              whileHover={{ y: -2 }}
            >
              <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-200 mb-3">
                {r.name}
              </h3>
              <div className="flex items-center justify-center gap-2">
                <motion.div 
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/40 hover:border-primary/70 transition-all"
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="text-sm font-bold text-primary">✨ Reward Item</span>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RewardsGallery;
