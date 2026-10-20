import React from 'react';
import { X, Download, Smartphone, Monitor, CheckCircle, ArrowRight, Share2, PlusSquare } from 'lucide-react';
import { PlatformType } from '../services/usePWAInstall';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  platform: PlatformType;
  onInstall?: () => void;
  canPromptNatively?: boolean;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({
  isOpen,
  onClose,
  platform,
  onInstall,
  canPromptNatively = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[32px] p-6 md:p-8 shadow-2xl border border-black/10 dark:border-white/10 relative overflow-hidden text-slate-900 dark:text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header decoration */}
        <div className="flex items-center justify-between pb-4 border-b border-black/5 dark:border-white/5">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-md shadow-primary/10">
              <Download size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black tracking-tight">Installer Hoomty</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Application rapide & légère</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-center hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content based on Platform */}
        <div className="py-6 space-y-4">
          {/* Avantages PWA */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2.5 rounded-2xl bg-black/5 dark:bg-white/5">
              <span className="block text-primary font-black text-sm">0 Mo</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">Légère</span>
            </div>
            <div className="p-2.5 rounded-2xl bg-black/5 dark:bg-white/5">
              <span className="block text-primary font-black text-sm">Hors-ligne</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">Consultation</span>
            </div>
            <div className="p-2.5 rounded-2xl bg-black/5 dark:bg-white/5">
              <span className="block text-primary font-black text-sm">Plein Écran</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">Sans barre</span>
            </div>
          </div>

          {/* Guide spécifique Android */}
          {platform === 'android' && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-2.5">
              <div className="flex items-center space-x-2 text-primary font-bold text-xs">
                <Smartphone size={16} />
                <span>Instructions Android (Chrome / Brave / Samsung)</span>
              </div>
              <ol className="text-xs space-y-2 text-slate-600 dark:text-slate-300 list-decimal list-inside font-medium">
                <li>Cliquez sur le bouton <strong>« Installer maintenant »</strong> ci-dessous.</li>
                <li>Si le navigateur ne propose pas automatiquement la fenêtre, ouvrez le menu <strong>⋮ (3 points en haut à droite)</strong>.</li>
                <li>Appuyez sur <strong>« Installer l'application »</strong> ou <strong>« Ajouter à l'écran d'accueil »</strong>.</li>
              </ol>
            </div>
          )}

          {/* Guide spécifique Windows */}
          {platform === 'windows' && (
            <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 space-y-2.5">
              <div className="flex items-center space-x-2 text-blue-500 font-bold text-xs">
                <Monitor size={16} />
                <span>Instructions Windows (Microsoft Edge & Google Chrome)</span>
              </div>
              <ol className="text-xs space-y-2 text-slate-600 dark:text-slate-300 list-decimal list-inside font-medium">
                <li>Cliquez sur <strong>« Installer maintenant »</strong> ou sur l'icône d'ordinateur <strong>(⊞ / 🖥️)</strong> dans la barre d'adresse de votre navigateur.</li>
                <li>Validez l'installation dans la boîte de dialogue.</li>
                <li>L'application s'ouvrira dans sa propre fenêtre indépendante.</li>
                <li>Edge et Chrome vous proposeront de <strong>Créer un raccourci sur le Bureau</strong> et d'<strong>Épingler à la barre des tâches</strong>.</li>
              </ol>
            </div>
          )}

          {/* Guide spécifique iOS */}
          {platform === 'ios' && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2.5">
              <div className="flex items-center space-x-2 text-amber-500 font-bold text-xs">
                <Smartphone size={16} />
                <span>Instructions iPhone & iPad (Safari)</span>
              </div>
              <ol className="text-xs space-y-2 text-slate-600 dark:text-slate-300 list-decimal list-inside font-medium">
                <li className="flex items-center gap-2">
                  <span>1. Appuyez sur le bouton <strong>Partager</strong></span>
                  <Share2 size={14} className="text-primary inline" />
                  <span>dans Safari.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>2. Faites défiler et touchez <strong>« Sur l'écran d'accueil »</strong></span>
                  <PlusSquare size={14} className="text-primary inline" />
                </li>
                <li>3. Confirmez en appuyant sur <strong>« Ajouter »</strong> en haut à droite.</li>
              </ol>
            </div>
          )}

          {/* Guide pour les autres navigateurs */}
          {platform !== 'android' && platform !== 'windows' && platform !== 'ios' && (
            <div className="p-4 rounded-2xl bg-slate-500/10 border border-slate-500/20 space-y-2 text-xs">
              <p className="font-medium">
                Vous pouvez installer Hoomty directement depuis le menu de votre navigateur en sélectionnant <strong>« Installer Hoomty »</strong> ou <strong>« Créer un raccourci »</strong>.
              </p>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="space-y-2 pt-2">
          {canPromptNatively ? (
            <button
              onClick={() => {
                if (onInstall) onInstall();
                onClose();
              }}
              className="w-full py-4 px-6 bg-primary hover:bg-emerald-600 text-white rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg shadow-primary/30 active:scale-95 transition-all"
            >
              <Download size={18} />
              <span>Installer maintenant</span>
            </button>
          ) : (
            <button
              onClick={onClose}
              className="w-full py-3.5 px-6 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-2xl font-bold text-sm transition-all"
            >
              Compris, j'ai suivi les étapes
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
