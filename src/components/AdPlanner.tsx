import React, { useState } from 'react';
import { AdCampaign, Store } from '../types';
import { CHANNEL_BENCHMARKS, ChannelBenchmark } from '../data/stores';
import {
  TrendingUp,
  Sliders,
  DollarSign,
  Plus,
  Compass,
  CheckCircle,
  HelpCircle,
  Sparkles,
  Zap,
  Target,
  BarChart,
  ShoppingBag
} from 'lucide-react';
import { motion } from 'motion/react';

interface AdPlannerProps {
  stores: Store[];
  campaigns: AdCampaign[];
  onAddCampaign: (newCampaign: Omit<AdCampaign, 'id'>) => void;
  onDeleteCampaign: (id: string) => void;
  onShowNotification: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export const AdPlanner: React.FC<AdPlannerProps> = ({
  stores,
  campaigns,
  onAddCampaign,
  onDeleteCampaign,
  onShowNotification
}) => {
  // Campaign creator states
  const [selectedStoreUrl, setSelectedStoreUrl] = useState<string>(stores[0]?.url || '');
  const [selectedPlatform, setSelectedPlatform] = useState<AdCampaign['platform']>('Facebook');
  const [budget, setBudget] = useState<number>(1500);
  const [targetCPC, setTargetCPC] = useState<number>(0.85);
  const [targetCTR, setTargetCTR] = useState<number>(1.2);
  const [targetCVR, setTargetCVR] = useState<number>(2.1);
  const [avgOrderValue, setAvgOrderValue] = useState<number>(45);

  // Load benchmarks helper
  const handleLoadBenchmark = (benchmark: ChannelBenchmark) => {
    setSelectedPlatform(benchmark.platform);
    setTargetCPC(benchmark.avgCPC);
    setTargetCTR(benchmark.avgCTR);
    setTargetCVR(benchmark.avgCVR);
    
    // Auto-assign corresponding best-fit store url if matched
    const bestFitStore = stores.find(store => store.niche === benchmark.recommendedNiches[0]);
    if (bestFitStore) {
      setSelectedStoreUrl(bestFitStore.url);
    }
    
    onShowNotification(`Loaded high-performance ROI benchmarks for ${benchmark.platform}!`);
  };

  // Perform computations for ad calculations
  const calculateMetrics = (
    cBudget: number, 
    cCpc: number, 
    cCvr: number, 
    cAov: number
  ) => {
    const projectedClicks = cCpc > 0 ? Math.floor(cBudget / cCpc) : 0;
    const projectedOrders = Math.floor(projectedClicks * (cCvr / 100));
    const grossRevenue = projectedOrders * cAov;
    const netProfit = grossRevenue - cBudget;
    const roas = cBudget > 0 ? (grossRevenue / cBudget).toFixed(2) : '0';
    const roi = cBudget > 0 ? ((netProfit / cBudget) * 100).toFixed(0) : '0';

    return {
      projectedClicks,
      projectedOrders,
      grossRevenue,
      netProfit,
      roas,
      roi
    };
  };

  const activeMetrics = calculateMetrics(budget, targetCPC, targetCVR, avgOrderValue);

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    onAddCampaign({
      storeUrl: selectedStoreUrl,
      platform: selectedPlatform,
      budget,
      targetCPC,
      targetCTR,
      targetConversionRate: targetCVR,
      avgOrderValue
    });
    onShowNotification(`Campaign blueprint saved in active ledger. Optimal scaling limits active.`);
  };

