
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { CATEGORIES, MOCK_STORES, ALGERIA_GEOGRAPHY, TRANSLATIONS } from '../constants';
import { MapPin, ChevronRight, ArrowRight, Zap, Navigation, Search, Sparkles, Mic } from 'lucide-react';
import { useUserStore } from '../stores/useUserStore';

const Home: React.FC = () => {
  const { user, setUser } = useUserStore();
  const navigate = useNavigate();
  const [isLocating, setIsLocating] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const isDark = user?.theme === 'dark';

  const handleGPSLocation = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(() => {
        setTimeout(() => {
          if (user) setUser({ ...user, wilaya: '16 - Alger', neighborhood: 'Hydra' });
          setIsLocating(false);
        }, 1500);
      }, () => setIsLocating(false));
    } else setIsLocating(false);
  };

  const handleVoiceSearch = () => {
    alert("🎙️ Recherche vocale (Derja) bientôt disponible !");
  };

  const filteredStores = MOCK_STORES.filter(store => {
    const matchesCategory = selectedCategory === 'all' || store.category === selectedCategory;
    const matchesWilaya = !user?.wilaya || store.wilaya === user.wilaya;
    const matchesNeighborhood = !user?.neighborhood || store.neighborhood === user.neighborhood;
    return matchesCategory && matchesWilaya && matchesNeighborhood;
  });

  return (
    <Layout>
      <div className="space-y-12">
        
        {/* HERO SECTION - BENTO STYLE */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-slate-950 rounded-[40px] p-8 md:p-14 text-white relative overflow-hidden shadow-premium group">
            <div className="relative z-10 max-w-lg">
              <div className="inline-flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full mb-8 backdrop-blur-md border border-white/10">
                <Sparkles size={14} className="text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest">Le futur de la Houma</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight tracking-tighter">
                L'essentiel du quartier, <br/>en <span className="text-primary">un éclair</span>.
              </h1>
              <div className="flex space-x-3 mb-8">
                <span className="text-xs font-bold text-primary/80 bg-primary/10 px-3 py-1 rounded-lg font-arabic">{TRANSLATIONS[user?.lang === 'ar' ? 'ar' : 'fr'].slogan1}</span>
                <span className="text-xs font-bold text-emerald-400 bg-white/5 px-3 py-1 rounded-lg font-arabic">{TRANSLATIONS[user?.lang === 'ar' ? 'ar' : 'fr'].slogan2}</span>
              </div>
              <p className="text-white/60 font-medium text-lg mb-10 leading-relaxed">
                Connectez-vous aux meilleurs commerces d'Algérie. Qualité, rapidité et confiance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/stores" className="bg-primary text-white px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-primary/40 hover:scale-105 active:scale-95 transition-all text-center">
                  Commander maintenant
                </Link>
                <button onClick={handleGPSLocation} className="bg-white/10 backdrop-blur-md text-white px-8 py-5 rounded-2xl font-black uppercase text-xs tracking-widest border border-white/10 hover:bg-white/20 transition-all flex items-center justify-center">
                  <Navigation size={16} className="mr-2" /> Me localiser
                </button>
              </div>
            </div>
            {/* Déco abstraite */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/20 to-transparent pointer-events-none"></div>
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-primary rounded-full blur-[120px] opacity-30 animate-pulse"></div>
          </div>

          <div className={`lg:col-span-4 rounded-[40px] p-10 flex flex-col justify-between border shadow-premium ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-black/5'}`}>
            <div className="space-y-4">
              <h3 className="text-2xl font-black uppercase tracking-tighter">Filtre Rapide</h3>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Changer de zone</p>
            </div>
            <div className="space-y-4 mt-8">
              <select 
                value={user?.wilaya || ''}
                onChange={(e) => user && setUser({ ...user, wilaya: e.target.value, neighborhood: '' })}
                className={`w-full py-4 px-6 rounded-2xl text-xs font-black uppercase tracking-widest outline-none border-none transition-all ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}
              >
                <option value="">Wilaya</option>
                {ALGERIA_GEOGRAPHY.map(g => <option key={g.wilaya} value={g.wilaya}>{g.wilaya}</option>)}
              </select>
              <select 
                value={user?.neighborhood || ''}
                onChange={(e) => user && setUser({ ...user, neighborhood: e.target.value })}
                disabled={!user?.wilaya}
                className={`w-full py-4 px-6 rounded-2xl text-xs font-black uppercase tracking-widest outline-none border-none transition-all disabled:opacity-30 ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}
              >
                <option value="">Quartier</option>
                {user?.wilaya && ALGERIA_GEOGRAPHY.find(g => g.wilaya === user.wilaya)?.neighborhoods.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </div>
        </section>

        {/* SEARCH BAR FLOAT */}
        <section className="relative z-20 -mt-10 md:-mt-14 max-w-4xl mx-auto px-4">
          <div className={`p-2 rounded-[32px] border shadow-2xl flex items-center transition-all ${isDark ? 'bg-slate-900 border-white/10' : 'bg-white border-black/5'}`}>
            <div className="flex-1 flex items-center px-6">
              <Search size={20} className="text-gray-400 mr-4" />
              <input 
                type="text" 
                placeholder="Un produit, une boutique..." 
                className="bg-transparent w-full py-4 font-bold text-sm outline-none"
                onFocus={() => navigate('/stores')}
              />
              <button 
                onClick={(e) => { e.stopPropagation(); handleVoiceSearch(); }}
                className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors"
              >
                <Mic size={20} />
              </button>
            </div>
            <button className="bg-primary text-white p-4 rounded-[24px] shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
              <ArrowRight size={20} />
            </button>
          </div>
        </section>

        {/* CATEGORIES GRID */}
        <section>
          <div className="flex items-center justify-between mb-8 px-2">
            <h2 className="text-2xl font-black uppercase tracking-tighter">Par Rayon</h2>
            <Link to="/stores" className="text-primary text-[10px] font-black uppercase tracking-widest flex items-center group">
              Voir tout <ChevronRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {CATEGORIES.map((cat, i) => (
              <button 
                key={cat.id}
                onClick={() => navigate(`/stores?category=${cat.id}`)}
                className={`p-6 rounded-[36px] border flex flex-col items-center justify-center transition-all group animate-in slide-in-from-bottom duration-500 ${
                  selectedCategory === cat.id 
                    ? 'bg-primary border-primary text-white shadow-xl shadow-primary/20' 
                    : isDark ? 'bg-white/5 border-white/5 hover:border-primary/50' : 'bg-white border-black/5 hover:shadow-xl'
                }`}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className={`text-4xl mb-4 transition-all duration-500 ${selectedCategory === cat.id ? 'scale-110' : 'group-hover:scale-125 group-hover:rotate-12'}`}>
                  {cat.icon}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest transition-colors text-center ${selectedCategory === cat.id ? 'text-white' : 'text-gray-500 group-hover:text-primary'}`}>{cat.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* STORES SECTION */}
        <section>
          <div className="flex items-center justify-between mb-10 px-2">
            <h2 className="text-2xl font-black uppercase tracking-tighter">
              {selectedCategory === 'all' ? 'Commerces à proximité' : `Commerces: ${CATEGORIES.find(c => c.id === selectedCategory)?.name}`}
            </h2>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-ping"></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Live maintenant</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredStores.map(store => (
              <Link 
                key={store.id} 
                to={`/store/${store.id}`}
                className={`rounded-[44px] border overflow-hidden transition-all group flex flex-col md:flex-row h-auto md:h-72 ${isDark ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-white border-black/5 hover:shadow-2xl shadow-premium'}`}
              >
                <div className="w-full md:w-2/5 h-48 md:h-full relative overflow-hidden">
                  <img src={store.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 flex items-center bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20">
                     <Zap size={12} className="text-primary mr-1.5 fill-current" />
                     <span className="text-white text-[10px] font-black uppercase">{store.distance}</span>
                  </div>
                </div>
                <div className="p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-black leading-tight group-hover:text-primary transition-colors">{store.name}</h3>
                    <div className="flex items-center mt-2 text-gray-400 font-bold text-xs uppercase tracking-widest">
                       <MapPin size={12} className="mr-2 text-primary" />
                       {store.neighborhood}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-6 border-t border-black/5 dark:border-white/5">
                    <div className="flex flex-col">
                       <span className="text-[9px] font-black uppercase text-gray-400">Note</span>
                       <span className="font-black text-lg">4.8 <span className="text-xs text-gray-400">/5</span></span>
                    </div>
                    <div className="bg-primary/10 text-primary p-3 rounded-2xl group-hover:translate-x-2 transition-transform">
                       <ArrowRight size={20} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
            {filteredStores.length === 0 && (
              <div className="col-span-full py-20 text-center">
                <p className="text-gray-400 font-bold uppercase tracking-widest">Aucun commerce trouvé dans cette catégorie</p>
              </div>
            )}
          </div>
        </section>

      </div>
    </Layout>
  );
};

export default Home;
