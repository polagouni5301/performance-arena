import React from 'react';

const defaultRewards = [
  { id: 1, name: 'Sipper', key: 'sipper' },
  { id: 2, name: 'Headset', key: 'headset' },
  { id: 3, name: 'Bonus XPS', key: 'bonus-xps' },
  { id: 4, name: 'Bonus Points', key: 'bonus-points' },
  { id: 5, name: 'Coffee Mug', key: 'coffee-mug' },
  { id: 6, name: 'T-Shirt', key: 't-shirt' },
  { id: 7, name: 'Cheers', key: 'cheers' },
  { id: 8, name: 'Laptop Bag', key: 'laptop-bag' },
  { id: 9, name: 'Hoodie', key: 'hoodie' }
];

const RewardsGallery = ({ rewards = defaultRewards, images = {} }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
      {rewards.map((r) => (
        <div key={r.id} className="flex flex-col items-center group">
          <div className="w-32 h-32 mb-4 rounded-xl bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center overflow-hidden border border-slate-700/40 hover:border-primary/50 transition-all group-hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)]">
            {images[r.key] ? (
              <img src={images[r.key]} alt={r.name} className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-300" />
            ) : (
              <div className="text-xs text-muted-foreground text-center px-2">{r.name}</div>
            )}
          </div>
          <div className="text-sm font-medium text-foreground text-center group-hover:text-primary transition-colors">{r.name}</div>
        </div>
      ))}
    </div>
  );
};

export default RewardsGallery;
