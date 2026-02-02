
/**
 * @typedef {"excellent" | "on-track" | "at-risk" | "critical"} MetricStatus
 */

/**
 * @typedef {Object} Metric
 * @property {string} key - Unique metric identifier
 * @property {string} title - Display title
 * @property {string|number} value - Current value
 * @property {string} target - Target description
 * @property {MetricStatus} status - Performance status
 * @property {string} statusLabel - Display label for status
 * @property {number} progress - Progress percentage (0-100)
 * @property {string} [prefix] - Value prefix (e.g., "$")
 * @property {string} [suffix] - Value suffix (e.g., "%", "k")
 * @property {string} [change] - Change indicator (e.g., "+2%")
 * @property {string} [color] - Color theme key
 */

/**
 * @typedef {Object} LeaderboardEntry
 * @property {number} rank - Position in leaderboard
 * @property {string} name - User name
 * @property {number|string} points - Points earned
 * @property {string} avatar - Avatar initial/letter
 * @property {string} [team] - Team name
 * @property {string} [color] - Gradient color class
 * @property {string} [badge] - Badge type (GOLD, SILVER, BRONZE)
 * @property {number} [gap] - Points gap to next rank
 * @property {"up" | "down" | "same"} [trend] - Trend direction
 */

/**
 * @typedef {Object} AgentDashboard
 * @property {number} score - Daily performance score (0-100)
 * @property {number} xp - Total XP points
 * @property {number} xpToday - XP earned today
 * @property {number} streak - Current streak days
 * @property {number} personalBest - Personal best streak
 * @property {number} percentile - Performance percentile
 * @property {string} ranking - Rank label (e.g., "Top 5%")
 * @property {number} spinUnlockProgress - Progress to unlock spin (0-100)
 * @property {boolean} spinUnlocked - Whether spin is unlocked
 * @property {number} callsToUnlock - Calls remaining to unlock
 * @property {LeaderboardEntry[]} leaderboard - Top 3 leaderboard
 * @property {LeaderboardEntry} currentUser - Current user's position
 * @property {Metric[]} metrics - Performance metrics
 * @property {boolean} scratchCardAvailable - Scratch card availability
 */

/**
 * @typedef {Object} PointsLogEntry
 * @property {string} metric - Metric name
 * @property {string} points - Points change (e.g., "+150")
 * @property {string} time - Relative time
 * @property {"positive" | "negative"} type - Entry type
 * @property {string} category - Metric category
 */

/**
 * @typedef {Object} AgentPerformance
 * @property {Object} agent - Agent info
 * @property {Array} weeklyData - Weekly chart data
 * @property {Metric[]} metrics - Detailed metrics
 * @property {PointsLogEntry[]} pointsLog - Points activity log
 */

/**
 * @typedef {Object} Badge
 * @property {string} icon - Icon identifier
 * @property {string} title - Badge title
 * @property {string} description - Badge description
 * @property {boolean} earned - Whether badge is earned
 * @property {string} [date] - Date earned
 * @property {number} [progress] - Progress if not earned
 * @property {string} color - Gradient color class
 * @property {string} [glow] - Glow effect class
 */

/**
 * @typedef {Object} Milestone
 * @property {string} title - Milestone title
 * @property {boolean} completed - Completion status
 * @property {number} xp - XP reward
 * @property {string} icon - Emoji icon
 * @property {number} [progress] - Progress if not completed
 */

/**
 * @typedef {Object} Reward
 * @property {number} id - Reward ID
 * @property {string} title - Reward title
 * @property {string} description - Description
 * @property {number} points - Point cost
 * @property {"in-stock" | "limited" | "locked"} status - Availability
 * @property {string} image - Emoji/image
 * @property {string} category - Category ID
 * @property {"common" | "rare" | "epic" | "legendary"} rarity - Rarity tier
 * @property {number} [stock] - Stock count if limited
 * @property {string} [requiredRank] - Required rank if locked
 */

export default {};
