
import React, { useState } from 'react';
import { LayoutDashboard, Users, Calendar, Settings, Sparkles, LogOut, Bell, Search, Lock } from 'lucide-react';
import AiConsole from './AiConsole';
import PatientsTable from './PatientsTable';
import AppointmentCalendar from './AppointmentCalendar';
import { User } from '../../types';

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const SidebarLink = ({ id, icon: Icon, label, restricted }: any) => {
    const isLocked = restricted && user.role !== 'admin' && user.role !== 'developer';
    
    if (isLocked) {
        // Optional: Render disabled link or nothing. Rendering disabled for visibility.
        return (
            <button
                disabled
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold text-slate-600 opacity-50 cursor-not-allowed"
            >
                <div className="relative">
                    <Icon className="w-5 h-5" />
                    <Lock className="w-3 h-3 absolute -top-1 -right-1 text-slate-500" />
                </div>
                {label}
            </button>
        );
    }
    
    return (
      <button
        onClick={() => setActiveTab(id)}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === id ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
      >
        <Icon className="w-5 h-5" />
        {label}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full z-20">
        <div className="p-6 border-b border-slate-800">
           <div className="flex items-center gap-2 text-white">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold">DS</div>
              <span className="font-display font-bold text-lg">AdminPortal</span>
           </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
            <SidebarLink id="dashboard" icon={LayoutDashboard} label="Overview" />
            <SidebarLink id="calendar" icon={Calendar} label="Appointments" />
            <SidebarLink id="patients" icon={Users} label="Patient Directory" />
            <div className="py-2">
                <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Management</p>
                <SidebarLink id="ai" icon={Sparkles} label="AI Console" restricted={true} />
                <SidebarLink id="settings" icon={Settings} label="Settings" restricted={true} />
            </div>
        </nav>

        <div className="p-4 border-t border-slate-800">
            <div className="mb-4 px-4 py-2 bg-slate-800 rounded text-xs text-slate-400">
                Logged in as <span className="text-white font-bold">{user.role}</span>
            </div>
            <button onClick={onLogout} className="flex items-center gap-2 text-slate-400 hover:text-red-400 transition-colors text-sm font-bold w-full">
                <LogOut className="w-4 h-4" /> Sign Out
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        {/* Top Header */}
        <header className="bg-white h-16 border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
            <h2 className="text-xl font-bold text-slate-800 capitalize">{activeTab === 'ai' ? 'AI Management' : activeTab}</h2>
            <div className="flex items-center gap-6">
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <button className="relative p-2 text-slate-400 hover:text-slate-600">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <div className="flex items-center gap-3 border-l border-slate-100 pl-6">
                    <div className="text-right">
                        <p className="text-sm font-bold text-slate-800">{user.name}</p>
                        <p className="text-xs text-slate-500 capitalize">{user.role}</p>
                    </div>
                    <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
                </div>
            </div>
        </header>

        {/* Content Area */}
        <div className="p-8">
            {activeTab === 'dashboard' && (
                <div className="space-y-8 animate-in fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                            <p className="text-slate-500 text-xs font-bold uppercase">Today's Appointments</p>
                            <p className="text-3xl font-bold text-slate-800 mt-2">12</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                            <p className="text-slate-500 text-xs font-bold uppercase">Pending Actions</p>
                            <p className="text-3xl font-bold text-slate-800 mt-2 text-amber-500">4</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                            <p className="text-slate-500 text-xs font-bold uppercase">AI Queries (Today)</p>
                            <p className="text-3xl font-bold text-slate-800 mt-2 text-primary">89</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <h3 className="font-bold text-slate-800 mb-4">Quick Schedule</h3>
                            <AppointmentCalendar />
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <h3 className="font-bold text-slate-800 mb-4">Recent Patients</h3>
                            <PatientsTable />
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'calendar' && (
                <div className="animate-in fade-in">
                    <AppointmentCalendar />
                </div>
            )}

            {activeTab === 'patients' && (
                <div className="animate-in fade-in">
                    <PatientsTable />
                </div>
            )}

            {activeTab === 'ai' && (
                (user.role === 'admin' || user.role === 'developer') ? (
                    <AiConsole />
                ) : (
                    <div className="flex flex-col items-center justify-center h-96 text-center bg-white rounded-xl border border-slate-200 shadow-sm">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-500 mb-4">
                            <Lock className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">Access Denied</h3>
                        <p className="text-slate-500 max-w-sm mt-2">You do not have permission to view the AI Management Console.</p>
                    </div>
                )
            )}

            {activeTab === 'settings' && (
                (user.role === 'admin' || user.role === 'developer') ? (
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 animate-in fade-in">
                        <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Settings className="w-6 h-6 text-slate-400" /> System Settings
                        </h3>
                        <p className="text-slate-500 mb-8">Global application configurations and practice details.</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-6 border border-slate-200 rounded-xl hover:border-primary/50 transition-colors cursor-pointer group">
                                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                                    <LayoutDashboard className="w-5 h-5" />
                                </div>
                                <h4 className="font-bold text-slate-700">General Branding</h4>
                                <p className="text-xs text-slate-400 mt-1">Configure logo, practice name, and primary colors.</p>
                            </div>
                            <div className="p-6 border border-slate-200 rounded-xl hover:border-primary/50 transition-colors cursor-pointer group">
                                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                                    <Bell className="w-5 h-5" />
                                </div>
                                <h4 className="font-bold text-slate-700">Notifications</h4>
                                <p className="text-xs text-slate-400 mt-1">Email & SMS templates for appointment reminders.</p>
                            </div>
                            <div className="p-6 border border-slate-200 rounded-xl hover:border-primary/50 transition-colors cursor-pointer group">
                                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                                    <Settings className="w-5 h-5" />
                                </div>
                                <h4 className="font-bold text-slate-700">Integrations</h4>
                                <p className="text-xs text-slate-400 mt-1">Manage API keys (Google, Stripe, Twilio).</p>
                            </div>
                            <div className="p-6 border border-slate-200 rounded-xl hover:border-primary/50 transition-colors cursor-pointer group">
                                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <h4 className="font-bold text-slate-700">Security & Roles</h4>
                                <p className="text-xs text-slate-400 mt-1">Password policies, MFA, and staff permissions.</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-96 text-center bg-white rounded-xl border border-slate-200 shadow-sm">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-500 mb-4">
                            <Lock className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">Access Denied</h3>
                        <p className="text-slate-500 max-w-sm mt-2">You do not have permission to view System Settings.</p>
                    </div>
                )
            )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
