import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Check, ArrowRight } from 'lucide-react';
import { INSTITUTIONAL_PRESETS } from './InstitutionalPresets';
import { InstitutionalPreset } from '../types';

interface PresetSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset: (preset: InstitutionalPreset) => void;
}

export const PresetSelectorModal: React.FC<PresetSelectorModalProps> = ({
  isOpen,
  onClose,
  onSelectPreset,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl p-6 shadow-2xl text-slate-100 overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center space-y-2 mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Tek Tıkla Kurulum
            </div>
            <h3 className="text-xl font-bold text-white">Hazır Kurum Şablonu Seçin</h3>
            <p className="text-xs text-slate-400">
              Sektörünüze özel renk paleti, veli ön kayıt formu ve buton düzenini anında yükleyin.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {INSTITUTIONAL_PRESETS.map((preset) => (
              <div
                key={preset.id}
                className="bg-slate-950/60 border border-slate-800 hover:border-indigo-500/60 p-5 rounded-2xl flex flex-col justify-between space-y-4 group transition transform hover:-translate-y-1 shadow-lg"
              >
                <div className="space-y-2">
                  <h4 className="text-base font-extrabold text-white group-hover:text-indigo-400 transition">
                    {preset.name}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {preset.description}
                  </p>
                  <div className="pt-2">
                    <span className="text-[10px] bg-slate-900 border border-slate-800 text-slate-300 px-2 py-1 rounded-md block">
                      📌 {preset.suggestedLinks.length} Hazır Buton & Modül
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onSelectPreset(preset);
                    onClose();
                  }}
                  className="w-full py-2.5 bg-indigo-600/90 hover:bg-indigo-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition"
                >
                  Şablonu Yükle <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
