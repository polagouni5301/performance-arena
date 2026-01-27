const fs = require('fs');
const path = require('path');

class GuidesService {
  constructor() {
    this.guidesFile = path.join(__dirname, '../data/processed/guides.json');
    this.csvFile = path.join(__dirname, '../data/processed/gamification_data.xlsx.csv');
    this.targetsFile = path.join(__dirname, '../data/kpi target & weightage.csv');
    this.guides = this.loadGuides();
    this.targets = this.loadTargets();
  }

  loadGuides() {
    if (fs.existsSync(this.guidesFile)) {
      return JSON.parse(fs.readFileSync(this.guidesFile, 'utf8'));
    }
    return {};
  }

  saveGuides() {
    fs.writeFileSync(this.guidesFile, JSON.stringify(this.guides, null, 2));
  }

  loadTargets() {
    // Simple: use Inbound targets for all
    return {
      'Inbound': {
        new_refund_pct: 7,
        new_conversion_pct: 18.5,
        nrpc: 11.22,
        aos: 60.66,
        nps: 65,
        wow_score: 80,
        weights: {
          new_refund_pct: 10,
          new_conversion_pct: 20,
          nrpc: 25,
          aos: 20,
          nps: 15,
          wow_score: 10
        }
      }
    };
  }

  loadFromCSV() {
    if (!fs.existsSync(this.csvFile)) {
      console.error('CSV file not found');
      return;
    }
    const csvData = fs.readFileSync(this.csvFile, 'utf8');
    const lines = csvData.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',');
    const rows = lines.slice(1).map(line => {
      const values = line.split(',');
      const obj = {};
      headers.forEach((h, i) => obj[h.trim()] = values[i]?.trim() || '');
      return obj;
    });
    this.processGuides(rows);
    this.saveGuides();
  }

  processGuides(csvData) {
    const guideMap = {};

    csvData.forEach(row => {
      const guideId = row.guide_id;
      if (!guideMap[guideId]) {
        guideMap[guideId] = {
          guide_id: guideId,
          name: row.guide_name,
          department: row.department,
          supervisor: row.supervisor,
          manager: row.manager,
          metrics: {
            aht: parseFloat(row.aht) || 0,
            qa: parseFloat(row.qa_score) || 0,
            revenue: parseFloat(row.new_revenue) || 0,
            nps: parseFloat(row.nps) || 0,
            nrpc: parseFloat(row.nrpc) || 0,
            nconv_pct: parseFloat(row.new_conversion_pct) || 0,
            aos: parseFloat(row.aos) || 0,
            qa_score: parseFloat(row.qa_score) || 0,
            new_refund_pct: parseFloat(row.new_refund_pct) || 0,
            wow_score: parseFloat(row.wow_score) || 0
          },
          calculated: this.calculateXPAndPoints({
            aht: parseFloat(row.aht) || 0,
            qa: parseFloat(row.qa_score) || 0,
            revenue: parseFloat(row.new_revenue) || 0,
            nps: parseFloat(row.nps) || 0,
            new_refund_pct: parseFloat(row.new_refund_pct) || 0,
            new_conversion_pct: parseFloat(row.new_conversion_pct) || 0,
            nrpc: parseFloat(row.nrpc) || 0,
            aos: parseFloat(row.aos) || 0,
            wow_score: parseFloat(row.wow_score) || 0
          }, row.department),
          streak: 1,
          rewards: this.getDefaultRewards(),
          registered: false,
          loginInfo: null
        };
      }
    });

    this.guides = guideMap;
  }

  calculateXPAndPoints(metrics, department) {
    const deptTargets = this.targets[department] || this.targets['Inbound'];
    let finalScore = 0;

    const kpiMappings = {
      new_refund_pct: 'new_refund_pct',
      new_conversion_pct: 'new_conversion_pct',
      nrpc: 'nrpc',
      aos: 'aos',
      nps: 'nps',
      wow_score: 'wow_score'
    };

    Object.keys(kpiMappings).forEach(key => {
      const weight = deptTargets.weights[kpiMappings[key]] / 100;
      if (weight > 0 && metrics[key] > 0) {
        const target = deptTargets[kpiMappings[key]];
        const kpiScore = Math.min((metrics[key] / target) * 100, 100);
        finalScore += kpiScore * weight;
      }
    });

    const points = Math.min(finalScore, 100);
    const xp = Math.min(Math.floor(points / 10), 10);

    return { finalScore, points, xp };
  }

  getDefaultRewards() {
    return [
      {
        id: 'r1',
        name: 'Amazon Gift Card $50',
        category: 'gift-cards',
        pointCost: 5000,
        rarity: 'rare',
        inStock: true,
        stockCount: 15
      },
      {
        id: 'r2',
        name: 'Starbucks Voucher $25',
        category: 'vouchers',
        pointCost: 2500,
        rarity: 'common',
        inStock: true,
        stockCount: 50
      }
    ];
  }

  getGuide(guideId) {
    return this.guides[guideId];
  }

  registerGuide(guideId, loginInfo) {
    if (this.guides[guideId]) {
      this.guides[guideId].registered = true;
      this.guides[guideId].loginInfo = loginInfo;
      this.saveGuides();
    }
  }

  getAllGuides() {
    return Object.values(this.guides);
  }

  getGuidesBySupervisor(supervisor) {
    return Object.values(this.guides).filter(g => g.supervisor === supervisor);
  }

  getGuidesByDepartment(dept) {
    return Object.values(this.guides).filter(g => g.department === dept);
  }

  getDepartments() {
    const depts = new Set(Object.values(this.guides).map(g => g.department));
    return Array.from(depts);
  }

  recalculateAll() {
    Object.values(this.guides).forEach(guide => {
      guide.calculated = this.calculateXPAndPoints(guide.metrics, guide.department);
    });
    this.saveGuides();
  }
}

module.exports = new GuidesService();