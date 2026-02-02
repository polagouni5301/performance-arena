import { Skeleton } from "./skeleton";

/**
 * Page-level loading skeleton for dashboard pages.
 * Shows a standardized loading state with cards, charts, and tables.
 */
export const DashboardSkeleton = () => (
  <div className="space-y-6 animate-fade-in">
    {/* Header */}
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-48" />
      </div>
      <Skeleton className="h-10 w-32" />
    </div>

    {/* KPI Cards Row */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="glass-card p-5">
          <div className="flex items-center justify-between mb-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-8 rounded-lg" />
          </div>
          <Skeleton className="h-8 w-20 mb-2" />
          <Skeleton className="h-3 w-32" />
        </div>
      ))}
    </div>

    {/* Chart Area */}
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-6 w-48" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
      <Skeleton className="h-72 w-full" />
    </div>

    {/* Two Column Layout */}
    <div className="grid lg:grid-cols-2 gap-6">
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="glass-card p-5">
          <Skeleton className="h-6 w-40 mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, j) => (
              <div key={j} className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-6 w-16" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

/**
 * Hero-style skeleton for agent dashboard
 */
export const AgentDashboardSkeleton = () => (
  <div className="space-y-6 animate-fade-in">
    {/* Top Row */}
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Hero Card */}
      <div className="glass-card-hero p-6">
        <Skeleton className="h-44 w-44 rounded-full mx-auto mb-4" />
        <Skeleton className="h-6 w-48 mx-auto mb-2" />
        <Skeleton className="h-4 w-64 mx-auto mb-4" />
        <Skeleton className="h-10 w-40 mx-auto" />
      </div>

      {/* Points & Streak */}
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="glass-card p-5 flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-14 w-14 rounded-xl" />
          </div>
        ))}
      </div>

      {/* Leaderboard */}
      <div className="glass-card p-5">
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="flex items-end justify-center gap-3 mb-4 pt-4">
          <Skeleton className="h-32 w-20 rounded-t-lg" />
          <Skeleton className="h-40 w-24 rounded-t-lg" />
          <Skeleton className="h-24 w-20 rounded-t-lg" />
        </div>
        <Skeleton className="h-16 w-full rounded-lg" />
      </div>
    </div>

    {/* Mission Progress */}
    <Skeleton className="h-20 w-full rounded-xl" />

    {/* Metrics Grid */}
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="glass-card-data p-4">
          <div className="flex items-center justify-between mb-3">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          <Skeleton className="h-4 w-16 mb-1" />
          <Skeleton className="h-8 w-24 mb-1" />
          <Skeleton className="h-3 w-20 mb-3" />
          <Skeleton className="h-1.5 w-full rounded-full" />
        </div>
      ))}
    </div>
  </div>
);

/**
 * Table-style skeleton for list pages
 */
export const TableSkeleton = ({ rows = 5 }) => (
  <div className="space-y-6 animate-fade-in">
    {/* Header */}
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-40" />
      </div>
      <div className="flex gap-3">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>

    {/* Filters */}
    <div className="flex gap-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-10 w-24 rounded-lg" />
      ))}
    </div>

    {/* Table */}
    <div className="glass-card overflow-hidden p-0">
      {/* Header Row */}
      <div className="flex items-center gap-4 p-4 border-b border-border/50 bg-muted/10">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-24" />
        ))}
      </div>
      {/* Data Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 border-b border-border/30">
          {Array.from({ length: 5 }).map((_, j) => (
            <Skeleton key={j} className="h-4 w-24" />
          ))}
        </div>
      ))}
    </div>
  </div>
);

/**
 * Game/Playzone skeleton
 */
export const PlayzoneSkeleton = () => (
  <div className="space-y-8 animate-fade-in">
    {/* Header */}
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="flex gap-4">
        <Skeleton className="h-14 w-24 rounded-xl" />
        <Skeleton className="h-14 w-32 rounded-xl" />
        <Skeleton className="h-14 w-40 rounded-xl" />
      </div>
    </div>

    {/* Hero Games Row */}
    <div className="grid lg:grid-cols-2 gap-6">
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="glass-card p-8">
          <Skeleton className="h-6 w-32 mb-6" />
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-80 mb-8" />
          <Skeleton className="h-48 w-full mb-8 rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      ))}
    </div>

    {/* Challenges */}
    <div className="glass-card p-6">
      <Skeleton className="h-6 w-48 mb-4" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-xl" />
        ))}
      </div>
    </div>
  </div>
);

export default DashboardSkeleton;
