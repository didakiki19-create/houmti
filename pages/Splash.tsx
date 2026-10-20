
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../stores/useUserStore';
import { TRANSLATIONS } from '../constants';

const ModernLogo = ({ className = "w-10 h-10" }: { className?: string }) => (
  <div className={`relative ${className} group`}>
    <div className="absolute inset-0 bg-white rounded-[32px] rotate-6 group-hover:rotate-12 transition-transform duration-300 shadow-2xl"></div>
    <div className="absolute inset-0 bg-dark rounded-[32px] -rotate-3 group-hover:rotate-0 transition-transform duration-300 flex items-center justify-center overflow-hidden border-2 border-white/10">
      <span className="text-white font-black text-5xl tracking-tighter">H</span>
      <div className="absolute bottom-3 right-3 w-4 h-4 bg-primary rounded-full animate-pulse"></div>
    </div>
  </div>
);

const Splash: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const lang = user?.lang || 'fr';
  const t = TRANSLATIONS[lang as keyof typeof TRANSLATIONS];
  const [currentSlogan, setCurrentSlogan] = useState(t.slogan1);

  useEffect(() => {
    const sloganTimer = setTimeout(() => {
      setCurrentSlogan(t.slogan2);
    }, 1200);

    const timer = setTimeout(() => {
      navigate('/onboarding');
    }, 2500);
    return () => {
      clearTimeout(timer);
      clearTimeout(sloganTimer);
    };
  }, [navigate, t]);

  return (
    <div className="flex-1 bg-gradient-to-br from-primary to-primary-light flex flex-col items-center justify-center text-white">
      <div className="mb-12 animate-bounce">
        <ModernLogo className="w-28 h-28" />
      </div>
      <h1 className="text-5xl font-black tracking-tight mb-3">Hoomty</h1>
      <p className="text-white/80 font-bold tracking-widest text-sm h-6 animate-in fade-in duration-500 font-arabic">
        {currentSlogan}
      </p>
      
      <div className="absolute bottom-16 flex flex-col items-center">
        <div className="w-16 h-1 bg-white/20 rounded-full overflow-hidden mb-4 relative">
          <div className="absolute inset-0 bg-white animate-[loading_1.5s_infinite]"></div>
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Initialisation...</span>
      </div>
      
      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default Splash;
