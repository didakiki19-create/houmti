
import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  Home, 
  Store as StoreIcon, 
  ShoppingCart, 
  User, 
  ChevronLeft, 
  MapPin,
  Gift,
  LayoutDashboard,
  Bell,
  Sun,
  Moon,
  Search,
  Users
} from 'lucide-react';
import { useUserStore } from '../stores/useUserStore';
import { useCartStore } from '../stores/useCartStore';
import { useNotificationStore } from '../stores/useNotificationStore';
import { UserRole } from '../types';
import { TRANSLATIONS } from '../constants';
import { InstallPWA } from './InstallPWA';

const PremiumLogo = ({ className = "w-10 h-10" }: { className?: string }) => (
  <div className={`relative ${className} group cursor-pointer`}>
    <div className="absolute inset-0 bg-primary rounded-[18px] rotate-6 group-hover:rotate-12 transition-all duration-500 shadow-lg shadow-primary/20"></div>
    <div className="absolute inset-0 bg-slate-950 dark:bg-white rounded-[18px] -rotate-3 group-hover:rotate-0 transition-all duration-500 flex items-center justify-center overflow-hidden border border-white/10">
      <span className="text-white dark:text-primary font-black text-2xl tracking-tighter select-none">H</span>
      <div className="absolute bottom-1.5 right-1.5 w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_8px_#059669]"></div>
    </div>
  </div>
);

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  showBack?: boolean;
  hideNav?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, title, showBack = false, hideNav = false }) => {
  const { user, toggleTheme, toggleLang } = useUserStore();
  const { items: cart } = useCartStore();
  const { notifications } = useNotificationStore();
  const [showNotifs, setShowNotifs] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isClient = user?.role === UserRole.CLIENT;
  const unreadCount = notifications.filter(n => !n.read).length;
  const t = TRANSLATIONS[user?.lang || 'fr'];
  const isDark = user?.theme === 'dark';

  const navItems = isClient ? [
    { label: 'Accueil', icon: Home, path: '/home' },
    { label: 'Houma', icon: Users, path: '/houma' },
    { label: 'Boutiques', icon: StoreIcon, path: '/stores' },
    { label: 'Fidélité', icon: Gift, path: '/fidelity' },
    { label: 'Moi', icon: User, path: '/profile' },
  ] : [
    { label: 'Admin', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Profil', icon: User, path: '/profile' },
  ];

  return (
    <div className={`flex flex-col h-screen overflow-hidden ${isDark ? 'dark bg-slate-950 text-white' : 'bg-light text-slate-900'} ${user?.lang === 'ar' ? 'font-arabic text-right' : ''}`} dir={user?.lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* HEADER PREMIUM */}
      <header className="sticky top-0 z-[60] px-4 md:px-12 h-18 md:h-24 shrink-0 flex items-center justify-between glass-header border-b border-black/5 dark:border-white/5 transition-all">
        <div className="flex items-center space-x-4 md:space-x-8 rtl:space-x-reverse">
          {showBack && (
            <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white/50 dark:bg-white/5 border border-black/5 dark:border-white/10 hover:bg-white transition-all shadow-sm">
              <ChevronLeft size={20} className={user?.lang === 'ar' ? 'rotate-180' : ''} />
            </button>
          )}
          <Link to="/home" className="flex items-center space-x-3 rtl:space-x-reverse">
            <PremiumLogo className="w-10 h-10 md:w-12 md:h-12" />
            <div className="hidden lg:block">
              <span className="font-black text-2xl tracking-tight block leading-none">Hoomty</span>
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary">Prestige</span>
            </div>
          </Link>
        </div>

        <div className="flex items-center space-x-2 md:space-x-4 rtl:space-x-reverse">
          {/* Pseudonym & Avatar Pill */}
          <Link to="/profile" className={`flex items-center pl-4 pr-1.5 py-1.5 rounded-full border transition-all ${isDark ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-white border-black/5 hover:shadow-md shadow-sm'}`}>
            <div className="flex flex-col items-end mr-3 hidden sm:flex">
               <span className="text-[10px] font-black text-primary uppercase tracking-widest">{user?.role}</span>
               <span className="text-xs font-bold tracking-tight">{user?.pseudonym}</span>
            </div>
            <div className="w-9 h-9 rounded-2xl bg-orange-500 text-white flex items-center justify-center font-black shadow-lg shadow-orange-500/30">
              {user?.pseudonym?.[0].toUpperCase()}
            </div>
          </Link>

          <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
            <InstallPWA variant="minimal" />

            <button onClick={toggleTheme} className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white/50 dark:bg-white/5 border border-black/5 dark:border-white/10 hover:scale-110 transition-all">
              {isDark ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} />}
            </button>
            
            <div className="relative">
              <button onClick={() => setShowNotifs(!showNotifs)} className={`w-10 h-10 flex items-center justify-center rounded-2xl transition-all ${showNotifs ? 'bg-primary text-white' : 'bg-white/50 dark:bg-white/5 border border-black/5 dark:border-white/10'}`}>
                <Bell size={18} />
                {unreadCount > 0 && <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-error rounded-full ring-2 ring-white dark:ring-slate-900"></span>}
              </button>
            </div>

            {isClient && (
              <Link to="/cart" className="relative w-10 h-10 flex items-center justify-center bg-primary text-white rounded-2xl shadow-lg shadow-primary/30 hover:scale-110 active:scale-90 transition-all">
                <ShoppingCart size={18} />
                {cart.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-slate-950 text-white text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white dark:border-slate-950">
                    {cart.length}
                  </span>
                )}
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar scroll-smooth">
        <div className="max-w-7xl mx-auto w-full px-4 md:px-12 py-6 md:py-10">
          {children}
        </div>
      </main>

      {!hideNav && (
        <nav className="md:hidden sticky bottom-0 z-[60] px-6 pb-6 pt-2">
          <div className="flex items-center justify-around h-16 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl rounded-[28px] shadow-2xl border border-black/5 dark:border-white/10">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link key={item.path} to={item.path} className={`flex flex-col items-center justify-center w-full transition-all ${isActive ? (item.icon === User ? 'text-orange-500' : 'text-primary') : 'text-slate-400 dark:text-slate-500'}`}>
                  <div className={`p-2 transition-all ${isActive ? (item.icon === User ? 'bg-orange-500 text-white rounded-2xl shadow-lg shadow-orange-500/30' : 'bg-primary/10 text-primary rounded-xl') : 'rounded-xl hover:bg-black/5 dark:hover:bg-white/5'}`}>
                    <Icon size={24} className={isActive ? 'stroke-[2.5px]' : ''} />
                  </div>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
};

export default Layout;
