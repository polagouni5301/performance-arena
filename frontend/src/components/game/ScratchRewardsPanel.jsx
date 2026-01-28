import ScratchRewardItem from "./ScratchRewardItem";

const ScratchRewardsPanel = ({ cards, onScratch }) => {
  const pending = cards.filter(c => c.status === "PENDING");
  const history = cards.filter(c => c.status !== "PENDING");

  return (
    <div className="space-y-6">
      {/* Pending */}
      <div>
        <h3 className="text-xs font-display tracking-widest text-accent mb-3">
          SCRATCH REWARDS
        </h3>

        <div className="space-y-3">
          {pending.length === 0 && (
            <p className="text-xs text-muted-foreground">
              No pending scratch cards
            </p>
          )}

          {pending.map(card => (
            <ScratchRewardItem
              key={card.id}
              card={card}
              onScratch={onScratch}
            />
          ))}
        </div>
      </div>

      {/* History */}
      <div>
        <h3 className="text-xs font-display tracking-widest text-muted-foreground mb-3">
          CARD HISTORY
        </h3>

        <div className="space-y-2">
          {history.map(card => (
            <ScratchRewardItem
              key={card.id}
              card={card}
              onScratch={() => {}}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScratchRewardsPanel;
