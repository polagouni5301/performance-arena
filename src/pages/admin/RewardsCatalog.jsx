import { useState } from "react";
import { motion } from "framer-motion";
import AddRewardModal from "@/components/admin/AddRewardModal";
import { 
  Search, 
  Plus,
  Download,
  Edit,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Coffee,
  CreditCard,
  Star,
  Headphones,
  Gamepad2
} from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRewardsCatalog } from "./hooks.jsx";
import { TableSkeleton } from "@/components/ui/PageSkeleton";

const iconMap = {
  Coffee,
  CreditCard,
  Star,
  Headphones,
  Gamepad2,
};

const RewardsCatalog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);

  const { data, loading, error, actions } = useRewardsCatalog({
    category: selectedCategory,
    status: selectedStatus,
    page: currentPage,
  });

  if (loading) return <TableSkeleton />;
  if (error) return <div className="text-destructive p-4">Error: {error}</div>;
  if (!data) return null;

  const { rewards, categories, statuses, pagination } = data;

  const filteredRewards = rewards.filter(reward => {
    const matchesSearch = reward.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         reward.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All Categories" || reward.category === selectedCategory;
    const matchesStatus = selectedStatus === "All Statuses" || reward.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "Active": return "bg-success/20 text-success";
      case "Low Stock": return "bg-warning/20 text-warning";
      case "Out of Stock": return "bg-muted text-muted-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStockDisplay = (stock, status) => {
    if (stock === "Unlimited") return { text: "Unlimited", color: "text-muted-foreground", showBar: false };
    if (status === "Out of Stock") return { text: "0 left", color: "text-muted-foreground", showBar: true, progress: 0 };
    if (status === "Low Stock") return { text: `${stock} left`, color: "text-destructive", showBar: true, progress: (stock / 50) * 100 };
    return { text: `${stock} left`, color: "text-foreground", showBar: true, progress: Math.min((stock / 200) * 100, 100) };
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reward Inventory & Catalog</h1>
          <p className="text-muted-foreground mt-1">Manage reward items, stock levels, and catalog settings.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50 border border-border text-sm text-foreground hover:bg-muted transition-colors">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add New Reward
          </button>
        </div>
      </div>

      {/* Add Reward Modal */}
      <AddRewardModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />

      {/* Filters */}
      <GlassCard className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search rewards by name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-muted/30 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="appearance-none px-4 py-2 pr-10 rounded-lg bg-muted/30 border border-border text-sm text-foreground focus:outline-none focus:border-primary cursor-pointer"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="appearance-none px-4 py-2 pr-10 rounded-lg bg-muted/30 border border-border text-sm text-foreground focus:outline-none focus:border-primary cursor-pointer"
            >
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>

          {/* Results Count */}
          <div className="ml-auto text-sm text-muted-foreground">
            Showing <strong className="text-foreground">{filteredRewards.length}</strong> of {pagination.total} items
          </div>
        </div>
      </GlassCard>

      {/* Rewards Table */}
      <GlassCard className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">REWARD DETAILS</TableHead>
              <TableHead>CATEGORY</TableHead>
              <TableHead className="text-right">POINT COST</TableHead>
              <TableHead>STOCK AVAILABILITY</TableHead>
              <TableHead>STATUS</TableHead>
              <TableHead className="text-center">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRewards.map((reward, index) => {
              const stockInfo = getStockDisplay(reward.stock, reward.status);
              const IconComponent = iconMap[reward.icon] || Coffee;
              return (
                <motion.tr
                  key={reward.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className={cn(
                    "border-b border-border/50 transition-colors",
                    reward.status === "Out of Stock" ? "opacity-50" : "hover:bg-muted/20"
                  )}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        reward.status === "Low Stock" ? "bg-destructive/20" :
                        reward.status === "Out of Stock" ? "bg-muted/30" : "bg-primary/20"
                      )}>
                        <IconComponent className={cn(
                          "w-5 h-5",
                          reward.status === "Low Stock" ? "text-destructive" :
                          reward.status === "Out of Stock" ? "text-muted-foreground" : "text-primary"
                        )} />
                      </div>
                      <div>
                        <p className={cn(
                          "font-medium",
                          reward.status === "Out of Stock" ? "text-muted-foreground line-through" : "text-foreground"
                        )}>{reward.name}</p>
                        <p className="text-xs text-muted-foreground">ID: {reward.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={cn(
                      "px-2 py-1 rounded text-xs font-medium",
                      reward.category === "Voucher" ? "bg-primary/20 text-primary" :
                      reward.category === "Perk" ? "bg-secondary/20 text-secondary" :
                      "bg-muted text-muted-foreground"
                    )}>
                      {reward.category}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-semibold text-foreground">
                    {reward.pointCost.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={cn("text-sm font-medium", stockInfo.color)}>
                          {stockInfo.text}
                        </span>
                        {reward.status === "Low Stock" && (
                          <button className="text-xs text-primary hover:underline">Restock</button>
                        )}
                      </div>
                      {stockInfo.showBar && (
                        <div className="w-24 h-1.5 bg-muted/30 rounded-full overflow-hidden">
                          <div 
                            className={cn(
                              "h-full rounded-full",
                              reward.status === "Low Stock" ? "bg-destructive" : "bg-success"
                            )}
                            style={{ width: `${stockInfo.progress}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={cn(
                      "px-2 py-1 rounded text-xs font-medium",
                      getStatusColor(reward.status)
                    )}>
                      {reward.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => actions.update(reward.id, reward)}
                        className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <div className={cn(
                        "w-10 h-5 rounded-full relative transition-colors cursor-pointer",
                        reward.status !== "Out of Stock" ? "bg-primary" : "bg-muted"
                      )}>
                        <div className={cn(
                          "absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform",
                          reward.status !== "Out of Stock" ? "translate-x-5" : "translate-x-0.5"
                        )} />
                      </div>
                    </div>
                  </TableCell>
                </motion.tr>
              );
            })}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Showing 1 to {pagination.perPage} of {pagination.total} results
          </p>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg border border-border hover:bg-muted transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 rounded-lg bg-primary text-primary-foreground text-sm font-medium">1</button>
            <button className="w-8 h-8 rounded-lg hover:bg-muted text-sm text-foreground transition-colors">2</button>
            <button className="w-8 h-8 rounded-lg hover:bg-muted text-sm text-foreground transition-colors">3</button>
            <button className="p-2 rounded-lg border border-border hover:bg-muted transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default RewardsCatalog;
