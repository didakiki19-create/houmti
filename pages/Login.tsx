
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, Store, User, ChevronRight, Sparkles } from 'lucide-react';
import { useUserStore } from '../stores/useUserStore';
import { UserRole } from '../types';
import { ALGERIA_GEOGRAPHY, CATEGORIES } from '../constants';

const PremiumLogo = ({ className = "w-10 h-10" }: { className?: string }) => (
  <div className={`relative ${className} group`}>
    <div className="absolute inset-0 bg-primary rounded-[28px] rotate-12 shadow-2xl shadow-primary/30"></div>
    <div className="absolute inset-0 bg-slate-950 rounded-[28px] -rotate-3 flex items-center justify-center overflow-hidden border border-white/10">
      <span className="text-white font-black text-5xl tracking-tighter">H</span>
      <div className="absolute bottom-3 right-3 w-3 h-3 bg-primary rounded-full shadow-[0_0_15px_#059669]"></div>
    </div>
  </div>
);

const Login: React.FC = () => {
  const [pseudonym, setPseudonym] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<UserRole>(UserRole.CLIENT);
  const [businessType, setBusinessType] = useState('');
  const [wilaya, setWilaya] = useState(localStorage.getItem('pending_wilaya') || '');
  const [neighborhood, setNeighborhood] = useState(localStorage.getItem('pending_neighborhood') || '');
  const { setUser } = useUserStore();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({
      name: pseudonym,
      pseudonym: pseudonym,
      email: `${pseudonym.toLowerCase()}@hoomty.dz`,
      points: 450,
      role,
      wilaya: wilaya || '16 - Alger',
      neighborhood: neighborhood || 'Hydra',
      lang: 'fr',
      theme: 'light',
      businessType: role === UserRole.STORE ? businessType : undefined,
      addresses: [
        { id: '1', label: 'Domicile', details: 'Hydra, Rue Ahmed', wilaya: wilaya || '16 - Alger', neighborhood: neighborhood || 'Hydra' }
      ]
    });
    navigate(role === UserRole.CLIENT ? '/home' : '/dashboard');
  };

  return (
    <div className="flex-1 bg-white md:bg-light flex flex-col items-center justify-center p-6 md:p-12 min-h-screen">
      <div className="w-full max-w-2xl bg-white md:rounded-[56px] shadow-premium p-8 md:p-20 flex flex-col items-center animate-in zoom-in duration-700 relative overflow-hidden">
        
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-accent/5 rounded-full blur-3xl"></div>

        <div className="mb-14 text-center">
          <div className="mb-10 flex justify-center animate-float">
            <PremiumLogo className="w-24 h-24" />
          </div>
          <div className="inline-flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
             <Sparkles size={14} className="text-primary" />
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Prestige Digital</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-950 mb-3 tracking-tighter uppercase">Bienvenue</h1>
          <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Connectez-vous à votre Houma</p>
        </div>

        <div className="w-full flex bg-gray-100 p-2 rounded-[28px] mb-12 shadow-inner-soft">
          <button 
            onClick={() => setRole(UserRole.CLIENT)}
            className={`flex-1 flex items-center justify-center py-3 rounded-[22px] font-black text-[10px] uppercase tracking-widest transition-all ${
              role === UserRole.CLIENT ? 'bg-white text-orange-500 shadow-xl scale-[1.02]' : 'text-gray-400'
            }`}
          >
            <div className={`p-1.5 rounded-lg mr-2 transition-all ${role === UserRole.CLIENT ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'bg-gray-200/50 text-gray-400'}`}>
              <User size={14} />
            </div>
            Client
          </button>
          <button 
            onClick={() => setRole(UserRole.STORE)}
            className={`flex-1 flex items-center justify-center py-3 rounded-[22px] font-black text-[10px] uppercase tracking-widest transition-all ${
              role === UserRole.STORE ? 'bg-white text-primary shadow-xl scale-[1.02]' : 'text-gray-400'
            }`}
          >
            <div className={`p-1.5 rounded-lg mr-2 transition-all ${role === UserRole.STORE ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-gray-200/50 text-gray-400'}`}>
              <Store size={14} />
            </div>
            Commerçant
          </button>
        </div>

        <form onSubmit={handleLogin} className="w-full space-y-8">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Pseudonyme Unique</label>
              <input 
                type="text"
                value={pseudonym}
                onChange={(e) => setPseudonym(e.target.value)}
                placeholder="Ex: Mourad_31"
                className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-[24px] py-5 px-8 font-bold text-slate-950 outline-none transition-all shadow-sm"
                required
              />
            </div>

            {role === UserRole.STORE && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-4 duration-500">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Type de Commerce</label>
                <select 
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-[24px] py-5 px-8 font-bold text-slate-950 outline-none transition-all shadow-sm appearance-none cursor-pointer"
                  required
                >
                  <option value="">-- Choisir le type --</option>
                  {CATEGORIES.slice(1).map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                  ))}
                </select>
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Mot de passe secret</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-[24px] py-5 px-8 font-bold text-slate-950 outline-none transition-all shadow-sm"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-300 hover:text-primary transition-colors">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-primary text-white font-black py-6 rounded-[32px] shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm uppercase tracking-[0.2em] flex items-center justify-center mt-6"
          >
            Accéder à la plateforme <ChevronRight size={20} className="ml-3" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
