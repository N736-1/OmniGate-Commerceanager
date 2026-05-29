import React, { useState } from 'react';
import { Store } from '../types';
import {
  Settings,
  Plus,
  Trash2,
  Save,
  Rocket,
  Github,
  Globe,
  Database,
  ArrowRight,
  HelpCircle,
  Code,
  ShieldAlert,
  Menu
} from 'lucide-react';

interface AdminDashboardProps {
  stores: Store[];
  setStores: React.Dispatch<React.SetStateAction<Store[]>>;
  onShowNotification: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  stores,
  setStores,
  onShowNotification
}) => {
  const [config, setConfig] = useState({
    gatewayAlias: "PayBridg Pakistan",
    cryptoExchangeEnabled: true,
    defaultCurrency: "PKR",
    appSheetWebhook: "https://theamericanemporiu.com/api/webhooks/appsheet"
  });

  // New Store Form State
  const [newStoreName, setNewStoreName] = useState('');
  const [newStoreUrl, setNewStoreUrl] = useState('');
  const [newStoreNiche, setNewStoreNiche] = useState('');

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    onShowNotification(`System configuration saved! Central router is mapping ${stores.length} lojas via default proxy currency [${config.defaultCurrency}].`);
  };

  const handleAddStore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStoreName || !newStoreUrl) {
      onShowNotification("Please provide at least a store name and valid URL domain.", "error");
      return;
    }

    // Prefix URL if needed
    let formattedUrl = newStoreUrl.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `https://${formattedUrl}`;
    }

    const nextId = `store_${Date.now()}`;
    const newStoreItem: Store = {
      id: nextId,
      name: newStoreName.trim(),
      url: formattedUrl,
      niche: newStoreNiche.trim() || 'General Dropshipping Outlets'
    };

    setStores(prev => [...prev, newStoreItem]);
    onShowNotification(`New Wed2C Store Added: "${newStoreItem.name}" is now online and listening.`);
    
    // Reset Form
    setNewStoreName('');
    setNewStoreUrl('');
    setNewStoreNiche('');
  };

  const handleRemoveStore = (id: string, name: string) => {
    if (stores.length <= 1) {
      onShowNotification("Cannot delete all stores. The hub requires at least one active outlet.", "error");
      return;
    }
    
    setStores(prev => prev.filter(s => s.id !== id));
    onShowNotification(`Removed Store Outlet: "${name}" has been disconnected from PayBridg router API.`);
  };

  return (
    <div className="space-y-6">
      {/* Admin Command Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-6 border border-slate-800 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 opacity-5">
          <Settings size={300} />
        </div>
        <div className="relative z-10 space-y-2">
          <span className="bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2.5 inline-block border border-indigo-500/20">
            Owner Command Terminal
          </span>
          <h2 className="text-2xl font-bold font-sans">App Owner Structure & Integration Console</h2>
          <p className="text-slate-300 text-sm max-w-2xl">
            Take full control of active directories. Insert new dropshipping shops, remove inactive URLs, save global route aliases, and inspect the operational handbook for GitHub repository syncing.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Dynamic Data Structure Manager Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* Active Outlets Data Manager */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-md font-bold text-slate-800 mb-2 flex items-center gap-2">
              <Database size={18} className="text-indigo-600" />
              Dynamic Shop Outlets Registry ({stores.length})
            </h3>
            <p className="text-xs text-slate-500 mb-4 leading-normal">
              Directly manipulate the app data structure. Deleted stores are instantly removed from the sidebar maps, checkout sandboxes, and social ROI planners.
            </p>

            {/* In-app Store list with dynamic Delete triggers */}
            <div className="space-y-2 max-h-[290px] overflow-y-auto pr-1 mb-6 border-b border-slate-100 pb-4">
              {stores.map((store) => (
                <div
                  key={store.id}
                  className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between transition-all hover:bg-slate-100/50"
                >
                  <div className="truncate max-w-[80%] font-mono text-xs">
                    <span className="font-sans font-bold text-slate-800 block text-xs truncate leading-tight">{store.name}</span>
                    <span className="text-[10px] text-slate-400 block truncate mt-0.5">{store.url}</span>
                    <span className="text-[9px] text-indigo-600 font-bold tracking-wider uppercase block mt-1">Niche: {store.niche}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveStore(store.id, store.name)}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg hover:text-rose-700 transition cursor-pointer"
                    title={`Remove ${store.name}`}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>

            {/* Quick Added Form */}
            <form onSubmit={handleAddStore} className="space-y-4 bg-slate-50 border border-dashed border-slate-200 p-4 rounded-xl text-xs">
              <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                Add Custom Store Outlet
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-600 uppercase mb-1">Store Name *</label>
                  <input
                    required
                    type="text"
                    value={newStoreName}
                    onChange={(e) => setNewStoreName(e.target.value)}
                    placeholder="e.g. Premium Outlet Shop"
                    className="w-full text-slate-800 border border-slate-200 rounded-lg p-2 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 uppercase mb-1">Store URL Domain *</label>
                  <input
                    required
                    type="text"
                    value={newStoreUrl}
                    onChange={(e) => setNewStoreUrl(e.target.value)}
                    placeholder="e.g. premiumshop.wed2c.com"
                    className="w-full text-slate-800 border border-slate-200 rounded-lg p-2 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 uppercase mb-1">Sales Niche / Genre</label>
                <input
                  type="text"
                  value={newStoreNiche}
                  onChange={(e) => setNewStoreNiche(e.target.value)}
                  placeholder="e.g. Gourmet Slicers & Household"
                  className="w-full text-slate-800 border border-slate-200 rounded-lg p-2 bg-white"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Plus size={14} />
                Connect Store Outlet
              </button>
            </form>
          </div>

          {/* System Environment Configurations Form */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-md font-bold text-slate-800 mb-2 flex items-center gap-2">
              <Settings size={18} className="text-indigo-600" />
              Global Upkeep Settings
            </h3>
            <p className="text-xs text-slate-500 mb-4 leading-normal">
              Manage core variables for transactions and gateway aliases.
            </p>

            <form onSubmit={handleSaveConfig} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-600 uppercase tracking-wide mb-1">
                    System Gateway Name
                  </label>
                  <input
                    type="text"
                    value={config.gatewayAlias}
                    onChange={(e) => setConfig({ ...config, gatewayAlias: e.target.value })}
                    className="w-full text-slate-850 border border-slate-200 p-2 rounded-lg bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 uppercase tracking-wide mb-1">
                    Settlement Currency Code
                  </label>
                  <select
                    value={config.defaultCurrency}
                    onChange={(e) => setConfig({ ...config, defaultCurrency: e.target.value })}
                    className="w-full text-slate-850 border border-slate-200 p-2 rounded-lg bg-white font-bold"
                  >
                    <option value="PKR">Pakistani Rupees (PKR)</option>
                    <option value="USD">American Dollars (USD)</option>
                    <option value="INR">Indian Rupees (INR)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 py-1">
                <input
                  type="checkbox"
                  id="crypto-exchange-agent"
                  checked={config.cryptoExchangeEnabled}
                  onChange={(e) => setConfig({ ...config, cryptoExchangeEnabled: e.target.checked })}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="crypto-exchange-agent" className="text-slate-700 font-semibold text-xs select-none">
                  Enable Antigravity AI Crypto Conversion Broker (BTC & USDC direct payout routing)
                </label>
              </div>

              <button
                type="submit"
                className="flex items-center justify-center gap-1 w-full bg-slate-900 text-white font-bold py-2 rounded-lg hover:bg-slate-800 transition shadow-sm cursor-pointer"
              >
                <Save size={14} />
                Save System Parameters
              </button>
            </form>
          </div>
        </div>

        {/* GitHub & Deployment Handbook Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-md font-bold text-slate-800 mb-1 flex items-center gap-2">
              <Github size={16} className="text-slate-900" />
              Operational & GitHub Handbook
            </h3>
            <p className="text-xs text-slate-500 mb-4 leading-normal">
              Your step-by-step guidebook to preview, save, or host your centralized gateway on external platforms.
            </p>

            <div className="space-y-4">
              {/* How to push to GitHub */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex gap-3">
                <Code className="text-indigo-600 shrink-0 mt-0.5" size={16} />
                <div className="text-xs">
                  <span className="font-bold text-slate-800 block text-xs mb-0.5">1. Check Code on GitHub Repository</span>
                  <p className="text-slate-600 leading-normal leading-normal text-[11px]">
                    To sync this application with your own GitHub, simply look at the global menu bar on this platform. Click the <span className="font-bold text-indigo-600">Settings</span> menu at the top right, and choose <span className="font-bold">Export to GitHub</span>. It will automatically authorize, instantiate a branch, and push the source.
                  </p>
                </div>
              </div>

              {/* Offline Pack */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex gap-3">
                <Rocket className="text-teal-600 shrink-0 mt-0.5" size={16} />
                <div className="text-xs">
                  <span className="font-bold text-slate-800 block text-xs mb-0.5">2. Complete Offline Source Code (ZIP)</span>
                  <p className="text-slate-600 leading-normal leading-normal text-[11px]">
                    To work offline or host it independently, navigate to the <span className="font-bold text-indigo-600">Settings</span> menu inside AI Studio Build, and select <span className="font-bold">Download ZIP</span>.
                  </p>
                </div>
              </div>

              {/* Environments Guide */}
              <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 flex gap-3">
                <Globe className="text-indigo-700 shrink-0 mt-0.5" size={16} />
                <div className="text-xs">
                  <span className="font-bold text-indigo-900 block text-xs mb-0.5">3. Production Host Guidelines</span>
                  <p className="text-indigo-950 leading-normal leading-normal text-[11px]">
                    This application operates a custom full-stack compilation. Port <span className="font-mono font-bold bg-indigo-100 px-1 py-0.2 rounded text-indigo-800">3000</span> is set up by default to host the express proxy. Ensure host parameters are binded to <span className="font-mono">0.0.0.0</span> during live production server handshakes.
                  </p>
                </div>
              </div>

              {/* Security Reminder */}
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl flex gap-3">
                <ShieldAlert className="text-amber-600 shrink-0 mt-0.5" size={16} />
                <div className="text-xs text-amber-900">
                  <span className="font-bold block text-xs mb-0.5">Secure Credentials Policy</span>
                  <p className="leading-normal leading-normal text-[11px]">
                    Never commit sensitive Live credentials directly to files or GitHub repos. Always configure them through the `.env` settings to maintain complete confidentiality.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
