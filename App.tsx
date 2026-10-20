import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useUserStore } from './stores/useUserStore';

// Pages
import Splash from './pages/Splash';
import Onboarding from './pages/Onboarding';
import Login from './pages/Login';
import Home from './pages/Home';
import StoreList from './pages/StoreList';
import Catalog from './pages/Catalog';
import Cart from './pages/Cart';
import Fidelity from './pages/Fidelity';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import { HoumaPage } from './pages/Houma';

// Components
import { PWAUpdateNotification } from './components/PWAUpdateNotification';
import { PWAOfflineIndicator } from './components/PWAOfflineIndicator';

const App: React.FC = () => {
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();

  // Garde de sécurité (Redirection si non connecté)
  useEffect(() => {
    const publicPaths = ['/', '/onboarding', '/login'];
    if (!user && !publicPaths.includes(location.pathname)) {
      navigate('/login');
    }
    // Redirection Commerçant vers son Dashboard
    if (user?.role === 'STORE' && location.pathname === '/home') {
      navigate('/dashboard');
    }
  }, [user, location.pathname, navigate]);

  return (
    <div className={`w-full min-h-screen flex flex-col items-center transition-colors duration-300 ${user?.theme === 'dark' ? 'bg-[#0a0a0a]' : 'bg-gray-50'}`}>
      <div className={`w-full md:max-w-7xl md:min-h-screen flex flex-col relative overflow-hidden shadow-2xl ${user?.theme === 'dark' ? 'bg-[#121212] text-white' : 'bg-white'}`}>
        
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/stores" element={<StoreList />} />
          <Route path="/store/:id" element={<Catalog />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/fidelity" element={<Fidelity />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/houma" element={<HoumaPage />} />
        </Routes>

        <PWAUpdateNotification />
        <PWAOfflineIndicator />
      </div>
    </div>
  );
};

export default App;
