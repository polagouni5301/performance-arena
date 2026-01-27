
/**
 * @typedef {Object} TeamHealthMetrics
 * @property {number} teamHealthScore - Overall team health (0-100)
 * @property {number} teamHealthChange - Change percentage
 * @property {number} participationRate - Participation percentage
 * @property {number} participationChange - Change percentage
 * @property {number} pointsBudget - Total points budget
 * @property {number} pointsRemaining - Remaining points
 */

/**
 * @typedef {Object} TopPerformer
 * @property {string} name - Agent name
 * @property {string} dept - Department
 * @property {number} xp - XP points
 * @property {number} rank - Rank position
 * @property {string} avatar - Avatar initial
 */

/**
 * @typedef {Object} AttentionItem
 * @property {string} name - Agent name
 * @property {string} issue - Issue description
 * @property {"coach" | "nudge" | "review"} type - Action type
 */

/**
 * @typedef {Object} AgentMetric
 * @property {number} value - Metric value
 * @property {"exceeding" | "on-target" | "at-risk" | "below" | "critical"} status
 * @property {string} label - Status label
 */

/**
 * @typedef {Object} TeamAgent
 * @property {string} name - Agent name
 * @property {string} role - Agent role
 * @property {string} avatar - Avatar initial
 * @property {AgentMetric} aht - AHT metric
 * @property {AgentMetric} qa - QA Score metric
 * @property {AgentMetric} revenue - Revenue metric
 */

/**
 * @typedef {Object} Contest
 * @property {number} id - Contest ID
 * @property {string} name - Contest name
 * @property {"live" | "upcoming" | "completed"} status
 * @property {string} objective - Contest objective
 * @property {number} [progress] - Progress percentage
 * @property {number} [target] - Target value
 * @property {number} [current] - Current value
 * @property {string} [timeRemaining] - Time remaining
 * @property {string} [scheduledStart] - Scheduled start time
 * @property {number} participants - Number of participants
 */

export default {};
