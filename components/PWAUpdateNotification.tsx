import React from 'react';
import { RefreshCw, CheckCircle2, X } from 'lucide-react';
import { useRegisterSW } from 'virtual:pwa-register/react';

export const PWAUpdateNotification: React.FC = () => {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      if (r) {
        // Vérification périodique des mises à jour toutes les heures
        setInterval(() => {
          r.update();
        }, 60 * 60 * 1000);
      }
    },
    onRegisterError(error) {
      console.warn('PWA Service Worker registration error:', error);
    },
  });

  const closeOffline = () => {
    setOfflineReady(false);
  };

  const closeRefresh = () => {
    setNeedRefresh(false);
  };

  if (!needRefresh && !offlineReady) {
    return null;
  }

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 left-4 md:left-auto md:max-w-md z-[100] animate-in slide-in-from-bottom-5 duration-300">
      {needRefresh && (
        <div className="p-4 rounded-[24px] bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-2xl border border-white/10 dark:border-black/10 flex items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center shrink-0 shadow-md shadow-primary/30">
              <RefreshCw size={18} className="animate-spin" />
            </div>
            <div>
              <p className="font-black text-xs uppercase tracking-wider text-primary">Mise à jour Hoomty</p>
              <p className="text-xs font-semibold leading-tight mt-0.5">Une nouvelle version est disponible.</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => updateServiceWorker(true)}
              className="px-4 py-2 bg-primary hover:bg-emerald-600 active:scale-95 text-white rounded-xl font-bold text-xs shadow-md transition-all"
            >
              Actualiser
            </button>
            <button
              onClick={closeRefresh}
              className="w-8 h-8 rounded-xl bg-white/10 dark:bg-black/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              title="Fermer"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {offlineReady && !needRefresh && (
        <div className="p-4 rounded-[24px] bg-emerald-600 text-white shadow-2xl flex items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <CheckCircle2 size={20} className="text-white shrink-0" />
            <p className="text-xs font-bold leading-tight">Hoomty est prête pour une utilisation hors-ligne !</p>
          </div>
          <button
            onClick={closeOffline}
            className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors shrink-0"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
};
