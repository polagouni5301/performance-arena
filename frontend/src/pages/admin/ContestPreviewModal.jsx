/**
 * Contest Preview Modal
 * Shows how the contest will appear on landing page and contest page
 */
import { useState } from "react";
import { motion } from "framer-motion";
import { X, Home, Trophy, Share2, Copy, Check } from "lucide-react";

const ContestPreviewModal = ({ isOpen, onClose, contest }) => {
  const [copied, setCopied] = useState(false);
  const [previewMode, setPreviewMode] = useState("banner");

  if (!isOpen || !contest) return null;

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const startDate = new Date(contest.startDate);
  const endDate = new Date(contest.endDate);
  const daysRemaining = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl glass-card border border-border/50"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 p-6 border-b border-border/50 bg-background/50 backdrop-blur-sm flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">{contest.name} - Preview</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector */}
        <div className="p-6 border-b border-border/50 flex items-center gap-4">
          <button
            onClick={() => setPreviewMode("banner")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              previewMode === "banner"
                ? "bg-primary text-primary-foreground"
                : "bg-muted/30 text-foreground hover:bg-muted/50"
            }`}
          >
            <Home className="w-4 h-4" />
            Landing Banner
          </button>
          <button
            onClick={() => setPreviewMode("contest")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              previewMode === "contest"
                ? "bg-primary text-primary-foreground"
                : "bg-muted/30 text-foreground hover:bg-muted/50"
            }`}
          >
            <Trophy className="w-4 h-4" />
            Contest Page
          </button>
        </div>

        {/* Preview Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {previewMode === "banner" ? (
            // Banner Preview
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <p className="text-xs text-muted-foreground mb-3">
                  How it appears on the Landing Page
                </p>
                <div
                  className="relative rounded-xl overflow-hidden border-2 border-dashed"
                  style={{ borderColor: contest.theme.primary }}
                >
                  {/* Banner Background */}
                  <div
                    className="p-8 text-white"
                    style={{
                      background: `linear-gradient(135deg, ${contest.theme.primary}dd 0%, ${contest.theme.accent}dd 100%)`,
                    }}
                  >
                    {/* Banner Content */}
                    <div className="max-w-2xl">
                      <div className="flex items-center gap-3 mb-4">
                        <Trophy
                          className="w-8 h-8"
                          style={{ color: contest.theme.secondary }}
                        />
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20">
                          NEW CONTEST
                        </span>
                      </div>

                      <h1 className="text-3xl md:text-4xl font-bold mb-2">
                        {contest.name}
                      </h1>
                      <p className="text-sm md:text-base opacity-90 mb-6 max-w-lg">
                        {contest.description || "Join this exclusive contest and showcase your performance. Compete with your peers and win amazing rewards!"}
                      </p>

                      <div className="flex flex-wrap items-center gap-6 mb-6">
                        <div>
                          <p className="text-xs opacity-75 mb-1">Duration</p>
                          <p className="font-bold text-lg">{daysRemaining} Days</p>
                        </div>
                        <div>
                          <p className="text-xs opacity-75 mb-1">Metrics</p>
                          <p className="font-bold text-lg">
                            {contest.metrics?.length || 0}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs opacity-75 mb-1">Reward Pool</p>
                          <p className="font-bold text-lg">
                            {contest.rewards?.length || 0} Tiers
                          </p>
                        </div>
                      </div>

                      <button
                        className="px-6 py-2.5 rounded-lg font-semibold transition-all"
                        style={{
                          backgroundColor: contest.theme.secondary,
                          color: "white",
                        }}
                      >
                        REGISTER & JOIN
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Banner Code */}
              <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    Embed Code
                  </p>
                  <button
                    onClick={() =>
                      handleCopy(
                        `<!-- ${contest.name} Banner --> <div style="background: linear-gradient(135deg, ${contest.theme.primary} 0%, ${contest.theme.accent} 100%);"></div>`
                      )
                    }
                    className="flex items-center gap-1 px-2 py-1 rounded text-xs text-primary hover:bg-primary/10 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <code className="text-xs text-muted-foreground font-mono break-all">
                  &lt;div className="contest-banner" style="background:
                  linear-gradient(135deg, {contest.theme.primary} 0%,
                  {contest.theme.accent} 100%)"&gt;...&lt;/div&gt;
                </code>
              </div>
            </motion.div>
          ) : (
            // Contest Page Preview
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <p className="text-xs text-muted-foreground mb-3">
                  How it appears on the Contest Page
                </p>
                <div className="rounded-xl bg-muted/20 border border-border/30 overflow-hidden">
                  {/* Contest Page Header */}
                  <div
                    className="p-8 text-white"
                    style={{
                      background: `linear-gradient(135deg, ${contest.theme.primary} 0%, ${contest.theme.secondary} 100%)`,
                    }}
                  >
                    <h1 className="text-3xl font-bold mb-2">{contest.name}</h1>
                    <p className="text-sm opacity-90 mb-6">
                      {contest.description}
                    </p>

                    <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs opacity-75">Starts</p>
                        <p className="font-semibold">{contest.startDate}</p>
                      </div>
                      <div>
                        <p className="text-xs opacity-75">Ends</p>
                        <p className="font-semibold">{contest.endDate}</p>
                      </div>
                      <div>
                        <p className="text-xs opacity-75">Duration</p>
                        <p className="font-semibold">{daysRemaining}d</p>
                      </div>
                      <div>
                        <p className="text-xs opacity-75">Status</p>
                        <p className="font-semibold">Upcoming</p>
                      </div>
                    </div>
                  </div>

                  {/* Metrics Section */}
                  <div className="p-8">
                    <h2 className="text-lg font-bold text-foreground mb-4">
                      Performance Metrics
                    </h2>
                    <div className="space-y-3">
                      {contest.metrics?.slice(0, 3).map((metric, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-lg bg-muted/30 border border-border/30 flex items-center justify-between"
                        >
                          <div>
                            <p className="font-medium text-foreground">
                              {metric.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Target: {metric.target} • Weight: {metric.weightage}%
                            </p>
                          </div>
                          <div
                            className="px-3 py-1 rounded-full text-xs font-medium text-white"
                            style={{ backgroundColor: contest.theme.accent }}
                          >
                            {metric.weightage}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Rewards Section */}
                  <div className="p-8 border-t border-border/30">
                    <h2 className="text-lg font-bold text-foreground mb-4">
                      🏆 Rewards
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { pos: "🥇 1st", points: "5000+" },
                        { pos: "🥈 2nd", points: "3000+" },
                        { pos: "🥉 3rd", points: "1000+" },
                      ].map((reward, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-lg text-center"
                          style={{
                            backgroundColor: `${contest.theme.primary}20`,
                            borderColor: contest.theme.primary,
                            borderWidth: "1px",
                          }}
                        >
                          <p className="text-lg font-bold text-foreground mb-1">
                            {reward.pos}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {reward.points} Points
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 p-6 border-t border-border/50 bg-background/50 backdrop-blur-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/30 text-foreground hover:bg-muted/50 transition-colors text-sm font-medium">
              <Share2 className="w-4 h-4" />
              Share Preview
            </button>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Close Preview
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ContestPreviewModal;
