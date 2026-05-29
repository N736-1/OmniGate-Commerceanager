import React, { useState } from 'react';
import { Agent, AgentRole, Store } from '../types';
import {
  Users,
  UserPlus,
  ArrowRight,
  Download,
  Database,
  FileText,
  DollarSign,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  Share2
} from 'lucide-react';
import { motion } from 'motion/react';

interface AgentNetworkProps {
  stores: Store[];
  agents: Agent[];
  onAddAgent: (newAgent: Omit<Agent, 'id' | 'totalSalesCount' | 'totalRevenueGenerated' | 'createdAt'>) => void;
  onTrackSale: (agentId: string, amount: number) => void;
  onShowNotification: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export const AgentNetwork: React.FC<AgentNetworkProps> = ({
  stores,
  agents,
  onAddAgent,
  onTrackSale,
  onShowNotification
}) => {
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  
  // New Agent Form States
  const [name, setName] = useState<string>('');
  const [role, setRole] = useState<AgentRole>('Agent');
  const [parentId, setParentId] = useState<string>('');
  const [assignedStoreUrls, setAssignedStoreUrls] = useState<string[]>([stores[0]?.url || '']);
  const [commissionRate, setCommissionRate] = useState<number>(10);
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');

  // Sale Attribution State
  const [selectedAgentForSale, setSelectedAgentForSale] = useState<string | null>(null);
  const [manualSaleAmount, setManualSaleAmount] = useState<number>(49.99);

  // Filter for potential parent agents (Master/Agent roles can have sub-agents)
  const potentialParents = agents.filter(a => a.role === 'Master Agent' || a.role === 'Agent');

  const handleSubmitAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      onShowNotification('Please fill out all required contact fields.', 'error');
      return;
    }

    onAddAgent({
      name,
      role,
      parentId: role === 'Sub-Agent' && parentId ? parentId : undefined,
      assignedStoreUrls,
      commissionRate,
      email,
      phone
    });

