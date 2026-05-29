import React, { useState } from 'react';
import { Store, Agent, PaymentGatewayConfig, AdCampaign } from '../types';
import {
  Layers,
  Users,
  DollarSign,
  TrendingUp,
  ExternalLink,
  ShoppingCart,
  CheckCircle,
  Copy,
  ChevronRight,
  Database,
  RefreshCw,
  Sparkles,
  FileSpreadsheet
} from 'lucide-react';
import { motion } from 'motion/react';

interface OverviewProps {
  stores: Store[];
  agents: Agent[];
  campaigns: AdCampaign[];
  paymentConfigs: PaymentGatewayConfig[];
  transactions: Array<{
    id: string;
    storeUrl: string;
    amount: number;
    agentId?: string;
    createdAt: string;
    gatewayUsed: string;
    customerEmail: string;
    productName: string;
    status: string;
  }>;
  onAddMockTransaction: (storeUrl: string) => void;
}

export const Overview: React.FC<OverviewProps> = ({
  stores,
  agents,
  campaigns,
  paymentConfigs,
  transactions,
  onAddMockTransaction
}) => {
  const [copiedStoreIndex, setCopiedStoreIndex] = useState<number | null>(null);

  // Stats calculation
  const totalStoresCount = stores.length;
  const activeGatewaysLength = paymentConfigs.filter(g => g.isActive).length;
  const totalAgentsCount = agents.length;
  const subAgentsCount = agents.filter(a => a.role === 'Sub-Agent').length;

  const totalSalesFromLogs = transactions.reduce((acc, t) => acc + t.amount, 0);
  const totalTransactionsCount = transactions.length;

  const totalMarketingSpend = campaigns.reduce((acc, c) => acc + c.budget, 0);

  // Global ROAS / ROI estimate
  const roas = totalMarketingSpend > 0 ? (totalSalesFromLogs / totalMarketingSpend).toFixed(2) : '3.8';

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedStoreIndex(index);
    setTimeout(() => setCopiedStoreIndex(null), 2000);
  };

  const handleExportExcel = () => {
    if (transactions.length === 0) {
      alert("No transaction records to export!");
      return;
    }

    const headers = [
      "Transaction ID",
      "Store Name",
      "Store URL",
      "Product Name",
      "Customer Email",
      "Amount (USD)",
      "Payment Gateway",
      "Created At",
      "Status",
      "Agent Assigned"
    ];

    const rows = transactions.map(tx => {
      const storeObj = stores.find(s => s.url === tx.storeUrl);
      const storeName = storeObj ? storeObj.name : "Unknown Store";
      const agentAssigned = tx.agentId ? tx.agentId : "Direct";

      const escapeCsv = (val: string | number | undefined) => {
        if (val === undefined || val === null) return '""';
        const str = String(val).replace(/"/g, '""');
        return `"${str}"`;
      };

      return [
        escapeCsv(tx.id),
        escapeCsv(storeName),
        escapeCsv(tx.storeUrl),
        escapeCsv(tx.productName),
        escapeCsv(tx.customerEmail),
        escapeCsv(tx.amount),
        escapeCsv(tx.gatewayUsed),
        escapeCsv(tx.createdAt),
        escapeCsv(tx.status),
        escapeCsv(agentAssigned)
      ];
    });

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    const today = new Date().toISOString().split('T')[0];
    link.setAttribute("href", url);
    link.setAttribute("download", `wed2c_transactions_export_${today}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Visual Header Grid */}
      <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Database size={240} className="text-white" />
        </div>
        <div className="relative z-10 max-w-3xl">
          <span className="bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3 inline-block border border-amber-500/20">
            Multi-Store Enterprise Network
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2 font-sans">
            Operations Command Center
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed mb-4">
            Unified management hub for your dropshipping network. Consolidating payments for <span className="text-teal-400 font-semibold">{totalStoresCount} Wed2C outlets</span>, coordinating high-performance master and sub-agents, and projecting omni-channel ad performance in real-time.
          </p>
          <div className="flex flex-wrap gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
              9 active webhook relays
            </span>
            <span className="text-slate-600">|</span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Central gateway online
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-300">AppSheet Sync State: Active</span>
          </div>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Gateway Total Volume</span>
            <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
              <DollarSign size={20} />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">${totalSalesFromLogs.toLocaleString()}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-slate-500">{totalTransactionsCount} global purchases</span>
            <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">Secure SSL</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Active Wed2C Stores</span>
            <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
              <Layers size={20} />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{totalStoresCount} outlets</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-slate-500">{activeGatewaysLength} active payment proxies</span>
            <span className="text-xs text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full">100% Hosted</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Agent Fleet</span>
            <div className="p-2 bg-amber-50 rounded-xl text-amber-600">
              <Users size={20} />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{totalAgentsCount} partners</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-slate-500">{subAgentsCount} sub-agents enrolled</span>
            <span className="text-xs text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-full">AppSheet Logs</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">System ROI Estimate</span>
            <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
              <TrendingUp size={20} />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{roas}x ROAS</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-slate-500">Spend: ${totalMarketingSpend.toLocaleString()}/mo</span>
            <span className="text-xs text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-full">Optimized</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stores Grid Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800">Wed2C Dropshipping Outlets ({totalStoresCount})</h3>
            <span className="text-xs text-indigo-600 hover:underline cursor-pointer flex items-center gap-1">
              Configure Webhooks <ChevronRight size={14} />
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stores.map((store, index) => {
              // Aggregate statistics for this outlet
              const storeTransactions = transactions.filter(t => t.storeUrl === store.url);
              const storeSales = storeTransactions.reduce((sum, t) => sum + t.amount, 0);
              const storeCount = storeTransactions.length;

              return (
                <div
                  key={store.id}
                  className="bg-white border border-slate-200 hover:border-indigo-300 rounded-xl p-4 flex flex-col justify-between shadow-sm transition-all hover:shadow-md group relative overflow-hidden"
                >
                  <div className="absolute -right-4 -bottom-4 text-slate-100 opacity-60 group-hover:scale-110 duration-300 transition-transform">
                    <ShoppingCart size={80} />
                  </div>

                  <div className="relative z-10">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded uppercase tracking-wider font-mono">
                          API ACTIVE
                        </span>
                        <h4 className="font-bold text-slate-900 mt-1">{store.name}</h4>
                      </div>
                      <a
                        href={store.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-400 hover:text-slate-700 bg-slate-50 group-hover:bg-indigo-50 p-1.5 rounded-lg transition"
                      >
                        <ExternalLink size={14} />
                      </a>
                    </div>

                    <p className="text-slate-500 text-xs mt-1.5 line-clamp-1">{store.niche}</p>

                    <div className="mt-4 bg-slate-50 p-2 rounded-lg border border-slate-100 grid grid-cols-2 text-center text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Total Revenue</span>
                        <span className="font-bold text-slate-700">${storeSales.toLocaleString()}</span>
                      </div>
                      <div className="border-l border-slate-200">
                        <span className="text-[10px] text-slate-400 block">Checkouts</span>
                        <span className="font-bold text-slate-700">{storeCount} orders</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2 relative z-10">
                    <button
                      onClick={() => copyToClipboard(store.url, index)}
                      className="text-[11px] text-slate-500 hover:text-slate-700 flex items-center gap-1 py-1 px-2 hover:bg-slate-50 rounded"
                    >
                      <Copy size={11} />
                      {copiedStoreIndex === index ? 'Copied' : 'Store Link'}
                    </button>
                    <button
                      onClick={() => onAddMockTransaction(store.url)}
                      className="text-[11px] bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium py-1 px-2.5 rounded-lg flex items-center gap-1 transition"
                    >
                      <Sparkles size={11} />
                      Test Checkout
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Real-time Webhook Live Feed */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800">Unified Transaction Log</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportExcel}
                className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold py-1 px-3 rounded-lg flex items-center gap-1 transition shadow-3xs cursor-pointer inline-flex items-center"
                title="Export current transaction log as Microsoft Excel compatible file"
              >
                <FileSpreadsheet size={13} />
                <span>Export to Excel</span>
              </button>
              <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Live proxy
              </span>
            </div>
          </div>

          <div className="bg-slate-900 text-slate-100 p-5 rounded-2xl border border-slate-800 shadow-sm flex flex-col h-[520px]">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800 mb-3 text-xs text-slate-400 font-mono">
              <span>LISTENER: PORT 3000 Webhook</span>
              <span>STATE: LISTENING</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
              {transactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 py-6">
                  <ShoppingCart size={32} className="mb-2 text-slate-600 animate-bounce" />
                  <p>No transactions logged yet.</p>
                  <p className="text-[11px] mt-1">Tap a store's &quot;Test Checkout&quot; to push dummy Webhook metrics.</p>
                </div>
              ) : (
                transactions.map((tx) => {
                  const storeObj = stores.find(s => s.url === tx.storeUrl);
                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={tx.id}
                      className="bg-slate-800/80 rounded-lg p-3 border border-slate-700/50 hover:bg-slate-700/50 transition-all font-mono"
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-[11px] font-bold text-teal-400">
                          {storeObj?.name || 'Store outlet'}
                        </span>
                        <span className="text-[11px] text-emerald-400 font-semibold">+${tx.amount.toFixed(2)}</span>
                      </div>
                      <div className="text-slate-400 text-[10px] mt-1 flex flex-wrap justify-between gap-1">
                        <span>P: {tx.productName}</span>
                        <span>Gateway: {tx.gatewayUsed}</span>
                      </div>
                      <div className="text-slate-500 text-[10px] leading-none mt-1.5 flex justify-between items-center">
                        <span className="truncate max-w-[130px]">{tx.customerEmail}</span>
                        <span>{new Date(tx.createdAt).toLocaleTimeString()}</span>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            <div className="pt-3 border-t border-slate-800 text-[10px] text-slate-400 leading-normal">
              <span className="text-amber-400 font-semibold block">AppSheet Data Stream</span>
              <span>Instantly formats agent contributions relative to designated Wed2C stores. Real-time exports enabled in Agent Tab.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
