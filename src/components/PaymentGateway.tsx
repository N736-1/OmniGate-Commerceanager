import React, { useState } from 'react';
import { PaymentGatewayConfig, Store } from '../types';
import { WED2C_STORES } from '../data/stores';
import {
  Shield,
  CreditCard,
  Settings,
  Terminal,
  Play,
  Copy,
  Plus,
  RefreshCw,
  Cpu,
  Share2
} from 'lucide-react';
import { motion } from 'motion/react';

interface PaymentGatewayProps {
  paymentConfigs: PaymentGatewayConfig[];
  onToggleGateway: (id: string) => void;
  onUpdateGatewayKeys: (id: string, apiKey: string, testMode: boolean) => void;
  onSimulateCheckout: (paymentDetails: {
    storeUrl: string;
    amount: number;
    productName: string;
    customerEmail: string;
    gatewayUsed: string;
  }) => void;
  onShowNotification: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export const PaymentGateway: React.FC<PaymentGatewayProps> = ({
  paymentConfigs,
  onToggleGateway,
  onUpdateGatewayKeys,
  onSimulateCheckout,
  onShowNotification
}) => {
  const [selectedGatewayId, setSelectedGatewayId] = useState<string>('stripe');
  const [testMode, setTestMode] = useState<boolean>(true);
  const [apiKey, setApiKey] = useState<string>('sk_test_51Ng...9834');
  
  // Checkout Simulator Form States
  const [simulateStore, setSimulateStore] = useState<string>(WED2C_STORES[0].url);
  const [simulateAmount, setSimulateAmount] = useState<number>(39.99);
  const [simulateProduct, setSimulateProduct] = useState<string>('Premium American Retro Leather Jacket');
  const [simulateEmail, setSimulateEmail] = useState<string>('customer.test@gmail.com');
  
  const [simulating, setSimulating] = useState<boolean>(false);
  const [simulationLog, setSimulationLog] = useState<string[]>([]);
  const [copiedSnippet, setCopiedSnippet] = useState<boolean>(false);

  const selectedConfig = paymentConfigs.find(c => c.id === selectedGatewayId) || paymentConfigs[0];

  const handleUpdateKeysSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateGatewayKeys(selectedGatewayId, apiKey, testMode);
    onShowNotification(`Configuration updated successfully for ${selectedConfig.name}! All 9 Wed2C stores are now routed through these credentials.`);
  };

