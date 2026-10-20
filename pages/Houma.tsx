import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Briefcase, Map as MapIcon, Plus, Filter, Search, Mic, AlertTriangle } from 'lucide-react';
import { HoumaFeed } from '../components/HoumaFeed';
import { NeighborServices } from '../components/NeighborServices';
import { MapView } from '../components/MapView';
import { CitizenReports } from '../components/CitizenReports';
import { MOCK_NEWS, MOCK_SERVICES, MOCK_STORES, MOCK_REPORTS, TRANSLATIONS } from '../constants';
import { cn } from '../utils';

export const HoumaPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'news' | 'services' | 'map' | 'reports'>('news');
  const lang = 'fr'; // Should be from context
  const t = TRANSLATIONS[lang];

  const handleVoiceSearch = () => {
    alert("🎙️ Recherche vocale (Derja) bientôt disponible !");
  };

  return (
    <div className="min-h-screen pb-24 pt-4 px-4 max-w-2xl mx-auto">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
            {t.neighborhood}
          </h1>
          <p className="text-sm text-zinc-500 font-medium">Hydra, Alger</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleVoiceSearch}
            className="p-2.5 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 text-primary"
          >
            <Mic className="w-5 h-5" />
          </button>
          <button className="p-2.5 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400">
            <Search className="w-5 h-5" />
          </button>
          <button className="p-2.5 bg-zinc-900 dark:bg-zinc-100 rounded-2xl shadow-sm text-white dark:text-zinc-900">
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex p-1.5 bg-zinc-100 dark:bg-zinc-800/50 rounded-2xl mb-6 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('news')}
          className={cn(
            "flex-shrink-0 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold transition-all",
            activeTab === 'news' 
              ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm" 
              : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          )}
        >
          <Users className="w-4 h-4" />
          {t.houma_news}
        </button>
        <button
          onClick={() => setActiveTab('services')}
          className={cn(
            "flex-shrink-0 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold transition-all",
            activeTab === 'services' 
              ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm" 
              : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          )}
        >
          <Briefcase className="w-4 h-4" />
          {t.neighbor_services}
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={cn(
            "flex-shrink-0 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold transition-all",
            activeTab === 'reports' 
              ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm" 
              : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          )}
        >
          <AlertTriangle className="w-4 h-4" />
          Signalements
        </button>
        <button
          onClick={() => setActiveTab('map')}
          className={cn(
            "flex-shrink-0 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold transition-all",
            activeTab === 'map' 
              ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm" 
              : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          )}
        >
          <MapIcon className="w-4 h-4" />
          Carte
        </button>
      </div>

      {/* Content Area */}
      <div className="relative">
        <AnimatePresence mode="wait">
          {activeTab === 'news' && (
            <motion.div
              key="news"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <HoumaFeed news={MOCK_NEWS} />
            </motion.div>
          )}
          {activeTab === 'services' && (
            <motion.div
              key="services"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-zinc-900 dark:text-zinc-100">{t.find_service}</h3>
                <button className="flex items-center gap-1.5 text-xs font-bold text-zinc-500">
                  <Filter className="w-3 h-3" />
                  Filtrer
                </button>
              </div>
              <NeighborServices services={MOCK_SERVICES} />
            </motion.div>
          )}
          {activeTab === 'reports' && (
            <motion.div
              key="reports"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <CitizenReports reports={MOCK_REPORTS} />
            </motion.div>
          )}
          {activeTab === 'map' && (
            <motion.div
              key="map"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <MapView stores={MOCK_STORES} />
              <div className="mt-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-800">
                <p className="text-xs font-medium text-emerald-800 dark:text-emerald-300 leading-relaxed">
                  💡 <strong>Astuce :</strong> Les marqueurs bleus représentent les commerces ouverts actuellement dans votre rayon de 2km.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
