import React from 'react';
import { motion } from 'motion/react';
import { Star, Phone, Wrench, Zap, Trash2, GraduationCap, MoreHorizontal, MessageCircle } from 'lucide-react';
import { HoumaService } from '../types';

interface NeighborServicesProps {
  services: HoumaService[];
}

export const NeighborServices: React.FC<NeighborServicesProps> = ({ services }) => {
  const getCategoryIcon = (category: HoumaService['category']) => {
    switch (category) {
      case 'PLUMBING': return <Wrench className="w-5 h-5" />;
      case 'ELECTRICITY': return <Zap className="w-5 h-5" />;
      case 'CLEANING': return <Trash2 className="w-5 h-5" />;
      case 'TUTORING': return <GraduationCap className="w-5 h-5" />;
      default: return <MoreHorizontal className="w-5 h-5" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {services.map((service, index) => (
        <motion.div
          key={service.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white dark:bg-zinc-900 rounded-2xl p-4 shadow-sm border border-zinc-100 dark:border-zinc-800 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-zinc-600 dark:text-zinc-400">
                {getCategoryIcon(service.category)}
              </div>
              <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-lg">
                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                <span className="text-xs font-bold text-amber-700 dark:text-amber-400">{service.rating}</span>
              </div>
            </div>
            <h4 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">{service.title}</h4>
            <p className="text-xs text-zinc-500 mb-2">{service.provider}</p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 line-clamp-2">
              {service.description}
            </p>
          </div>
          <div className="flex items-center gap-2 mt-auto">
            {service.price && (
              <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mr-auto">
                {service.price}
              </span>
            )}
            <a
              href={`https://wa.me/${service.phone.replace(/\+/g, '')}?text=Bonjour ${service.provider}, je vous contacte via Hoomty pour votre service ${service.title}.`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center w-10 h-10 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
            </a>
            <a
              href={`tel:${service.phone}`}
              className="flex items-center gap-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-2 rounded-xl text-xs font-bold hover:opacity-90 transition-opacity"
            >
              <Phone className="w-3 h-3" />
              Appeler
            </a>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
