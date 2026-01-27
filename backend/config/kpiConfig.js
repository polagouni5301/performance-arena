
const KPI_CONFIG = {
  aht: {
    name: 'Average Handle Time',
    weightage: 25, // Percentage weight in overall score
    target: 20, // Target value in minutes
    type: 'lower_better', // Lower values are better
    unit: 'minutes',
    maxPoints: 100, // Max points for this KPI
    formula: (value, target) => {
      if (value <= target) return 100; // Full points if at or below target
      const penalty = Math.min((value - target) / target * 50, 50); // Up to 50% penalty
      return Math.max(100 - penalty, 0);
    }
  },
  qa: {
    name: 'Quality Assurance Score',
    weightage: 45,
    target: 4, // Target score (assuming out of 5 or 6)
    type: 'higher_better', // Higher values are better
    unit: '',
    maxPoints: 100,
    formula: (value, target) => {
      if (value >= target) return 100;
      return Math.max((value / target) * 100, 0);
    }
  },
  revenue: {
    name: 'Revenue',
    weightage: 30,
    target: 500, // Target revenue
    type: 'higher_better',
    unit: '$',
    maxPoints: 100,
    formula: (value, target) => {
      return Math.min((value / target) * 100, 150); // Cap at 150% for exceeding target
    }
  },
  nps: {
    name: 'Net Promoter Score',
    weightage: 0, // Not in current weightage, but available
    target: 50,
    type: 'higher_better',
    unit: '',
    maxPoints: 100,
    formula: (value, target) => {
      if (value >= target) return 100;
      return Math.max((value / target) * 100, 0);
    }
  }
  // Add more KPIs as needed
};

module.exports = KPI_CONFIG;