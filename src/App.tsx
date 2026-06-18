/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Overview } from './components/Overview';
import { PaymentGateway } from './components/PaymentGateway';
import { AgentNetwork } from './components/AgentNetwork';
import { AdPlanner } from './components/AdPlanner';
import { MaintenanceCalc } from './components/MaintenanceCalc';
import { AdminDashboard } from './components/AdminDashboard';
import { Agent, PaymentGatewayConfig, AdCampaign } from './types';
import { INITIAL_AGENTS } from './data/initialAgents';
import { WED2C_STORES } from './data/stores';
import {
  Layers,
  Users,
  TrendingUp,
  CreditCard,
  Calculator,
  LayoutDashboard,
  Coins,
  Settings
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'payment' | 'agents' | 'adplanner' | 'maintenance' | 'admin'>('overview');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showNotification = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setNotification({ message, type });
  };

  // Unified application state
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);
  
  const [campaigns, setCampaigns] = useState<AdCampaign[]>([
    {
      id: 'camp_1',
      storeUrl: 'https://theamericanemporiu.wed2c.com',
      platform: 'Facebook',
      budget: 1200,
      targetCPC: 0.85,
      targetCTR: 1.2,
      targetConversionRate: 2.1,
      avgOrderValue: 45
    },
    {
      id: 'camp_2',
      storeUrl: 'https://sellonlinestore1.wed2c.com',
      platform: 'TikTok',
      budget: 800,
      targetCPC: 0.45,
      targetCTR: 1.8,
      targetConversionRate: 1.9,
      avgOrderValue: 35
    }
  ]);

  const [paymentConfigs, setPaymentConfigs] = useState<PaymentGatewayConfig[]>([
    {
      id: 'stripe',
      name: 'Stripe Global API',
      isActive: true,
      apiKey: 'sk_test_51Ng834X9Yp0...kd92',
      webhookUrl: 'https://theamericanemporiu.com/api/webhooks/stripe',
      supportedMethods: ['Visa', 'MasterCard', 'Apple Pay'],
      testMode: true
    },
    {
      id: 'paypal',
      name: 'PayPal Commerce',
      isActive: true,
      apiKey: 'PAYPAL_CLIENT_ID_98834_ASD',
      webhookUrl: 'https://theamericanemporiu.com/api/webhooks/paypal',
      supportedMethods: ['PayPal', 'Pay Later', 'Venmo'],
      testMode: true
    },
    {
      id: 'checkout',
      name: 'Checkout.com Hub',
      isActive: false,
      apiKey: 'ck_test_7c2b...8e11',
      webhookUrl: 'https://theamericanemporiu.com/api/webhooks/checkout',
      supportedMethods: ['Credit Cards', 'GPay'],
      testMode: true
    },
    {
      id: 'crypto',
      name: 'Web3 Coinbase SDK',
      isActive: false,
      apiKey: 'coinbase_jwt_auth_key',
      webhookUrl: 'https://theamericanemporiu.com/api/webhooks/crypto',
      supportedMethods: ['USDC', 'Bitcoin', 'Ethereum'],
      testMode: true
    }
  ]);

  const [transactions, setTransactions] = useState<Array<{
    id: string;
    storeUrl: string;
    amount: number;
    agentId?: string;
    createdAt: string;
    gatewayUsed: string;
    customerEmail: string;
    productName: string;
    status: string;
  }>>([
    {
      id: 'tx_1029',
      storeUrl: 'https://theamericanemporiu.wed2c.com',
      amount: 45.00,
      agentId: 'agent_1',
      createdAt: '2026-05-25T16:40:00Z',
      gatewayUsed: 'Stripe Global API',
      customerEmail: 'clara.morales@yahoo.com',
      productName: 'Instant Gourmet Mini-Fryer',
      status: 'Captured'
    },
    {
      id: 'tx_1030',
      storeUrl: 'https://sellonlinestore1.wed2c.com',
      amount: 35.00,
      agentId: 'agent_5',
      createdAt: '2026-05-25T17:05:00Z',
      gatewayUsed: 'Stripe Global API',
      customerEmail: 'danny_b32@gmail.com',
      productName: 'Wireless Bluetooth Smart Tracker',
      status: 'Captured'
    },
    {
      id: 'tx_1031',
      storeUrl: 'https://bazaarshop.wed2c.com',
      amount: 59.90,
      agentId: 'agent_3',
      createdAt: '2026-05-25T17:12:00Z',
      gatewayUsed: 'PayPal Commerce',
      customerEmail: 'alex.h@gmail.com',
      productName: 'Tactical Expedition Travel Backpack',
      status: 'Captured'
    }
  ]);

  // Handler: Turn payment gateway on or off
  const handleToggleGateway = (id: string) => {
    setPaymentConfigs(prev =>
      prev.map(c => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
  };

  // Handler: Update credentials key for gateway
  const handleUpdateGatewayKeys = (id: string, apiKey: string, testMode: boolean) => {
    setPaymentConfigs(prev =>
      prev.map(c => (c.id === id ? { ...c, apiKey, testMode } : c))
    );
  };

  // Handler: Adds direct mock order checking manually or from stores card trigger
  const handleAddMockTransaction = (storeUrl: string) => {
    const productsList = [
      'Ergonomic Leather Support Vest',
      'Ultra Smart Wireless Earbuds V2',
      'Eco Food Chopper & Slicer Combo',
      'Minimalist Desktop Ambient Lamp',
      'Smart Wellness Body Fat Scale'
    ];
    const prices = [59.99, 49.99, 29.95, 39.90, 45.00];
    const emails = ['fargo.stone@gmail.com', 'clara_beaty@yahoo.com', 'marian.c@outlook.com', 'justin.adams@hushmail.com'];
    
    const randIndex = Math.floor(Math.random() * productsList.length);
    const selectedProduct = productsList[randIndex];
    const selectedPrice = prices[randIndex];
    const selectedEmail = emails[Math.floor(Math.random() * emails.length)];
    
    // Choose active gateway
    const activeGateways = paymentConfigs.filter(g => g.isActive);
    const selectedGate = activeGateways.length > 0 ? activeGateways[0].name : 'Stripe Global API';

    // Check if there is an agent assigned to promotion of this store url
    const agentMatched = agents.find(a => a.assignedStoreUrls.includes(storeUrl));

    const newTx = {
      id: `tx_${Math.floor(1000 + Math.random() * 9000)}`,
      storeUrl,
      amount: selectedPrice,
      agentId: agentMatched?.id,
      createdAt: new Date().toISOString(),
      gatewayUsed: selectedGate,
      customerEmail: selectedEmail,
      productName: selectedProduct,
      status: 'Captured'
    };

    setTransactions(prev => [newTx, ...prev]);

    // If there is a matching agent, credit them automatically
    if (agentMatched) {
      handleTrackSale(agentMatched.id, selectedPrice);
    }
  };

  // Handler: Simulate customizable transaction handshake
  const handleSimulateCheckout = (details: {
    storeUrl: string;
    amount: number;
    productName: string;
    customerEmail: string;
    gatewayUsed: string;
  }) => {
    const agentMatched = agents.find(a => a.assignedStoreUrls.includes(details.storeUrl));

    const newTx = {
      id: `tx_${Math.floor(1000 + Math.random() * 9000)}`,
      storeUrl: details.storeUrl,
      amount: details.amount,
      agentId: agentMatched?.id,
      createdAt: new Date().toISOString(),
      gatewayUsed: details.gatewayUsed,
      customerEmail: details.customerEmail,
      productName: details.productName,
      status: 'Captured'
    };

    setTransactions(prev => [newTx, ...prev]);

    if (agentMatched) {
      handleTrackSale(agentMatched.id, details.amount);
    }
  };

  // Handler: Enroll partner agent
  const handleAddAgent = (newAgent: Omit<Agent, 'id' | 'totalSalesCount' | 'totalRevenueGenerated' | 'createdAt'>) => {
    const freshAgent: Agent = {
      ...newAgent,
      id: `agent_${agents.length + 1}`,
      totalSalesCount: 0,
      totalRevenueGenerated: 0,
      createdAt: new Date().toISOString()
    };
    setAgents(prev => [...prev, freshAgent]);
  };

  // Handler: Adds sale revenue to agent (and gives parents overrides if necessary!)
  const handleTrackSale = (agentId: string, amount: number) => {
    setAgents(prev => {
      return prev.map(agent => {
        if (agent.id === agentId) {
          return {
            ...agent,
            totalSalesCount: agent.totalSalesCount + 1,
            totalRevenueGenerated: agent.totalRevenueGenerated + amount
          };
        }
        // If this is the parent master agent, they receive a standard 2% sponsor overlay override
        const targetAgent = prev.find(a => a.id === agentId);
        if (targetAgent && targetAgent.parentId === agent.id) {
          return {
            ...agent,
            totalRevenueGenerated: agent.totalRevenueGenerated + (amount * 0.05) // override bonus
          };
        }
        return agent;
      });
    });
  };

  // Handler: Ads planning creation & deletion
  const handleAddCampaign = (newCamp: Omit<AdCampaign, 'id'>) => {
    const camp: AdCampaign = {
      ...newCamp,
      id: `camp_${campaigns.length + 1}`
    };
    setCampaigns(prev => [...prev, camp]);
  };

  const handleDeleteCampaign = (id: string) => {
    setCampaigns(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div className="h-screen w-screen flex bg-slate-50 text-slate-800 antialiased font-sans overflow-hidden">
      {/* Sleek Vertical Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col h-full shrink-0 shadow-sm">
        {/* Brand Header */}
        <div className="p-5 flex items-center gap-3 border-b border-slate-100 shrink-0">
          <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-extrabold shadow-sm shadow-indigo-200">
            W
          </div>
          <div>
            <span className="font-bold text-slate-900 tracking-tight text-sm block leading-tight">Wed2C Hub</span>
            <span className="text-[10px] text-indigo-600 font-extrabold block uppercase tracking-wider font-mono">
              Enterprise Suite
            </span>
          </div>
        </div>

        {/* Sidebar Body */}
        <div className="flex-1 py-5 px-3 space-y-6 overflow-y-auto">
          {/* Operations Navigation Links */}
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2 font-mono">
              Operations Center
            </div>
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer transition-all duration-150 ${
                  activeTab === 'overview'
                    ? 'bg-indigo-50/75 text-indigo-700 shadow-xs border-r-4 border-indigo-600'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <LayoutDashboard size={15} className={activeTab === 'overview' ? 'text-indigo-600' : 'text-slate-400'} />
                Hub Overview
              </button>

              <button
                onClick={() => setActiveTab('payment')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer transition-all duration-150 ${
                  activeTab === 'payment'
                    ? 'bg-indigo-50/75 text-indigo-700 shadow-xs border-r-4 border-indigo-600'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <CreditCard size={15} className={activeTab === 'payment' ? 'text-indigo-600' : 'text-slate-400'} />
                Unified Gateway
              </button>

              <button
                onClick={() => setActiveTab('agents')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer transition-all duration-150 ${
                  activeTab === 'agents'
                    ? 'bg-indigo-50/75 text-indigo-700 shadow-xs border-r-4 border-indigo-600'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Users size={15} className={activeTab === 'agents' ? 'text-indigo-600' : 'text-slate-400'} />
                Agent Network
              </button>

              <button
                onClick={() => setActiveTab('adplanner')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer transition-all duration-150 ${
                  activeTab === 'adplanner'
                    ? 'bg-indigo-50/75 text-indigo-700 shadow-xs border-r-4 border-indigo-600'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <TrendingUp size={15} className={activeTab === 'adplanner' ? 'text-indigo-600' : 'text-slate-400'} />
                Social ROI Planner
              </button>

              <button
                onClick={() => setActiveTab('admin')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer transition-all duration-150 ${
                  activeTab === 'admin'
                    ? 'bg-indigo-50/75 text-indigo-700 shadow-xs border-r-4 border-indigo-600'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Settings size={15} className={activeTab === 'admin' ? 'text-indigo-600' : 'text-slate-400'} />
                System Admin
              </button>

              <button
                onClick={() => setActiveTab('maintenance')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer transition-all duration-150 ${
                  activeTab === 'maintenance'
                    ? 'bg-indigo-50/75 text-indigo-700 shadow-xs border-r-4 border-indigo-600'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Calculator size={15} className={activeTab === 'maintenance' ? 'text-indigo-600' : 'text-slate-400'} />
                Cost & Projections
              </button>
            </nav>
          </div>

          {/* Connected Wed2C Store Outlets */}
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2 font-mono flex items-center justify-between">
              <span>Active Outlets</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <div className="space-y-1 max-h-[190px] overflow-y-auto pr-1">
              {WED2C_STORES.map(store => (
                <a
                  key={store.id}
                  href={store.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 transition group"
                >
                  <span className="text-[11px] font-semibold text-slate-600 truncate max-w-[140px] group-hover:text-indigo-600">
                    {store.name}
                  </span>
                  <span className="text-[9px] font-semibold font-mono text-emerald-600 uppercase">
                    Live
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Maintenance Widget */}
        <div className="p-4 m-3 bg-slate-900 text-slate-100 rounded-xl border border-slate-800 relative overflow-hidden shrink-0 shadow-sm">
          <div className="relative z-10 space-y-1.5">
            <span className="text-[9px] uppercase font-mono tracking-wider text-slate-400 block font-bold">
              Fixed Upkeep Cost
            </span>
            <span className="text-base font-bold text-white block">
              $650.00 <span className="text-xs text-slate-400 font-normal">/ mo</span>
            </span>
            <div className="w-full bg-slate-800 rounded-full h-1 mt-1 overflow-hidden">
              <div className="bg-indigo-500 h-full rounded-full" style={{ width: '100%' }}></div>
            </div>
            <p className="text-[9px] text-slate-400 leading-normal">
              Proxy server, domain networks & workspace hosting included.
            </p>
          </div>
        </div>
      </aside>

      {/* Main Multi-Screen Layout Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
        {/* Custom Header Bar */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-8 flex items-center justify-between shrink-0 shadow-3xs z-30">
          <div>
            <h1 className="text-md font-bold text-slate-900 tracking-tight capitalize">
              {activeTab === 'overview' && 'Operations Dashboard'}
              {activeTab === 'payment' && 'Unified Payment Gateway'}
              {activeTab === 'agents' && 'Partner Agent Network'}
              {activeTab === 'adplanner' && 'Multi-Channel Social ROI Planner'}
              {activeTab === 'maintenance' && 'System Run Costs & Scaling Curves'}
              {activeTab === 'admin' && 'System Administration'}
            </h1>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider font-mono mt-0.5">
              Secure Multi-Outlet Proxy Command Gateway
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              API HANDSHAKES SUCCESSBOARD
            </div>
          </div>
        </header>

        {/* Floating Custom Toast/Notification Banner (No more disruptive alerts!) */}
        {notification && (
          <div className="absolute top-4 right-8 z-55 max-w-sm pointer-events-auto">
            <div className="bg-slate-900 text-white p-4 rounded-xl border border-slate-800 shadow-xl flex items-start gap-3">
              <div className="mt-0.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 block"></span>
              </div>
              <div className="flex-1">
                <span className="text-xs font-bold block mb-0.5 uppercase tracking-widest text-indigo-400">
                  System Notification
                </span>
                <p className="text-slate-300 text-xs leading-normal">
                  {notification.message}
                </p>
              </div>
              <button
                onClick={() => setNotification(null)}
                className="text-slate-500 hover:text-white transition font-bold leading-none shrink-0 cursor-pointer"
              >
                &times;
              </button>
            </div>
          </div>
        )}

        {/* Render Active View Layout Panel */}
        <main className="flex-1 p-8 overflow-y-auto space-y-6 bg-slate-50">
          {activeTab === 'overview' && (
            <Overview
              agents={agents}
              campaigns={campaigns}
              paymentConfigs={paymentConfigs}
              transactions={transactions}
              onAddMockTransaction={handleAddMockTransaction}
            />
          )}

          {activeTab === 'payment' && (
            <PaymentGateway
              paymentConfigs={paymentConfigs}
              onToggleGateway={handleToggleGateway}
              onUpdateGatewayKeys={handleUpdateGatewayKeys}
              onSimulateCheckout={handleSimulateCheckout}
              onShowNotification={showNotification}
            />
          )}

          {activeTab === 'agents' && (
            <AgentNetwork
              agents={agents}
              onAddAgent={handleAddAgent}
              onTrackSale={handleTrackSale}
              onShowNotification={showNotification}
            />
          )}

          {activeTab === 'adplanner' && (
            <AdPlanner
              campaigns={campaigns}
              onAddCampaign={handleAddCampaign}
              onDeleteCampaign={handleDeleteCampaign}
              onShowNotification={showNotification}
            />
          )}

          {activeTab === 'maintenance' && (
            <MaintenanceCalc
              agents={agents}
              campaigns={campaigns}
            />
          )}

          {activeTab === 'admin' && (
            <AdminDashboard />
          )}
        </main>
      </div>
    </div>
  );
}
