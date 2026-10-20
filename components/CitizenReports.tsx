import React from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, Clock, CheckCircle2, MapPin, User, Calendar } from 'lucide-react';
import { CitizenReport } from '../types';
import { cn } from '../utils';

interface CitizenReportsProps {
  reports: CitizenReport[];
}

export const CitizenReports: React.FC<CitizenReportsProps> = ({ reports }) => {
  const getStatusIcon = (status: CitizenReport['status']) => {
    switch (status) {
      case 'PENDING': return <Clock className="w-4 h-4 text-amber-500" />;
      case 'IN_PROGRESS': return <AlertTriangle className="w-4 h-4 text-blue-500" />;
      case 'RESOLVED': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
    }
  };

  const getStatusText = (status: CitizenReport['status']) => {
    switch (status) {
      case 'PENDING': return 'En attente';
      case 'IN_PROGRESS': return 'En cours';
      case 'RESOLVED': return 'Résolu';
    }
  };

  const getCategoryLabel = (category: CitizenReport['category']) => {
    switch (category) {
      case 'INFRASTRUCTURE': return 'Infrastructure';
      case 'CLEANLINESS': return 'Propreté';
      case 'SECURITY': return 'Sécurité';
      case 'OTHER': return 'Autre';
    }
  };

  return (
    <div className="space-y-4">
      {reports.map((report, index) => (
        <motion.div
          key={report.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white dark:bg-zinc-900 rounded-3xl p-5 border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all group"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-[10px] font-black uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                {getCategoryLabel(report.category)}
              </span>
              <div className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider",
                report.status === 'PENDING' && "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
                report.status === 'IN_PROGRESS' && "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
                report.status === 'RESOLVED' && "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
              )}>
                {getStatusIcon(report.status)}
                {getStatusText(report.status)}
              </div>
            </div>
            <span className="text-[10px] text-zinc-400 font-medium flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(report.date).toLocaleDateString()}
            </span>
          </div>

          <h4 className="text-lg font-black text-zinc-900 dark:text-zinc-100 mb-2 group-hover:text-primary transition-colors">
            {report.title}
          </h4>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
            {report.description}
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-zinc-50 dark:border-zinc-800/50">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-bold">
                <User className="w-3.5 h-3.5 text-orange-500" />
                {report.author}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-bold">
                <MapPin className="w-3.5 h-3.5" />
                {report.neighborhood}
              </div>
            </div>
            <button className="text-xs font-black text-primary uppercase tracking-widest hover:underline">
              Voir détails
            </button>
          </div>
        </motion.div>
      ))}

      <button className="w-full py-4 bg-primary text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all mt-4">
        Signaler un nouveau problème
      </button>
    </div>
  );
};
