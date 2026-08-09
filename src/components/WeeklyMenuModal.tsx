import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Utensils, Calendar, ExternalLink } from 'lucide-react';

interface WeeklyMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  institutionTitle: string;
  menuUrl?: string;
  menuTitle?: string;
}

export const WeeklyMenuModal: React.FC<WeeklyMenuModalProps> = ({
  isOpen,
  onClose,
  institutionTitle,
  menuUrl,
  menuTitle = 'Haftalık Yemek & Beslenme Menüsü',
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl p-6 shadow-2xl text-slate-100 overflow-hidden max-h-[85vh] flex flex-col"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-4 pr-8">
            <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/30">
              <Utensils className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{menuTitle}</h3>
              <p className="text-xs text-slate-400">{institutionTitle}</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {menuUrl ? (
              <div className="space-y-3">
                {menuUrl.endsWith('.pdf') ? (
                  <iframe
                    src={menuUrl}
                    className="w-full h-80 rounded-2xl border border-slate-800"
                    title="Menu PDF"
                  />
                ) : (
                  <img
                    src={menuUrl}
                    alt="Yemek Menüsü"
                    className="w-full rounded-2xl border border-slate-800 object-cover"
                  />
                )}
                <a
                  href={menuUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition"
                >
                  Tam Ekran / İndir <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ) : (
              /* Sample Interactive Weekly Menu Table when no custom image URL is provided */
              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-3 text-xs">
                <div className="flex items-center justify-between text-slate-400 font-bold border-b border-slate-800 pb-2">
                  <span>Gün</span>
                  <span>Öğle Yemeği</span>
                  <span>İkindi Kahvaltısı</span>
                </div>

                <div className="flex items-center justify-between text-slate-200">
                  <span className="font-bold text-amber-400">Pazartesi</span>
                  <span>Mercimek Çorbası, Izgara Köfte, Makarna</span>
                  <span className="text-slate-400">Meyve Tabağı</span>
                </div>
                <div className="flex items-center justify-between text-slate-200">
                  <span className="font-bold text-amber-400">Salı</span>
                  <span>Tavuk Sote, Pirinç Pilavı, Cacık</span>
                  <span className="text-slate-400">Ev Yapımı Kek</span>
                </div>
                <div className="flex items-center justify-between text-slate-200">
                  <span className="font-bold text-amber-400">Çarşamba</span>
                  <span>Sebzeli Et Yemeği, Bulgur Pilavı, Yoğurt</span>
                  <span className="text-slate-400">Süt & Kurabiye</span>
                </div>
                <div className="flex items-center justify-between text-slate-200">
                  <span className="font-bold text-amber-400">Perşembe</span>
                  <span>Tarhana Çorbası, Fırın Balık, Patates</span>
                  <span className="text-slate-400">Fındık & Kuru Üzüm</span>
                </div>
                <div className="flex items-center justify-between text-slate-200">
                  <span className="font-bold text-amber-400">Cuma</span>
                  <span>Kuru Fasulye, Pirinç Pilavı, Turşu</span>
                  <span className="text-slate-400">Taze Sıkma Meyve Suyu</span>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 rounded-xl transition"
            >
              Kapat
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
