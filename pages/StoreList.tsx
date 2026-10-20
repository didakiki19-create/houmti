
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { MOCK_STORES, ALGERIA_GEOGRAPHY, CATEGORIES } from '../constants';
import { Star, MapPin, Search, Filter, Navigation, Map as MapIcon, X, ChevronDown } from 'lucide-react';
import { useUserStore } from '../stores/useUserStore';

const StoreList: React.FC = () => {
  const { user } = useUserStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWilaya, setSelectedWilaya] = useState(user?.wilaya || '');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState(user?.neighborhood || '');
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'all');
  const [sortBy, setSortBy] = useState<'rating' | 'distance' | 'name'>('rating');
  const [isLocating, setIsLocating] = useState(false);
  const isDark = user?.theme === 'dark';

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    } else {
      setSelectedCategory('all');
    }
  }, [categoryParam]);

  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    if (catId === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', catId);
    }
    setSearchParams(searchParams);
  };

  const filteredStores = MOCK_STORES
    .filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesWilaya = selectedWilaya === '' || s.wilaya === selectedWilaya;
      const matchesNeighborhood = selectedNeighborhood === '' || s.neighborhood === selectedNeighborhood;
      const matchesCategory = selectedCategory === 'all' || s.category === selectedCategory;
      return matchesSearch && matchesWilaya && matchesNeighborhood && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'distance') {
        const distA = parseFloat(a.distance);
        const distB = parseFloat(b.distance);
        return distA - distB;
      }
      return a.name.localeCompare(b.name);
    });

  const handleFindNearby = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        // Simulation d'une détection de quartier
        setTimeout(() => {
          setSelectedWilaya(user?.wilaya || '16 - Alger');
          setSelectedNeighborhood(user?.neighborhood || 'Hydra');
          setIsLocating(false);
        }, 1200);
      }, (error) => {
        setIsLocating(false);
        alert("Permission refusée ou erreur de signal GPS.");
      });
    } else {
      setIsLocating(false);
      alert("Votre appareil ne supporte pas la géolocalisation.");
    }
  };

  const resetFilters = () => {
    setSelectedWilaya('');
    setSelectedNeighborhood('');
    setSelectedCategory('all');
    setSearchTerm('');
  };

  return (
    <Layout title="Nos Boutiques" showBack>
      <div className="p-4 md:p-12 space-y-8 pb-32">
        {/* Titre et Action GPS */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">Les Boutiques</h2>
            <div className="flex items-center space-x-2 mt-2">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                {filteredStores.length} commerces à proximité
              </p>
            </div>
          </div>
          
          <button 
            onClick={handleFindNearby}
            disabled={isLocating}
            className={`flex items-center space-x-3 px-8 py-5 rounded-[24px] font-black uppercase text-xs tracking-widest transition-all shadow-xl ${
              isLocating 
              ? 'bg-gray-100 text-gray-400' 
              : 'bg-primary text-white shadow-primary/20 hover:scale-105 active:scale-95'
            }`}
          >
            <div className={isLocating ? 'animate-spin' : 'animate-bounce'}>
              <Navigation size={18} fill="currentColor" />
            </div>
            <span>{isLocating ? 'Localisation...' : 'Trouver autour de moi'}</span>
          </button>
        </div>

        {/* Panneau de Filtrage Professionnel */}
        <div className={`rounded-[40px] p-6 md:p-10 border transition-all ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
          <div className="space-y-8">
            {/* Onglets de Catégories (Types de Commerce) */}
            <div className="space-y-3">
              <label className="text-[10px] font-black opacity-40 uppercase tracking-widest ml-1">Type de commerce (Rayons)</label>
              <div className="flex space-x-3 overflow-x-auto no-scrollbar pb-2">
                {CATEGORIES.map(cat => (
                  <button 
                    key={cat.id} 
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center space-x-2 ${
                      selectedCategory === cat.id 
                        ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105' 
                        : isDark ? 'bg-white/5 text-white/60 hover:bg-white/10' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    <span className="text-lg">{cat.icon}</span>
                    <span>{user?.lang === 'ar' ? cat.nameAr : cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="md:col-span-1 space-y-3">
                <label className="text-[10px] font-black opacity-40 uppercase tracking-widest ml-1">Nom de l'enseigne</label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text"
                    placeholder="Ex: El Mordjane..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full border-none rounded-2xl py-4 pl-12 pr-10 text-sm font-bold focus:ring-2 focus:ring-primary outline-none transition-all ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}
                  />
                  {searchTerm && (
                    <button 
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black opacity-40 uppercase tracking-widest ml-1">Wilaya</label>
                <select 
                  value={selectedWilaya}
                  onChange={(e) => {
                    setSelectedWilaya(e.target.value);
                    setSelectedNeighborhood('');
                  }}
                  className={`w-full border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-primary outline-none transition-all appearance-none ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}
                >
                  <option value="">-- Toute l'Algérie --</option>
                  {ALGERIA_GEOGRAPHY.map(g => (
                    <option key={g.wilaya} value={g.wilaya}>{g.wilaya}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black opacity-40 uppercase tracking-widest ml-1">Quartier / Houma</label>
                <select 
                  value={selectedNeighborhood}
                  onChange={(e) => setSelectedNeighborhood(e.target.value)}
                  className={`w-full border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-primary outline-none transition-all appearance-none disabled:opacity-30 ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}
                  disabled={!selectedWilaya}
                >
                  <option value="">-- Tous les quartiers --</option>
                  {selectedWilaya && ALGERIA_GEOGRAPHY.find(g => g.wilaya === selectedWilaya)?.neighborhoods.map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2">
                <div className="flex-1 space-y-3">
                  <label className="text-[10px] font-black opacity-40 uppercase tracking-widest ml-1">Trier par</label>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className={`w-full border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-primary outline-none transition-all appearance-none ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}
                  >
                    <option value="rating">Mieux notés ⭐</option>
                    <option value="distance">Plus proches 📍</option>
                    <option value="name">Nom (A-Z) 🔤</option>
                  </select>
                </div>

                <button 
                  onClick={resetFilters}
                  className={`mt-7 p-4 rounded-2xl flex items-center justify-center transition-all ${isDark ? 'bg-white/5 text-white' : 'bg-gray-100 text-dark'} hover:bg-error hover:text-white group`}
                  title="Réinitialiser"
                >
                  <X size={20} className="group-hover:rotate-90 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Grille de Boutiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredStores.map(store => (
            <Link 
              key={store.id} 
              to={`/store/${store.id}`}
              className={`rounded-[48px] overflow-hidden shadow-sm border flex flex-col group transition-all hover:shadow-2xl hover:-translate-y-2 ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-gray-100'}`}
            >
              <div className="h-56 relative overflow-hidden">
                <img src={store.image} alt={store.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" />
                <div className="absolute top-5 right-5 bg-white/95 dark:bg-dark/95 backdrop-blur px-4 py-2 rounded-2xl flex items-center shadow-2xl">
                  <Star size={16} className="text-accent fill-accent mr-2" />
                  <span className="text-sm font-black">{store.rating}</span>
                </div>
                <div className="absolute bottom-5 left-5 bg-primary text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-2xl shadow-xl flex items-center">
                  <div className="w-2 h-2 bg-white rounded-full mr-2 animate-ping"></div>
                  Ouvert maintenant
                </div>
              </div>
              <div className="p-8">
                <h3 className="font-black text-2xl mb-2 group-hover:text-primary transition-colors leading-tight">{store.name}</h3>
                <div className="flex items-center text-xs opacity-50 font-bold uppercase mb-8">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <MapPin size={16} className="text-primary" />
                  </div>
                  {store.neighborhood}, {store.wilaya}
                </div>
                
                <div className="flex items-center justify-between pt-6 border-t border-gray-50 dark:border-white/5">
                  <div className="flex flex-col">
                    <span className="text-[9px] opacity-40 font-black uppercase tracking-tighter">Distance</span>
                    <span className="text-sm font-black text-primary">{store.distance}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-[9px] opacity-40 font-black uppercase tracking-tighter">Horaires</div>
                    <div className="text-xs font-black uppercase">{store.hours}</div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* État vide */}
        {filteredStores.length === 0 && (
          <div className="text-center py-40 space-y-6">
            <div className="w-24 h-24 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-dashed border-gray-100">
               <MapIcon size={40} className="text-gray-300" />
            </div>
            <h3 className="text-3xl font-black opacity-30 tracking-tight">Aucune boutique ici...</h3>
            <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">Essayez de changer de quartier ou de wilaya.</p>
            <button onClick={resetFilters} className="text-primary font-black uppercase text-sm underline underline-offset-8">Voir tout le pays</button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default StoreList;
