import React, { useState, useRef, useEffect } from 'react';
import { Save, Database, MessageSquare, Terminal, RefreshCw, Plus, Trash2, Phone, Settings, Sliders, Upload, FileText, CheckCircle, Loader2, Play, Video, Image as ImageIcon, Key, Globe, Cpu } from 'lucide-react';
import { apiClient } from '../../libs/api';
import { TwilioConfig, AISettings } from '../../types';

const AiConsole: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'prompts' | 'knowledge' | 'media' | 'logs' | 'telephony' | 'providers'>('prompts');
    const [isLoading, setIsLoading] = useState(false);
    
    // AI Config State
    const [systemPrompt, setSystemPrompt] = useState("You are a helpful assistant for Dr. Beate Setzer's UX Frontend practice. Your primary role is to provide verified information based on Google searches and assist users with general inquiries about services, appointments, and practice information. You must NOT provide medical advice, diagnoses, or treatment recommendations. If a user asks for medical advice, politely decline and direct them to consult with Dr. Beate Setzer or another qualified healthcare professional. Ensure all information provided is accurate and verified.");
    const [temperature, setTemperature] = useState(0.7);
    const [tone, setTone] = useState("Professional & Empathetic");

    // Telephony State
    const [twilioConfig, setTwilioConfig] = useState<TwilioConfig>({
        accountSid: '',
        authToken: '',
        phoneNumber: '',
        webhookUrl: ''
    });

    // Provider Settings State
    const [aiSettings, setAiSettings] = useState<AISettings>({
        provider: 'google',
        apiKey: '',
        models: {
            chat: 'gemini-2.5-flash',
            image: 'gemini-2.5-flash-image',
            video: 'veo-3.1-fast-generate-preview',
            audio: 'gemini-2.5-flash-native-audio-preview-09-2025'
        }
    });

    // Knowledge Base State
    const [docs, setDocs] = useState([
        { id: 1, name: 'Practice_Hours_2024.pdf', type: 'application/pdf', status: 'indexed' },
        { id: 2, name: 'Pricing_List_General.docx', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', status: 'indexed' }
    ]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Media State
    const [autoImage, setAutoImage] = useState(true);
    const [autoVideo, setAutoVideo] = useState(false); // Default off due to cost

    const [logs, setLogs] = useState([
        { id: 1, user: 'John Doe', query: 'How much is a consultation?', timestamp: '10 mins ago', status: 'success' },
        { id: 2, user: 'Sarah Smith', query: 'Can I book for tomorrow?', timestamp: '25 mins ago', status: 'success' }
    ]);

    useEffect(() => {
        // Load configurations on mount
        const loadConfig = async () => {
            setIsLoading(true);
            try {
                const tConfig = await apiClient.settings.getTwilioConfig();
                setTwilioConfig(tConfig);
                const aConfig = await apiClient.settings.getAI();
                setAiSettings(aConfig);
            } catch (e) {
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        };
        loadConfig();
    }, []);

    const handleSave = async () => {
        setIsLoading(true);
        try {
            if (activeTab === 'telephony') {
                await apiClient.settings.saveTwilioConfig(twilioConfig);
            } else if (activeTab === 'providers') {
                await apiClient.settings.saveAI(aiSettings);
            }
            // Simulate other saves
            await new Promise(r => setTimeout(r, 1000));
            alert("Configuration saved successfully!");
        } catch (e) {
            console.error(e);
            alert("Failed to save configuration.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFile = e.target.files[0];
            const newDoc = {
                id: Date.now(),
                name: newFile.name,
                type: newFile.type,
                status: 'processing'
            };
            
            // Add to list with 'processing' status
            setDocs(prev => [...prev, newDoc]);
            
            // Simulate processing/indexing delay
            setTimeout(() => {
                setDocs(prev => prev.map(d => d.id === newDoc.id ? { ...d, status: 'indexed' } : d));
            }, 2500);
        }
    };

    // Simulation for Telephony
    const runSimulation = async () => {
        const testMsg = "Can I book an appointment for tomorrow?";
        alert(`Simulating Incoming Voice Call...\n\nUser says: "${testMsg}"\n\n(Check Console for Backend Logic)`);
        const response = await apiClient.webhooks.twilio.voice(testMsg);
        console.log("TwiML Response Generated:", response);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <Terminal className="w-6 h-6 text-primary" /> AI Management Console
                </h3>
                <div className="flex bg-white rounded-lg p-1 border border-slate-200">
                    {(['prompts', 'providers', 'knowledge', 'media', 'logs', 'telephony'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-3 py-2 rounded-md text-xs font-bold capitalize transition-all ${activeTab === tab ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 min-h-[500px] p-6 relative">
                {isLoading && (
                    <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                )}
                
                {activeTab === 'providers' && (
                    <div className="space-y-6 animate-in fade-in">
                        <div className="flex justify-between items-center">
                            <div>
                                <h4 className="font-bold text-slate-800">API Providers & Keys</h4>
                                <p className="text-sm text-slate-500">Configure connection strings and model selections.</p>
                            </div>
                            <button onClick={handleSave} className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg flex items-center gap-2 hover:bg-blue-700">
                                <Save className="w-4 h-4" /> Save Config
                            </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Provider Config */}
                            <div className="space-y-4">
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Globe className="w-5 h-5 text-primary" />
                                        <h5 className="font-bold text-slate-700">Provider Settings</h5>
                                    </div>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Active Provider</label>
                                            <select 
                                                value={aiSettings.provider}
                                                onChange={(e) => setAiSettings({...aiSettings, provider: e.target.value as any})}
                                                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm"
                                            >
                                                <option value="google">Google Cloud (Vertex/Gemini)</option>
                                                <option value="custom">Custom Endpoint (OpenAI Compat)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">API Key</label>
                                            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-2">
                                                <Key className="w-4 h-4 text-slate-400" />
                                                <input 
                                                    type="password"
                                                    value={aiSettings.apiKey}
                                                    onChange={(e) => setAiSettings({...aiSettings, apiKey: e.target.value})}
                                                    placeholder="Enter API Key to override env"
                                                    className="flex-1 outline-none text-sm font-mono"
                                                />
                                            </div>
                                            <p className="text-[10px] text-slate-400 mt-1">Leave empty to use VITE_GOOGLE_API_KEY from environment.</p>
                                        </div>
                                        {aiSettings.provider === 'custom' && (
                                            <div>
                                                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Endpoint URL</label>
                                                <input 
                                                    type="text"
                                                    value={aiSettings.endpoint || ''}
                                                    onChange={(e) => setAiSettings({...aiSettings, endpoint: e.target.value})}
                                                    placeholder="https://api.openai.com/v1"
                                                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm font-mono"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Model Config */}
                            <div className="space-y-4">
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Cpu className="w-5 h-5 text-purple-500" />
                                        <h5 className="font-bold text-slate-700">Model Selection</h5>
                                    </div>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Chat Model</label>
                                            <input 
                                                type="text" 
                                                value={aiSettings.models.chat}
                                                onChange={(e) => setAiSettings({...aiSettings, models: {...aiSettings.models, chat: e.target.value}})}
                                                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm font-mono"
                                            />
                                            <p className="text-[10px] text-slate-400">Default: gemini-2.5-flash</p>
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Image Model</label>
                                            <input 
                                                type="text" 
                                                value={aiSettings.models.image}
                                                onChange={(e) => setAiSettings({...aiSettings, models: {...aiSettings.models, image: e.target.value}})}
                                                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm font-mono"
                                            />
                                            <p className="text-[10px] text-slate-400">Default: gemini-2.5-flash-image</p>
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Video Model</label>
                                            <input 
                                                type="text" 
                                                value={aiSettings.models.video}
                                                onChange={(e) => setAiSettings({...aiSettings, models: {...aiSettings.models, video: e.target.value}})}
                                                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm font-mono"
                                            />
                                            <p className="text-[10px] text-slate-400">Default: veo-3.1-fast-generate-preview</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'prompts' && (
                    <div className="space-y-6 animate-in fade-in">
                        <div className="flex justify-between items-center mb-2">
                            <div>
                                <h4 className="font-bold text-slate-800">Persona & Behavior</h4>
                                <p className="text-sm text-slate-500">Configure how the AI interacts with patients.</p>
                            </div>
                            <button onClick={handleSave} className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg flex items-center gap-2 hover:bg-blue-700">
                                <Save className="w-4 h-4" /> Save Changes
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-2 space-y-2">
                                <div className="flex justify-between items-end">
                                    <label className="text-xs font-bold text-slate-500 uppercase">System Instruction</label>
                                    <div className="flex gap-2">
                                        {['{{PATIENT_NAME}}', '{{PATIENT_AGE}}', '{{LAST_APPT}}', '{{MEDICAL_HISTORY}}'].map(tag => (
                                            <button
                                                key={tag}
                                                onClick={() => setSystemPrompt(curr => curr + ' ' + tag)}
                                                className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-1 rounded border border-slate-200 font-mono transition-colors"
                                                title="Insert dynamic placeholder"
                                            >
                                                {tag}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <textarea 
                                    className="w-full h-64 p-4 bg-slate-50 border border-slate-200 rounded-lg font-mono text-sm focus:border-primary outline-none resize-none leading-relaxed"
                                    value={systemPrompt}
                                    onChange={(e) => setSystemPrompt(e.target.value)}
                                    placeholder="Enter the system behavior instructions here..."
                                />
                                <p className="text-[10px] text-slate-400 flex items-center gap-1">
                                    <span className="font-bold text-primary">Tip:</span> Dynamic variables will be replaced with actual patient data at runtime.
                                </p>
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Creativity (Temperature)</label>
                                    <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
                                        <Sliders className="w-5 h-5 text-slate-400" />
                                        <input 
                                            type="range" 
                                            min="0" 
                                            max="1" 
                                            step="0.1" 
                                            value={temperature}
                                            onChange={(e) => setTemperature(parseFloat(e.target.value))}
                                            className="flex-1 accent-primary h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                                        />
                                        <span className="text-sm font-bold text-slate-800 w-8">{temperature}</span>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-1">Lower values are more deterministic.</p>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Voice & Tone</label>
                                    <select 
                                        value={tone}
                                        onChange={(e) => setTone(e.target.value)}
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:border-primary outline-none font-medium text-sm"
                                    >
                                        <option>Professional & Empathetic</option>
                                        <option>Direct & Clinical</option>
                                        <option>Friendly & Casual</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'media' && (
                    <div className="space-y-6 animate-in fade-in">
                        <div className="flex justify-between items-center">
                            <div>
                                <h4 className="font-bold text-slate-800">Agentic Media Generation</h4>
                                <p className="text-sm text-slate-500">Configure automated visual aids for educational purposes.</p>
                            </div>
                            <button onClick={handleSave} className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg flex items-center gap-2 hover:bg-blue-700">
                                <Save className="w-4 h-4" /> Save Config
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                             <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                                            <ImageIcon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h5 className="font-bold text-slate-800">Automated Image Generation</h5>
                                            <p className="text-xs text-slate-500">Generates diagrams for anatomical queries.</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" checked={autoImage} onChange={e => setAutoImage(e.target.checked)} className="sr-only peer" />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                                    </label>
                                </div>
                                <div className="text-xs bg-white p-3 rounded border border-slate-200 text-slate-600">
                                    Uses <strong>{aiSettings.models.image}</strong>. Low latency. Best for static diagrams (e.g., "Show me the human heart").
                                </div>
                             </div>

                             <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                                            <Video className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h5 className="font-bold text-slate-800">Educational Video Agent</h5>
                                            <p className="text-xs text-slate-500">Generates short animations for complex topics.</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" checked={autoVideo} onChange={e => setAutoVideo(e.target.checked)} className="sr-only peer" />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                                    </label>
                                </div>
                                <div className="text-xs bg-white p-3 rounded border border-slate-200 text-slate-600">
                                    Uses <strong>{aiSettings.models.video}</strong>. High latency (~60s). Ideal for explaining processes (e.g., "How does the heart pump blood?").
                                </div>
                             </div>
                        </div>
                    </div>
                )}

                {activeTab === 'telephony' && (
                    <div className="space-y-6 animate-in fade-in">
                         <div className="flex justify-between items-center">
                            <div>
                                <h4 className="font-bold text-slate-800">Telephony Integration (Twilio)</h4>
                                <p className="text-sm text-slate-500">Configure backend webhooks for voice & SMS handling.</p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={runSimulation} className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-bold rounded-lg flex items-center gap-2 hover:bg-slate-200">
                                    <Play className="w-4 h-4" /> Test Simulation
                                </button>
                                <button onClick={handleSave} className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg flex items-center gap-2 hover:bg-blue-700">
                                    <Save className="w-4 h-4" /> Save Config
                                </button>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Twilio Account SID</label>
                                    <input 
                                        type="password"
                                        value={twilioConfig.accountSid}
                                        onChange={(e) => setTwilioConfig({...twilioConfig, accountSid: e.target.value})}
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:border-primary outline-none font-mono text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Auth Token</label>
                                    <input 
                                        type="password"
                                        value={twilioConfig.authToken}
                                        onChange={(e) => setTwilioConfig({...twilioConfig, authToken: e.target.value})}
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:border-primary outline-none font-mono text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Phone Number</label>
                                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-3">
                                        <Phone className="w-4 h-4 text-slate-400" />
                                        <input 
                                            type="text"
                                            value={twilioConfig.phoneNumber}
                                            onChange={(e) => setTwilioConfig({...twilioConfig, phoneNumber: e.target.value})}
                                            className="flex-1 bg-transparent outline-none font-mono text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                    <h5 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                                        <Settings className="w-4 h-4" /> Webhook Configuration
                                    </h5>
                                    <p className="text-sm text-blue-800 mb-4">
                                        Point your Twilio Voice Request URL to this endpoint to enable the AI Receptionist.
                                    </p>
                                    <div className="bg-white p-3 rounded-lg border border-blue-200 font-mono text-xs text-slate-600 break-all">
                                        {twilioConfig.webhookUrl || 'https://api.practizone.local/webhooks/twilio'}
                                    </div>
                                    <div className="mt-4 flex gap-2">
                                        <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded uppercase">Active</span>
                                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold rounded uppercase">Voice Capable</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'knowledge' && (
                    <div className="space-y-6 animate-in fade-in">
                         <div className="flex justify-between items-center">
                            <div>
                                <h4 className="font-bold text-slate-800">Knowledge Base (RAG)</h4>
                                <p className="text-sm text-slate-500">Documents indexed for AI retrieval.</p>
                            </div>
                            <div>
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    onChange={handleFileUpload}
                                    className="hidden" 
                                    accept=".pdf,.docx,.txt"
                                />
                                <button 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-bold rounded-lg flex items-center gap-2 hover:bg-slate-200 border border-slate-200"
                                >
                                    <Plus className="w-4 h-4" /> Upload Document
                                </button>
                            </div>
                        </div>
                        <div className="border rounded-lg overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600">
                                    <tr>
                                        <th className="p-4">Document Name</th>
                                        <th className="p-4">Type</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {docs.map(doc => (
                                        <tr key={doc.id} className="hover:bg-slate-50">
                                            <td className="p-4 font-bold text-slate-700 flex items-center gap-2">
                                                <FileText className="w-4 h-4 text-slate-400" /> {doc.name}
                                            </td>
                                            <td className="p-4 text-slate-500">{doc.type.split('/')[1] || 'doc'}</td>
                                            <td className="p-4">
                                                {doc.status === 'processing' ? (
                                                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full flex items-center gap-1 w-fit">
                                                        <Loader2 className="w-3 h-3 animate-spin" /> Processing
                                                    </span>
                                                ) : (
                                                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full flex items-center gap-1 w-fit">
                                                        <CheckCircle className="w-3 h-3" /> Indexed
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-4 text-right">
                                                <button className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {docs.length === 0 && (
                                <div className="p-8 text-center text-slate-400">
                                    <Upload className="w-10 h-10 mx-auto mb-2 opacity-20" />
                                    <p>No documents found. Upload a PDF or DOCX to get started.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'logs' && (
                    <div className="space-y-6 animate-in fade-in">
                         <div>
                            <h4 className="font-bold text-slate-800">Interaction Logs</h4>
                            <p className="text-sm text-slate-500">Recent user queries handled by the model.</p>
                        </div>
                        <div className="space-y-2">
                            {logs.map(log => (
                                <div key={log.id} className="p-4 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-slate-200">
                                            <MessageSquare className="w-5 h-5 text-slate-400" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-700">{log.query}</p>
                                            <p className="text-xs text-slate-500">{log.user} • {log.timestamp}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded border border-green-100">
                                        {log.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AiConsole;