    // Reset form
    setName('');
    setRole('Agent');
    setParentId('');
    setAssignedStoreUrls([stores[0]?.url || '']);
    setCommissionRate(10);
    setEmail('');
    setPhone('');
    setShowAddForm(false);
    onShowNotification('Agent enrolled successfully! They have been assigned their designated Wed2C promotion link.');
  };

  const handleAttributeSaleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAgentForSale) return;
    
    onTrackSale(selectedAgentForSale, manualSaleAmount);
    
    // Find agent name for alert feedback
    const targetAgent = agents.find(a => a.id === selectedAgentForSale);
    let alertMessage = `Attributed $${manualSaleAmount} sale to ${targetAgent?.name}. Commission paid: $${((manualSaleAmount * (targetAgent?.commissionRate || 10)) / 100).toFixed(2)}.`;
    
    // Check if they are a sub-agent to highlight parent overrides
    if (targetAgent?.parentId) {
      const parent = agents.find(p => p.id === targetAgent.parentId);
      if (parent) {
        alertMessage += ` Parent agent ${parent.name} received override commission.`;
      }
    }
    
    onShowNotification(alertMessage);
    setSelectedAgentForSale(null);
  };

  // Convert Agent database to CSV Format for AppSheet or Excel download
  const downloadCSVForAppSheet = () => {
    // CSV Header row matches typical AppSheet column architecture
    const headers = [
      'Agent_ID',
      'Name',
      'Role',
      'Parent_Agent_ID',
      'Parent_Agent_Name',
      'Assigned_Wed2C_Store',
      'Commission_Rate_Percent',
      'Email_Address',
      'Phone_Contact',
      'Sales_Attribution_Count',
      'Total_Revenue_Accrued_USD',
      'Registration_Date'
    ];

    const rows = agents.map(agent => {
      const parentAgent = agent.parentId ? agents.find(a => a.id === agent.parentId) : null;
      return [
        `"${agent.id}"`,
        `"${agent.name.replace(/"/g, '""')}"`,
        `"${agent.role}"`,
        `"${agent.parentId || ''}"`,
        `"${parentAgent ? parentAgent.name.replace(/"/g, '""') : ''}"`,
        `"${agent.assignedStoreUrls.join('; ')}"`,
        agent.commissionRate,
        `"${agent.email}"`,
        `"${agent.phone}"`,
        agent.totalSalesCount,
        agent.totalRevenueGenerated,
        `"${new Date(agent.createdAt).toLocaleDateString()}"`
      ];
    });

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    
    // Trigger browser file download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `wed2c_agents_appsheet_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Convert Agent Database to raw readable TXT layout for fast copy-pasting
  const downloadTXTFormat = () => {
    let txtContent = `=================================================================\n`;
    txtContent += `       CENTRAL WED2C AGENTS & SUB-AGENTS SALES DIRECTORY\n`;
    txtContent += `       Generated on: ${new Date().toLocaleString()}\n`;
    txtContent += `=================================================================\n\n`;

    agents.forEach((a, i) => {
      const parentAgent = a.parentId ? agents.find(p => p.id === a.parentId) : null;
      txtContent += `[AGENT #${i + 1}] ID: ${a.id}\n`;
      txtContent += `-----------------------------------------------------------------\n`;
      txtContent += `Name:          ${a.name}\n`;
      txtContent += `Role:          ${a.role}\n`;
      if (parentAgent) {
        txtContent += `Reports To:    ${parentAgent.name} (ID: ${parentAgent.id})\n`;
      }
      txtContent += `Store Link:    ${a.assignedStoreUrls.join(', ')}\n`;
      txtContent += `Comm. Rate:    ${a.commissionRate}%\n`;
      txtContent += `Email:         ${a.email}\n`;
      txtContent += `Phone:         ${a.phone}\n`;
      txtContent += `Sales Count:   ${a.totalSalesCount} attributed sales\n`;
      txtContent += `Volume Accrued: $${a.totalRevenueGenerated.toLocaleString()} USD\n`;
      txtContent += `Active Since:  ${new Date(a.createdAt).toDateString()}\n\n`;
    });

    const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `wed2c_agents_data_${new Date().toISOString().split('T')[0]}.txt`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Visual Hub Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Users size={220} className="text-white" />
        </div>
        <div className="relative z-10 max-w-3xl">
          <span className="bg-teal-500/20 text-teal-300 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3 inline-block border border-teal-500/20">
            Social Distribution Network
          </span>
          <h2 className="text-2xl font-bold font-sans">Agent & Sub-Agent Distribution Pipeline</h2>
          <p className="text-slate-400 text-sm mt-1.5">
            Recruit normal partners, master hubs, and recursive sub-agents to distribute Wed2C products directly over messaging loops and social accounts. All tracking data can be downloaded straight into formats perfectly suited for AppSheet or spreadsheet importing.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
        <div className="flex gap-2">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs py-2 px-4 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
          >
            <UserPlus size={14} />
            {showAddForm ? 'Close Enrollment Form' : 'Enroll New Partner'}
          </button>
        </div>

        {/* Data Persistence Exporters */}
        <div className="flex gap-2 font-medium text-xs">
          <button
            onClick={downloadCSVForAppSheet}
            className="bg-indigo-600 hover:bg-indigo-500 text-white py-2 px-4 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
          >
            <Download size={14} />
            Export AppSheet (CSV)
          </button>
          <button
            onClick={downloadTXTFormat}
            className="border border-slate-200 hover:bg-slate-50 text-slate-700 py-2 px-4 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
          >
            <FileText size={14} />
            Download Text Log
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Core Agent Fleet Column */}
        <div className="lg:col-span-2 space-y-4">
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4"
            >
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100">
                Enroll New Network Agent
              </h3>

              <form onSubmit={handleSubmitAgent} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-600 uppercase tracking-wider mb-1">
                      Full Agent Name *
                    </label>
                    <input
                      required
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Michael Chen"
                      className="w-full text-slate-800 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg p-2"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 uppercase tracking-wider mb-1">
                      Agent Hierarchy Role
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as AgentRole)}
                      className="w-full text-slate-800 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg p-2 bg-white"
                    >
                      <option value="Master Agent">Master Agent (Direct reporting hub)</option>
                      <option value="Agent">Standard Agent (Independent sales)</option>
                      <option value="Sub-Agent">Sub-Agent (Tied to a master sponsor)</option>
                    </select>
                  </div>
                </div>

                {role === 'Sub-Agent' && (
                  <div>
                    <label className="block font-semibold text-slate-600 uppercase tracking-wider mb-1">
                      Select Sponsor Master Agent *
                    </label>
                    <select
                      required
                      value={parentId}
                      onChange={(e) => setParentId(e.target.value)}
                      className="w-full text-slate-800 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg p-2 bg-white"
                    >
                      <option value="">-- Choose Sponsor Agent --</option>
                      {potentialParents.map(parent => (
                        <option key={parent.id} value={parent.id}>
                          {parent.name} ({parent.role})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-600 uppercase tracking-wider mb-1">
                      Promotion Commission Rate (%)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={commissionRate}
                      onChange={(e) => setCommissionRate(parseInt(e.target.value) || 1)}
                      className="w-full text-slate-800 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg p-2"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 uppercase tracking-wider mb-1">
                      Assign Target Wed2C Store
                    </label>
                    <select
                      value={assignedStoreUrls[0]}
                      onChange={(e) => setAssignedStoreUrls([e.target.value])}
                      className="w-full text-slate-800 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg p-2 bg-white"
                    >
                      {stores.map(store => (
                        <option key={store.id} value={store.url}>
                          {store.name} ({store.url})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-600 uppercase tracking-wider mb-1">
                      Email address *
                    </label>
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="agent@example.com"
                      className="w-full text-slate-800 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg p-2"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 uppercase tracking-wider mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full text-slate-800 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg p-2"
                    />
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="border border-slate-200 text-slate-700 py-1.5 px-3 rounded hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white py-1.5 px-4 rounded hover:bg-indigo-500"
                  >
                    Submit Enrollment
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Active Hierarchy List */}
          <div className="space-y-4">
            <h3 className="text-md font-bold text-slate-800">Current Distribution Network Hierarchy</h3>

            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="bg-slate-50 border-b border-slate-100 p-4 grid grid-cols-12 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <span className="col-span-4">Partner Details & Role</span>
                <span className="col-span-4">Assigned Store Outlet</span>
                <span className="col-span-2 text-right">Commission</span>
                <span className="col-span-2 text-right">Sales volume</span>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                {/* Visualizing agents by structural connection */}
                {agents.map((agent) => {
                  const parentAgent = agent.parentId ? agents.find(p => p.id === agent.parentId) : null;
                  const isSubAgent = agent.role === 'Sub-Agent';
                  const assignedStoreObj = stores.find(s => s.url === agent.assignedStoreUrls[0]);

                  return (
                    <div
                      key={agent.id}
                      className={`p-4 grid grid-cols-12 items-center hover:bg-slate-50/75 transition-all ${
                        isSubAgent ? 'bg-slate-50/30' : ''
                      }`}
                    >
                      <div className="col-span-4 flex items-center gap-2">
                        {isSubAgent && (
                          <div className="h-5 w-5 border-l-2 border-b-2 border-slate-200 rounded-bl-md ml-3 mr-1 self-start"></div>
                        )}
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-800">{agent.name}</span>
                            <span
                              className={`text-[9px] px-2 py-0.5 rounded-full font-semibold ${
                                agent.role === 'Master Agent'
                                  ? 'bg-indigo-100 text-indigo-800'
                                  : agent.role === 'Agent'
                                  ? 'bg-teal-100 text-teal-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {agent.role}
                            </span>
                          </div>
                          {parentAgent && (
                            <span className="text-[10px] text-slate-400 block mt-0.5">
                              Sponsor parent: {parentAgent.name}
                            </span>
                          )}
                          <span className="text-[10px] text-slate-400 block font-mono">{agent.email}</span>
                        </div>
                      </div>

                      <div className="col-span-4">
                        <span className="font-bold text-slate-700 block truncate">{assignedStoreObj?.name || 'All Sites Proxy'}</span>
                        <a
                          href={agent.assignedStoreUrls[0]}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] text-slate-400 hover:text-indigo-600 block truncate"
                        >
                          {agent.assignedStoreUrls[0]}
                        </a>
                      </div>

                      <div className="col-span-2 text-right">
                        <span className="font-bold text-slate-800 text-sm">{agent.commissionRate}%</span>
                        <span className="text-[10px] text-slate-400 block">per checkout</span>
                      </div>

                      <div className="col-span-2 text-right flex flex-col justify-center items-end">
                        <span className="font-bold text-slate-900 text-sm">
                          ${agent.totalRevenueGenerated.toLocaleString()}
                        </span>
                        <button
                          onClick={() => setSelectedAgentForSale(agent.id)}
                          className="text-[10px] text-indigo-500 hover:text-indigo-700 hover:underline mt-0.5 font-semibold"
                        >
                          Manual Attribution
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Manualattribution modal / AppSheet Setup Guide */}
        <div className="space-y-6">
          {/* Slide out inline attribution simulator */}
          {selectedAgentForSale && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-sm"
            >
              <div className="flex items-center gap-1.5 mb-3 pb-2 border-b border-slate-800">
                <DollarSign size={16} className="text-teal-400" />
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-200">
                  Manual Sales Input attribution
                </h4>
              </div>
              <p className="text-slate-400 text-[11px] mb-4 leading-normal">
                Inject custom sales attribution to verify commission structures and test AppSheet output data.
              </p>

              <form onSubmit={handleAttributeSaleSubmit} className="space-y-4 text-xs font-mono">
                <div>
                  <span className="text-slate-500 text-[10px] block">TARGET RECIPIENT</span>
                  <span className="font-bold text-slate-100 text-sm">
                    {agents.find(a => a.id === selectedAgentForSale)?.name}
                  </span>
                </div>

                <div>
                  <label className="block text-slate-400 text-[10px] font-semibold mb-1">
                    Sale Amount (USD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={manualSaleAmount}
                    onChange={(e) => setManualSaleAmount(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded p-2 text-xs"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedAgentForSale(null)}
                    className="flex-1 border border-slate-700 text-slate-400 py-1.5 rounded hover:bg-slate-800 text-[11px]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-teal-500 text-slate-950 font-bold py-1.5 rounded hover:bg-teal-400 text-[11px]"
                  >
                    Attribute Sale
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* AppSheet configuration helper */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
              <Database size={18} className="text-slate-500" />
              <h3 className="text-md font-bold text-slate-800">AppSheet Mapping Manual</h3>
            </div>
            
            <p className="text-xs text-slate-500 leading-relaxed">
              Google AppSheet translates spreadsheets directly into native companion apps. Follow these configuration keys to match your CSV exports:
            </p>

            <ul className="space-y-3.5 text-xs text-slate-600">
              <li className="flex gap-2">
                <span className="bg-slate-200 text-slate-700 font-bold px-1.5 py-0.5 rounded text-[10px] font-mono h-fit">
                  1
                </span>
                <div>
                  <span className="font-bold block text-slate-700">Connect CSV to Sheets</span>
                  <span>Upload your downloaded <code>wed2c_agents.csv</code> file into Google Drive and convert to a Google Sheet.</span>
                </div>
              </li>
              <li className="flex gap-2">
                <span className="bg-slate-200 text-slate-700 font-bold px-1.5 py-0.5 rounded text-[10px] font-mono h-fit">
                  2
                </span>
                <div>
                  <span className="font-bold block text-slate-700">Parent-Child Relationship</span>
                  <span>In AppSheet, set the <code>Parent_Agent_ID</code> column type to <b>Ref</b> referencing the same Agent table to enable hierarchy.</span>
                </div>
              </li>
              <li className="flex gap-2">
                <span className="bg-slate-200 text-slate-700 font-bold px-1.5 py-0.5 rounded text-[10px] font-mono h-fit">
                  3
                </span>
                <div>
                  <span className="font-bold block text-slate-700">Commission Formulas</span>
                  <span>Set a virtual AppSheet column for payout: <code>[Total_Revenue_Accrued_USD] * ([Commission_Rate_Percent] / 100)</code>.</span>
                </div>
              </li>
            </ul>

            <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-center">
              <span className="text-[10px] text-indigo-700 font-bold uppercase block tracking-wider mb-0.5">
                AppSheet Native Companion
              </span>
              <p className="text-[11px] text-indigo-600">
                Run local collections offline with absolute stability!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
