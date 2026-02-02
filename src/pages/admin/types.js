/**
 * Admin Types
 * Data contracts for Admin role API responses.
 */

/**
 * @typedef {Object} SystemHealth
 * @property {string} status - System status
 * @property {Object} apiLatency - API latency info
 * @property {Object} lastSync - Last sync info
 * @property {Object} errorRate - Error rate info
 */

/**
 * @typedef {Object} LowStockItem
 * @property {string} name - Item name
 * @property {string} category - Item category
 * @property {number} stock - Current stock
 * @property {"Critical" | "Low"} status - Stock status
 */

/**
 * @typedef {Object} ActivityItem
 * @property {string} title - Activity title
 * @property {string} desc - Activity description
 * @property {string} time - Relative time
 * @property {"rule" | "warning" | "inventory" | "contest"} type - Activity type
 */

/**
 * @typedef {Object} Metric
 * @property {number} id - Metric ID
 * @property {string} name - Metric name
 * @property {string} category - Metric category
 * @property {string} target - Target value
 * @property {number} weightage - Weightage percentage
 * @property {string} cap - Cap limits
 * @property {"Operational" | "Business"} type - Metric type
 * @property {"Enabled" | "Disabled"} status - Metric status
 */

/**
 * @typedef {Object} TierMultiplier
 * @property {string} label - Tier label
 * @property {number} multiplier - Multiplier value
 */

/**
 * @typedef {Object} RewardProbability
 * @property {string} id - Probability ID
 * @property {string} name - Reward name
 * @property {number} probability - Probability percentage
 * @property {string} color - Color theme
 */

/**
 * @typedef {Object} GlobalCap
 * @property {boolean} enabled - Whether cap is enabled
 * @property {number} value - Cap value
 */

/**
 * @typedef {Object} CatalogReward
 * @property {string} id - Reward ID
 * @property {string} name - Reward name
 * @property {string} category - Reward category
 * @property {number} pointCost - Point cost
 * @property {number|string} stock - Stock count
 * @property {"Active" | "Low Stock" | "Out of Stock"} status
 */

/**
 * @typedef {Object} ClaimLog
 * @property {string} date - Claim date
 * @property {string} agent - Agent name
 * @property {string} initials - Agent initials
 * @property {string} reward - Reward name
 * @property {number} points - Points used
 * @property {string} status - Claim status
 */

export default {};
