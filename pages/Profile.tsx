
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useUserStore } from '../stores/useUserStore';
import { 
  User, 
  MapPin, 
  Shield, 
  LogOut,
  ChevronRight,
  Camera,
  Moon,
  Sun,
  Globe,
  Plus,
  BadgeCheck,
  Store as StoreIcon,
  Map,
  X,
  Check,
  Share2
} from 'lucide-react';
import { UserRole, Address } from '../types';
import { ALGERIA_GEOGRAPHY } from '../constants';
import { InstallPWA } from '../components/InstallPWA';

const Profile: React.FC = () => {
  const { user, setUser, toggleTheme, toggleLang } = useUserStore();
  const navigate = useNavigate();
  const isDark = user?.theme === 'dark';
  
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddr, setNewAddr] = useState<Partial<Address>>({
    label: '',
    details: '',
    wilaya: '',
    neighborhood: ''
  });

  const handleLogout = () => {
    setUser(null);
    navigate('/login');
  };

  const handleAddAddress = () => {
    if (user && newAddr.label && newAddr.wilaya && newAddr.neighborhood) {
      const address: Address = {
        id: Math.random().toString(36).substr(2, 9),
        label: newAddr.label!,
        details: newAddr.details || 'Aucun détail',
        wilaya: newAddr.wilaya!,
        neighborhood: newAddr.neighborhood!
      };
      setUser({
        ...user,
        addresses: [...user.addresses, address]
      });
      setNewAddr({ label: '', details: '', wilaya: '', neighborhood: '' });
      setShowAddAddress(false);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Hoomty - Mon quartier',
      text: 'Découvrez Hoomty, Mon quartier ! Commandez chez vos commerçants locaux en un clic.',
      url: window.location.origin,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.origin);
        alert("Lien de partage copié ! Partagez-le avec vos voisins.");
      } catch (err) {
        console.error('Failed to copy: ', err);
      }
    }
  };

  const isMerchant = user?.role === UserRole.STORE;

  const badges = [
    { id: 'b1', name: 'Weld el Houma', icon: '🏠', earned: true },
    { id: 'b2', name: 'Client Fidèle', icon: '💎', earned: true },
    { id: 'b3', name: 'Aide Voisin', icon: '🤝', earned: false },
    { id: 'b4', name: 'Explorateur', icon: '🗺️', earned: true },
  ];

  return (
    <Layout title="Mon Profil">
      <div className={`p-4 md:p-12 space-y-10 pb-32 ${isDark ? 'text-white' : 'text-dark'}`}>
        {/* Profil Header */}
        <div className="flex flex-col items-center">
          <div className="relative mb-8 group">
            <div className={`w-32 h-32 md:w-44 md:h-44 rounded-[40px] border-[6px] shadow-2xl p-1 overflow-hidden transition-all duration-500 group-hover:scale-105 group-hover:-rotate-2 ${isDark ? 'bg-orange-500 border-orange-500/20' : 'bg-orange-500 border-white'}`}>
              <img src={`https://ui-avatars.com/api/?name=${user?.pseudonym}&background=F97316&color=fff&size=256`} alt="Avatar" className="w-full h-full rounded-[32px]" />
            </div>
            <button className="absolute -bottom-2 -right-2 bg-primary text-white p-4 rounded-2xl shadow-2xl border-4 border-white dark:border-[#121212] hover:scale-110 active:scale-90 transition-all">
              <Camera size={20}/>
            </button>
            {isMerchant && (
              <div className="absolute -top-3 -left-3 bg-accent text-white p-3 rounded-2xl shadow-xl border-4 border-white dark:border-[#121212] animate-bounce">
                <StoreIcon size={18}/>
              </div>
            )}
          </div>
          
          <div className="text-center">
            <h2 className="text-4xl font-black flex items-center justify-center space-x-3 tracking-tighter">
              <span>{user?.name}</span>
              {isMerchant && <BadgeCheck size={28} className="text-accent fill-accent/20" />}
            </h2>
            
            <div className="flex flex-col items-center mt-4 space-y-4">
              <div className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${isMerchant ? 'bg-accent/10 text-accent' : 'bg-orange-500/10 text-orange-600'}`}>
                {isMerchant ? 'Vendeur Certifié Hoomty' : 'Client Fidèle Houma'}
              </div>
              <div className={`flex items-center space-x-2 px-6 py-3 rounded-2xl border ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                  <MapPin size={16} className="text-primary" />
                </div>
                <div className="text-left rtl:text-right">
                  <p className="text-[10px] opacity-40 font-black uppercase tracking-tighter">Ma Localisation</p>
                  <p className="text-sm font-black uppercase">{user?.neighborhood}, {user?.wilaya}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* POINTS & BADGES SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`p-8 rounded-[40px] border relative overflow-hidden group ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
            <div className="relative z-10">
              <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Points Hoomty</span>
              <div className="flex items-end gap-3 mt-2">
                <span className="text-5xl font-black tracking-tighter text-primary">{user?.points || 0}</span>
                <span className="text-sm font-bold mb-2 opacity-60">DA cumulés</span>
              </div>
              <p className="text-[10px] font-bold mt-4 text-primary uppercase tracking-widest">Niveau : Habitant Actif</p>
            </div>
          </div>

          <div className={`p-8 rounded-[40px] border ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
            <span className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-4 block">Mes Badges Houma</span>
            <div className="flex flex-wrap gap-3">
              {badges.map(badge => (
                <div 
                  key={badge.id}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm border transition-all hover:scale-110 ${badge.earned ? 'bg-white dark:bg-zinc-800 border-zinc-100 dark:border-zinc-700 grayscale-0' : 'bg-zinc-100 dark:bg-zinc-900 border-transparent grayscale opacity-30'}`}
                  title={badge.name}
                >
                  {badge.icon}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PWA INSTALLATION SECTION */}
        <InstallPWA variant="card" />

        {/* BOUTON PARTAGE PREMIUM */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-[40px] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <button 
            onClick={handleShare}
            className="relative w-full bg-slate-950 dark:bg-white p-6 rounded-[35px] text-white dark:text-primary shadow-2xl flex items-center justify-between group hover:scale-[1.01] transition-all border border-white/10 dark:border-black/5"
          >
            <div className="flex items-center space-x-5">
               <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30">
                  <Share2 size={28} className="text-white animate-pulse" />
               </div>
               <div className="text-left">
                  <p className="font-black text-lg tracking-tight">Partager Hoomty</p>
                  <p className="text-[10px] font-bold uppercase opacity-60 tracking-widest">Invitez vos voisins & amis</p>
               </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:translate-x-2 transition-transform">
              <ChevronRight size={24} className="text-primary" />
            </div>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Section Adresses */}
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-2xl font-black uppercase tracking-tighter flex items-center">
                <Map className="mr-3 text-primary" /> 
                {isMerchant ? 'Emplacement Boutique' : 'Mes Adresses Houma'}
              </h3>
              {!isMerchant && (
                <button 
                  onClick={() => setShowAddAddress(!showAddAddress)}
                  className={`p-3 rounded-2xl transition-all active:scale-90 ${showAddAddress ? 'bg-error/10 text-error' : 'bg-primary/10 text-primary'}`}
                >
                  {showAddAddress ? <X size={20}/> : <Plus size={20}/>}
                </button>
              )}
            </div>
            
            <div className="space-y-4">
              {showAddAddress && !isMerchant && (
                <div className={`p-6 rounded-[32px] border animate-in slide-in-from-top duration-300 space-y-4 ${isDark ? 'bg-white/5 border-primary/20' : 'bg-white border-primary/20 shadow-xl shadow-primary/5'}`}>
                  <div className="grid grid-cols-1 gap-3">
                    <input 
                      type="text" 
                      placeholder="Nom (ex: Bureau, Parents...)" 
                      value={newAddr.label}
                      onChange={(e) => setNewAddr({...newAddr, label: e.target.value})}
                      className={`w-full py-3 px-4 rounded-xl text-xs font-bold outline-none border transition-all ${isDark ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100 focus:bg-white focus:border-primary'}`}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <select 
                        value={newAddr.wilaya}
                        onChange={(e) => setNewAddr({...newAddr, wilaya: e.target.value, neighborhood: ''})}
                        className={`py-3 px-4 rounded-xl text-xs font-bold outline-none border ${isDark ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'}`}
                      >
                        <option value="">Wilaya</option>
                        {ALGERIA_GEOGRAPHY.map(g => <option key={g.wilaya} value={g.wilaya}>{g.wilaya}</option>)}
                      </select>
                      <select 
                        value={newAddr.neighborhood}
                        onChange={(e) => setNewAddr({...newAddr, neighborhood: e.target.value})}
                        disabled={!newAddr.wilaya}
                        className={`py-3 px-4 rounded-xl text-xs font-bold outline-none border ${isDark ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'} disabled:opacity-30`}
                      >
                        <option value="">Quartier</option>
                        {newAddr.wilaya && ALGERIA_GEOGRAPHY.find(g => g.wilaya === newAddr.wilaya)?.neighborhoods.map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                    <input 
                      type="text" 
                      placeholder="Détails (Bâtiment, Rue...)" 
                      value={newAddr.details}
                      onChange={(e) => setNewAddr({...newAddr, details: e.target.value})}
                      className={`w-full py-3 px-4 rounded-xl text-xs font-bold outline-none border ${isDark ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'}`}
                    />
                    <button 
                      onClick={handleAddAddress}
                      className="w-full bg-primary text-white py-3 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20 flex items-center justify-center space-x-2"
                    >
                      <Check size={16} /> <span>Enregistrer l'adresse</span>
                    </button>
                  </div>
                </div>
              )}

              {isMerchant ? (
                <div className={`p-8 rounded-[40px] border flex items-center justify-between group ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
                  <div className="flex items-center space-x-6">
                    <div className="w-16 h-16 bg-accent/10 text-accent rounded-[20px] flex items-center justify-center">
                      <StoreIcon size={32} />
                    </div>
                    <div>
                      <h4 className="font-black text-lg">Boutique Principale</h4>
                      <p className="text-[10px] opacity-40 uppercase font-black tracking-widest">{user?.neighborhood}, {user?.wilaya}</p>
                    </div>
                  </div>
                </div>
              ) : (
                user?.addresses.map(addr => (
                  <div key={addr.id} className={`p-6 rounded-[32px] border flex items-center justify-between group cursor-pointer hover:border-primary/50 transition-all ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
                    <div className="flex items-center space-x-6">
                      <div className="w-14 h-14 bg-primary/10 text-primary rounded-[20px] flex items-center justify-center group-hover:rotate-6 transition-transform">
                        <MapPin size={28} />
                      </div>
                      <div>
                        <h4 className="font-black text-lg">{addr.label}</h4>
                        <p className="text-[10px] opacity-40 uppercase font-black tracking-widest">{addr.details}</p>
                        <p className="text-[9px] text-primary font-bold uppercase mt-1">{addr.neighborhood}, {addr.wilaya}</p>
                      </div>
                    </div>
                    <ChevronRight size={22} className="opacity-20 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Préférences */}
          <div className="space-y-6">
            <h3 className="text-2xl font-black uppercase tracking-tighter px-2">Réglages App</h3>
            <div className={`rounded-[40px] border overflow-hidden ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
              <button onClick={toggleTheme} className={`w-full flex items-center justify-between p-8 hover:bg-gray-50 dark:hover:bg-white/5 transition-all border-b ${isDark ? 'border-white/5' : 'border-gray-50'}`}>
                <div className="flex items-center">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mr-5 ${isDark ? 'bg-yellow-400/10 text-yellow-400' : 'bg-primary/10 text-primary'}`}>
                    {isDark ? <Sun size={24} /> : <Moon size={24} />}
                  </div>
                  <div className="text-left rtl:text-right">
                    <span className="font-black text-lg block">Mode Visuel</span>
                    <span className="text-[10px] opacity-40 font-bold uppercase">{isDark ? 'Thème Sombre' : 'Thème Clair'}</span>
                  </div>
                </div>
                <div className={`w-14 h-7 rounded-full relative transition-all shadow-inner ${isDark ? 'bg-primary' : 'bg-gray-200'}`}>
                  <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg transition-all ${isDark ? 'left-8' : 'left-1'}`}></div>
                </div>
              </button>
              
              <button onClick={toggleLang} className={`w-full flex items-center justify-between p-8 hover:bg-gray-50 dark:hover:bg-white/5 transition-all border-b ${isDark ? 'border-white/5' : 'border-gray-50' }`}>
                <div className="flex items-center">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mr-5">
                    <Globe size={24} />
                  </div>
                  <div className="text-left rtl:text-right">
                    <span className="font-black text-lg block">Langue / لغة</span>
                    <span className="text-[10px] opacity-40 font-bold uppercase">Changer la langue</span>
                  </div>
                </div>
                <span className="text-xs font-black uppercase text-primary px-4 py-2 bg-primary/10 rounded-xl shadow-sm">
                  {user?.lang === 'ar' ? 'العربية' : 'Français'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Déconnexion */}
        <button 
          onClick={handleLogout} 
          className="w-full p-8 bg-error/5 text-error rounded-[48px] border-2 border-error/10 font-black uppercase text-xs tracking-[0.4em] flex items-center justify-center hover:bg-error hover:text-white hover:border-error transition-all shadow-xl shadow-error/5 group"
        >
          <LogOut size={24} className="mr-4 group-hover:-translate-x-2 transition-transform" /> 
          Déconnexion
        </button>
      </div>
    </Layout>
  );
};

export default Profile;
