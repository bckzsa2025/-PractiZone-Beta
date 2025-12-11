
import React, { useEffect, useState } from 'react';
import { apiClient } from '../../libs/api';
import { User, Appointment } from '../../types';
import { LogOut, Calendar, FileText, User as UserIcon, CreditCard, MessageSquare, WifiOff, Download, Upload, Pill, X, Printer, Send } from 'lucide-react';
import Profile from './Profile';

interface DashboardProps {
    user: User;
    onLogout: () => void;
}

type ViewState = 'overview' | 'profile' | 'billing' | 'messages';

const Dashboard: React.FC<DashboardProps> = ({ user: initialUser, onLogout }) => {
  const [user, setUser] = useState<User>(initialUser);
  const [view, setView] = useState<ViewState>('overview');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  // Doc state for Overview
  const [showPrescription, setShowPrescription] = useState(false);
  const STORAGE_KEY_DOCS = 'dr_sester_patient_docs';
  const [docs, setDocs] = useState<any[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_DOCS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [
      { id: '1', name: 'Blood Test Results', source: 'PathCare', date: 'Oct 12, 2023', type: 'lab' },
      { id: '2', name: 'Prescription Script', source: 'Dr. Sester', date: 'Sep 28, 2023', type: 'prescription' }
    ];
  });

  // Message State
  const [messageInput, setMessageInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
      { id: 1, sender: 'staff', text: 'Good morning Alex, just confirming your appointment for tomorrow.', time: 'Yesterday 10:30 AM' },
      { id: 2, sender: 'user', text: 'Yes, I will be there. Thanks!', time: 'Yesterday 10:45 AM' }
  ]);

  useEffect(() => {
    // Network listeners
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial Data Fetch
    const fetchAppts = async () => {
        const data = await apiClient.appointments.list(user.id);
        setAppointments(data);
    };
    fetchAppts();

    return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
    };
  }, [user.id]);

  useEffect(() => {
      localStorage.setItem(STORAGE_KEY_DOCS, JSON.stringify(docs));
  }, [docs]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
          const newDocs = Array.from(e.target.files).map((file: File) => ({
              id: Date.now().toString(),
              name: file.name,
              source: 'Upload',
              date: new Date().toLocaleDateString(),
              type: 'upload'
          }));
          setDocs(prev => [...newDocs, ...prev]);
      }
  };

  const handleSendMessage = (e: React.FormEvent) => {
      e.preventDefault();
      if (!messageInput.trim()) return;
      
      const newMsg = {
          id: Date.now(),
          sender: 'user',
          text: messageInput,
          time: 'Just now'
      };
      setChatMessages(prev => [...prev, newMsg]);
      setMessageInput('');
  };

  const SidebarItem = ({ id, label, icon: Icon }: { id: ViewState, label: string, icon: any }) => (
      <button 
        onClick={() => setView(id)}
        className={`w-full flex items-center gap-3 px-6 py-4 text-sm font-bold transition-colors border-b border-slate-50 ${view === id ? 'text-primary bg-blue-50/50' : 'text-slate-600 hover:bg-slate-50 hover:text-primary'}`}
      >
          <Icon className="w-4 h-4" /> {label}
      </button>
  );

  return (
    <div className="min-h-screen bg-slate-50">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <span className="font-display font-bold text-slate-800 text-xl">PractiZone™ Portal</span>
                    {!isOnline && (
                        <div className="flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold animate-pulse">
                            <WifiOff className="w-3 h-3" /> Offline Mode
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-slate-800">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                    <button onClick={onLogout} className="p-2 text-slate-400 hover:text-red-500 transition-colors" title="Logout">
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
            <aside className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-center">
                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-primary mx-auto mb-4 border-2 border-white shadow-sm">
                        <UserIcon className="w-10 h-10" />
                    </div>
                    <h2 className="font-bold text-slate-800">{user.name}</h2>
                    <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold uppercase rounded mt-2">
                        Active Patient
                    </span>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <nav className="flex flex-col">
                        <button 
                            onClick={() => setView('overview')}
                            className={`w-full flex items-center gap-3 px-6 py-4 text-sm font-bold transition-colors border-b border-slate-50 ${view === 'overview' ? 'text-primary bg-blue-50/50' : 'text-slate-600 hover:bg-slate-50 hover:text-primary'}`}
                        >
                            <Calendar className="w-4 h-4" /> Overview
                        </button>
                        <SidebarItem id="profile" label="My Profile" icon={UserIcon} />
                        <SidebarItem id="billing" label="Billing & Invoices" icon={CreditCard} />
                        <SidebarItem id="messages" label="Messages" icon={MessageSquare} />
                    </nav>
                </div>
                
                {/* Mini Summary */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                     <h3 className="font-bold text-slate-400 text-xs uppercase mb-4">Medical Summary</h3>
                     <div className="space-y-4">
                        <div>
                            <p className="text-xs font-bold text-slate-500">Conditions</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                                {user.medicalSummary?.conditions.map(c => (
                                    <span key={c} className="px-2 py-1 bg-amber-50 text-amber-700 text-xs rounded border border-amber-100 font-bold">{c}</span>
                                ))}
                            </div>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-500">Allergies</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                                {user.medicalSummary?.allergies.map(c => (
                                    <span key={c} className="px-2 py-1 bg-red-50 text-red-700 text-xs rounded border border-red-100 font-bold">{c}</span>
                                ))}
                            </div>
                        </div>
                     </div>
                </div>
            </aside>

            <div className="lg:col-span-3 space-y-6">
                
                {view === 'overview' && (
                    <>
                        {/* Appointments Section */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="font-display font-bold text-lg text-slate-800 flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-primary" /> Appointments
                                </h2>
                                <button className="text-sm font-bold text-primary hover:underline">+ Book New</button>
                            </div>

                            <div className="space-y-4">
                                {appointments.length === 0 ? (
                                    <p className="text-slate-400 text-center py-8 italic">No appointments found.</p>
                                ) : (
                                    appointments.map(appt => (
                                        <div key={appt.id} className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-slate-50 rounded-lg border border-slate-100">
                                            <div className="bg-white p-3 rounded-lg border border-slate-200 text-center min-w-[70px]">
                                                <span className="block text-xs font-bold text-slate-400 uppercase">
                                                    {new Date(appt.date).toLocaleDateString('en-US', { month: 'short' })}
                                                </span>
                                                <span className="block text-xl font-bold text-slate-800">
                                                    {new Date(appt.date).getDate()}
                                                </span>
                                            </div>
                                            <div className="flex-1 text-center sm:text-left">
                                                <h4 className="font-bold text-slate-800">
                                                    {appt.type === 'telehealth' ? 'Telehealth Consultation' : 'In-Person Visit'}
                                                </h4>
                                                <p className="text-sm text-slate-500">
                                                    {new Date(appt.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} • Dr. B Setzer
                                                </p>
                                            </div>
                                            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                                                {appt.status}
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Documents Section */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col">
                            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-primary" /> Documents
                            </h3>
                            
                            <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 mb-4 text-center hover:bg-slate-50 transition-colors relative">
                                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileUpload} />
                                <div className="flex flex-col items-center gap-1 text-slate-400">
                                    <Upload className="w-6 h-6" />
                                    <p className="text-xs font-bold">Click to Upload</p>
                                </div>
                            </div>

                            <ul className="space-y-2">
                                {docs.map((doc) => (
                                    <li 
                                        key={doc.id}
                                        onClick={() => doc.type === 'prescription' && setShowPrescription(true)}
                                        className={`flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors group ${doc.type === 'prescription' ? 'cursor-pointer ring-1 ring-transparent hover:ring-primary/20' : ''}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            {doc.type === 'prescription' ? <Pill className="w-5 h-5 text-slate-400" /> : <FileText className="w-5 h-5 text-slate-400" />}
                                            <div>
                                                <p className="text-sm font-bold text-slate-700">{doc.name}</p>
                                                <p className="text-[10px] text-slate-500">{doc.date}</p>
                                            </div>
                                        </div>
                                        <Download className="w-4 h-4 text-slate-400" />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </>
                )}

                {view === 'profile' && (
                    <Profile user={user} onUpdate={(u) => setUser(u)} />
                )}

                {view === 'billing' && (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h2 className="font-display font-bold text-lg text-slate-800 flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-primary" /> Billing History
                            </h2>
                            <button className="text-sm font-bold text-primary hover:underline">Download Statement</button>
                        </div>
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 font-bold text-slate-600">
                                <tr>
                                    <th className="p-4">Date</th>
                                    <th className="p-4">Description</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 text-right">Amount</th>
                                    <th className="p-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                <tr>
                                    <td className="p-4 text-slate-500">Oct 12, 2023</td>
                                    <td className="p-4 font-bold text-slate-700">General Consultation</td>
                                    <td className="p-4"><span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Paid</span></td>
                                    <td className="p-4 text-right font-mono">R 450.00</td>
                                    <td className="p-4 text-right"><button className="text-slate-400 hover:text-primary"><Download className="w-4 h-4" /></button></td>
                                </tr>
                                <tr>
                                    <td className="p-4 text-slate-500">Sep 28, 2023</td>
                                    <td className="p-4 font-bold text-slate-700">Pathology (Blood Test)</td>
                                    <td className="p-4"><span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Paid</span></td>
                                    <td className="p-4 text-right font-mono">R 850.00</td>
                                    <td className="p-4 text-right"><button className="text-slate-400 hover:text-primary"><Download className="w-4 h-4" /></button></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}

                {view === 'messages' && (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 h-[600px] flex flex-col animate-in fade-in">
                         <div className="p-4 border-b border-slate-100 flex items-center gap-3">
                             <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                                 <UserIcon className="w-5 h-5 text-slate-400" />
                             </div>
                             <div>
                                 <h3 className="font-bold text-slate-800">Front Desk</h3>
                                 <p className="text-xs text-slate-500">Usually replies within 1 hour</p>
                             </div>
                         </div>
                         <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                             {chatMessages.map(msg => (
                                 <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                     <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.sender === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-white text-slate-700 border border-slate-200 rounded-bl-none'}`}>
                                         <p>{msg.text}</p>
                                         <span className="text-[10px] opacity-70 block text-right mt-1">{msg.time}</span>
                                     </div>
                                 </div>
                             ))}
                         </div>
                         <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100 flex gap-2">
                             <button type="button" className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg"><Upload className="w-5 h-5" /></button>
                             <input 
                                type="text" 
                                value={messageInput}
                                onChange={e => setMessageInput(e.target.value)}
                                className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 focus:outline-none focus:border-primary"
                                placeholder="Type a secure message..."
                             />
                             <button type="submit" className="p-2 bg-primary text-white rounded-lg hover:bg-blue-700"><Send className="w-5 h-5" /></button>
                         </form>
                    </div>
                )}

            </div>
        </main>

        {/* Prescription Modal */}
        {showPrescription && (
            <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
                <div className="bg-primary p-4 flex justify-between items-center text-white">
                <h3 className="font-bold flex items-center gap-2">
                    <Pill className="w-5 h-5" /> Prescription Details
                </h3>
                <button onClick={() => setShowPrescription(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                    <X className="w-5 h-5" />
                </button>
                </div>
                <div className="p-6 space-y-4">
                <div className="flex justify-between border-b border-slate-100 pb-4">
                    <div>
                        <p className="text-xs text-slate-500 uppercase font-bold">Prescribing Doctor</p>
                        <p className="font-bold text-slate-800">Dr. BC Setzer</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-slate-500 uppercase font-bold">Date</p>
                        <p className="font-bold text-slate-800">Sep 28, 2023</p>
                    </div>
                </div>
                
                <div>
                    <p className="text-xs text-slate-500 uppercase font-bold mb-3">Medications</p>
                    <div className="space-y-3">
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                            <p className="font-bold text-slate-800">Amoxicillin 500mg</p>
                            <p className="text-sm text-slate-600">1 tablet every 8 hours</p>
                        </div>
                    </div>
                </div>
                </div>
                <div className="bg-slate-50 p-4 flex justify-end gap-2 border-t border-slate-100">
                <button onClick={() => setShowPrescription(false)} className="px-4 py-2 text-slate-600 text-sm font-bold hover:bg-slate-200 rounded-lg">Close</button>
                <button className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-teal-600 flex items-center gap-2">
                    <Printer className="w-4 h-4" /> Print
                </button>
                </div>
            </div>
            </div>
        )}

    </div>
  );
};

export default Dashboard;