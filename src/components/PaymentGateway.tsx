import React, { useState } from 'react';
import { PaymentGatewayConfig, Store } from '../types';
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
  Share2,
  TrendingDown,
  QrCode,
  DollarSign,
  ArrowRightLeft,
  CheckCircle2,
  Info
} from 'lucide-react';
import { motion } from 'motion/react';

interface PaymentGatewayProps {
  stores: Store[];
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

// User-provided accounts for testing
const OWNER_PRESETS = [
  {
    id: 'card_virtual',
    title: 'Virtual Credit Card',
    number: '5591772004157515',
    expiry: '27/02',
    cvc: '719',
    type: 'MasterCard',
    provider: 'International Wallet'
  },
  {
    id: 'card_jazz_debit',
    title: 'Jazzcash Debit Card',
    number: '5591772710921816',
    expiry: '12/30',
    cvc: '862',
    type: 'MasterCard',
    provider: 'Mobilink Microfinance'
  },
  {
    id: 'card_nayapay',
    title: 'Nayapay Visa Card',
    number: '4782780012467364',
    expiry: '06/28',
    cvc: '116',
    type: 'Visa',
    provider: 'NayaPay Wallet'
  },
  {
    id: 'card_ubl',
    title: 'UBL Primary Card',
    number: '5403758083992319',
    expiry: '08/26',
    cvc: '547',
    type: 'MasterCard',
    provider: 'United Bank Ltd'
  },
  {
    id: 'easypaisa_iban',
    title: 'EasyPaisa IBAN Account',
    iban: 'PK90TMFB0000000041354279',
    type: 'Bank Transfer',
    provider: 'Telenor Microfinance'
  },
  {
    id: 'jazzcash_raast',
    title: 'Jazzcash Raast ID',
    raastId: '03124787036',
    type: 'Raast Gateway',
    provider: 'Mobilink Wallet'
  },
  {
    id: 'jazzcash_iban',
    title: 'Jazzcash Bank IBAN',
    iban: 'PK45JCMA2207923124787036',
    type: 'Bank Transfer',
    provider: 'Mobilink Bank'
  }
];

export const PaymentGateway: React.FC<PaymentGatewayProps> = ({
  stores,
  paymentConfigs,
  onToggleGateway,
  onUpdateGatewayKeys,
  onSimulateCheckout,
  onShowNotification
}) => {
  const [selectedGatewayId, setSelectedGatewayId] = useState<string>('paybridg');
  const [testMode, setTestMode] = useState<boolean>(true);
  const [apiKey, setApiKey] = useState<string>('PB_LIVE_90TMFB0000000041354279');
  
  // Checkout Simulator Form States
  const [simulateStore, setSimulateStore] = useState<string>(stores[0]?.url || '');
  const [simulateAmount, setSimulateAmount] = useState<number>(39.99);
  const [simulateProduct, setSimulateProduct] = useState<string>('Premium American Retro Leather Jacket');
  const [simulateEmail, setSimulateEmail] = useState<string>('customer.test@gmail.com');
  
  // Active selected preset account for simulation
  const [activePresetIndex, setActivePresetIndex] = useState<number>(0);
  
  // States for Simulating payment
  const [simulating, setSimulating] = useState<boolean>(false);
  const [simulationLog, setSimulationLog] = useState<string[]>([]);
  const [copiedSnippet, setCopiedSnippet] = useState<boolean>(false);

  // States for Currency Exchange Calculator Agent
  const [exchangeAmount, setExchangeAmount] = useState<number>(100);
  const [exchangeFrom, setExchangeFrom] = useState<string>('USD');
  const [exchangeTo, setExchangeTo] = useState<string>('PKR');

  const selectedConfig = paymentConfigs.find(c => c.id === selectedGatewayId) || paymentConfigs[0];
  const activePreset = OWNER_PRESETS[activePresetIndex];

  // Rates structured for testing
  const CONVERSION_RATES: Record<string, number> = {
    'USD_PKR': 278.43,
    'PKR_USD': 0.0036,
    'USD_INR': 83.15,
    'INR_USD': 0.012,
    'PKR_INR': 0.30,
    'INR_PKR': 3.35,
    'BTC_USD': 68250.00,
    'USD_BTC': 1 / 68250.00,
    'BTC_PKR': 68250.00 * 278.43,
    'PKR_BTC': 1 / (68250.00 * 278.43)
  };

  const getExchangeResult = () => {
    if (exchangeFrom === exchangeTo) return exchangeAmount;
    const pair = `${exchangeFrom}_${exchangeTo}`;
    if (CONVERSION_RATES[pair]) {
      return exchangeAmount * CONVERSION_RATES[pair];
    }
    // Fallback multiplier
    return exchangeAmount * 1.5;
  };

  const handleUpdateKeysSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateGatewayKeys(selectedGatewayId, apiKey, testMode);
    onShowNotification(`Configuration updated successfully for ${selectedConfig.name}! All outlets are routed through these credentials.`);
  };

