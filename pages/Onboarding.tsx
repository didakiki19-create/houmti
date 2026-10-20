
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ChevronRight, Zap, Map } from 'lucide-react';
import { ALGERIA_GEOGRAPHY, TRANSLATIONS } from '../constants';
import { useUserStore } from '../stores/useUserStore';

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const lang = user?.lang || 'fr';
  const t = TRANSLATIONS[lang as keyof typeof TRANSLATIONS];
  const [step, setStep] = useState(1);
  const [selectedWilaya, setSelectedWilaya] = useState('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('');

  const handleFinish = () => {
    localStorage.setItem('pending_wilaya', selectedWilaya);
    localStorage.setItem('pending_neighborhood', selectedNeighborhood);
    navigate('/login');
  };

  return (
    <div className="flex-1 bg-white p-6 md:p-12 flex flex-col items-center justify-center">
      {step === 1 ? (
        <div className="max-w-xl w-full flex flex-col items-center text-center animate-in fade-in zoom-in duration-700">
          <div className="w-72 h-72 md:w-96 md:h-96 bg-primary/5 rounded-[60px] flex items-center justify-center mb-12 relative">
            <img 
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80" 
              alt="Course de quartier" 
              className="w-64 h-64 md:w-80 md:h-80 rounded-[44px] object-cover shadow-2xl rotate-2"
            />
            <div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-3xl shadow-xl flex items-center space-x-3 -rotate-3 border border-gray-100">
               <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white"><Zap size={20}/></div>
               <div className="text-left">
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Temps moyen</p>
                  <p className="text-sm font-black text-dark uppercase tracking-tight">25 Minutes</p>
               </div>
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-dark mb-6 tracking-tight">Votre quartier devient <span className="text-primary">Digital</span>.</h2>
          <p className="text-gray-500 mb-4 px-4 text-lg font-medium leading-relaxed">
            Hoomty connecte votre domicile aux meilleurs commerces de votre "Houma" en Algérie.
          </p>
          <div className="flex flex-col items-center mb-12 space-y-2">
            <span className="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-bold font-arabic">{t.slogan1}</span>
            <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-600 rounded-full text-xs font-bold font-arabic">{t.slogan2}</span>
          </div>
          <button 
            onClick={() => setStep(2)}
            className="w-full bg-primary text-white font-black py-6 rounded-3xl flex items-center justify-center space-x-3 shadow-2xl shadow-primary/30 hover:bg-primary-light hover:scale-105 transition-all text-sm uppercase tracking-widest"
          >
            <span>Démarrer l'inscription</span>
            <ChevronRight size={20} strokeWidth={3} />
          </button>
        </div>
      ) : (
        <div className="max-w-lg w-full flex flex-col animate-in fade-in slide-in-from-right duration-500">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-8">
             <MapPin size={32} strokeWidth={2.5} />
          </div>
          <h2 className="text-3xl font-black text-dark mb-2 tracking-tight">Où habitez-vous ?</h2>
          <p className="text-gray-500 mb-10 text-sm font-bold uppercase tracking-widest">Choisissez votre Wilaya puis votre Quartier</p>
          
          <div className="space-y-6 flex-1">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">1. Sélectionnez la Wilaya</label>
              <div className="relative">
                <select 
                  value={selectedWilaya}
                  onChange={(e) => {
                    setSelectedWilaya(e.target.value);
                    setSelectedNeighborhood('');
                  }}
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-3xl py-5 px-6 font-bold text-dark focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="">-- Wilaya --</option>
                  {ALGERIA_GEOGRAPHY.map(g => (
                    <option key={g.wilaya} value={g.wilaya}>{g.wilaya}</option>
                  ))}
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <Map size={20} />
                </div>
              </div>
            </div>

            {selectedWilaya && (
              <div className="space-y-3 animate-in fade-in slide-in-from-top-4 duration-500">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">2. Sélectionnez le Quartier</label>
                <div className="relative">
                  <select 
                    value={selectedNeighborhood}
                    onChange={(e) => setSelectedNeighborhood(e.target.value)}
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-3xl py-5 px-6 font-bold text-dark focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="">-- Quartier / Houma --</option>
                    {ALGERIA_GEOGRAPHY.find(g => g.wilaya === selectedWilaya)?.neighborhoods.map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <MapPin size={20} />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-12 space-y-4">
            <button 
              onClick={handleFinish}
              disabled={!selectedWilaya || !selectedNeighborhood}
              className={`w-full py-6 rounded-3xl font-black shadow-2xl transition-all uppercase tracking-widest text-sm ${
                (selectedWilaya && selectedNeighborhood) ? 'bg-primary text-white shadow-primary/30 active:scale-95' : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
              }`}
            >
              Créer mon compte
            </button>
            <button 
              onClick={() => setStep(1)}
              className="w-full py-4 text-gray-400 text-[10px] font-black uppercase tracking-widest hover:text-dark transition-colors"
            >
              Retour
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Onboarding;
