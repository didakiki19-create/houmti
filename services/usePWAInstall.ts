import { useState, useEffect } from 'react';

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export type PlatformType = 'android' | 'windows' | 'ios' | 'mac' | 'other';

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [platform, setPlatform] = useState<PlatformType>('other');

  useEffect(() => {
    // 1. Détection du mode Standalone (PWA lancée comme application installée)
    const checkStandalone = () => {
      const isStandaloneMedia = window.matchMedia('(display-mode: standalone)').matches;
      const isIOSStandalone = (window.navigator as unknown as { standalone?: boolean }).standalone === true;
      const isDocumentReferrer = document.referrer.includes('android-app://');
      const active = isStandaloneMedia || isIOSStandalone || isDocumentReferrer;
      setIsStandalone(active);
      if (active) {
        setIsInstalled(true);
      }
    };

    checkStandalone();

    // 2. Détection de la plateforme OS
    const ua = window.navigator.userAgent.toLowerCase();
    if (/android/i.test(ua)) {
      setPlatform('android');
    } else if (/windows|win32|win64/i.test(ua)) {
      setPlatform('windows');
    } else if (/iphone|ipad|ipod/i.test(ua)) {
      setPlatform('ios');
    } else if (/macintosh|mac os x/i.test(ua)) {
      setPlatform('mac');
    } else {
      setPlatform('other');
    }

    // 3. Capture de l'événement natif avant installation (Android, Windows Chrome/Edge)
    const handleBeforeInstallPrompt = (e: Event) => {
      // Empêcher l'affichage de la mini-infobarre automatique pour déclencher au moment opportun
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    // 4. Détection quand l'application a été installée avec succès
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsStandalone(e.matches);
      if (e.matches) setIsInstalled(true);
    };
    mediaQuery.addEventListener('change', handleMediaChange);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      mediaQuery.removeEventListener('change', handleMediaChange);
    };
  }, []);

  const install = async (): Promise<boolean> => {
    if (!deferredPrompt) {
      return false;
    }
    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
        return true;
      }
      return false;
    } catch (err) {
      console.warn('Erreur lors de l’installation PWA :', err);
      return false;
    }
  };

  return {
    isInstallable: !!deferredPrompt,
    isInstalled,
    isStandalone,
    platform,
    install,
  };
}