  const executeSimulation = async () => {
    setSimulating(true);
    setSimulationLog([]);
    
    const logs = [
      `[PING] Handshake initiated with Wed2C checkout proxy...`,
      `[PAYBRIDG] Authenticating PayBridg security headers...`,
      `[CREDENTIALS] Auto-binding checking account: ${activePreset.title} (${activePreset.provider})`,
      activePreset.number 
        ? `[PAYLOAD] Card Authorization requested: ${activePreset.number.slice(0, 4)}**** with CVC ***`
        : activePreset.iban
        ? `[PAYLOAD] Bank Direct Debit requested for IBAN: ${activePreset.iban.slice(0, 8)}...`
        : `[PAYLOAD] Raast Peer connection requested for ID: ${activePreset.raastId}`,
      `[GATEWAY] Simulating Secure Pakistan Interbank Proxy (EasyPaisa/JazzCash network)`,
      `[WEBHOOK] Broadcasting real-time order record back to AppSheet API`,
    ];

    for (let i = 0; i < logs.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setSimulationLog(prev => [...prev, logs[i]]);
    }

    onSimulateCheckout({
      storeUrl: simulateStore,
      amount: simulateAmount,
      productName: simulateProduct,
      customerEmail: simulateEmail,
      gatewayUsed: selectedConfig.name
    });

    setSimulationLog(prev => [...prev, `[SUCCESS] Transaction processed over PayBridg Proxy! Commission split routed to linked agent.`]);
    setSimulating(false);
  };

  // Switch preset account fields
  const handleSelectPreset = (index: number) => {
    setActivePresetIndex(index);
    const selected = OWNER_PRESETS[index];
    if (selected.number) {
      onShowNotification(`Testing credit card selected: ${selected.title}. Ready for sandbox checkout verification.`);
    } else if (selected.iban) {
      onShowNotification(`Testing IBAN selected: ${selected.iban}. Ready for PayBridg API handshake.`);
    } else {
      onShowNotification(`Testing Raast ID selected: ${selected.raastId}.`);
    }
  };

  // Integration snippet
  const embedCodeSnippet = `<!-- Multi-Store Gateway Interceptor Widget -->
<script>
  window.Wed2CGatewayInterceptor = {
    merchantId: "MCH_59012384",
    centralRouter: "https://paybridg-router.wed2c.com/api/process",
    activeStores: ${JSON.stringify(stores.map(s => s.url), null, 6)}
  };
</script>`;