  return (
    <div className="space-y-6">
      {/* Banner overview */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <TrendingUp size={240} className="text-white" />
        </div>
        <div className="relative z-10 max-w-3xl">
          <span className="bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 inline-block">
            ROI Optimizer Module
          </span>
          <h2 className="text-2xl font-bold font-sans">Multi-SaaS Social Traffic Acquisition</h2>
          <p className="text-slate-400 text-sm mt-1">
            Build and optimize conversions across all relevant top-tier social advertising loops. Tap preset analytics benchmarks configured for the absolute highest Return on Ad Spend (ROAS) guidelines.
          </p>
        </div>
      </div>

      {/* Pre-configured High ROI Blueprints Selector */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5">
          <Zap size={18} className="text-amber-500 animate-pulse" />
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            High ROI Channel Blueprints (Recommended)
          </h3>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
          {CHANNEL_BENCHMARKS.map((benchmark) => {
            const bestFitStore = stores.find(store => store.niche === benchmark.recommendedNiches[0]);
            return (
              <button
                key={benchmark.platform}
                onClick={() => handleLoadBenchmark(benchmark)}
                className="bg-white border border-slate-200 hover:border-indigo-500 rounded-xl p-3 text-left transition-all duration-200 hover:shadow-md flex flex-col justify-between h-40 group hover:-translate-y-0.5"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-slate-800 text-xs tracking-tight group-hover:text-indigo-600">
                      {benchmark.platform}
                    </span>
                    <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-1.5 py-0.5 rounded font-mono">
                      {benchmark.roiFactor}x
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1.5 font-mono">
                    CPC: ${benchmark.avgCPC} | CVR: {benchmark.avgCVR}%
                  </p>
                </div>

                <div className="border-t border-slate-100 pt-2 w-full">
                  <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-semibold">
                    Best Store Match
                  </span>
                  <span className="text-[10px] text-slate-600 block line-clamp-2 mt-0.5 font-medium leading-tight">
                    {bestFitStore?.name || 'All Sites Proxy'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive Calculator Form (Slices: 5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Sliders size={18} className="text-slate-500" />
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Interactive ROI Planner
              </h3>
            </div>

            <form onSubmit={handleCreateCampaign} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-600 uppercase tracking-wider mb-1">
                  Target Wed2C Outlet Store
                </label>
                <select
                  value={selectedStoreUrl}
                  onChange={(e) => setSelectedStoreUrl(e.target.value)}
                  className="w-full text-slate-800 border border-slate-200 rounded-lg p-2 bg-white"
                >
                  {stores.map(store => (
                    <option key={store.id} value={store.url}>
                      {store.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-600 uppercase tracking-wider mb-1">
                    Ad Network Platform
                  </label>
                  <select
                    value={selectedPlatform}
                    onChange={(e) => setSelectedPlatform(e.target.value as AdCampaign['platform'])}
                    className="w-full text-slate-800 border border-slate-200 rounded-lg p-2 bg-white"
                  >
                    <option value="Facebook">Facebook Ads</option>
                    <option value="Google Ads">Google Ads</option>
                    <option value="YouTube Ads">YouTube Ads</option>
                    <option value="TikTok">TikTok Ads</option>
                    <option value="WhatsApp">WhatsApp Loop</option>
                    <option value="Instagram">Instagram Ads</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 uppercase tracking-wider mb-1">
                    Monthly Budget (USD)
                  </label>
                  <input
                    type="number"
                    min="100"
                    max="100000"
                    value={budget}
                    onChange={(e) => setBudget(parseFloat(e.target.value) || 0)}
                    className="w-full text-slate-800 border border-slate-200 rounded-lg p-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-600 uppercase tracking-wider mb-1">
                    Avg CPC Target ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.05"
                    max="10.0"
                    value={targetCPC}
                    onChange={(e) => setTargetCPC(parseFloat(e.target.value) || 0)}
                    className="w-full text-slate-800 border border-slate-200 rounded-lg p-2"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 uppercase tracking-wider mb-1">
                    Order Value Avg ($)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="500"
                    value={avgOrderValue}
                    onChange={(e) => setAvgOrderValue(parseFloat(e.target.value) || 0)}
                    className="w-full text-slate-800 border border-slate-200 rounded-lg p-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-600 uppercase tracking-wider mb-1">
                    Clicks Clickrate (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="30"
                    value={targetCTR}
                    onChange={(e) => setTargetCTR(parseFloat(e.target.value) || 0)}
                    className="w-full text-slate-800 border border-slate-200 rounded-lg p-2"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 uppercase tracking-wider mb-1">
                    Conv. Rate (CVR %)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="20"
                    value={targetCVR}
                    onChange={(e) => setTargetCVR(parseFloat(e.target.value) || 0)}
                    className="w-full text-slate-800 border border-slate-200 rounded-lg p-2"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 text-white font-bold tracking-wide text-xs py-2.5 rounded-lg hover:bg-slate-800 transition shadow-sm cursor-pointer"
              >
                Log Blueprint Scenario
              </button>
            </form>
          </div>
        </div>

        {/* Computations Display Panel (Slices: 7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 text-white border border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <BarChart size={18} className="text-teal-400" />
                  <h3 className="text-sm font-bold uppercase tracking-wider">
                    Projected Outcomes ({selectedPlatform})
                  </h3>
                </div>
                <span className="text-[10px] text-teal-400 font-mono font-bold bg-teal-950/80 px-2 py-0.5 rounded border border-teal-500/20">
                  METRICS ENGAGED
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 block font-mono">Sessions / Clicks</span>
                  <p className="text-xl font-bold mt-1 text-slate-200">
                    {activeMetrics.projectedClicks.toLocaleString()}
                  </p>
                </div>
                <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 block font-mono">Conversions</span>
                  <p className="text-xl font-bold mt-1 text-teal-400">
                    {activeMetrics.projectedOrders.toLocaleString()}
                  </p>
                </div>
                <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 block font-mono">ROAS Ratio</span>
                  <p className="text-xl font-bold mt-1 text-indigo-400 font-mono">
                    {activeMetrics.roas}x
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-800">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Projected General Revenue</span>
                  <span className="font-bold text-slate-200">${activeMetrics.grossRevenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Acquisition Advertising Cost</span>
                  <span className="font-bold text-rose-400">-${budget.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm pt-2 border-t border-dashed border-slate-800">
                  <span className="font-bold text-slate-300">Net Promotion ROI Yield</span>
                  <span className={`font-bold text-lg font-mono ${activeMetrics.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    +${activeMetrics.netProfit.toLocaleString()} ({activeMetrics.roi}%)
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800 flex items-start gap-2.5">
              <ShoppingBag size={22} className="text-indigo-400 shrink-0 mt-0.5" />
              <div className="text-[11px] text-slate-500 leading-normal">
                <span className="text-slate-400 font-semibold block">Social Setup Recommendation</span>
                {selectedPlatform === 'WhatsApp' ? (
                  <span>WhatsApp direct broadcasting has minimal cost and incredibly high click/intent ratios by exploiting pre-validated customer groups. Focus closely on high average order value packages.</span>
                ) : (
                  <span>Ensure your Facebook and TikTok pixel codes are correctly loaded inside the central checkouts proxy, ensuring full optimization attribution for your sub-agents in real-time.</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Campaigns Ledger */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
          Saved Ad Blueprint Ledgers ({campaigns.length})
        </h3>

        {campaigns.length === 0 ? (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center text-xs text-slate-500">
            No custom campaigns mapped yet. Save optimized blueprints above.
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="bg-slate-50 border-b border-slate-100 p-4 grid grid-cols-12 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <span className="col-span-3">Target Shop & Network</span>
              <span className="col-span-2 text-right">Budget</span>
              <span className="col-span-2 text-right">Specs</span>
              <span className="col-span-3 text-right">Proj ROI / Net</span>
              <span className="col-span-2 text-right">Action</span>
            </div>

            <div className="divide-y divide-slate-100 text-xs text-slate-700">
              {campaigns.map((camp) => {
                const storeObj = stores.find(s => s.url === camp.storeUrl);
                const metrics = calculateMetrics(
                  camp.budget,
                  camp.targetCPC,
                  camp.targetConversionRate,
                  camp.avgOrderValue
                );

                return (
                  <div key={camp.id} className="p-4 grid grid-cols-12 items-center hover:bg-slate-50">
                    <div className="col-span-3">
                      <span className="font-bold text-slate-800 block truncate">{storeObj?.name || 'All-Sites Proxy'}</span>
                      <span className="text-[10px] text-indigo-600 block bg-indigo-50 w-fit px-1.5 py-0.5 rounded mt-0.5 font-semibold">
                        {camp.platform} Ads
                      </span>
                    </div>

                    <div className="col-span-2 text-right font-mono font-bold text-slate-900">
                      ${camp.budget.toLocaleString()}
                    </div>

                    <div className="col-span-2 text-right text-[10px] text-slate-400 font-mono">
                      CPC: ${camp.targetCPC} | CVR: {camp.targetConversionRate}%
                    </div>

                    <div className="col-span-3 text-right">
                      <span className="font-bold text-emerald-600 block font-mono">+${metrics.netProfit.toLocaleString()}</span>
                      <span className="text-[10px] text-slate-400 block font-mono">{metrics.roi}% ROI ({metrics.roas}x ROAS)</span>
                    </div>

                    <div className="col-span-2 text-right">
                      <button
                        onClick={() => onDeleteCampaign(camp.id)}
                        className="text-red-500 hover:text-red-700 font-semibold hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
