const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

/**
 * Reads an Excel file and returns sheet data as JSON objects.
 * @param {string} filePath - Path to the Excel file.
 * @returns {Object} - Object with sheet names as keys and arrays of objects as values.
 */
function readExcelFile(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Excel file not found: ${filePath}`);
  }

  const workbook = XLSX.readFile(filePath);
  const sheetData = {};

  workbook.SheetNames.forEach(sheetName => {
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    // Convert to array of objects using first row as headers
    if (jsonData.length > 0) {
      const headers = jsonData[0];
      const rows = jsonData.slice(1);
      const objects = rows.map(row => {
        const obj = {};
        headers.forEach((header, index) => {
          obj[header] = row[index] || null;
        });
        return obj;
      });
      sheetData[sheetName] = objects;
    } else {
      sheetData[sheetName] = [];
    }
  });

  return sheetData;
}

/**
 * Normalizes data types and formats for consistency.
 * Handles single sheet with custom columns: Date, department, supervisor, manager, guide_name, new_revenue, new_conversion_pct, aos, cpd, nps, guide_id, aht, nrpc, wow_score, discovery_score, qa_score, new_refund_pct
 * @param {Object} data - Raw sheet data.
 * @returns {Object} - Normalized data.
 */
function normalizeData(data) {
  const normalized = {};

  // Assume the main sheet is the first one or named 'Data'
  const sheetNames = Object.keys(data);
  const mainSheet = data[sheetNames[0]] || [];
  const rows = mainSheet;

  // Extract unique entities
  const departments = new Set();
  const managers = new Map(); // name -> id
  const supervisors = new Map(); // name -> id
  const users = new Map(); // guide_id -> user object

  rows.forEach(row => {
    if (row.department) departments.add(row.department);
    if (row.manager) managers.set(row.manager, managers.size + 1);
    if (row.supervisor) supervisors.set(row.supervisor, supervisors.size + 1);
    if (row.guide_id && row.guide_name) {
      users.set(row.guide_id, {
        user_id: row.guide_id,
        name: row.guide_name,
        department: row.department,
        manager_name: row.manager,
        supervisor_name: row.supervisor
      });
    }
  });

  // Create users array
  normalized.users = Array.from(users.values()).map(user => {
    const managerId = managers.get(user.manager_name) ? `mgr_${managers.get(user.manager_name)}` : null;
    const supervisorId = supervisors.get(user.supervisor_name) ? `sup_${supervisors.get(user.supervisor_name)}` : null;
    return {
      user_id: user.user_id,
      name: user.name,
      email: `${user.name.toLowerCase().replace(/\s+/g, '.')}@company.com`,
      role: 'agent',
      department: user.department,
      team_id: `team_${user.department}`,
      manager_id: managerId,
      supervisor_id: supervisorId,
      avatar_url: null,
      hire_date: new Date().toISOString(), // Default
      rank: 'Bronze',
      status: 'active'
    };
  });

  // Add managers and supervisors as users
  managers.forEach((id, name) => {
    normalized.users.push({
      user_id: `mgr_${id}`,
      name: name,
      email: `${name.toLowerCase().replace(/\s+/g, '.')}@company.com`,
      role: 'manager',
      department: null,
      team_id: null,
      manager_id: null,
      supervisor_id: null,
      avatar_url: null,
      hire_date: new Date().toISOString(),
      rank: 'Gold',
      status: 'active'
    });
  });

  supervisors.forEach((id, name) => {
    normalized.users.push({
      user_id: `sup_${id}`,
      name: name,
      email: `${name.toLowerCase().replace(/\s+/g, '.')}@company.com`,
      role: 'leadership',
      department: null,
      team_id: null,
      manager_id: null,
      supervisor_id: null,
      avatar_url: null,
      hire_date: new Date().toISOString(),
      rank: 'Platinum',
      status: 'active'
    });
  });

  // Create performanceMetrics
  const metricMappings = {
    new_revenue: 'revenue',
    new_conversion_pct: 'conversion_rate',
    aos: 'average_order_size',
    cpd: 'calls_per_day',
    nps: 'nps_score',
    aht: 'average_handle_time',
    nrpc: 'new_revenue_per_call',
    wow_score: 'wow_score',
    discovery_score: 'discovery_score',
    qa_score: 'qa_score',
    new_refund_pct: 'refund_rate'
  };

  normalized.performanceMetrics = [];
  rows.forEach(row => {
    const date = new Date(row.Date).toISOString();
    const userId = row.guide_id;
    Object.keys(metricMappings).forEach(col => {
      if (row[col] !== undefined && row[col] !== null) {
        normalized.performanceMetrics.push({
          user_id: userId,
          date: date,
          metric_key: metricMappings[col],
          value: parseFloat(row[col]) || 0,
          target: 0, // Default, can be set later
          unit: col.includes('pct') ? '%' : (col.includes('revenue') ? '$' : '')
        });
      }
    });
  });

  // Generate rewardsCatalog - one per department
  normalized.rewardsCatalog = Array.from(departments).map((dept, index) => ({
    reward_id: `reward_${index + 1}`,
    name: `${dept} Excellence Reward`,
    description: `Reward for outstanding performance in ${dept}`,
    category: 'Department',
    point_cost: 100,
    stock: 'Unlimited',
    status: 'Active',
    icon: 'trophy',
    image: '',
    eligibility: { minRank: 'Bronze', departments: [dept] }
  }));

  // Generate pointsLedger - mock based on metrics
  normalized.pointsLedger = normalized.users.map(user => ({
    transaction_id: `txn_${user.user_id}_1`,
    user_id: user.user_id,
    date: new Date().toISOString(),
    points: Math.floor(Math.random() * 100) + 50, // Mock
    xp: Math.floor(Math.random() * 200) + 100,
    type: 'earned',
    source: 'performance',
    description: 'Points from daily performance'
  }));

  // Generate leaderboard - mock rankings
  normalized.leaderboard = normalized.users.slice(0, 10).map((user, index) => ({
    user_id: user.user_id,
    period: 'weekly',
    period_type: 'current',
    rank: index + 1,
    previous_rank: index + 2,
    total_points: Math.floor(Math.random() * 500) + 200,
    total_xp: Math.floor(Math.random() * 1000) + 500,
    score: Math.floor(Math.random() * 100) + 80
  }));

  return normalized;
}

module.exports = {
  readExcelFile,
  normalizeData
};