  const copyEmbeddedSnippet = () => {
    navigator.clipboard.writeText(embedCodeSnippet);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Visual explanation banner */}
      <div className="bg-gradient-to-r from-indigo-950 to-slate-950 border border-slate-800 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 opacity-10">
          <QrCode size={300} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2.5 inline-block border border-indigo-500/20">
              PayBridg Aggregation Hub
            </span>
            <h2 className="text-2xl font-bold font-sans">Centralized payment gateway for dropshipping</h2>
            <p className="text-slate-300 text-sm max-w-2xl">
              Route checkout transactions instantly to your EasyPaisa, JazzCash, Nayapay, or UBL accounts using custom tokenized proxy URLs. Avoid the hassle of handling separate payment gateways.
            </p>
          </div>
          <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl text-center md:text-right flex flex-col justify-center shrink-0 min-w-[200px]">
            <span className="text-[10px] text-indigo-300 block font-mono">PAYBRIDG PROXY STATUS</span>
            <span className="text-lg font-bold text-emerald-400 flex items-center justify-center md:justify-end gap-1.5 mt-0.5 font-mono">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              API CONNECTED
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Gateway Configurations Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Settings size={18} className="text-slate-500" />
                <h3 className="text-md font-bold text-slate-800">Dynamic Gateway Configurator</h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">ACTIVE LEDGER</span>
            </div>

