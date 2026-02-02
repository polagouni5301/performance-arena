/**
 * Contest Builder - Admin custom contest creation
 * Allows admins to create branded contests with template customization
 */
import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Eye,
  Download,
  Share2,
  Settings,
  Palette,
  Calendar,
  Gift,
  TrendingUp,
  Check,
  X,
  ChevronRight,
  Clock,
  Users,
  Zap,
  Home,
  FileText,
  Search,
  Trash2,
  Trophy,
} from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";
import ContestTemplateDesigner from "./ContestTemplateDesigner";
import ContestPreviewModal from "./ContestPreviewModal";
import ContestMailerGenerator from "./ContestMailerGenerator";
import { adminApi } from "@/api";
import { toast } from "sonner";

const ContestBuilder = () => {
  const [activeTab, setActiveTab] = useState("create");
  const [showTemplateDesigner, setShowTemplateDesigner] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showMailer, setShowMailer] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContest, setSelectedContest] = useState(null);
  const [deletingContest, setDeletingContest] = useState(null);
  const [loading, setLoading] = useState(false);

  const [contests, setContests] = useState([
    {
      id: 1,
      name: "Q4 Revenue Sprint",
      status: "published",
      startDate: "2026-02-01",
      endDate: "2026-02-15",
      metrics: 3,
      theme: { primary: "#8B5CF6", accent: "#EC4899" },
      createdAt: "Jan 20, 2026",
    },
    {
      id: 2,
      name: "Customer Satisfaction Blitz",
      status: "draft",
      startDate: "2026-02-15",
      endDate: "2026-03-01",
      metrics: 2,
      theme: { primary: "#3B82F6", accent: "#06B6D4" },
      createdAt: "Jan 15, 2026",
    },
  ]);

  const [newContest, setNewContest] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    metrics: [],
    rewards: [],
    theme: {
      primary: "#8B5CF6",
      secondary: "#3B82F6",
      accent: "#EC4899",
      backgroundColor: "#1a1a2e",
    },
    template: "default",
    bannerText: "",
    targetAudience: "all",
  });

  // Fetch contests from backend
  const fetchContests = useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminApi.getContests();
      if (data?.contests) {
        setContests(data.contests);
      }
    } catch (error) {
      console.error("Error fetching contests:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContests();
  }, [fetchContests]);

  const handleDeleteContest = useCallback(async (contestId) => {
    if (!confirm("Are you sure you want to delete this contest?")) return;
    
    setDeletingContest(contestId);
    try {
      await adminApi.deleteContest(contestId);
      toast.success("Contest deleted successfully");
      fetchContests();
    } catch (error) {
      toast.error("Failed to delete contest");
      console.error("Delete error:", error);
    } finally {
      setDeletingContest(null);
    }
  }, [fetchContests]);

  const handleCreateContest = () => {
    if (newContest.name && newContest.startDate && newContest.endDate) {
      const contest = {
        id: Math.max(...contests.map((c) => c.id), 0) + 1,
        ...newContest,
        status: "draft",
        createdAt: new Date().toLocaleDateString(),
      };
      setContests([...contests, contest]);
      setNewContest({
        name: "",
        description: "",
        startDate: "",
        endDate: "",
        metrics: [],
        rewards: [],
        theme: {
          primary: "#8B5CF6",
          secondary: "#3B82F6",
          accent: "#EC4899",
          backgroundColor: "#1a1a2e",
        },
        template: "default",
        bannerText: "",
        targetAudience: "all",
      });
      setShowTemplateDesigner(false);
    }
  };

  const handlePublish = async (contestId) => {
    try {
      await adminApi.publishContest(contestId);
      toast.success("Contest published successfully");
      fetchContests();
    } catch (error) {
      toast.error("Failed to publish contest");
    }
  };

  const filteredContests = contests.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Custom Contest Builder</h1>
          <p className="text-muted-foreground mt-1">
            Create branded, high-impact contests with custom themes and metrics
          </p>
        </div>
        <button
          onClick={() => setShowTemplateDesigner(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Contest
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border/50">
        {[
          { id: "create", label: "Create Contest", icon: Plus },
          { id: "live", label: "Live Contests", icon: Zap },
          { id: "drafts", label: "Drafts", icon: FileText },
          { id: "templates", label: "Templates", icon: Palette },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors",
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === "create" && (
          <motion.div
            key="create"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <GlassCard className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Contests</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{contests.length}</p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Published</p>
                    <p className="text-2xl font-bold text-success mt-1">
                      {contests.filter((c) => c.status === "published").length}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-success/20 flex items-center justify-center">
                    <Check className="w-6 h-6 text-success" />
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Drafts</p>
                    <p className="text-2xl font-bold text-warning mt-1">
                      {contests.filter((c) => c.status === "draft").length}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-warning/20 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-warning" />
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Contest List */}
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-foreground">Your Contests</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search contests..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 rounded-lg bg-muted/30 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              <div className="space-y-3">
                {filteredContests.length > 0 ? (
                  filteredContests.map((contest) => (
                    <motion.div
                      key={contest.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-lg bg-muted/20 border border-border/30 hover:border-primary/50 transition-all group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-foreground">{contest.name}</h3>
                            <span
                              className={cn(
                                "px-2 py-1 rounded-full text-xs font-medium",
                                contest.status === "published"
                                  ? "bg-success/20 text-success"
                                  : "bg-warning/20 text-warning"
                              )}
                            >
                              {contest.status === "published" ? "PUBLISHED" : "DRAFT"}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-muted-foreground mt-2">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{contest.startDate}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <TrendingUp className="w-4 h-4" />
                              <span>{Array.isArray(contest.metrics) ? contest.metrics.length : contest.metrics} metrics</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              <span>Target: All</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span>{contest.createdAt}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => {
                              setSelectedContest(contest);
                              setShowPreview(true);
                            }}
                            className="p-2 rounded-lg hover:bg-muted/50 transition-colors"
                            title="Preview"
                          >
                            <Eye className="w-4 h-4 text-muted-foreground" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedContest(contest);
                              setShowMailer(true);
                            }}
                            className="p-2 rounded-lg hover:bg-muted/50 transition-colors"
                            title="Generate Mailer"
                          >
                            <Download className="w-4 h-4 text-muted-foreground" />
                          </button>
                          {contest.status === "draft" && (
                            <button
                              onClick={() => handlePublish(contest.id)}
                              className="p-2 rounded-lg hover:bg-success/20 transition-colors"
                              title="Publish"
                            >
                              <Share2 className="w-4 h-4 text-muted-foreground hover:text-success" />
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setSelectedContest(contest);
                              setShowTemplateDesigner(true);
                            }}
                            className="p-2 rounded-lg hover:bg-muted/50 transition-colors"
                            title="Edit"
                          >
                            <Settings className="w-4 h-4 text-muted-foreground" />
                          </button>
                          <button
                            onClick={() => handleDeleteContest(contest.id)}
                            disabled={deletingContest === contest.id}
                            className="p-2 rounded-lg hover:bg-destructive/20 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No contests found</p>
                  </div>
                )}
              </div>
            </GlassCard>
          </motion.div>
        )}

        {activeTab === "live" && (
          <motion.div
            key="live"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <GlassCard className="p-6">
              <div className="grid gap-4">
                {contests
                  .filter((c) => c.status === "published")
                  .map((contest) => (
                    <div key={contest.id} className="p-4 rounded-lg bg-success/10 border border-success/30">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-foreground">{contest.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {contest.startDate} to {contest.endDate}
                          </p>
                        </div>
                        <div className="w-3 h-3 rounded-full bg-success animate-pulse" />
                      </div>
                    </div>
                  ))}
              </div>
            </GlassCard>
          </motion.div>
        )}

        {activeTab === "drafts" && (
          <motion.div
            key="drafts"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <GlassCard className="p-6">
              <div className="grid gap-4">
                {contests
                  .filter((c) => c.status === "draft")
                  .map((contest) => (
                    <div key={contest.id} className="p-4 rounded-lg bg-warning/10 border border-warning/30">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-foreground">{contest.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1">Created: {contest.createdAt}</p>
                        </div>
                        <button
                          onClick={() => handlePublish(contest.id)}
                          className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors"
                        >
                          Publish
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Template Designer Modal */}
      <ContestTemplateDesigner
        isOpen={showTemplateDesigner}
        onClose={() => setShowTemplateDesigner(false)}
        onSave={handleCreateContest}
        initialData={selectedContest || newContest}
        onDataChange={setNewContest}
      />

      {/* Preview Modal */}
      <ContestPreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        contest={selectedContest}
      />

      {/* Mailer Generator Modal */}
      <ContestMailerGenerator
        isOpen={showMailer}
        onClose={() => setShowMailer(false)}
        contest={selectedContest}
      />
    </div>
  );
};

export default ContestBuilder;
