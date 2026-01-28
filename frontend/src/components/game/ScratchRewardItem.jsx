import { motion } from "framer-motion";
import { Gift, Clock, ChevronRight, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

const ScratchRewardItem = ({ card, onScratch }) => {
  const isPending = card.status === "PENDING";

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={cn(
        "flex items-center justify-between rounded-xl border p-4",
        "bg-gradient-to-br from-background/80 to-card/60 backdrop-blur",
        isPending
          ? "border-accent/40 hover:shadow-accent/30"
          : "border-border opacity-70"
      )}
    >
      {/* Left */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
          {isPending ? (
            <Gift className="w-5 h-5 text-accent" />
          ) : (
            <Lock className="w-5 h-5 text-muted-foreground" />
          )}
        </div>

        <div>
          <p className="text-sm font-display tracking-wide">
            {isPending ? "Mystery Scratch" : card.reward}
          </p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
            <Clock className="w-3 h-3" />
            <span>Allocated {card.date}</span>
          </div>
        </div>
      </div>

      {/* Right */}
      {isPending ? (
        <button
          onClick={() => onScratch(card)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                     bg-accent text-accent-foreground text-xs
                     hover:bg-accent/90 transition"
        >
          Scratch Now
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      ) : (
        <span className="text-xs px-2 py-1 rounded-md bg-success/15 text-success">
          Claimed
        </span>
      )}
    </motion.div>
  );
};

export default ScratchRewardItem;
