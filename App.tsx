
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useEffect } from 'react';
import Home from './routes/Home';
import Dashboard from './routes/Patient/Dashboard';
import Login from './routes/Auth/Login';
import AdminDashboard from './routes/Admin/AdminDashboard';
import DeveloperConsole from './routes/Developer/DeveloperConsole';
import ChatWidget from './components/ui/ChatWidget';
import ConsentSplash from './components/ui/ConsentSplash';
import { User } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'login' | 'portal' | 'admin' | 'developer'>('home');
  const [user, setUser] = useState<User | null>(null);
  const [hasConsented, setHasConsented] = useState(false);

  // Check initial consent status
  useEffect(() => {
    const consent = localStorage.getItem('dr_setzer_consent');
    if (consent) setHasConsented(true);
  }, []);

  const handleLoginSuccess = (userData: User) => {
      setUser(userData);
      if (userData.role === 'developer') {
          setView('developer');
      } else if (userData.role === 'admin' || userData.role === 'staff') {
          setView('admin');
      } else {
          setView('portal');
      }
  };

  const handleLogout = () => {
      setUser(null);
      setView('home');
  };

  return (
    <>
      <ConsentSplash onAccept={() => setHasConsented(true)} />

      {/* Main Views */}
      {view === 'home' && (
          <Home onLoginClick={() => setView('login')} />
      )}

      {view === 'login' && (
          <Login onLoginSuccess={handleLoginSuccess} />
      )}

      {view === 'portal' && user && (
          <Dashboard user={user} onLogout={handleLogout} />
      )}

      {view === 'admin' && user && (
          <AdminDashboard user={user} onLogout={handleLogout} />
      )}

      {view === 'developer' && user && (
          <DeveloperConsole user={user} onLogout={handleLogout} />
      )}

      {/* Global Persistent Chat Widget (only show if consented) */}
      {hasConsented && <ChatWidget />}
    </>
  );
};

export default App;
