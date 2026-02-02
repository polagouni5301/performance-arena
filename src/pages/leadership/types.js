
/**
 * @typedef {Object} KPI
 * @property {string} value - Display value
 * @property {string} [change] - Change indicator
 * @property {"positive" | "negative"} [changeType] - Change direction
 * @property {string} [subtitle] - Additional context
 * @property {number} [progress] - Progress percentage
 * @property {Object} [badge] - Badge info
 */

/**
 * @typedef {Object} Department
 * @property {string} name - Department name
 * @property {string} revenue - Revenue display value
 * @property {number} progress - Progress percentage
 * @property {string} [color] - Gradient color class
 */

/**
 * @typedef {Object} Campaign
 * @property {string} name - Campaign name
 * @property {string} owner - Campaign owner
 * @property {number} budgetUtil - Budget utilization percentage
 * @property {string} revenueImpact - Revenue impact display
 * @property {"Exceeding" | "On Track" | "Below"} roiStatus - ROI status
 */

/**
 * @typedef {Object} LeaderboardEntry
 * @property {number} rank - Position
 * @property {string} name - Person name
 * @property {string} department - Department name
 * @property {string} region - Region
 * @property {number} points - Total points
 * @property {string} revenue - Revenue display
 * @property {number} nps - NPS score
 * @property {string} trend - Trend percentage
 * @property {"up" | "down" | "neutral"} trendType - Trend direction
 */

/**
 * @typedef {Object} ContestROI
 * @property {string} name - Contest name
 * @property {string} spend - Spend display
 * @property {string} revenue - Revenue display
 * @property {string} roi - ROI multiplier
 * @property {"Excellent" | "Strong" | "Good" | "Average"} status
 */

export default {};
