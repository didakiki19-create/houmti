
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { MOCK_STORES, MOCK_PRODUCTS, CATEGORIES } from '../constants';
import { useUserStore } from '../stores/useUserStore';
import { useCartStore } from '../stores/useCartStore';
import { Plus, MapPin, Star, Phone, MessageCircle } from 'lucide-react';
import { ProductOrigin } from '../types';

const Catalog: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCartStore();
  const { user } = useUserStore();
  const [activeCat, setActiveCat] = useState('all');
  const [showLocalOnly, setShowLocalOnly] = useState(false);
  const isDark = user?.theme === 'dark';

  const store = MOCK_STORES.find(s => s.id === id);
  let products = MOCK_PRODUCTS.filter(p => p.storeId === id);

  if (activeCat !== 'all') products = products.filter(p => p.category === activeCat);
  if (showLocalOnly) products = products.filter(p => p.origin === ProductOrigin.LOCAL);

  const handleCategoryClick = (catId: string) => {
    if (catId === 'all') {
      setActiveCat('all');
    } else if (catId === store?.category) {
      setActiveCat(catId);
    } else {
      // Si on clique sur un autre type de commerce, on redirige vers la liste des commerces
      navigate(`/stores?category=${catId}`);
    }
  };

  if (!store) return <Layout showBack>Boutique non trouvée</Layout>;

  return (
    <Layout title={store.name} showBack>
      <div className="relative h-64 md:h-96">
        <img src={store.image} className="w-full h-full object-cover" alt={store.name} />
        <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent opacity-80"></div>
        <div className="absolute bottom-8 left-4 md:left-12 text-white">
          <h1 className="text-3xl md:text-6xl font-black uppercase mb-2">{store.name}</h1>
          <div className="flex items-center space-x-4 text-[10px] font-black uppercase tracking-widest">
            <span className="flex items-center"><MapPin size={12} className="mr-1.5" /> {store.neighborhood}</span>
            <span className="flex items-center text-accent"><Star size={12} className="mr-1.5 fill-current" /> {store.rating}</span>
          </div>
          {store.phone && (
            <a 
              href={`https://wa.me/${store.phone.replace(/\+/g, '')}?text=Bonjour ${store.name}, je vous contacte via Hoomty pour une demande d'information.`} 
              target="_blank" 
              rel="noreferrer"
              className="mt-4 inline-flex items-center px-6 py-3 bg-emerald-500 rounded-2xl text-white font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/40"
            >
              <MessageCircle size={16} className="mr-2" />
              Contacter via WhatsApp
            </a>
          )}
        </div>
        <div className="absolute top-4 right-4 flex space-x-2">
           <a href={`tel:${store.phone}`} className="p-3 bg-white/10 backdrop-blur rounded-2xl text-white hover:bg-white/20"><Phone size={20}/></a>
           <a 
             href={`https://wa.me/${store.phone?.replace(/\+/g, '')}?text=Bonjour ${store.name}, je vous contacte via Hoomty.`} 
             target="_blank" 
             rel="noreferrer"
             className="p-3 bg-emerald-500 rounded-2xl text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/20"
           >
             <MessageCircle size={20}/>
           </a>
        </div>
      </div>

      <div className={`p-4 md:p-12 space-y-10 ${isDark ? 'bg-[#121212]' : 'bg-white'} rounded-t-[40px] -mt-10 relative z-10`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex space-x-3 overflow-x-auto no-scrollbar pb-2">
            {CATEGORIES.map(cat => (
              <button key={cat.id} onClick={() => handleCategoryClick(cat.id)} className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeCat === cat.id ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-white/5'}`}>
                {user?.lang === 'ar' ? cat.nameAr : cat.name}
              </button>
            ))}
          </div>
          <button onClick={() => setShowLocalOnly(!showLocalOnly)} className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${showLocalOnly ? 'bg-primary border-primary text-white' : 'border-primary text-primary'}`}>
            Filtre Terroir 🇩🇿
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {products.map(p => (
            <div key={p.id} className={`group rounded-[32px] border overflow-hidden transition-all hover:shadow-2xl ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-gray-100'}`}>
              <div className="relative aspect-square overflow-hidden">
                <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                {p.stock <= 5 && p.stock > 0 && <span className="absolute top-2 right-2 bg-orange-500 text-white text-[8px] px-2 py-1 rounded-lg font-black">STOCK BAS</span>}
                {p.stock === 0 && <div className="absolute inset-0 bg-dark/60 flex items-center justify-center text-white text-[10px] font-black uppercase">Épuisé</div>}
              </div>
              <div className="p-5">
                <div className="text-[8px] opacity-40 font-black uppercase tracking-widest">{p.category}</div>
                <h4 className="font-bold text-sm h-10 line-clamp-2 mt-1">{p.name}</h4>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-black text-primary">{p.price} DA</span>
                  <button 
                    disabled={p.stock === 0}
                    onClick={() => addToCart(p)} 
                    className={`p-2 rounded-xl transition-all ${p.stock === 0 ? 'bg-gray-200 text-gray-400' : 'bg-primary text-white shadow-lg active:scale-90'}`}>
                    <Plus size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Catalog;
