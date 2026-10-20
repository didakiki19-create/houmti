
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { 
  TrendingUp, 
  Package, 
  DollarSign, 
  Printer, 
  AlertTriangle,
  Zap,
  CheckCircle2,
  Clock,
  CreditCard,
  Search
} from 'lucide-react';
import { MOCK_PRODUCTS } from '../constants';
import { useUserStore } from '../stores/useUserStore';
import { useOrderStore } from '../stores/useOrderStore';

const Dashboard: React.FC = () => {
  const { user } = useUserStore();
  const { orders } = useOrderStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'stock' | 'clients'>('overview');
  const [stockSearch, setStockSearch] = useState('');
  const [stockSort, setStockSort] = useState<'name' | 'stock' | 'price'>('name');
  const isDark = user?.theme === 'dark';

  // Simulation d'une fonction de validation commerçant
  const handleValidateOrder = (orderId: string) => {
    // Dans une vraie app, on mettrait à jour le statut de la commande dans la DB
    alert(`Paiement de la commande ${orderId} validé avec succès !`);
    // Note: Pour cette démo, on ne modifie pas l'état global directement pour éviter les bugs complexes sans backend réel
  };

  const pendingMerchantOrders = [
    { id: 'ORD-772', client: 'Mourad31', total: '2,400', date: 'Aujourd\'hui', items: 3 },
    { id: 'ORD-901', client: 'Ines_Algr', total: '1,150', date: 'Hier', items: 2 }
  ];

  const stats = [
    { label: 'Chiffre d\'affaires', val: '52,400 DA', icon: DollarSign, color: 'text-emerald-500' },
    { label: 'Paiements à valider', val: pendingMerchantOrders.length.toString(), icon: Clock, color: 'text-accent' },
    { label: 'Fidélité Clients', val: '42%', icon: TrendingUp, color: 'text-blue-500' },
  ];

  const handleLaunchFlashPromo = () => {
    alert("🚀 Promo Flash lancée ! Tous vos clients d'Hydra ont reçu une notification.");
  };

  const lowStockProducts = MOCK_PRODUCTS.filter(p => p.stock < 10);

  const merchantProducts = MOCK_PRODUCTS
    .filter(p => p.name.toLowerCase().includes(stockSearch.toLowerCase()))
    .sort((a, b) => {
      if (stockSort === 'stock') return a.stock - b.stock;
      if (stockSort === 'price') return a.price - b.price;
      return a.name.localeCompare(b.name);
    });

  return (
    <Layout title="Dashboard Commerçant">
      <div className={`p-4 md:p-12 space-y-10 ${isDark ? 'text-white' : 'text-dark'}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase">Portail Gestion</h2>
            <p className="text-[10px] opacity-50 font-black uppercase tracking-[0.3em] mt-1">Supérette El Mordjane • Hydra</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handleLaunchFlashPromo}
              className="bg-accent text-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-accent/20 flex items-center space-x-3 hover:scale-105 active:scale-95 transition-all"
            >
               <Zap size={18} fill="currentColor" />
               <span>Promo Flash</span>
            </button>
            <button className="bg-primary text-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 flex items-center space-x-3 hover:scale-105 active:scale-95 transition-all">
               <Package size={18} />
               <span>Arrivage</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((s, i) => (
            <div key={i} className={`p-8 rounded-[40px] border flex flex-col justify-between transition-all hover:-translate-y-1 ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
              <div className={`p-4 rounded-2xl w-fit ${s.color} bg-current/10`}><s.icon size={28} /></div>
              <div className="mt-8">
                <span className="text-[10px] opacity-40 font-black uppercase tracking-widest">{s.label}</span>
                <div className="text-3xl font-black mt-2 tracking-tight">{s.val}</div>
              </div>
            </div>
          ))}
        </div>

        <div className={`flex space-x-8 border-b ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
          {['overview', 'stock', 'clients'].map(t => (
            <button key={t} onClick={() => setActiveTab(t as any)} className={`pb-4 text-xs font-black uppercase tracking-widest relative transition-all ${activeTab === t ? 'text-primary' : 'opacity-40'}`}>
              {t === 'overview' ? 'Validation Paiements' : t}
              {activeTab === t && <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full"></div>}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-xl font-black uppercase tracking-tighter px-2">Flux de paiements encaissés</h3>
              {pendingMerchantOrders.map(order => (
                <div key={order.id} className={`p-6 md:p-8 rounded-[32px] border flex flex-col sm:flex-row items-center justify-between group gap-6 transition-all hover:border-accent/30 ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
                  <div className="flex items-center space-x-6 w-full sm:w-auto">
                    <div className="w-16 h-16 bg-accent/10 text-accent rounded-2xl flex items-center justify-center font-black">
                       <CreditCard size={28} />
                    </div>
                    <div>
                      <h4 className="font-black text-lg">{order.client}</h4>
                      <p className="text-[10px] opacity-40 font-black uppercase tracking-widest">{order.items} articles • {order.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end space-x-6 w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0">
                    <div className="text-right">
                       <span className="text-xl font-black text-accent">{order.total} DA</span>
                       <p className="text-[8px] font-black uppercase opacity-30 tracking-widest">En attente de validation</p>
                    </div>
                    <button 
                      onClick={() => handleValidateOrder(order.id)}
                      className="p-4 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary-light transition-all active:scale-90"
                      title="Valider le paiement"
                    >
                      <CheckCircle2 size={24} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-6">
              <div className="p-8 bg-error/10 border border-error/20 rounded-[40px]">
                <h3 className="text-xl font-black text-error flex items-center mb-6"><AlertTriangle className="mr-3" /> Rayons vides</h3>
                <div className="space-y-4">
                  {lowStockProducts.map(p => (
                    <div key={p.id} className="flex justify-between items-center text-sm font-bold">
                      <span className="opacity-70 text-xs">{p.name}</span>
                      <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase ${p.stock === 0 ? 'bg-error text-white' : 'bg-white text-error'}`}>
                        {p.stock === 0 ? 'RUPTURE' : `${p.stock} unités`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`p-8 rounded-[40px] border ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-gray-100'}`}>
                <h3 className="text-xl font-black mb-6 uppercase tracking-tighter">Votre Impact Houma</h3>
                <div className="space-y-4">
                   <div className="flex justify-between items-end">
                      <span className="text-[10px] font-black opacity-40 uppercase">Clients Fidèles</span>
                      <span className="text-2xl font-black">124</span>
                   </div>
                   <div className="w-full bg-gray-100 dark:bg-white/5 h-2 rounded-full overflow-hidden">
                      <div className="bg-primary h-full w-[65%] rounded-full shadow-sm"></div>
                   </div>
                   <p className="text-[9px] opacity-50 italic">Félicitations ! Vous êtes le commerce le plus actif d'Hydra ce mois-ci.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'stock' && (
           <div className="space-y-8">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text"
                    placeholder="Rechercher un produit..."
                    value={stockSearch}
                    onChange={(e) => setStockSearch(e.target.value)}
                    className={`w-full border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-primary outline-none transition-all ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}
                  />
                </div>
                <div className="flex items-center space-x-4 w-full md:w-auto">
                  <span className="text-[10px] font-black opacity-40 uppercase tracking-widest whitespace-nowrap">Trier par</span>
                  <select 
                    value={stockSort}
                    onChange={(e) => setStockSort(e.target.value as any)}
                    className={`flex-1 md:w-48 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-primary outline-none transition-all appearance-none ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}
                  >
                    <option value="name">Nom (A-Z)</option>
                    <option value="stock">Stock (Croissant)</option>
                    <option value="price">Prix (Croissant)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {merchantProducts.map(p => (
                  <div key={p.id} className={`p-6 rounded-[32px] border flex items-center space-x-6 transition-all hover:border-primary/30 ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
                    <img src={p.image} className="w-20 h-20 rounded-2xl object-cover" alt={p.name} />
                    <div className="flex-1">
                      <h4 className="font-bold text-sm line-clamp-1">{p.name}</h4>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-primary font-black">{p.price} DA</span>
                        <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase ${p.stock <= 5 ? 'bg-error text-white' : 'bg-primary/10 text-primary'}`}>
                          {p.stock} en stock
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {merchantProducts.length === 0 && (
                <div className="py-20 text-center">
                  <Package size={48} className="mx-auto opacity-10 mb-4" />
                  <h3 className="text-2xl font-black opacity-30 uppercase tracking-tighter">Aucun produit trouvé</h3>
                </div>
              )}
           </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
