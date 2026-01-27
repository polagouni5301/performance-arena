# gaMEtrix - API Data Requirements Documentation

> **Purpose**: This document defines all data requirements for each page across Agent, Manager, Leadership, and Admin views. Use this as a contract between frontend and backend teams.

---

## 📋 Table of Contents

1. [Agent View](#agent-view)
2. [Manager View](#manager-view)
3. [Leadership View](#leadership-view)
4. [Admin View](#admin-view)

---

## 🎮 Agent View

### 1. Agent Home (Dashboard)
**Endpoint**: `GET /api/agent/{agentId}/dashboard`

```json
{
  "score": 88,                    // Overall performance score (0-100)
  "xp": 1250,                     // Total XP points
  "streak": 5,                    // Current day streak
  "countdown": {                  // Time until daily reset
    "hours": 4,
    "minutes": 23,
    "seconds": 15
  },
  "metrics": [                    // Daily mission metrics
    {
      "key": "aht",               // Metric identifier (aht, qa, revenue, nps)
      "title": "Handle Time",
      "value": "4:32",            // Current value (display format)
      "target": "Target: 5:00",   // Target description
      "progress": 92,             // Progress percentage (0-100)
      "status": "excellent"       // Status: excellent | on-track | at-risk | critical
    }
  ],
  "leaderboard": [                // Top performers for quick view
    {
      "rank": 1,
      "name": "Alex M.",
      "avatar": "AM",
      "points": 12500,
      "trend": "up"               // up | down | neutral
    }
  ],
  "gamification": {
    "wheelUnlocked": true,        // Is spin wheel available
    "scratchCardsAvailable": 2,   // Number of scratch cards
    "tokensEarned": 65,           // Tokens toward next spin
    "tokensNeeded": 100           // Tokens required for spin
  }
}
```

---

### 2. Agent Performance
**Endpoint**: `GET /api/agent/{agentId}/performance`

```json
{
  "agent": {
    "name": "Sarah Johnson",
    "avatar": "SJ",
    "rank": "Elite",
    "team": "Sales Alpha",
    "percentile": 96               // Top X percentile
  },
  "weeklyData": [                  // Chart data for weekly trajectory
    {
      "day": "Mon",
      "points": 120,
      "team": 95,                  // Team average
      "target": 100                // Target line
    }
  ],
  "metrics": [                     // Detailed metric cards
    {
      "key": "qa",
      "title": "Quality Score",
      "value": 94,
      "prefix": "",
      "suffix": "%",
      "target": "95%",
      "progress": 98,
      "change": "+2.1%",
      "status": "excellent",       // excellent | on-track | at-risk | critical
      "statusLabel": "Excellent"
    }
  ],
  "pointsLog": [                   // Points earning history
    {
      "id": 1,
      "source": "QA Bonus",
      "category": "QA",
      "amount": 50,
      "time": "2 hours ago"
    }
  ]
}
```

---

### 3. Agent Leaderboard
**Endpoint**: `GET /api/agent/leaderboard`

**Query Params**: `viewType` (individual|team), `timeRange` (weekly|monthly|all-time)

```json
{
  "lastUpdated": "Jan 24, 09:00 AM",
  "currentWeek": "Jan 19 - Jan 25",
  "levelTiers": [
    {
      "name": "Master",
      "minXP": 1500,
      "color": "from-amber-400 to-orange-500",
      "icon": "👑"
    }
  ],
  "weeklyRewards": {
    "top3": { "points": 500, "scratchCards": 3 },
    "top10": { "points": 250, "scratchCards": 2 },
    "top25Percent": { "points": 100, "scratchCards": 1 }
  },
  "currentUser": {
    "rank": 4,
    "name": "Current User",
    "xp": 1350,
    "level": "Elite",
    "percentile": 96
  },
  "topThree": [                    // Podium display
    {
      "rank": 1,
      "name": "Alex Martinez",
      "avatar": "AM",
      "department": "Sales",
      "points": 15200,
      "xp": 1520,
      "level": "Master"
    }
  ],
  "leaderboard": [                 // Full rankings table
    {
      "rank": 1,
      "name": "Alex Martinez",
      "avatar": "AM",
      "department": "Sales",
      "region": "North",
      "points": 15200,
      "xp": 1520,
      "level": "Master",
      "trend": "+2",
      "trendType": "up"
    }
  ]
}
```

---

### 4. Play Zone (Game Center)
**Endpoint**: `GET /api/agent/{agentId}/playzone`

```json
{
  "streak": 7,
  "totalPoints": 12450,
  "tokenBalance": 65,
  "tokensNeeded": 100,
  "wheelUnlocked": true,
  "countdown": {
    "hours": 4,
    "minutes": 23,
    "seconds": 15
  },
  "dailyMissions": [
    {
      "id": "m1",
      "title": "Complete 5 Calls",
      "description": "Handle 5 customer calls",
      "progress": 3,
      "target": 5,
      "reward": 50,
      "completed": false,
      "icon": "phone"
    }
  ],
  "weeklyChallenges": [
    {
      "id": "c1",
      "title": "Revenue Champion",
      "description": "Achieve $2000 in sales",
      "progress": 1500,
      "target": 2000,
      "tokenReward": 25,
      "difficulty": "hard",         // easy | medium | hard
      "status": "active",           // active | completed | expired
      "daysLeft": 3
    }
  ],
  "scratchCards": [
    {
      "id": "sc1",
      "type": "daily",
      "available": true,
      "revealed": false,
      "reward": null                // Populated after reveal
    }
  ],
  "earningHistory": [
    {
      "id": "e1",
      "source": "Daily Mission",
      "amount": 100,
      "time": "2 hours ago",
      "status": "claimed"           // claimed | processing
    }
  ],
  "todaysPerformance": {
    "meetsThreshold": true,
    "metric": {
      "name": "Revenue",
      "value": "$520",
      "target": "$500"
    }
  },
  "scratchReward": "+500 PTS",
  "weekRange": "Sun Jan 19 - Sat Jan 25"
}
```

**Actions**:
- `POST /api/agent/{agentId}/playzone/scratch` - Reveal scratch card
- `POST /api/agent/{agentId}/playzone/spin` - Spin the wheel
- `POST /api/agent/{agentId}/playzone/challenge/{challengeId}/accept` - Accept challenge

---

### 5. Rewards & Achievements
**Endpoint**: `GET /api/agent/{agentId}/achievements`

```json
{
  "level": 12,
  "title": "Elite Performer",
  "currentXP": 4850,
  "nextLevelXP": 5000,
  "levelProgress": 97,
  "badges": [
    {
      "id": "b1",
      "title": "Streak Master",
      "description": "Maintained 7-day streak",
      "icon": "flame",
      "color": "from-amber-500 to-orange-600",
      "earned": true,
      "date": "Jan 15, 2024",
      "progress": 100
    },
    {
      "id": "b2",
      "title": "Revenue King",
      "description": "Achieve $10,000 monthly sales",
      "icon": "crown",
      "color": "from-primary to-pink-500",
      "earned": false,
      "progress": 75
    }
  ]
}
```

**Endpoint**: `GET /api/agent/{agentId}/rewards-vault`

```json
{
  "availablePoints": 8500,
  "rewards": [
    {
      "id": "r1",
      "name": "Amazon Gift Card $50",
      "category": "gift-cards",
      "pointCost": 5000,
      "rarity": "rare",             // common | rare | epic | legendary
      "inStock": true,
      "stockCount": 15,
      "image": "https://..."
    }
  ],
  "claimHistory": [
    {
      "id": "ch1",
      "rewardName": "Coffee Voucher",
      "pointsSpent": 500,
      "claimedAt": "2024-01-20",
      "status": "fulfilled"
    }
  ]
}
```

---

## 👔 Manager View

### 1. Manager Overview
**Endpoint**: `GET /api/manager/{managerId}/overview`

```json
{
  "teamName": "Sales Team Alpha",
  "lastUpdated": "Today, 09:00 AM",
  "teamHealthScore": 87,
  "teamHealthChange": 5,           // vs previous period (can be negative)
  "participationRate": 94,
  "participationChange": 3,
  "pointsBudget": 50000,
  "pointsRemaining": 12500,
  "weeklyData": [                  // Productivity trend chart
    {
      "day": "Mon",
      "current": 85,
      "previous": 78,
      "target": 80
    }
  ],
  "topPerformers": [
    {
      "name": "Sarah J.",
      "avatar": "SJ",
      "dept": "Sales",
      "xp": 4850,
      "rank": 1
    }
  ],
  "attentionNeeded": [
    {
      "name": "Mike Wilson",
      "issue": "QA Score below target for 3 days",
      "type": "coach"              // coach | nudge | review
    }
  ],
  "liveFeed": [
    {
      "name": "Alex",
      "action": "earned",
      "value": "+150 pts",
      "time": "2 min ago",
      "dept": "Sales"
    }
  ],
  "insight": "3 team members are showing improved QA scores after last week's coaching session."
}
```

---

### 2. Team Performance (Heatmap)
**Endpoint**: `GET /api/manager/{managerId}/team-performance`

```json
{
  "agents": [
    {
      "name": "Sarah Johnson",
      "avatar": "SJ",
      "role": "Senior Agent",
      "aht": {
        "value": 285,
        "status": "exceeding",     // exceeding | on-target | at-risk | below | critical
        "label": "Exceeding"
      },
      "qa": {
        "value": 96,
        "status": "exceeding",
        "label": "Excellent"
      },
      "revenue": {
        "value": 8500,
        "status": "on-target",
        "label": "On Target"
      }
    }
  ],
  "selectedAgentInsight": {        // When an agent is selected
    "analysis": "QA Score: 78%",
    "details": "18% below team target. Major gaps in empathy and solution accuracy.",
    "pattern": "QA scores drop on calls longer than 8 minutes.",
    "recommendedActions": [
      {
        "type": "coaching",
        "title": "Schedule 1:1 Coaching",
        "desc": "Review last 3 failed calls together."
      },
      {
        "type": "training",
        "title": "Assign Training Module",
        "desc": "Advanced Empathy & Tone (15m)"
      }
    ],
    "history": [
      {
        "action": "Sent Kudos for NPS",
        "time": "2 days ago",
        "by": "AM"
      }
    ]
  }
}
```

---

### 3. Contest Management
**Endpoint**: `GET /api/manager/{managerId}/contests`

```json
{
  "activeContests": [
    {
      "id": 1,
      "name": "Q1 Revenue Sprint",
      "status": "live",            // live | upcoming | completed
      "objective": "Maximize team revenue",
      "progress": 67,
      "target": 50000,
      "current": 33500,
      "timeRemaining": "2d 14h",
      "participants": 12
    },
    {
      "id": 2,
      "name": "Quality Week",
      "status": "upcoming",
      "objective": "Improve QA scores",
      "scheduledStart": "Jan 28, 9:00 AM",
      "participants": 15
    }
  ],
  "pastContests": [
    {
      "name": "December Blitz",
      "dates": "Dec 1-15",
      "winner": "Alex M.",
      "winnerAvatar": "AM",
      "reward": 500.00,
      "impact": "+12% Revenue"
    }
  ],
  "liveFeed": [
    {
      "avatar": "SJ",
      "name": "Sarah",
      "action": "moved to #2",
      "time": "5 min ago"
    }
  ],
  "tip": "Shorter sprints (3-5 days) often yield 2x engagement vs monthly ones."
}
```

**Actions**:
- `POST /api/manager/contests` - Create new contest
- `PUT /api/manager/contests/{contestId}` - Update contest
- `DELETE /api/manager/contests/{contestId}` - Delete contest

---

### 4. Rewards Audit
**Endpoint**: `GET /api/manager/{managerId}/rewards-audit`

```json
{
  "totalDistributed": 145680,
  "remainingBudget": 4320,
  "totalBudget": 150000,
  "budgetChange": 8,               // Percentage vs last month
  "pointsByMetric": [
    {
      "name": "Revenue",
      "value": 58000,
      "color": "hsl(280, 100%, 60%)"
    },
    {
      "name": "QA Score",
      "value": 42000,
      "color": "hsl(145, 70%, 45%)"
    },
    {
      "name": "AHT",
      "value": 28000,
      "color": "hsl(195, 100%, 50%)"
    },
    {
      "name": "NPS",
      "value": 17680,
      "color": "hsl(45, 100%, 50%)"
    }
  ],
  "rewardHistory": [
    {
      "avatar": "SJ",
      "agent": "Sarah Johnson",
      "reward": "$50 Amazon Card",
      "points": 5000,
      "date": "Jan 22, 2024",
      "status": "claimed"
    }
  ],
  "liveRedemptions": [
    {
      "avatar": "AM",
      "name": "Alex",
      "action": "redeemed",
      "value": "Coffee Voucher",
      "time": "5 min ago"
    }
  ],
  "fairnessAlert": "Top 10% of performers are claiming 60% of rewards. Consider adjusting tiers."
}
```

---

## 👑 Leadership View

### 1. Leadership Overview
**Endpoint**: `GET /api/leadership/overview`

```json
{
  "kpis": {
    "performanceScore": {
      "value": "87.4",
      "change": "+3.2%",
      "changeType": "positive",
      "subtitle": "Across 12 departments"
    },
    "participationRate": {
      "value": "94%",
      "change": "+5%",
      "changeType": "positive",
      "subtitle": "1,247 of 1,326 active"
    },
    "rewardsSpent": {
      "value": "₹4.2L",
      "subtitle": "of ₹5L budget",
      "progress": 84
    },
    "revenueUplift": {
      "value": "+18%",
      "badge": {
        "label": "4.2x ROI",
        "color": "success"
      },
      "subtitle": "vs. pre-implementation"
    }
  },
  "trendData": [
    {
      "day": "Week 1",
      "performance": 82,
      "participation": 88
    }
  ],
  "topDepartments": [
    {
      "name": "Enterprise Sales",
      "revenue": "₹1.2Cr",
      "progress": 100
    }
  ],
  "recentCampaigns": [
    {
      "name": "Q4 Push Campaign",
      "owner": "John D.",
      "budgetUtil": 92,
      "revenueImpact": "+₹45L",
      "roiStatus": "Exceeding"
    }
  ],
  "insights": [
    "Gamification increased agent retention by 23%",
    "Top performers earn 4.2x more rewards than average"
  ]
}
```

---

### 2. Leadership Leaderboards
**Endpoint**: `GET /api/leadership/leaderboards`

**Query Params**: `timeRange`, `viewLevel`, `rankBy`

```json
{
  "filters": {
    "timeRanges": ["Weekly", "Monthly", "Quarterly"],
    "viewLevels": ["All Champions", "By Department", "By Region"],
    "rankByOptions": ["XP Earned", "Points", "Revenue Impact"]
  },
  "currentWeek": "Jan 19 - Jan 25",
  "monthStartDate": "Jan 1",
  "levelTiers": [
    {
      "name": "Master",
      "minXP": 1500,
      "color": "from-amber-400 to-orange-500",
      "icon": "👑"
    }
  ],
  "weeklyRewards": {
    "top3": { "points": 500, "scratchCards": 3, "xp": 100, "badge": "Weekly Champion" },
    "top10": { "points": 250, "scratchCards": 2, "xp": 50 },
    "top25Percent": { "points": 100, "scratchCards": 1, "xp": 25 }
  },
  "promotionRules": {
    "promoted": { "description": "Top 20% ascend to next tier" },
    "safeZone": { "description": "Next 25% maintain current rank" },
    "demotionZone": { "description": "Bottom tier risks descent" }
  },
  "currentUser": {
    "rank": 4,
    "xp": 1350,
    "level": "Elite",
    "nextLevel": "Master",
    "xpToNextLevel": 150,
    "rankChange": "+2",
    "weeklyXPGain": 250
  },
  "leaderboard": [
    {
      "rank": 1,
      "name": "Alex Martinez",
      "avatar": "AM",
      "department": "Enterprise Sales",
      "region": "North",
      "points": 15200,
      "xp": 1520,
      "level": "Master",
      "revenue": "₹12.5L",
      "nps": 92,
      "trend": "+2",
      "trendType": "up"
    }
  ]
}
```

---

### 3. Leadership Reports
**Endpoint**: `GET /api/leadership/reports`

**Query Params**: `activeTab` (Revenue|Efficiency|Culture)

```json
{
  "revenueData": [
    {
      "month": "JAN",
      "revenue": 2.1
    },
    {
      "month": "JUN",
      "revenue": 2.7,
      "milestone": "System Launch"
    }
  ],
  "departmentRevenue": [
    {
      "name": "Enterprise Sales",
      "revenue": "₹1.2Cr",
      "progress": 100,
      "color": "from-primary to-secondary"
    }
  ],
  "kpiMetrics": [
    {
      "label": "QUALITY SCORE (AVG)",
      "value": "91.2%",
      "change": "+4.5%",
      "changeType": "positive",
      "icon": "Shield",
      "sparkData": [85, 87, 88, 90, 91, 91, 92],
      "teams": [
        { "name": "T-A", "value": "+3.2%", "progress": 92 },
        { "name": "T-B", "value": "+1.8%", "progress": 88 }
      ]
    }
  ]
}
```

**Actions**:
- `POST /api/leadership/reports/export` - Export report (PDF/CSV)

---

### 4. Leadership ROI
**Endpoint**: `GET /api/leadership/roi`

**Query Params**: `fiscalYear`

```json
{
  "totalSpent": 420000,            // In rupees
  "totalGain": 1780000,
  "roiMultiplier": 4.24,
  "correlationR2": 0.84,
  "scatterData": [                 // Points vs Revenue scatter plot
    {
      "points": 5000,
      "revenue": 120000,
      "name": "Agent A"
    }
  ],
  "quarterlyData": [
    {
      "quarter": "Q1",
      "spend": 95000,
      "uplift": 380000
    }
  ],
  "contestROI": [
    {
      "name": "Q4 Revenue Push",
      "spend": "₹45K",
      "revenue": "₹2.1L",
      "roi": "4.7x",
      "status": "Excellent"        // Excellent | Strong | Good | Average
    }
  ]
}
```

---

## ⚙️ Admin View

### 1. Admin Overview
**Endpoint**: `GET /api/admin/overview`

```json
{
  "kpis": {
    "activeUsers": {
      "value": "1,247",
      "change": "+12%",
      "changeType": "positive"
    },
    "activeContests": {
      "value": "8",
      "subtitle": "3 ending this week"
    },
    "rewardsInStock": {
      "value": "156",
      "alert": "5 items low stock"
    },
    "criticalWarnings": {
      "value": "3",
      "subtitle": "Requires attention"
    }
  },
  "systemHealth": {
    "status": "All Systems Operational",
    "apiLatency": {
      "value": "45ms",
      "status": "Normal"
    },
    "lastSync": {
      "value": "2 min ago",
      "status": "Synced",
      "subtitle": "HRMS Integration"
    },
    "errorRate": {
      "value": "0.02%",
      "status": "Healthy",
      "progress": 2
    }
  },
  "lowStockAlerts": [
    {
      "name": "Wireless Headphones",
      "category": "Tech",
      "stock": 3,
      "status": "Critical",        // Critical | Low
      "icon": "Headphones"
    }
  ],
  "recentActivity": [
    {
      "title": "New Contest Created",
      "desc": "Q1 Revenue Sprint by Manager A",
      "time": "10 min ago",
      "icon": "Zap",
      "color": "text-primary"
    }
  ]
}
```

---

### 2. Metric Configuration
**Endpoint**: `GET /api/admin/metrics`

```json
{
  "summary": {
    "totalWeightage": 100,
    "activeKPIs": 4,
    "operationalCount": 2,
    "businessCount": 2
  },
  "metrics": [
    {
      "id": "aht",
      "name": "Average Handle Time",
      "category": "Call Efficiency",
      "icon": "Clock",
      "color": "text-secondary",
      "target": "≤ 400 sec",
      "weightage": 25,
      "cap": "500 pts/day",
      "type": "Operational",       // Operational | Business
      "status": "Enabled"          // Enabled | Disabled
    }
  ]
}
```

**Actions**:
- `POST /api/admin/metrics` - Create new metric
- `PUT /api/admin/metrics/{metricId}` - Update metric
- `DELETE /api/admin/metrics/{metricId}` - Delete metric

---

### 3. Points Rules Engine
**Endpoint**: `GET /api/admin/points-rules`

```json
{
  "kpiWeightage": [
    { "id": "aht", "value": 25 },
    { "id": "qa", "value": 45 },
    { "id": "revenue", "value": 30 }
  ],
  "tierMultipliers": {
    "topTier": {
      "label": "Top 10%",
      "multiplier": 1.5
    },
    "midTier": {
      "label": "Top 50%",
      "multiplier": 1.0
    },
    "standard": {
      "label": "Baseline",
      "multiplier": 0.8
    }
  },
  "rewardProbability": [
    { "id": "mega", "name": "Mega Reward", "probability": 5 },
    { "id": "rare", "name": "Rare Bonus", "probability": 25 },
    { "id": "common", "name": "Common Ticket", "probability": 70 }
  ],
  "globalCaps": {
    "daily": { "enabled": true, "value": 5000 },
    "weekly": { "enabled": true, "value": 25000 },
    "monthly": { "enabled": false, "value": null }
  },
  "systemStatus": {
    "rulesActive": true,
    "lastUpdated": "Jan 23, 2024",
    "version": "v2.4"
  }
}
```

**Actions**:
- `PUT /api/admin/points-rules` - Save all rules
- `POST /api/admin/points-rules/simulate` - Simulate rules with test data

---

### 4. Rewards Catalog
**Endpoint**: `GET /api/admin/rewards-catalog`

**Query Params**: `category`, `status`, `page`, `search`

```json
{
  "categories": ["All Categories", "Voucher", "Merchandise", "Perk", "Experience"],
  "statuses": ["All Statuses", "Active", "Low Stock", "Out of Stock"],
  "pagination": {
    "page": 1,
    "perPage": 10,
    "total": 156,
    "totalPages": 16
  },
  "rewards": [
    {
      "id": "RWD-001",
      "name": "Amazon Gift Card $50",
      "category": "Voucher",
      "pointCost": 5000,
      "stock": 45,                 // Number or "Unlimited"
      "status": "Active",          // Active | Low Stock | Out of Stock
      "icon": "CreditCard",
      "image": "https://...",
      "eligibility": {
        "minRank": "Elite",
        "departments": ["All"]
      }
    }
  ]
}
```

**Actions**:
- `POST /api/admin/rewards-catalog` - Add new reward
- `PUT /api/admin/rewards-catalog/{rewardId}` - Update reward
- `DELETE /api/admin/rewards-catalog/{rewardId}` - Delete reward
- `PATCH /api/admin/rewards-catalog/{rewardId}/stock` - Update stock

---

### 5. Audit Logs
**Endpoint**: `GET /api/admin/audit-logs`

**Query Params**: `search`, `page`, `dateFrom`, `dateTo`

```json
{
  "pagination": {
    "showing": "1-10",
    "total": 2456
  },
  "claimLogs": [
    {
      "date": "Jan 24, 10:32 AM",
      "initials": "SJ",
      "agent": "Sarah Johnson",
      "reward": "$50 Amazon Card",
      "points": 5000,
      "status": "Fulfilled",       // Fulfilled | Pending Approval | Shipped | Rejected
      "color": "bg-primary"
    }
  ],
  "emailTriggers": [
    {
      "name": "Low Stock Alert",
      "desc": "Notify when item stock < 10",
      "enabled": true
    },
    {
      "name": "Claim Approval",
      "desc": "Manager approval for claims > 5000 pts",
      "enabled": true
    }
  ],
  "downloadReports": [
    {
      "name": "Monthly Summary",
      "desc": "Full audit trail for current month",
      "icon": "Calendar"
    },
    {
      "name": "Claims Report",
      "desc": "All reward claims with status",
      "icon": "FileText"
    }
  ]
}
```

**Actions**:
- `PATCH /api/admin/audit-logs/triggers/{triggerName}` - Toggle email trigger
- `GET /api/admin/audit-logs/export/{reportType}` - Download report

---

## 🔐 Authentication & Common

### User Authentication
**Endpoint**: `POST /api/auth/login`

```json
// Request
{
  "email": "user@company.com",
  "password": "..."
}

// Response
{
  "token": "jwt_token",
  "user": {
    "id": "user_123",
    "name": "John Doe",
    "email": "john@company.com",
    "role": "agent",               // agent | manager | leadership | admin
    "avatar": "JD",
    "department": "Sales",
    "team": "Alpha"
  }
}
```

### Common Headers
```
Authorization: Bearer {jwt_token}
Content-Type: application/json
X-Request-ID: {uuid}
```

### Error Response Format
```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired token",
    "details": {}
  }
}
```

---

## 📝 Notes for Backend Team

1. **All dates** should be in ISO 8601 format for storage, but display-formatted strings for UI
2. **All monetary values** in the smallest unit (paise/cents) internally, formatted for display
3. **Pagination** should support `page`, `limit`, `sortBy`, `sortOrder` params
4. **Filtering** should support multiple values (comma-separated)
5. **Rate limiting**: Consider 100 req/min for normal endpoints, 10 req/min for heavy operations
6. **Caching**: Leaderboard (1 min), Dashboard (30 sec), Audit logs (no cache)
7. **WebSocket**: Consider for live feed updates on Manager/Admin dashboards

---

*Last Updated: January 24, 2026*
*Version: 1.0.0*
