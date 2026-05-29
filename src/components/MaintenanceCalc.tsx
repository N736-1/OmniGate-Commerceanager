import React, { useState } from 'react';
import { Agent, AdCampaign } from '../types';
import {
  Calculator,
  Sliders,
  DollarSign,
  TrendingUp,
  Cpu,
  BarChart,
  Grid,
  ShieldCheck,
  Award
} from 'lucide-react';
import { motion } from 'motion/react';

interface MaintenanceCalcProps {
  agents: Agent[];
  campaigns: AdCampaign[];
}

export const MaintenanceCalc: React.FC<MaintenanceCalcProps> = ({
  agents,
  campaigns
}) => {
  // Input settings
  const [proxyServerCost, setProxyServerCost] = useState<number>(45); // centralized proxy listener port 3000
  const [domainUpkeep, setDomainUpkeep] = useState<number>(90); // 9 shops * $10/year converted/month
  const [appSheetUpkeep, setAppSheetUpkeep] = useState<number>(15); // AppSheet core workspace fee
  const [developerSupport, setDeveloperSupport] = useState<number>(450); // support hourly retention / maintenance
  const [miscFees, setMiscFees] = useState<number>(50);

  // Scalability parameters
  const [monthsCount, setMonthsCount] = useState<number>(6);
  const [monthlyGrowthPercent, setMonthlyGrowthPercent] = useState<number>(15); // 15% traffic and sales volume compounding monthly
  const [commissionBufferPercent, setCommissionBufferPercent] = useState<number>(10); // buffer for agent payouts %

  // Aggregates
  const totalCampaignsAdSpend = campaigns.reduce((acc, c) => acc + c.budget, 0);
  
  // Total hard monthly maintenance cost (Operations excluding commissions/ad spends)
  const baseMonthlyMaintenanceCosts = proxyServerCost + domainUpkeep + appSheetUpkeep + developerSupport + miscFees;
  
  // Summing up total spending
  const estimateTotalCommissions = agents.reduce((acc, a) => {
    // Current average monthly sales payout override
    return acc + (a.totalRevenueGenerated * (a.commissionRate / 100)) / 4; // roughly monthly
  }, 0);

  const totalCurrentMonthlyExpenses = baseMonthlyMaintenanceCosts + totalCampaignsAdSpend + estimateTotalCommissions;

  // Let's generate projection coordinates for the SVG chart
  const currentMonthlyRevenue = agents.reduce((sum, a) => sum + (a.totalRevenueGenerated / 4), 0) || 5500;

  const projectionData = Array.from({ length: monthsCount }, (_, i) => {
    const monthIndex = i + 1;
    // Compounding revenue
    const projectedRevenue = currentMonthlyRevenue * Math.pow(1 + (monthlyGrowthPercent / 100), i);
    // Marketing scales proportionally to support growth
    const projectedMarketing = totalCampaignsAdSpend * Math.pow(1 + (monthlyGrowthPercent * 0.4 / 100), i);
    // Commissions scale exactly proportional to revenue
    const projectedCommissions = projectedRevenue * (commissionBufferPercent / 100);
    // Server proxies and support stay relatively stable with small indexing for data size
    const projectedHardware = baseMonthlyMaintenanceCosts * Math.pow(1.02, i);
    
    const projectedCost = projectedHardware + projectedMarketing + projectedCommissions;
    const projectedProfit = projectedRevenue - projectedCost;

    return {
      monthLabel: `Mo ${monthIndex}`,
      cost: Math.round(projectedCost),
      revenue: Math.round(projectedRevenue),
      profit: Math.round(projectedProfit)
    };
  });

  // Calculate coordinates for SVGs
  const maxVal = Math.max(...projectionData.map(d => Math.max(d.revenue, d.cost, d.profit))) || 10000;
  const padding = 40;
  const graphWidth = 580;
  const graphHeight = 220;

  const getCoordinates = (index: number, val: number) => {
    const x = padding + (index / (monthsCount - 1)) * (graphWidth - padding * 2);
    // Invert Y coordinate so 0 is at bottom
    const y = graphHeight - padding - (val / maxVal) * (graphHeight - padding * 2);
    return { x, y };
  };

  const revenuePoints = projectionData.map((d, i) => getCoordinates(i, d.revenue));
  const costPoints = projectionData.map((d, i) => getCoordinates(i, d.cost));
  const profitPoints = projectionData.map((d, i) => getCoordinates(i, d.profit));

  const generatePathD = (points: Array<{ x: number, y: number }>) => {
    if (points.length === 0) return '';
    return `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');
  };

  // Generate Area path for Profit
  const generateAreaD = (points: Array<{ x: number, y: number }>) => {
    if (points.length === 0) return '';
    const first = points[0];
    const last = points[points.length - 1];
    const bottomY = graphHeight - padding;
    return `M ${first.x} ${bottomY} L ${first.x} ${first.y} ` + 
           points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ') + 
           ` L ${last.x} ${bottomY} Z`;
  };

  return (
    <div className="space-y-6">
      {/* Visual Hub Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Calculator size={220} className="text-white" />
        </div>
        <div className="relative z-10 max-w-3xl">
          <span className="bg-rose-500/20 text-rose-300 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3 inline-block border border-rose-500/20">
            Internal Financial Ledger
          </span>
          <h2 className="text-2xl font-bold font-sans">1-Month Operational Costs & Scaling Projections</h2>
          <p className="text-slate-400 text-sm mt-1.5 font-medium leading-relaxed">
            Monitor proxy server overheads, global custom domain renewal fees, and compute commission allocations. Map long-term financial modeling algorithms to visualize the profitability cross-over.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Cost Tuners Column (Slices: 5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Sliders size={18} className="text-slate-500" />
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Cost & Upkeep Configurations
              </h3>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Central Webhook Proxy (Vite / Port 3000) Upkeep ($/MO)
                </label>
                <input
                  type="number"
                  min="5"
                  max="500"
                  value={proxyServerCost}
                  onChange={(e) => setProxyServerCost(parseFloat(e.target.value) || 0)}
                  className="w-full text-slate-800 border border-slate-200 rounded-lg p-2.5 font-mono"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Hosted on scalable Cloud Run container instances.
                </span>
              </div>

              <div>
                <label className="block font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Custom Domain upkeep (9 Shops) ($/MO)
                </label>
                <input
                  type="number"
                  min="0"
                  max="1000"
                  value={domainUpkeep}
                  onChange={(e) => setDomainUpkeep(parseFloat(e.target.value) || 0)}
                  className="w-full text-slate-800 border border-slate-200 rounded-lg p-2.5 font-mono"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Translates to ~$10/year registered domain renewals for each.
                </span>
              </div>

              <div>
                <label className="block font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  AppSheet / Spreadsheet API Sync Workspace ($/MO)
                </label>
                <input
                  type="number"
                  min="0"
                  max="200"
                  value={appSheetUpkeep}
                  onChange={(e) => setAppSheetUpkeep(parseFloat(e.target.value) || 0)}
                  className="w-full text-slate-800 border border-slate-200 rounded-lg p-2.5 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Developer / Support Retainer ($/MO)
                </label>
                <input
                  type="number"
                  min="0"
                  max="5000"
                  value={developerSupport}
                  onChange={(e) => setDeveloperSupport(parseFloat(e.target.value) || 0)}
                  className="w-full text-slate-800 border border-slate-200 rounded-lg p-2.5 font-mono"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Support maintenance for routing API issues and proxy webhooks.
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    Misc Buffers ($/MO)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="1000"
                    value={miscFees}
                    onChange={(e) => setMiscFees(parseFloat(e.target.value) || 0)}
                    className="w-full text-slate-800 border border-slate-200 rounded-lg p-2.5 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    Growth rate (%/MO)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={monthlyGrowthPercent}
                    onChange={(e) => setMonthlyGrowthPercent(parseFloat(e.target.value) || 1)}
                    className="w-full text-slate-800 border border-slate-200 rounded-lg p-2.5 font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cost outputs and Scaling Curves (Slices: 7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <BarChart size={18} className="text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                  Operational Ledger Output (1 Month)
                </h3>
              </div>
              <span className="text-xs text-rose-500 font-bold bg-rose-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                Maintenance
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold leading-tight">Fixed Maintenance</span>
                <span className="text-lg font-bold text-slate-800 mt-1 block font-mono">
                  ${baseMonthlyMaintenanceCosts.toLocaleString()}
                </span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold leading-tight">Ad Marketing</span>
                <span className="text-lg font-bold text-slate-800 mt-1 block font-mono">
                  ${totalCampaignsAdSpend.toLocaleString()}
                </span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold leading-tight">Commissions</span>
                <span className="text-lg font-bold text-slate-800 mt-1 block font-mono">
                  ${estimateTotalCommissions.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="p-4 bg-slate-900 text-white rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Total Monthly Run Cost</span>
                <span className="text-xl font-bold block mt-0.5 font-mono text-emerald-400">
                  ${Math.round(totalCurrentMonthlyExpenses).toLocaleString()} USD
                </span>
              </div>
              <span className="text-xs bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300 font-medium">
                Locked & Tracked
              </span>
            </div>
          </div>

          {/* Core Scale Projections Chart */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <TrendingUp size={18} className="text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                  Compounding Scaling Curves
                </h3>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setMonthsCount(3)}
                  className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold transition ${
                    monthsCount === 3 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  3M
                </button>
                <button
                  onClick={() => setMonthsCount(6)}
                  className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold transition ${
                    monthsCount === 6 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  6M
                </button>
                <button
                  onClick={() => setMonthsCount(12)}
                  className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold transition ${
                    monthsCount === 12 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  12M
                </button>
              </div>
            </div>

            {/* SVG line graph */}
            <div className="relative">
              <svg viewBox={`0 0 ${graphWidth} ${graphHeight}`} className="w-full h-auto text-slate-700">
                {/* Grid Lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((r, i) => {
                  const y = padding + r * (graphHeight - padding * 2);
                  const displayVal = Math.round(maxVal * (1 - r));
                  return (
                    <g key={i}>
                      <line
                        x1={padding}
                        y1={y}
                        x2={graphWidth - padding}
                        y2={y}
                        stroke="#f1f5f9"
                        strokeWidth="1"
                      />
                      <text
                        x={padding - 5}
                        y={y + 3}
                        textAnchor="end"
                        className="text-[9px] fill-slate-400 font-mono"
                      >
                        ${displayVal.toLocaleString()}
                      </text>
                    </g>
                  );
                })}

                {/* Month labels */}
                {projectionData.map((d, i) => {
                  const x = padding + (i / (monthsCount - 1)) * (graphWidth - padding * 2);
                  return (
                    <text
                      key={i}
                      x={x}
                      y={graphHeight - padding + 15}
                      textAnchor="middle"
                      className="text-[9px] fill-slate-500 font-semibold uppercase tracking-wider"
                    >
                      {d.monthLabel}
                    </text>
                  );
                })}

                {/* Profit shaded area */}
                <path
                  d={generateAreaD(revenuePoints)}
                  fill="url(#profitGrad)"
                  opacity="0.1"
                />

                {/* Lines */}
                <path
                  d={generatePathD(revenuePoints)}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d={generatePathD(costPoints)}
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2"
                  strokeDasharray="4 3"
                />
                <path
                  d={generatePathD(profitPoints)}
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="2"
                  strokeLinecap="round"
                />

                {/* Anchors/Dots for last week */}
                {revenuePoints.length > 0 && (
                  <>
                    <circle cx={revenuePoints[revenuePoints.length - 1].x} cy={revenuePoints[revenuePoints.length - 1].y} r="4" fill="#10b981" />
                    <circle cx={costPoints[costPoints.length - 1].x} cy={costPoints[costPoints.length - 1].y} r="3" fill="#ef4444" />
                    <circle cx={profitPoints[profitPoints.length - 1].x} cy={profitPoints[profitPoints.length - 1].y} r="4" fill="#6366f1" />
                  </>
                )}

                {/* Gradients */}
                <defs>
                  <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Chart Legend */}
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-2 pt-2 border-t border-slate-50 text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-emerald-500 inline-block rounded-full"></span>
                  Gross Revenue
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-rose-500 border-dashed border-t inline-block rounded-full"></span>
                  Projected Expenses
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-1 bg-indigo-500 inline-block rounded-full"></span>
                  Net Operational Profits
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Optimizers Strategy Checklist */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
          <ShieldCheck size={18} className="text-slate-500" />
          <h3 className="text-md font-bold text-slate-800">Operational Optimization Strategy</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600 leading-normal">
          <div className="p-3 bg-white border border-slate-100 rounded-xl space-y-1.5">
            <span className="font-bold text-slate-700 flex items-center gap-1">
              <Award size={14} className="text-indigo-600" /> Prevent Gateway Lockdowns
            </span>
            <p className="text-[11px] text-slate-500">
              Process transactions dynamically across multiple platforms to stay well within safety risk thresholds and avoid triggering high dispute/chargeback filters. 
            </p>
          </div>

          <div className="p-3 bg-white border border-slate-100 rounded-xl space-y-1.5">
            <span className="font-bold text-slate-700 flex items-center gap-1">
              <Cpu size={14} className="text-indigo-600" /> Reduce Infrastructure Bloat
            </span>
            <p className="text-[11px] text-slate-500">
              Maximize your use of free hosting tiers. By using a single webhook handler script, you keep compute resources consolidated, keeping SaaS sync overhead low.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
