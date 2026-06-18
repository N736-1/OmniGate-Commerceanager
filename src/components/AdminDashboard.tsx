import React, { useState } from 'react';
import { Settings, Plus, Trash2, Save } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
    const [config, setConfig] = useState({
        gatewayName: "PayBridg",
        cryptoExchangeEnabled: true,
        defaultCurrency: "PKR"
    });

    const handleSave = () => {
        alert("Configuration saved to system.");
    };

    return (
        <div className="p-6 bg-white rounded-xl border border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Settings size={20} className="text-indigo-600" />
                System Admin Console
            </h2>

            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Gateway Alias</label>
                        <input 
                            type="text" 
                            value={config.gatewayName}
                            onChange={(e) => setConfig({...config, gatewayName: e.target.value})}
                            className="w-full p-2 border rounded-lg text-sm"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <input 
                        type="checkbox" 
                        checked={config.cryptoExchangeEnabled}
                        onChange={(e) => setConfig({...config, cryptoExchangeEnabled: e.target.checked})}
                        id="crypto-toggle"
                    />
                    <label htmlFor="crypto-toggle" className="text-sm font-semibold">Enable BTC Digital Currency Exchange Agent</label>
                </div>

                <button 
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700"
                >
                    <Save size={16} />
                    Save System Config
                </button>
            </div>
        </div>
    );
};
