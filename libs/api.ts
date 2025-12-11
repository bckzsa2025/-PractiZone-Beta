
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * 🧠 PRACTIZONE™© PRM - API CLIENT ADAPTER
 * 
 * Connected Mode: Calls the FastAPI Backend.
 * Virtual Mode: Fallback to LocalStorage if backend is unreachable.
 */

import { User, Appointment, AppointmentCreate, TwilioConfig, AISettings } from '../types';

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8000';

class ApiClient {
  private token: string | null = localStorage.getItem('access_token');

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('access_token', token);
  }

  getToken() {
    return localStorage.getItem('access_token');
  }

  logout() {
    this.token = null;
    localStorage.removeItem('access_token');
    window.location.reload();
  }

  private async fetch(endpoint: string, options: RequestInit = {}) {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers as any,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            ...options,
            headers,
        });

        if (response.status === 401) {
            this.logout();
            throw new Error("Unauthorized");
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || 'API Request Failed');
        }

        return await response.json();
    } catch (error) {
        console.warn(`[API] Connection to ${endpoint} failed. Switching to Virtual Backend.`);
        return this.virtualBackend(endpoint, options);
    }
  }

  /**
   * Virtual Backend Simulation
   * Handles requests when the real server is offline.
   */
  private async virtualBackend(endpoint: string, options: RequestInit): Promise<any> {
      await new Promise(r => setTimeout(r, 600)); // Simulate network latency

      // --- AUTH ---
      if (endpoint === '/auth/login' || endpoint.includes('/auth/token')) {
          let email = "guest@practizone.com";
          if (options.body) {
             try {
                 const body = JSON.parse(options.body as string);
                 email = body.email || email;
             } catch(e) {
                 // For form data body
                 if (typeof options.body === 'string' && options.body.includes('username=')) {
                     const match = options.body.match(/username=([^&]*)/);
                     if (match) email = decodeURIComponent(match[1]);
                 }
             }
          }
          
          this.setToken("virtual_token_" + Date.now());
          return {
              id: 'u_' + Math.random().toString(36).substr(2, 5),
              name: email.split('@')[0],
              email: email,
              role: email.includes('admin') || email.includes('dev') ? (email.includes('dev') ? 'developer' : 'admin') : 'patient',
              medicalSummary: { conditions: ['Healthy'], allergies: [] }
          };
      }

      if (endpoint === '/auth/register') {
          const body = JSON.parse(options.body as string);
          this.setToken("virtual_token_" + Date.now());
          return { ...body, id: 'u_' + Date.now(), role: 'patient' };
      }

      // --- APPOINTMENTS ---
      if (endpoint === '/appointments') {
          const stored = localStorage.getItem('dr_setzer_appointments');
          const appts = stored ? JSON.parse(stored) : [];

          if (options.method === 'POST') {
              const body = JSON.parse(options.body as string);
              const newAppt = { 
                  ...body, 
                  id: Date.now().toString(), 
                  status: 'confirmed',
                  date: body.start // Map start to date for frontend compatibility
              };
              appts.push(newAppt);
              localStorage.setItem('dr_setzer_appointments', JSON.stringify(appts));
              return newAppt;
          }
          return appts;
      }

      // --- PATIENTS ---
      if (endpoint.startsWith('/patients/')) {
          if (options.method === 'PUT') {
              const body = JSON.parse(options.body as string);
              // In a real app we'd update a specific user, here we just echo back
              return body;
          }
          // Mock Profile Get
          return { 
              id: 'p_123', 
              name: 'Virtual Patient', 
              email: 'patient@demo.com', 
              role: 'patient',
              phone: '072 123 4567',
              medicalSummary: { allergies: ['None'], conditions: ['None'] }
          };
      }

      // --- AI ---
      if (endpoint === '/ai/chat') {
          return { 
              reply: "I am running in Offline Mode. I can answer general questions about practice hours (Mon-Fri 9-4) and location (Milnerton), but I cannot access real-time medical databases right now.",
              sources: []
          };
      }

      // --- SETTINGS ---
      if (endpoint === '/integrations/twilio') {
          const saved = localStorage.getItem('twilio_config');
          if (options.method === 'POST') {
              localStorage.setItem('twilio_config', options.body as string);
              return JSON.parse(options.body as string);
          }
          return saved ? JSON.parse(saved) : { accountSid: '', authToken: '', phoneNumber: '', webhookUrl: '' };
      }

      if (endpoint === '/settings/ai') {
           const saved = localStorage.getItem('ai_settings');
           if (options.method === 'POST') {
               localStorage.setItem('ai_settings', options.body as string);
               return JSON.parse(options.body as string);
           }
           if (saved) return JSON.parse(saved);
           
           return {
                provider: 'google',
                apiKey: '', // UI will fall back to ENV
                models: {
                    chat: 'gemini-2.5-flash',
                    image: 'gemini-2.5-flash-image',
                    video: 'veo-3.1-fast-generate-preview',
                    audio: 'gemini-2.5-flash-native-audio-preview-09-2025'
                }
           };
      }

      return {};
  }

  // --- Auth Module ---
  auth = {
    login: async (email: string): Promise<User> => {
      try {
        const formData = new URLSearchParams();
        formData.append('username', email);
        formData.append('password', 'password');

        // Try Real Backend First
        const res = await fetch(`${API_BASE}/auth/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData
        });
        
        if (!res.ok) throw new Error("Login failed");
        
        const data = await res.json();
        this.setToken(data.access_token);
        
        return {
            id: 'user_real', 
            name: email.split('@')[0], 
            email: email, 
            role: email.includes('admin') || email.includes('dev') ? (email.includes('dev') ? 'developer' : 'admin') : 'patient'
        };
      } catch (e) {
          // Fallback to Virtual Backend
          return this.virtualBackend('/auth/login', { 
              method: 'POST', 
              body: JSON.stringify({ email }) 
          });
      }
    },

    register: async (data: any): Promise<User> => {
      return this.fetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    }
  };

  // --- Appointments Module ---
  appointments = {
    list: async (patientId: string): Promise<Appointment[]> => {
      return this.fetch('/appointments'); 
    },

    create: async (data: AppointmentCreate): Promise<Appointment> => {
      return this.fetch('/appointments', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    }
  };
  
  // --- Patient Module ---
  patients = {
    get: async (id: string): Promise<User> => {
      return this.fetch(`/patients/${id}`); 
    },
    update: async (user: User): Promise<User> => {
        return this.fetch(`/patients/${user.id}`, {
            method: 'PUT',
            body: JSON.stringify(user)
        }); 
    }
  };

  // --- AI Module ---
  ai = {
    chat: async (message: string): Promise<{ reply: string; sources?: any[] }> => {
      return this.fetch('/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ message }),
      });
    }
  };

  // --- Integrations / Settings Module ---
  settings = {
    getTwilioConfig: async (): Promise<TwilioConfig> => {
      return this.fetch('/integrations/twilio');
    },
    saveTwilioConfig: async (config: TwilioConfig): Promise<TwilioConfig> => {
      return this.fetch('/integrations/twilio', {
        method: 'POST',
        body: JSON.stringify(config),
      });
    },
    getAI: async (): Promise<AISettings> => {
       return this.fetch('/settings/ai');
    },
    saveAI: async (settings: AISettings): Promise<AISettings> => {
      return this.fetch('/settings/ai', {
          method: 'POST',
          body: JSON.stringify(settings)
      });
    }
  };

  // --- Webhooks (Server-Side Now) ---
  webhooks = {
    twilio: {
      voice: async (transcript: string) => {
        console.log("Voice simulation sent to virtual backend");
        return `
        <?xml version="1.0" encoding="UTF-8"?>
        <Response>
            <Say>Hello! This is Dr. Setzer's virtual assistant. The backend is currently offline, but I received your message: ${transcript}</Say>
        </Response>
        `;
      },
      sms: async (body: string) => {
        return "Backend handling SMS (Virtual Mode)...";
      }
    }
  };
}

export const apiClient = new ApiClient();
