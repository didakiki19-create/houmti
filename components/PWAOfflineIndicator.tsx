import React, { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';

export const PWAOfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[90] animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="flex items-center space-x-2.5 px-4 py-2 rounded-full bg-amber-500 text-white shadow-xl text-xs font-bold border border-amber-400">
        <WifiOff size={16} className="animate-pulse" />
        <span>Mode Hors-ligne — Consultation des données locales actives</span>
      </div>
    </div>
  );
};
