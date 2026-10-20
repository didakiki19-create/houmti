
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useUserStore } from '../stores/useUserStore';
import { useCartStore } from '../stores/useCartStore';
import { useOrderStore } from '../stores/useOrderStore';
import { useNotificationStore } from '../stores/useNotificationStore';
import { Minus, Plus, Trash2, ShoppingBag, CreditCard, MapPin, ChevronDown, Check } from 'lucide-react';
import { Address, CartItem } from '../types';

import { MOCK_STORES } from '../constants';

const Cart: React.FC = () => {
  const { user } = useUserStore();
  const { items: cart, updateQuantity, removeFromCart, clearCart } = useCartStore();
  const { addOrders } = useOrderStore();
  const { addNotification } = useNotificationStore();
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(user?.addresses[0] || null);
  const [showAddressPicker, setShowAddressPicker] = useState(false);
  const navigate = useNavigate();
  const isDark = user?.theme === 'dark';

  const placeOrder = (address: Address, storeId?: string) => {
    const storeItems = storeId ? cart.filter(i => i.storeId === storeId) : cart;
    if (storeItems.length === 0) return;
    const storeSubtotal = storeItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const deliveryFee = 150;
    const total = storeSubtotal + deliveryFee;
    
    const newOrder = {
      id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
      storeId: storeId || storeItems[0]?.storeId,
      storeName: MOCK_STORES.find(s => s.id === (storeId || storeItems[0]?.storeId))?.name || 'Épicerie',
      items: storeItems,
      total,
      status: 'PENDING' as const,
      date: new Date().toLocaleDateString(),
      pointsGained: Math.floor(storeSubtotal / 100)
    };
    
    addOrders([newOrder]);
    storeItems.forEach(item => removeFromCart(item.id));
    addNotification({
      id: Math.random().toString(),
      title: 'Commande validée',
      message: `Votre commande chez ${newOrder.storeName} a été enregistrée.`,
      date: 'À l\'instant',
      read: false
    });
    navigate('/fidelity');
  };

  // Group items by storeId
  const groupedCart = cart.reduce((acc, item) => {
    if (!acc[item.storeId]) {
      acc[item.storeId] = [];
    }
    acc[item.storeId].push(item);
    return acc;
  }, {} as Record<string, typeof cart>);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const numMerchants = Object.keys(groupedCart).length;
  const deliveryFeePerMerchant = 150;
  const totalDeliveryFee = numMerchants * deliveryFeePerMerchant;
  const total = subtotal + totalDeliveryFee;

  const handleCheckout = (storeId?: string) => {
    if (selectedAddress) {
      placeOrder(selectedAddress, storeId);
    } else {
      alert("Veuillez sélectionner une adresse de livraison");
    }
  };

  return (
    <Layout title="Mon Panier" showBack>
      <div className={`p-4 md:p-12 space-y-8 ${isDark ? 'text-white' : 'text-dark'}`}>
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <ShoppingBag size={80} className="opacity-10 mb-8" />
            <h3 className="text-2xl font-black">Panier vide</h3>
            <button onClick={() => navigate('/home')} className="mt-8 bg-primary text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest">Faire mes courses</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-10">
              {(Object.entries(groupedCart) as [string, CartItem[]][]).map(([storeId, items]) => {
                const store = MOCK_STORES.find(s => s.id === storeId);
                const storeSubtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
                const storeTotal = storeSubtotal + deliveryFeePerMerchant;
                
                return (
                  <div key={storeId} className={`rounded-[40px] border overflow-hidden ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-gray-100 shadow-sm'}`}>
                    <div className={`p-6 border-b flex items-center justify-between ${isDark ? 'border-white/5 bg-white/5' : 'bg-gray-50/50 border-gray-100'}`}>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <ShoppingBag size={18} className="text-primary" />
                        </div>
                        <div>
                          <h3 className="text-lg font-black uppercase tracking-tight">{store?.name || 'Commerçant inconnu'}</h3>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{items.length} article(s)</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black opacity-40 uppercase tracking-widest">Total Commerçant</p>
                        <p className="font-black text-primary text-xl">{storeTotal.toLocaleString()} DA</p>
                        <p className="text-[9px] opacity-40 font-bold uppercase tracking-tighter">(Livraison incluse)</p>
                      </div>
                    </div>

                    <div className="p-6 space-y-4">
                      <div className="space-y-3">
                        {items.map(item => (
                          <div key={item.id} className={`p-4 rounded-[24px] border flex items-center space-x-4 ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-gray-50 shadow-sm'}`}>
                            <img src={item.image} className="w-14 h-14 rounded-xl object-cover" />
                            <div className="flex-1">
                              <h4 className="font-bold text-sm">{item.name}</h4>
                              <span className="text-primary font-black text-xs">{item.price} DA</span>
                            </div>
                            <div className={`flex items-center p-1 rounded-lg space-x-2 ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                              <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:text-primary transition-colors"><Minus size={12} /></button>
                              <span className="font-black w-4 text-center text-[10px]">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:text-primary transition-colors"><Plus size={12} /></button>
                            </div>
                            <button onClick={() => removeFromCart(item.id)} className="text-error opacity-40 hover:opacity-100 transition-opacity"><Trash2 size={16} /></button>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t border-dashed border-gray-100 dark:border-white/5">
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          Articles: {storeSubtotal.toLocaleString()} DA + Livraison: {deliveryFeePerMerchant} DA
                        </div>
                        <button 
                          onClick={() => handleCheckout(storeId)}
                          className="bg-primary text-white px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center"
                        >
                          <CreditCard size={14} className="mr-2" /> Confirmer ce commerçant
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <aside className="space-y-6">
              <div className={`p-8 rounded-[40px] border ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-gray-100 shadow-lg shadow-gray-200/20'}`}>
                <h3 className="text-xl font-black mb-8">Résumé de la commande</h3>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-sm opacity-50"><span>Sous-total articles</span><span>{subtotal.toLocaleString()} DA</span></div>
                  <div className="flex justify-between text-sm opacity-50">
                    <span>Livraison ({numMerchants} commerçants)</span>
                    <span>{totalDeliveryFee.toLocaleString()} DA</span>
                  </div>
                  <div className={`pt-4 border-t border-dashed flex justify-between items-center ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                    <span className="font-black uppercase text-xs">Total Général</span>
                    <span className="text-3xl font-black text-primary">{total.toLocaleString()} DA</span>
                  </div>
                </div>

                <div className="mb-10">
                  <label className="text-[10px] font-black uppercase opacity-40 mb-3 block">Destination de livraison</label>
                  <div className="relative">
                    <button 
                      onClick={() => setShowAddressPicker(!showAddressPicker)}
                      className={`w-full flex items-center justify-between p-5 rounded-2xl text-xs font-bold text-left transition-all ${isDark ? 'bg-white/5' : 'bg-gray-100 hover:bg-gray-200'}`}
                    >
                      <div className="flex items-center">
                        <MapPin size={16} className="text-primary mr-3" />
                        <span>{selectedAddress?.label || "Choisir mon adresse"}</span>
                      </div>
                      <ChevronDown size={16} className={`transition-transform ${showAddressPicker ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {showAddressPicker && (
                      <div className={`absolute top-full left-0 right-0 mt-2 rounded-2xl border z-20 overflow-hidden animate-in slide-in-from-top-2 duration-200 ${isDark ? 'bg-dark border-white/10' : 'bg-white border-gray-100 shadow-2xl'}`}>
                        {user?.addresses.map(addr => (
                          <button 
                            key={addr.id}
                            onClick={() => { setSelectedAddress(addr); setShowAddressPicker(false); }}
                            className={`w-full p-4 text-left hover:bg-primary/5 flex items-center justify-between group transition-all ${selectedAddress?.id === addr.id ? 'bg-primary/5 text-primary' : ''}`}
                          >
                            <div>
                              <p className="font-black text-xs uppercase">{addr.label}</p>
                              <p className="text-[10px] opacity-40 mt-1">{addr.neighborhood}, {addr.wilaya}</p>
                            </div>
                            {selectedAddress?.id === addr.id && <Check size={16} />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10">
                  <p className="text-[9px] font-black uppercase text-primary leading-tight">
                    * La confirmation se fait par commerçant. Cliquez sur "Confirmer ce commerçant" pour chaque boutique.
                  </p>
                </div>
              </div>
              
              <div className="bg-primary/10 p-6 rounded-[32px] text-center">
                 <p className="text-[10px] font-black uppercase tracking-widest text-primary">Points de fidélité à gagner</p>
                 <div className="text-2xl font-black text-primary mt-1">+{Math.floor(subtotal / 100)} pts</div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Cart;
