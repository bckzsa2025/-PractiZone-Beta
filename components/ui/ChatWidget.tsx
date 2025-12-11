
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, Image as ImageIcon, Video, Paperclip, Loader2, Maximize2, Minimize2, Mic, MicOff, Volume2, Globe, AlertCircle, PlayCircle, ExternalLink, Search, Brain, Stethoscope, Bot, PhoneOff, RefreshCw } from 'lucide-react';
import { AIMessage } from '../../types';
import { generateImage, generateMedicalVideo, chatWithGemini } from '../../services/ai';
import { useLiveSession } from '../../hooks/useLiveSession';

// Custom Logo Component for Nurse 🧠Beate-Ai™
const BeateAiLogo = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
  const dim = size === "sm" ? "w-8 h-8" : size === "lg" ? "w-16 h-16" : "w-10 h-10";
  const iconSize = size === "sm" ? "w-4 h-4" : size === "lg" ? "w-8 h-8" : "w-6 h-6";
  const badgeSize = size === "sm" ? "w-3 h-3" : size === "lg" ? "w-5 h-5" : "w-4 h-4";

  return (
    <div className={`relative ${dim} flex items-center justify-center shrink-0`}>
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-full animate-pulse"></div>
      <div className="relative z-10 bg-white rounded-full p-1.5 shadow-sm border border-primary/10 flex items-center justify-center h-full w-full">
         <Brain className={`${iconSize} text-primary`} />
      </div>
      <div className="absolute -bottom-0.5 -right-0.5 bg-white rounded-full p-0.5 shadow border border-slate-100 flex items-center justify-center">
          <Stethoscope className={`${badgeSize} text-red-500`} />
      </div>
    </div>
  );
};

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState('');
  
  // Load initial messages from localStorage or use default
  const [messages, setMessages] = useState<AIMessage[]>(() => {
      if (typeof window !== 'undefined') {
          const saved = localStorage.getItem('chat_history');
          if (saved) {
              try {
                  return JSON.parse(saved);
              } catch (e) {
                  console.error("Failed to parse chat history", e);
              }
          }
      }
      return [
          { id: 'welcome', role: 'assistant', content: 'Hello! I am Nurse 🧠Beate-Ai™, Dr. Setzer\'s intelligent assistant. I can help you find information, explain medical terms, or guide you to booking. How can I assist you today?', timestamp: Date.now() }
      ];
  });

  const [isTyping, setIsTyping] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lastUserMessage, setLastUserMessage] = useState<{text: string, mode?: 'standard' | 'visual'} | null>(null);
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Live API Hooks
  const { isConnected, isSpeaking, error: liveError, startSession, stopSession } = useLiveSession();
  const [voiceMode, setVoiceMode] = useState(false);

  // Persist messages to localStorage
  useEffect(() => {
      localStorage.setItem('chat_history', JSON.stringify(messages));
  }, [messages]);

  const scrollToBottom = () => {
    // Only scroll if not actively searching to avoid jumping
    if (!searchQuery) {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, voiceMode, errorMsg, searchQuery]);

  const handleSend = async (overrideInput?: string, mode?: 'standard' | 'visual') => {
    const textToSend = overrideInput || input;
    if (!textToSend.trim()) return;

    setErrorMsg(null);
    const userMsg: AIMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: textToSend,
        timestamp: Date.now()
    };

    // Store for retry functionality
    setLastUserMessage({ text: textToSend, mode });

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    
    // Close search if sending a new message
    if (isSearchOpen) {
        setIsSearchOpen(false);
        setSearchQuery('');
    }

    try {
        // Detect intent
        const isImageRequest = /draw|generate image|create a picture|sketch/i.test(textToSend);
        const isVideoRequest = /video|animation|animate|show me how/i.test(textToSend);

        if (mode === 'visual' || isVideoRequest) {
             // Advanced Agentic RAG: Generate Video
             // 1. Acknowledge
             setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: 'assistant',
                content: "I'm generating a medical animation to explain this concept. This may take a minute...",
                timestamp: Date.now()
             }]);
             
             // 2. Generate Video
             const videoUrl = await generateMedicalVideo(textToSend);
             
             if (videoUrl) {
                 const aiMsg: AIMessage = {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: "Here is a generated animation illustrating the concept:",
                    timestamp: Date.now(),
                    attachments: [{ type: 'video', url: videoUrl }]
                 };
                 setMessages(prev => [...prev, aiMsg]);
             } else {
                 throw new Error("Video generation failed or timed out.");
             }

        } else if (isImageRequest) {
           const imageUrl = await generateImage(textToSend);
           if (imageUrl) {
             const aiMsg: AIMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: "Here is the visual you requested:",
                timestamp: Date.now(),
                attachments: [{ type: 'image', url: imageUrl }]
             };
             setMessages(prev => [...prev, aiMsg]);
           } else {
             throw new Error("Failed to generate image");
           }
        } else {
           // Standard Text Chat with Search Grounding
           // Using client-side service directly to avoid "Failed to fetch" from missing backend
           const { text, sources } = await chatWithGemini(textToSend);
           
           const aiMsg: AIMessage = {
              id: (Date.now() + 1).toString(),
              role: 'assistant',
              content: text,
              timestamp: Date.now(),
              sources: sources
           };
           setMessages(prev => [...prev, aiMsg]);
        }

    } catch (err: any) {
        console.error(err);
        const isNetworkError = err.message.includes('fetch') || err.message.includes('network');
        setErrorMsg(isNetworkError ? "AI is currently unavailable. Please check your internet connection." : "I encountered an issue processing your request.");
        
        // Don't add a chat bubble for system errors, keep the error banner active
    } finally {
        setIsTyping(false);
    }
  };

  const handleRetry = () => {
      if (lastUserMessage) {
          // Remove the last user message from UI to prevent duplication visually, 
          // or just re-send. Let's just re-send logic but keep history.
          // Actually, handleSend adds the user message again. 
          // Ideally we want to just re-trigger the AI response for the LAST user message.
          // For simplicity in this UI, we will just call handleSend with the text.
          handleSend(lastUserMessage.text, lastUserMessage.mode);
      }
  };

  const toggleVoiceMode = () => {
    if (voiceMode) {
      stopSession();
      setVoiceMode(false);
    } else {
      setVoiceMode(true);
      startSession();
    }
  };

  // Filter messages based on search query
  const filteredMessages = messages.filter(msg => 
      msg.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) {
    return (
        <button 
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-40 bg-primary hover:bg-blue-700 text-white rounded-full p-4 shadow-xl flex items-center gap-3 transition-all hover:scale-105 group"
        >
            <div className="relative">
                <BeateAiLogo size="sm" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
            </div>
            <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 font-bold whitespace-nowrap">Ask Nurse 🧠Beate-Ai™</span>
        </button>
    );
  }

  return (
    <div className={`fixed z-50 bg-white shadow-2xl rounded-2xl overflow-hidden flex flex-col transition-all duration-300 border border-slate-200 ${isExpanded ? 'inset-4 md:inset-20' : 'bottom-6 right-6 w-96 h-[600px]'}`}>
        
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-secondary p-4 flex justify-between items-center text-white shrink-0">
            <div className="flex items-center gap-3">
                <div className="bg-white/10 rounded-full p-0.5 backdrop-blur-sm">
                    <BeateAiLogo size="sm" />
                </div>
                <div>
                    <h3 className="font-bold text-sm">Nurse 🧠Beate-Ai™</h3>
                    <p className="text-[10px] text-white/80 flex items-center gap-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-400' : 'bg-slate-300'}`}></span> 
                        {isConnected ? 'Live Audio' : 'Virtual Assistant'}
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                {!voiceMode && (
                    <button 
                        onClick={() => setIsSearchOpen(!isSearchOpen)} 
                        className={`p-1.5 rounded transition-colors ${isSearchOpen ? 'bg-white/20 text-white' : 'hover:bg-white/10 text-white'}`}
                        title="Search Conversation"
                    >
                        <Search className="w-4 h-4" />
                    </button>
                )}
                <button onClick={() => setIsExpanded(!isExpanded)} className="p-1.5 hover:bg-white/10 rounded transition-colors">
                    {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                <button onClick={() => { setIsOpen(false); if(voiceMode) toggleVoiceMode(); }} className="p-1.5 hover:bg-white/10 rounded transition-colors">
                    <X className="w-5 h-5" />
                </button>
            </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && !voiceMode && (
            <div className="bg-white p-2 border-b border-slate-100 flex items-center gap-2 animate-in slide-in-from-top-2 shrink-0">
                <Search className="w-4 h-4 text-slate-400" />
                <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search conversation history..." 
                    className="flex-1 text-xs outline-none text-slate-700 bg-transparent placeholder:text-slate-400"
                    autoFocus
                />
                {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-600">
                        <X className="w-3 h-3" />
                    </button>
                )}
            </div>
        )}

        {/* Disclaimer Banner */}
        <div className="bg-amber-50 p-2 text-center text-[10px] text-amber-800 font-bold border-b border-amber-100 shrink-0">
            NOT MEDICAL ADVICE. ILLUSTRATIVE PURPOSES ONLY.
        </div>

        {/* Error Banner */}
        {errorMsg && (
            <div className="bg-red-50 p-3 flex items-center gap-3 text-red-700 text-xs border-b border-red-100 shrink-0 animate-in slide-in-from-top-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span className="font-bold flex-1">{errorMsg}</span>
                {lastUserMessage && (
                    <button 
                        onClick={handleRetry} 
                        className="flex items-center gap-1 bg-red-100 hover:bg-red-200 text-red-800 px-2 py-1 rounded text-[10px] font-bold transition-colors"
                    >
                        <RefreshCw className="w-3 h-3" /> Retry
                    </button>
                )}
                <button onClick={() => setErrorMsg(null)}><X className="w-3 h-3" /></button>
            </div>
        )}

        {/* Content Area */}
        {voiceMode ? (
            <div className="flex-1 flex flex-col items-center justify-center bg-slate-900 text-white p-8 relative overflow-hidden">
                
                {/* Visualizer Background */}
                {isConnected && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                         <div className={`w-64 h-64 border border-primary/30 rounded-full animate-[ping_3s_linear_infinite] ${isSpeaking ? 'duration-[1s]' : 'duration-[3s]'}`}></div>
                         <div className={`w-48 h-48 border border-primary/40 rounded-full absolute animate-[ping_3s_linear_infinite] delay-700 ${isSpeaking ? 'duration-[1s]' : 'duration-[3s]'}`}></div>
                         <div className={`w-32 h-32 border border-primary/50 rounded-full absolute animate-[ping_3s_linear_infinite] delay-1000 ${isSpeaking ? 'duration-[1s]' : 'duration-[3s]'}`}></div>
                    </div>
                )}

                {/* Avatar / Status */}
                <div className={`relative z-10 w-32 h-32 rounded-full flex items-center justify-center mb-8 transition-all duration-500 border-4 ${isSpeaking ? 'border-primary shadow-[0_0_50px_rgba(59,130,246,0.6)] scale-110' : isConnected ? 'border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)]' : 'border-slate-700'}`}>
                    <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center overflow-hidden">
                         <Mic className={`w-12 h-12 ${isSpeaking ? 'text-primary animate-pulse' : isConnected ? 'text-green-500' : 'text-slate-500'}`} />
                    </div>
                </div>
                
                <h3 className="relative z-10 text-2xl font-bold font-display mb-2 text-center">
                    {isConnected ? (isSpeaking ? "Speaking..." : "Listening") : "Connecting..."}
                </h3>
                <p className="text-slate-400 text-sm text-center max-w-xs relative z-10">
                    {isConnected ? "Go ahead, I'm listening." : "Establishing secure voice channel..."}
                </p>
                
                {liveError && (
                    <div className="relative z-10 mt-4 px-4 py-2 bg-red-500/20 border border-red-500/50 text-red-200 rounded-full text-xs font-bold flex items-center gap-2 animate-pulse">
                        <AlertCircle className="w-4 h-4" />
                        {liveError}
                    </div>
                )}

                {/* Controls */}
                <div className="relative z-10 flex items-center gap-6 mt-12">
                    <button 
                        onClick={toggleVoiceMode}
                        className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-xl hover:scale-105 transition-all group"
                        title="End Voice Session"
                    >
                        <PhoneOff className="w-7 h-7 fill-current" />
                    </button>
                    <button 
                        onClick={toggleVoiceMode}
                        className="px-6 py-3 rounded-full bg-slate-800 border border-slate-700 hover:bg-slate-700 text-white font-bold text-sm transition-all shadow-lg"
                    >
                        Switch to Text
                    </button>
                </div>
            </div>
        ) : (
            <>
                {/* Text Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                    {filteredMessages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-2 opacity-50">
                            <BeateAiLogo size="lg" />
                            <p className="text-xs">No matching messages found</p>
                        </div>
                    ) : (
                        filteredMessages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.role === 'assistant' && (
                                    <div className="mr-2 hidden sm:block">
                                         <BeateAiLogo size="sm" />
                                    </div>
                                )}
                                <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${msg.role === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-white text-slate-700 rounded-bl-none border border-slate-100'}`}>
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                    
                                    {msg.attachments && msg.attachments.length > 0 && (
                                        <div className="mt-3 space-y-2">
                                            {msg.attachments.map((att, idx) => (
                                                <div key={idx} className="rounded-lg overflow-hidden border border-slate-200 bg-black/5">
                                                    {att.type === 'image' && (
                                                        <img src={att.url} alt="AI Generated" className="w-full h-auto" />
                                                    )}
                                                    {att.type === 'video' && (
                                                        <div className="relative w-full aspect-video bg-black flex items-center justify-center">
                                                            <video controls src={att.url} className="w-full h-full" />
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Grounding Sources */}
                                    {msg.sources && msg.sources.length > 0 && (
                                        <div className="mt-3 pt-3 border-t border-slate-100">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-2 flex items-center gap-1">
                                                <Globe className="w-3 h-3" /> Sources
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {msg.sources.map((source, idx) => (
                                                    <a 
                                                        key={idx} 
                                                        href={source.uri} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 hover:bg-white hover:border-primary/30 hover:text-primary text-slate-600 text-[10px] font-medium rounded-full transition-all max-w-full group"
                                                    >
                                                        <span className="truncate max-w-[150px]">{source.title}</span>
                                                        <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100" />
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    <span className="text-[10px] opacity-50 mt-1 block text-right">{new Date(msg.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                                </div>
                            </div>
                        ))
                    )}
                    {isTyping && !searchQuery && (
                        <div className="flex justify-start">
                             <div className="mr-2 hidden sm:block">
                                <BeateAiLogo size="sm" />
                            </div>
                            <div className="bg-white rounded-2xl rounded-bl-none p-3 border border-slate-100 shadow-sm flex items-center gap-2">
                                <div className="flex gap-1">
                                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-100"></span>
                                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-200"></span>
                                </div>
                                <span className="text-xs text-slate-400 font-medium animate-pulse">Thinking...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-3 bg-white border-t border-slate-100 shrink-0 space-y-2">
                    {/* Action Bar */}
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                         <button 
                            onClick={() => handleSend("Explain with visuals", "visual")}
                            className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-full whitespace-nowrap hover:bg-blue-100 flex items-center gap-1 border border-blue-200"
                        >
                            <Video className="w-3 h-3" /> Explain with Animation
                        </button>
                        <button 
                            onClick={() => handleSend("Show me an anatomical diagram", "standard")}
                            className="px-3 py-1.5 bg-purple-50 text-purple-700 text-xs font-bold rounded-full whitespace-nowrap hover:bg-purple-100 flex items-center gap-1 border border-purple-200"
                        >
                            <ImageIcon className="w-3 h-3" /> Diagram
                        </button>
                    </div>

                    <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
                        <button onClick={toggleVoiceMode} className="p-2 text-slate-400 hover:text-primary transition-colors" title="Start Voice Mode">
                            <Mic className="w-5 h-5" />
                        </button>
                        <input 
                            type="text" 
                            value={input}
                            onChange={e => {
                                setInput(e.target.value);
                                if (errorMsg) setErrorMsg(null);
                            }}
                            onKeyDown={e => e.key === 'Enter' && !isTyping && handleSend()}
                            placeholder="Ask Nurse 🧠Beate-Ai™ a question..."
                            className="flex-1 bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400"
                        />
                        <button 
                            onClick={() => handleSend()}
                            disabled={!input.trim() || isTyping}
                            className="p-2 bg-primary text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-primary transition-colors"
                        >
                            {isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
            </>
        )}
    </div>
  );
};

export default ChatWidget;