  const executeSimulation = async () => {
    setSimulating(true);
    setSimulationLog([]);
    
    const logs = [
      `[PING] Handshake initiated with Wed2C checkout proxy...`,
      `[AUTH] Authenticating merchant gateway via API key ending ...${selectedConfig.apiKey ? selectedConfig.apiKey.slice(-4) : 'Demo'}`,
      `[PAYLOAD] Forwarding order parameters: ${simulateProduct} | Value: $${simulateAmount}`,
      `[ROUTING] Binding purchase metrics matching store URL: ${simulateStore}`,
      `[GATEWAY] Processing credit card/endpoint verification...`,
      `[WEBHOOK] Fire: Dispatching secure transaction payload to Local Stream & AppSheet format...`
    ];

    for (let i = 0; i < logs.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 550));
      setSimulationLog(prev => [...prev, logs[i]]);
    }

    onSimulateCheckout({
      storeUrl: simulateStore,
      amount: simulateAmount,
      productName: simulateProduct,
      customerEmail: simulateEmail,
      gatewayUsed: selectedConfig.name
    });

    setSimulationLog(prev => [...prev, `[SUCCESS] Secure checkout processed! Payment volume aggregated globally.`]);
    setSimulating(false);
  };

  // Integration snippet
  const embedCodeSnippet = `<!-- Multi-Store Gateway Interceptor Widget -->
<script>
  window.Wed2CGatewayInterceptor = {
    merchantId: "MCH_59012384",
    centralRouter: "https://ais-dev.run.app/api/checkout/process",
    activeStores: [
      "https://httpstheamericane.wed2c.com",
      "https://theamericanemporiu.wed2c.com",
      "https://sellonlinestore1.wed2c.com",
      "https://sellbazzarshop.wed2c.com",
      "https://dropshippingshop.wed2c.com"
    ]
  };
  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "https://cdn.gatewayhub.net/checkout-widget.min.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'merchant-gateway'));
</script>`;

  const copyEmbeddedSnippet = () => {
    navigator.clipboard.writeText(embedCodeSnippet);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Visual explanation banner */}
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 border border-indigo-900 text-white rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="bg-indigo-500/20 text-indigo-300 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-2.5 inline-block border border-indigo-500/20">
              Gateway Aggregation Protocol
            </span>
            <h2 className="text-2xl font-bold font-sans">Single Merchant Account, 9 Outlets</h2>
            <p className="text-indigo-200 text-sm max-w-2xl">
              By deploying a client-side snippet inside your Wed2C checkout layouts, customer orders are captured, tokenized, and securely processed by this centralized interface. No need to register 9 different Stripe/PayPal accounts!
            </p>
          </div>
          <div className="bg-white/10 p-4 rounded-xl border border-white/20 text-center md:text-right flex flex-col justify-center shrink-0">
            <span className="text-[10px] text-indigo-300 block font-mono">PROXY RESPONSE STATUS</span>
            <span className="text-lg font-bold text-teal-400 flex items-center justify-center md:justify-end gap-1.5 mt-0.5 font-mono">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse"></span>
              ACTIVE
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gateway Configurations Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Settings size={18} className="text-slate-500" />
                <h3 className="text-md font-bold text-slate-800">Payment Gateway Management</h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">ACTIVE CREDENTIALS</span>
            </div>

            {/* Selector Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {paymentConfigs.map((config) => {
                const isSelected = selectedGatewayId === config.id;
                return (
                  <button
                    key={config.id}
                    onClick={() => {
                      setSelectedGatewayId(config.id);
                      setApiKey(config.apiKey);
                      setTestMode(config.testMode);
                    }}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between h-24 transition-all duration-200 ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/50 shadow-sm ring-1 ring-indigo-600'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <CreditCard size={18} className={isSelected ? 'text-indigo-600' : 'text-slate-400'} />
                      <div className="flex items-center">
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${config.isActive ? 'bg-emerald-400' : 'bg-slate-300'}`}></span>
                        <span className="text-[9px] uppercase font-mono text-slate-400">{config.isActive ? 'On' : 'Off'}</span>
                      </div>
                    </div>
                    <div>
                      <span className="font-bold text-xs text-slate-700 block">{config.name}</span>
                      <span className="text-[10px] text-slate-400 truncate block w-full">{config.supportedMethods.join(', ')}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Config Form */}
            <form onSubmit={handleUpdateKeysSubmit} className="space-y-4">
              <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200 mb-4">
                <div>
                  <span className="font-bold text-sm text-slate-800 block">Gateway Operational Status</span>
                  <p className="text-xs text-slate-500">Route payments through this provider across all 9 shops.</p>
                </div>
                <button
                  type="button"
                  onClick={() => onToggleGateway(selectedGatewayId)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    selectedConfig.isActive ? 'bg-indigo-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      selectedConfig.isActive ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                    API KEY / CLIENT ID
                  </label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter API credential key"
                    className="w-full text-slate-800 text-xs border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg p-2.5 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                    GATEWAY ENV MODE
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setTestMode(true)}
                      className={`flex-1 py-2 px-3 rounded-lg border text-xs font-medium transition ${
                        testMode
                          ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 font-semibold'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-500'
                      }`}
                    >
                      Test Sandbox
                    </button>
                    <button
                      type="button"
                      onClick={() => setTestMode(false)}
                      className={`flex-1 py-2 px-3 rounded-lg border text-xs font-medium transition ${
                        !testMode
                          ? 'border-emerald-600 bg-emerald-50/50 text-emerald-700 font-semibold'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-500'
                      }`}
                    >
                      Production Live
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                  Multi-Store Global Webhook Listener Endpoint (Port 3000)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={selectedConfig.webhookUrl}
                    className="w-full text-slate-500 bg-slate-50 text-xs border border-slate-200 rounded-lg p-2.5 font-mono cursor-not-allowed"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(selectedConfig.webhookUrl);
                      alert('Webhook listener coordinates copied to clipboard!');
                    }}
                    className="bg-slate-50 border border-slate-200 text-slate-700 font-medium text-xs px-4 rounded-lg hover:bg-slate-100 transition"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 text-white font-medium text-xs py-2.5 rounded-lg hover:bg-slate-800 transition shadow-sm"
              >
                Save {selectedConfig.name} Configuration Keys
              </button>
            </form>
          </div>

          {/* Code Embedding Snippet Section */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Share2 size={18} className="text-slate-500" />
                <h3 className="text-md font-bold text-slate-800">Universal Embedding Code Widget</h3>
              </div>
              <button
                onClick={copyEmbeddedSnippet}
                className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium py-1 px-2.5 rounded-lg flex items-center gap-1 transition"
              >
                <Copy size={12} />
                {copiedSnippet ? 'Copied!' : 'Copy Code'}
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-4 leading-normal">
              Inject this tag at the index template level of your Wed2C shop dashboard to auto-route transactions, secure credit card transactions, and push webhook transaction logs back here for agents tracking.
            </p>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 overflow-x-auto relative">
              <span className="absolute right-3 top-3 text-[10px] font-mono text-slate-600">HTML CODE</span>
              <pre className="text-[11px] text-indigo-300 font-mono leading-relaxed whitespace-pre font-sans">
                {embedCodeSnippet}
              </pre>
            </div>
          </div>
        </div>

        {/* Interactive Checkout Simulator */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-800">
                <div className="p-1.5 bg-indigo-500/10 text-indigo-400 rounded-lg">
                  <Cpu size={16} />
                </div>
                <h3 className="text-md font-bold text-white">Central Checkout Sandbox</h3>
              </div>
              <p className="text-slate-400 text-xs mb-4 leading-normal">
                Validate and simulate customer purchasing across any of your 9 stores on demand, without processing real money. See how transactions record globally.
              </p>

              <div className="space-y-4 text-xs font-mono">
                <div>
                  <label className="block text-slate-400 text-[10px] font-semibold uppercase tracking-wider mb-1">
                    Select Target Store
                  </label>
                  <select
                    value={simulateStore}
                    onChange={(e) => setSimulateStore(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg p-2 text-xs"
                  >
                    {WED2C_STORES.map((s) => (
                      <option key={s.id} value={s.url}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 text-[10px] font-semibold uppercase tracking-wider mb-1">
                    Simulate Product Name
                  </label>
                  <input
                    type="text"
                    value={simulateProduct}
                    onChange={(e) => setSimulateProduct(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg p-2 text-xs"
                    placeholder="E.g., Retro Leather Jacket"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-400 text-[10px] font-semibold uppercase tracking-wider mb-1">
                      Sale Amount ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={simulateAmount}
                      onChange={(e) => setSimulateAmount(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-[10px] font-semibold uppercase tracking-wider mb-1">
                      Customer Email
                    </label>
                    <input
                      type="email"
                      value={simulateEmail}
                      onChange={(e) => setSimulateEmail(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg p-2 text-xs"
                      placeholder="test@mail.com"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 space-y-4">
              <button
                onClick={executeSimulation}
                disabled={simulating}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 text-white font-bold text-xs py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Play size={12} />
                {simulating ? 'Simulating order process...' : 'Simulate Order Check'}
              </button>

              {/* Real-time status console terminal */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 font-mono text-[10px] leading-relaxed text-slate-400 h-44 overflow-y-auto">
                <div className="flex justify-between items-center text-slate-600 pb-1 mb-1 border-b border-slate-900">
                  <span>TERMINAL CONSOLE</span>
                  <Terminal size={10} />
                </div>
                {simulationLog.length === 0 ? (
                  <span className="text-slate-600 block">Console cleared. Waiting for simulation trigger...</span>
                ) : (
                  simulationLog.map((log, index) => (
                    <div
                      key={index}
                      className={
                        log.startsWith('[SUCCESS]')
                          ? 'text-teal-400 font-bold'
                          : log.startsWith('[FAIL]')
                          ? 'text-rose-400 font-bold'
                          : 'text-slate-300'
                      }
                    >
                      {log}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
