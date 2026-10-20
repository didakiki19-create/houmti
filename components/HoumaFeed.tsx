import React from 'react';
import { motion } from 'motion/react';
import { MessageSquare, ThumbsUp, Bell, Info, AlertTriangle, Calendar } from 'lucide-react';
import { HoumaNews } from '../types';
import { cn } from '../utils';

interface HoumaFeedProps {
  news: HoumaNews[];
}

export const HoumaFeed: React.FC<HoumaFeedProps> = ({ news }) => {
  const getTypeIcon = (type: HoumaNews['type']) => {
    switch (type) {
      case 'ALERT': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'INFO': return <Info className="w-5 h-5 text-blue-500" />;
      case 'EVENT': return <Calendar className="w-5 h-5 text-emerald-500" />;
      case 'PROMO': return <Bell className="w-5 h-5 text-amber-500" />;
      default: return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-4">
      {news.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white dark:bg-zinc-900 rounded-2xl p-4 shadow-sm border border-zinc-100 dark:border-zinc-800"
        >
          <div className="flex items-start gap-3">
            <div className={cn(
              "p-2 rounded-xl",
              item.type === 'ALERT' ? "bg-red-50 dark:bg-red-900/20" :
              item.type === 'INFO' ? "bg-blue-50 dark:bg-blue-900/20" :
              item.type === 'EVENT' ? "bg-emerald-50 dark:bg-emerald-900/20" :
              "bg-amber-50 dark:bg-amber-900/20"
            )}>
              {getTypeIcon(item.type)}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">{item.author}</h4>
                <span className="text-xs text-zinc-500">{item.time}</span>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3 leading-relaxed">
                {item.content}
              </p>
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                  <ThumbsUp className="w-4 h-4" />
                  {item.likes}
                </button>
                <button className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                  <MessageSquare className="w-4 h-4" />
                  {item.comments}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