            {/* Selector Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {paymentConfigs.map((config) => {
                const isSelected = selectedGatewayId === config.id;
                return (
                  <button
                    key={config.id}
                    type="button"
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
                      <span className="font-bold text-xs text-slate-700 block text-ellipsis overflow-hidden whitespace-nowrap">{config.name}</span>
                      <span className="text-[9px] text-slate-400 truncate block w-full">{config.supportedMethods.slice(0, 2).join(', ')}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Config Form */}
            <form onSubmit={handleUpdateKeysSubmit} className="space-y-4">
              <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200 mb-4">
                <div>
                  <span className="font-bold text-sm text-slate-800 block">Active Status</span>
                  <p className="text-xs text-slate-500">Route payments through this provider across all {stores.length} outlets.</p>
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
                    API KEY / INTEGRATION MERCHANT ID
                  </label>
                  <input
                    type="text"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter API credential key"
                    className="w-full text-slate-800 text-xs border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg p-2.5 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                    GATEWAY MODE
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setTestMode(true)}
                      className={`flex-1 py-1 px-3 rounded-lg border text-xs font-medium transition h-10 ${
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
                      className={`flex-1 py-1 px-3 rounded-lg border text-xs font-medium transition h-10 ${
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
                  Universal Backend Webhook Endpoint
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
                    className="bg-slate-50 border border-slate-200 text-slate-700 font-medium text-xs px-4 rounded-lg hover:bg-slate-100 transition whitespace-nowrap"
                  >
                    Copy Url
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 text-white font-medium text-xs py-2.5 rounded-lg hover:bg-slate-800 transition shadow-sm font-sans"
              >
                Save {selectedConfig.name} Configuration Keys
              </button>
            </form>
          </div>

          {/* AI Currency Exchange Agents Section */}
          <div className="bg-slate-900 text-white border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ArrowRightLeft size={18} className="text-teal-400 animate-pulse" />
                <h3 className="text-md font-bold text-white">AI Currency Exchange Agent</h3>
              </div>
              <span className="text-[10px] bg-teal-500/20 text-teal-300 font-mono font-bold px-2 py-0.5 rounded-full">
                Multi-Currency Enabled
              </span>
            </div>
            <p className="text-slate-400 text-xs">
              Demonstrate smart currency swapping over multiple global boundaries (US Dollars, Pakistani Rupees, Indian Rupees, and BTC Exchange formats). Fully suited for direct client payouts.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              {/* Input Value */}
              <div className="md:col-span-4 space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase">Input Value</label>
                <input
                  type="number"
                  value={exchangeAmount}
                  onChange={(e) => setExchangeAmount(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 text-xs font-mono font-bold focus:ring-1 focus:ring-teal-400"
                />
              </div>

              {/* From Select */}
              <div className="md:col-span-3 space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase">From</label>
                <select
                  value={exchangeFrom}
                  onChange={(e) => setExchangeFrom(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 text-xs font-bold"
                >
                  <option value="USD">USD ($)</option>
                  <option value="PKR">PKR (Rs)</option>
                  <option value="INR">INR (₹)</option>
                  <option value="BTC">BTC (₿)</option>
                </select>
              </div>

              {/* Swap visual */}
              <div className="md:col-span-1 flex justify-center pt-4">
                <ArrowRightLeft size={16} className="text-slate-500 rotate-90 md:rotate-0" />
              </div>

              {/* To Select */}
              <div className="md:col-span-4 space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase">To</label>
                <select
                  value={exchangeTo}
                  onChange={(e) => setExchangeTo(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 text-xs font-bold"
                >
                  <option value="PKR">PKR (Rs)</option>
                  <option value="USD">USD ($)</option>
                  <option value="INR">INR (₹)</option>
                  <option value="BTC">BTC (₿)</option>
                </select>
              </div>
            </div>

            {/* Conversion Result Plate */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row justify-between items-center gap-3">
              <div className="space-y-0.5 text-center md:text-left">
                <span className="text-[10px] uppercase font-mono text-slate-500">Live Exchange Conversion</span>
                <p className="text-lg font-bold font-mono text-teal-400">
                  {exchangeAmount} {exchangeFrom} ={' '}
                  {getExchangeResult().toLocaleString(undefined, { maximumFractionDigits: 6 })} {exchangeTo}
                </p>
              </div>
              <div className="text-[10px] text-slate-500 font-mono text-center md:text-right">
                <span>Spread Fee: 0%</span>
                <span className="block text-indigo-400 font-bold">API Source: Antigravity AI Server</span>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Checkout Simulator & Account Preset Picker */}
        <div className="lg:col-span-5 space-y-6">
          {/* Preset Test Accounts Selection */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-1 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-indigo-600" />
              Saved Owner Accounts
            </h3>
            <p className="text-xs text-slate-500 mb-4 leading-normal">
              Click an account to instantly load credentials and simulate verification handshakes with PayBridg.
            </p>

            <div className="space-y-2 h-76 overflow-y-auto pr-1">
              {OWNER_PRESETS.map((preset, idx) => {
                const isPresetSelected = idx === activePresetIndex;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(idx)}
                    className={`w-full p-2.5 rounded-xl border text-left transition-all text-xs font-mono flex items-center justify-between ${
                      isPresetSelected
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 font-semibold shadow-xs'
                        : 'border-slate-100 bg-slate-50 hover:bg-slate-100 text-slate-600'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-[11px] text-slate-800 block leading-tight">{preset.title}</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{preset.provider}</span>
                      {preset.number && (
                        <span className="text-[10px] block mt-1 font-bold text-indigo-700 bg-indigo-100/50 w-fit px-1.5 py-0.5 rounded">
                          No: {preset.number} (Exp: {preset.expiry})
                        </span>
                      )}
                      {preset.iban && (
                        <span className="text-[10px] block mt-1 font-bold text-teal-700 bg-teal-100/50 w-fit px-1.5 py-0.5 rounded break-all max-w-[200px]">
                          IBAN: {preset.iban}
                        </span>
                      )}
                      {preset.raastId && (
                        <span className="text-[10px] block mt-1 font-bold text-amber-700 bg-amber-100/50 w-fit px-1.5 py-0.5 rounded">
                          Raast: {preset.raastId}
                        </span>
                      )}
                    </div>
                    {isPresetSelected && (
                      <span className="text-[9px] font-bold text-white bg-indigo-600 px-2 py-0.5 rounded-full uppercase">
                        Active
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-800">
                <div className="p-1.5 bg-indigo-500/10 text-indigo-400 rounded-lg">
                  <Cpu size={16} />
                </div>
                <h3 className="text-md font-bold text-white">Central Checkout Sandbox</h3>
              </div>
              <p className="text-slate-400 text-xs mb-4 leading-normal">
                Validate and simulate customer purchasing across any of your {stores.length} outlets on demand.
              </p>

              <div className="space-y-4 text-xs font-mono">
                <div>
                  <label className="block text-slate-400 text-[10px] font-semibold uppercase tracking-wider mb-1">
                    Select Target Store Outlet
                  </label>
                  <select
                    value={simulateStore}
                    onChange={(e) => setSimulateStore(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg p-2 text-xs"
                  >
                    {stores.map((s) => (
                      <option key={s.id} value={s.url}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 text-[10px] font-semibold uppercase tracking-wider mb-1">
                    Product Purchase Alias
                  </label>
                  <input
                    type="text"
                    value={simulateProduct}
                    onChange={(e) => setSimulateProduct(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg p-2 text-xs"
                    placeholder="E.g. Retro Leather Jacket"
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

                <div className="bg-slate-850 p-3 rounded-lg border border-slate-800 space-y-1">
                  <span className="text-[9px] uppercase font-semibold text-slate-500">Processing Account</span>
                  <p className="text-[11px] font-semibold text-indigo-300 truncate">{activePreset.title}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 space-y-4">
              <button
                type="button"
                onClick={executeSimulation}
                disabled={simulating}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 text-white font-bold text-xs py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Play size={12} />
                {simulating ? 'Simulating order process...' : 'Process Order with Presets'}
              </button>

              {/* Dynamic QR Code Box for Transfers */}
              <div className="bg-white text-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col items-center justify-center space-y-2 relative">
                <span className="absolute top-2 left-2 text-[8px] bg-indigo-100 text-indigo-700 font-bold px-1.5 py-0.5 rounded uppercase tracking-widest font-mono">
                  Direct QR Code Gateway
                </span>
                
                {/* Visual Customstyled QR representation using custom pure CSS grid */}
                <div className="w-24 h-24 bg-slate-100 border border-slate-200 p-1 flex flex-col justify-between items-center rounded-lg mt-2 relative">
                  <div className="absolute inset-0 p-1.5 flex flex-wrap gap-[2px] items-center justify-center overflow-hidden">
                    {/* Visual QR grids */}
                    {Array.from({ length: 144 }).map((_, i) => {
                      const isPixel = (i % 3 === 0 || i % 7 === 1 || i % 11 === 0 || i % 13 === 1) && !(i > 30 && i < 50) && !(i > 90 && i < 110);
                      return (
                        <div key={i} className={`w-[6px] h-[6px] rounded-xs ${isPixel ? 'bg-slate-900' : 'bg-transparent'}`} />
                      );
                    })}
                  </div>
                  {/* Decorative corner indicators representing actual QR specifications */}
                  <div className="absolute top-1 left-1 w-5 h-5 border-2 border-slate-900 bg-white p-0.5 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-slate-900" />
                  </div>
                  <div className="absolute top-1 right-1 w-5 h-5 border-2 border-slate-900 bg-white p-0.5 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-slate-900" />
                  </div>
                  <div className="absolute bottom-1 left-1 w-5 h-5 border-2 border-slate-900 bg-white p-0.5 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-slate-900" />
                  </div>
                </div>

                <div className="text-center">
                  <span className="text-[10px] font-bold text-indigo-600 font-mono block">PB_TRANS_LINK_#{activePreset.id.toUpperCase()}</span>
                  <span className="text-[9px] text-slate-400 block font-mono leading-normal leading-tight">
                    Scan with JazzCash, EasyPaisa, or BTC wallets to auto-populate secure proxy details
                  </span>
                </div>
              </div>

              {/* Real-time status console terminal */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 font-mono text-[10px] leading-relaxed text-slate-400 h-44 overflow-y-auto">
                <div className="flex justify-between items-center text-slate-600 pb-1 mb-1 border-b border-slate-900">
                  <span>TERMINAL CONSOLE</span>
                  <Terminal size={10} />
                </div>
                {simulationLog.length === 0 ? (
                  <span className="text-slate-600 block">Console cleared. Waiting for checkout simulation...</span>
                ) : (
                  simulationLog.map((log, index) => (
                    <div
                      key={index}
                      className={
                        log.startsWith('[SUCCESS]')
                          ? 'text-emerald-400 font-bold animate-pulse'
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
