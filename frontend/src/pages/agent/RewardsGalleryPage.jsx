import React from 'react';
import RewardsGallery from '@/components/ui/RewardsGallery';

const sampleRewards = [
  { id: 'reward_1', name: 'Messaging - Email Support Excellence Reward', key: 'email-reward' },
  { id: 'reward_2', name: 'Messaging - Hosting Excellence Reward', key: 'hosting-reward' },
  { id: 'reward_3', name: 'Messaging - Account Support Excellence Reward', key: 'account-reward' },
  { id: 'reward_4', name: 'Messaging - General Excellence Reward', key: 'general-reward' },
  { id: 'reward_5', name: 'Messaging - Sales Excellence Reward', key: 'sales-reward' },
];

const RewardsGalleryPage = () => {
  return (
    <div className="min-h-screen p-6 max-w-[1200px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Rewards Gallery</h1>
        <p className="text-sm text-muted-foreground mt-1">Browse available rewards and images.</p>
      </div>

      <div className="bg-card p-4 rounded-lg border border-border">
        <RewardsGallery rewards={sampleRewards} />
      </div>
    </div>
  );
};

export default RewardsGalleryPage;
