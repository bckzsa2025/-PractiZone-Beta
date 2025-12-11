
import React, { useState, useEffect } from 'react';
import { Terminal, Activity, Database, Server, Shield, Cpu, HardDrive, LogOut, Code, Bug, Globe } from 'lucide-react';
import { User } from '../../types';

interface DeveloperConsoleProps {
  user: User;
  onLogout: () => void;
}

const DeveloperConsole: React.FC<DeveloperConsoleProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('system');
  const [logs, setLogs] = useState<string[]>([]);
  const [stats, setStats] = useState({ cpu: 12, memory: 45, requests: 1240, latency: 45 });

  // Simulate live data
  useEffect(() => {
    const interval = setInterval(() => {
        setStats(prev => ({
            cpu: Math.floor(Math.random() * 30) + 10,
            memory: Math.floor(Math.random() * 10) + 40,
            requests: prev.requests + Math.floor(Math.random() * 5),
            latency: Math.floor(Math.random() * 20) + 30
        }));
        
        const newLog = `[${new Date().toISOString()}] INFO: API Request /health processed in ${Math.floor(Math.random() * 50)}ms`;
        setLogs(prev => [newLog, ...prev].slice(0, 50));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-mono flex flex-col">
      {/* Top Bar */}
      <header className="h-14 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between px-6 backdrop-blur-md sticky top-0 z-50">
         <div className="flex items-center gap-3">
             <Terminal className="w-5 h-5 text-green-500" />
             <span className="font-bold text-slate-100">PractiZone™::DevConsole <span className="text-slate-600 text-xs">v1.0.0-rc1</span></span>
         </div>
         <div className="flex items-center gap-6">
             <div className="flex items-center gap-2 text-xs">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                System Online
             </div>
             <div className="flex items-center gap-2">
                 <div className="w-6 h-6 bg-slate-800 rounded flex items-center justify-center text-xs font-bold text-slate-400">SU</div>
                 <span className="text-sm font-bold text-slate-400">{user.email}</span>
             </div>
             <button onClick={onLogout} className="p-2 hover:bg-red-500/10 hover:text-red-400 rounded transition-colors">
                 <LogOut className="w-4 h-4" />
             </button>
         </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
         {/* Sidebar */}
         <aside className="w-64 border-r border-slate-800 bg-slate-900/30 flex flex-col">
            <nav className="p-4 space-y-1">
                <button onClick={() => setActiveTab('system')} className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm font-bold transition-all ${activeTab === 'system' ? 'bg-slate-800 text-white border-l-2 border-green-500' : 'hover:bg-slate-800/50 text-slate-500'}`}>
                    <Activity className="w-4 h-4" /> System Health
                </button>
                <button onClick={() => setActiveTab('logs')} className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm font-bold transition-all ${activeTab === 'logs' ? 'bg-slate-800 text-white border-l-2 border-green-500' : 'hover:bg-slate-800/50 text-slate-500'}`}>
                    <Code className="w-4 h-4" /> Live Logs
                </button>
                <button onClick={() => setActiveTab('db')} className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm font-bold transition-all ${activeTab === 'db' ? 'bg-slate-800 text-white border-l-2 border-green-500' : 'hover:bg-slate-800/50 text-slate-500'}`}>
                    <Database className="w-4 h-4" /> Database Ops
                </button>
                <button onClick={() => setActiveTab('env')} className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm font-bold transition-all ${activeTab === 'env' ? 'bg-slate-800 text-white border-l-2 border-green-500' : 'hover:bg-slate-800/50 text-slate-500'}`}>
                    <Shield className="w-4 h-4" /> Environment
                </button>
            </nav>
            <div className="mt-auto p-4 border-t border-slate-800">
                <div className="bg-slate-900 p-3 rounded border border-slate-800 text-xs">
                    <p className="text-slate-500 mb-1">Worker Status</p>
                    <div className="flex justify-between items-center text-green-400 font-bold">
                        <span>Active</span>
                        <span>4/4 Nodes</span>
                    </div>
                </div>
            </div>
         </aside>

         {/* Main View */}
         <main className="flex-1 overflow-y-auto p-8">
            {activeTab === 'system' && (
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-white mb-6">System Telemetry</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg">
                            <div className="flex items-center gap-3 mb-2 text-slate-400 text-xs font-bold uppercase">
                                <Cpu className="w-4 h-4" /> CPU Usage
                            </div>
                            <div className="text-3xl font-bold text-white">{stats.cpu}%</div>
                            <div className="w-full bg-slate-800 h-1 mt-3 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${stats.cpu}%` }}></div>
                            </div>
                        </div>
                        <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg">
                            <div className="flex items-center gap-3 mb-2 text-slate-400 text-xs font-bold uppercase">
                                <HardDrive className="w-4 h-4" /> Memory
                            </div>
                            <div className="text-3xl font-bold text-white">{stats.memory}%</div>
                            <div className="w-full bg-slate-800 h-1 mt-3 rounded-full overflow-hidden">
                                <div className="h-full bg-purple-500 transition-all duration-500" style={{ width: `${stats.memory}%` }}></div>
                            </div>
                        </div>
                        <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg">
                            <div className="flex items-center gap-3 mb-2 text-slate-400 text-xs font-bold uppercase">
                                <Globe className="w-4 h-4" /> Requests/m
                            </div>
                            <div className="text-3xl font-bold text-white">{stats.requests}</div>
                            <div className="text-xs text-green-500 mt-2 flex items-center gap-1">▲ 12% vs last hour</div>
                        </div>
                        <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg">
                            <div className="flex items-center gap-3 mb-2 text-slate-400 text-xs font-bold uppercase">
                                <Server className="w-4 h-4" /> Latency
                            </div>
                            <div className="text-3xl font-bold text-white">{stats.latency}ms</div>
                             <div className="text-xs text-slate-500 mt-2">p95 avg</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mt-8">
                        <div className="bg-slate-900 border border-slate-800 p-6 rounded-lg">
                            <h3 className="text-lg font-bold text-white mb-4">Service Status</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center p-3 bg-slate-950 rounded border border-slate-800/50">
                                    <span className="text-sm font-bold text-slate-300">Backend API (FastAPI)</span>
                                    <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded border border-green-500/30">Healthy</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-slate-950 rounded border border-slate-800/50">
                                    <span className="text-sm font-bold text-slate-300">Database (PostgreSQL)</span>
                                    <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded border border-green-500/30">Healthy</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-slate-950 rounded border border-slate-800/50">
                                    <span className="text-sm font-bold text-slate-300">Vector Store (ChromaDB)</span>
                                    <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded border border-green-500/30">Healthy</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-slate-950 rounded border border-slate-800/50">
                                    <span className="text-sm font-bold text-slate-300">AI Service (Gemini)</span>
                                    <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded border border-green-500/30">Connected</span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-slate-900 border border-slate-800 p-6 rounded-lg">
                            <h3 className="text-lg font-bold text-white mb-4">Recent Deployments</h3>
                            <div className="space-y-4">
                                <div className="border-l-2 border-blue-500 pl-4">
                                    <p className="text-sm font-bold text-white">v1.2.0 - Hotfix: Admin Login</p>
                                    <p className="text-xs text-slate-500">Deployed by Gim • 2 hours ago</p>
                                </div>
                                <div className="border-l-2 border-slate-700 pl-4 opacity-50">
                                    <p className="text-sm font-bold text-white">v1.1.5 - Feature: AI Voice</p>
                                    <p className="text-xs text-slate-500">Deployed by Gim • 1 day ago</p>
                                </div>
                                <div className="border-l-2 border-slate-700 pl-4 opacity-50">
                                    <p className="text-sm font-bold text-white">v1.1.0 - Initial RAG Setup</p>
                                    <p className="text-xs text-slate-500">Deployed by Gim • 3 days ago</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'logs' && (
                <div className="bg-slate-950 rounded-lg border border-slate-800 h-full flex flex-col">
                    <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                        <div className="text-sm font-bold text-slate-300">Live Server Logs</div>
                        <div className="flex gap-2">
                             <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                             <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                             <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-1">
                        {logs.map((log, i) => (
                            <div key={i} className="hover:bg-white/5 p-1 rounded transition-colors text-slate-400">
                                <span className="text-slate-600 mr-2">$</span>
                                {log}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'env' && (
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-white mb-4">Environment Variables</h2>
                    <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-950 text-slate-500 font-bold border-b border-slate-800">
                                <tr>
                                    <th className="p-4">Variable</th>
                                    <th className="p-4">Value</th>
                                    <th className="p-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                <tr>
                                    <td className="p-4 font-bold text-purple-400">DATABASE_URL</td>
                                    <td className="p-4 text-slate-500">postgresql://user:****@db:5432/...</td>
                                    <td className="p-4"><span className="text-green-500 text-xs">● Loaded</span></td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-bold text-purple-400">GEMINI_API_KEY</td>
                                    <td className="p-4 text-slate-500">AIzaSy*****************</td>
                                    <td className="p-4"><span className="text-green-500 text-xs">● Loaded</span></td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-bold text-purple-400">TWILIO_AUTH_TOKEN</td>
                                    <td className="p-4 text-slate-500">**********************</td>
                                    <td className="p-4"><span className="text-green-500 text-xs">● Loaded</span></td>
                                </tr>
                                <tr>
                                    <td className="p-4 font-bold text-purple-400">NODE_ENV</td>
                                    <td className="p-4 text-slate-300">production</td>
                                    <td className="p-4"><span className="text-green-500 text-xs">● Loaded</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
         </main>
      </div>
    </div>
  );
};

export default DeveloperConsole;