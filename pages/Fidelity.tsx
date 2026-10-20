
import React from 'react';
import Layout from '../components/Layout';
import { useUserStore } from '../stores/useUserStore';
import { useOrderStore } from '../stores/useOrderStore';
import { Gift, Clock, History, Award, Package, Bike, CheckCircle2, ChevronRight, CreditCard, AlertCircle } from 'lucide-react';

const Fidelity: React.FC = () => {
  const { user } = useUserStore();
  const { orders } = useOrderStore();
  const isDark = user?.theme === 'dark';

  const pendingOrders = orders.filter(o => o.status !== 'COMPLETED');
  const completedOrders = orders.filter(o => o.status === 'COMPLETED');

  return (
    <Layout title="Historique & Fidélité">
      <div className={`p-4 md:p-12 space-y-10 ${isDark ? 'text-white' : 'text-dark'}`}>
        
        {/* POINTS HERO SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-primary to-primary-light p-10 rounded-[50px] text-white relative overflow-hidden shadow-2xl shadow-primary/30">
            <div className="relative z-10">
              <span className="text-xs font-black uppercase tracking-[0.2em] opacity-70 mb-2 block">Cagnotte de Quartier</span>
              <div className="flex items-baseline space-x-3 mb-8">
                <span className="text-6xl font-black">{user?.points || 0}</span>
                <span className="text-xl font-bold uppercase opacity-80">pts</span>
              </div>
              
              <div className="space-y-4">
                <div className="bg-white/20 h-4 rounded-full overflow-hidden border border-white/10">
                  <div 
                    className="bg-accent h-full rounded-full shadow-[0_0_20px_rgba(245,158,11,0.5)] transition-all duration-1000" 
                    style={{ width: `${Math.min(((user?.points || 0) / 1000) * 100, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                   <span>Palier Local</span>
                   <span className="text-accent">Prochain bonus à 1000 pts</span>
                </div>
              </div>
            </div>
            <Award className="absolute right-[-20px] bottom-[-20px] text-white/5 rotate-12" size={240} />
          </div>

          <div className={`p-10 rounded-[50px] border flex flex-col justify-center ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
             <h3 className="text-2xl font-black mb-4 tracking-tighter uppercase">Le saviez-vous ?</h3>
             <p className="opacity-60 font-medium mb-8 leading-relaxed">
               En commandant sur Hoomty, vous aidez votre épicier de quartier à se digitaliser tout en cumulant des avantages pour vos futurs achats.
             </p>
             <button className="bg-primary text-white px-8 py-4 rounded-2xl font-black uppercase text-xs w-fit hover:scale-105 transition-all shadow-lg shadow-primary/20">
                Voir les partenaires
             </button>
          </div>
        </div>

        {/* SECTION COMMANDES EN ATTENTE */}
        <section>
          <div className="flex items-center space-x-3 mb-8 px-2">
            <Clock size={28} className="text-accent" />
            <h2 className="text-3xl font-black tracking-tighter uppercase">Commandes en attente</h2>
          </div>
          <div className="space-y-4">
            {pendingOrders.length === 0 ? (
              <div className={`rounded-[40px] py-12 text-center border-2 border-dashed ${isDark ? 'border-white/5 bg-white/2' : 'border-gray-100 bg-gray-50'}`}>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Aucune commande en cours.</p>
              </div>
            ) : (
              pendingOrders.map(order => (
                <div key={order.id} className={`p-6 md:p-8 rounded-[32px] border shadow-sm group animate-in slide-in-from-bottom duration-500 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100'}`}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center space-x-6">
                      <div className="w-16 h-16 bg-accent/10 text-accent rounded-2xl flex items-center justify-center font-black">
                        <AlertCircle size={24} />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                           <h4 className="font-black text-lg">Paiement en attente</h4>
                           <span className="text-[9px] bg-accent/10 text-accent px-2 py-0.5 rounded-full font-black uppercase tracking-widest">{order.status}</span>
                        </div>
                        <p className="text-[11px] opacity-40 font-bold uppercase tracking-widest mt-1">{order.date} • {order.storeName}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between md:justify-end space-x-10 border-t md:border-t-0 pt-4 md:pt-0">
                       <div className="text-right">
                          <span className="text-xl font-black text-accent">{order.total.toLocaleString()} DA</span>
                          <p className="text-[9px] opacity-40 font-black uppercase tracking-tighter">Attente validation commerçant</p>
                       </div>
                       <ChevronRight size={20} className="text-gray-300" />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* SECTION ACHATS EFFECTUÉS (TERMINÉS) */}
        <section>
          <div className="flex items-center space-x-3 mb-8 px-2">
            <CheckCircle2 size={28} className="text-primary" />
            <h2 className="text-3xl font-black tracking-tighter uppercase">Achats effectués</h2>
          </div>
          <div className="space-y-4">
            {completedOrders.length === 0 ? (
              <div className={`rounded-[40px] py-12 text-center border-2 border-dashed ${isDark ? 'border-white/5 bg-white/2' : 'border-gray-100 bg-gray-50'}`}>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Votre historique est vide.</p>
              </div>
            ) : (
              completedOrders.map(order => (
                <div key={order.id} className={`p-6 md:p-8 rounded-[32px] border shadow-sm group transition-all hover:border-primary/30 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100'}`}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center space-x-6">
                      <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center font-black">
                        <CreditCard size={24} />
                      </div>
                      <div>
                        <h4 className="font-black text-lg">Paiement Validé</h4>
                        <p className="text-[11px] opacity-40 font-bold uppercase tracking-widest mt-1">{order.date} • {order.storeName}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between md:justify-end space-x-10 border-t md:border-t-0 pt-4 md:pt-0">
                       <div className="text-right">
                          <span className="text-xl font-black text-primary">+{order.pointsGained} pts</span>
                          <p className="text-[9px] opacity-40 font-black uppercase tracking-tighter">{order.total.toLocaleString()} DA Payés</p>
                       </div>
                       <div className="p-3 bg-primary/10 text-primary rounded-xl">
                          <CheckCircle2 size={20} />
                       </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Fidelity;
