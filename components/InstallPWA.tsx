import React, { useState } from 'react';
import { Download, CheckCircle, Smartphone, Monitor, Sparkles } from 'lucide-react';
import { usePWAInstall } from '../services/usePWAInstall';
import { PWAInstallModal } from './PWAInstallModal';

interface InstallPWAProps {
  variant?: 'button' | 'card' | 'minimal';
  className?: string;
}

export const InstallPWA: React.FC<InstallPWAProps> = ({ variant = 'button', className = '' }) => {
  const { isInstallable, isInstalled, isStandalone, platform, install } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);
  const [justInstalled, setJustInstalled] = useState(false);

  // Si déjà en mode standalone plein écran, afficher un indicateur discret ou rien
  if (isStandalone || isInstalled) {
    if (variant === 'card') {
      return (
        <div className={`p-6 rounded-[32px] bg-emerald-500/10 border border-emerald-500/20 text-primary flex items-center justify-between ${className}`}>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
              <CheckCircle size={24} />
            </div>
            <div>
              <p className="font-black text-sm tracking-tight">Hoomty est installée</p>
              <p className="text-[11px] opacity-75 font-medium">Application active en mode natif</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-primary/20 rounded-full text-[10px] font-black uppercase tracking-wider">
            Actif
          </span>
        </div>
      );
    }
    return null;
  }

  const handleAction = async () => {
    if (isInstallable) {
      const success = await install();
      if (success) {
        setJustInstalled(true);
      }
    } else {
      // Si le prompt natif n'est pas encore armé ou sur iOS / Edge menu, ouvrir le modal guidé
      setShowModal(true);
    }
  };

  if (justInstalled) {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500/10 text-primary text-xs font-bold border border-emerald-500/20">
        <CheckCircle size={16} />
        <span>Installation réussie !</span>
      </div>
    );
  }

  // Variant "card" pour le profil ou la page d'accueil
  if (variant === 'card') {
    return (
      <>
        <div className={`relative group overflow-hidden rounded-[35px] border border-primary/20 p-6 bg-gradient-to-br from-emerald-500/10 via-white dark:via-slate-900 to-primary/5 shadow-xl transition-all ${className}`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/30 shrink-0">
                {platform === 'windows' ? <Monitor size={28} /> : <Smartphone size={28} />}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-black uppercase tracking-widest text-primary">PWA Officielle</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-primary/10 text-primary">
                    <Sparkles size={10} className="mr-1" /> Rapide & Hors-ligne
                  </span>
                </div>
                <h4 className="font-black text-lg text-slate-900 dark:text-white tracking-tight mt-0.5">
                  Installer l'application Hoomty
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {platform === 'windows' 
                    ? 'Fenêtre dédiée sur PC Windows, icône Bureau & barre des tâches' 
                    : 'Accès 1 clic sur votre écran d\'accueil sans navigateur'}
                </p>
              </div>
            </div>

            <button
              onClick={handleAction}
              className="w-full sm:w-auto px-6 py-3.5 bg-primary hover:bg-emerald-600 active:scale-95 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 flex items-center justify-center space-x-2 transition-all shrink-0"
            >
              <Download size={16} />
              <span>Installer Hoomty</span>
            </button>
          </div>
        </div>

        <PWAInstallModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          platform={platform}
          onInstall={install}
          canPromptNatively={isInstallable}
        />
      </>
    );
  }

  // Variant "minimal" pour la barre d'en-tête
  if (variant === 'minimal') {
    return (
      <>
        <button
          onClick={handleAction}
          className={`flex items-center space-x-1.5 px-3 py-2 rounded-2xl bg-primary/10 hover:bg-primary/20 text-primary font-black text-xs transition-all border border-primary/20 ${className}`}
          title="Installer l'application Hoomty"
        >
          <Download size={14} />
          <span className="hidden sm:inline">Installer</span>
        </button>

        <PWAInstallModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          platform={platform}
          onInstall={install}
          canPromptNatively={isInstallable}
        />
      </>
    );
  }

  // Variant standard "button"
  return (
    <>
      <button
        onClick={handleAction}
        className={`px-5 py-2.5 bg-primary hover:bg-emerald-600 active:scale-95 text-white rounded-2xl font-black text-xs uppercase tracking-wider shadow-md shadow-primary/20 flex items-center justify-center space-x-2 transition-all ${className}`}
      >
        <Download size={16} />
        <span>Installer Hoomty</span>
      </button>

      <PWAInstallModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        platform={platform}
        onInstall={install}
        canPromptNatively={isInstallable}
      />
    </>
  );
};
