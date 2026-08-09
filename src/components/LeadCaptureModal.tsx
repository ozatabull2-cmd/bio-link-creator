import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, CheckCircle2, User, Phone, GraduationCap, MessageSquare, Sparkles } from 'lucide-react';
import { ParentLead } from '../types';

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  institutionTitle: string;
  whatsappNotifyNumber?: string;
  onSubmitLead: (lead: Omit<ParentLead, 'id' | 'createdAt' | 'status'>) => void;
}

export const LeadCaptureModal: React.FC<LeadCaptureModalProps> = ({
  isOpen,
  onClose,
  institutionTitle,
  whatsappNotifyNumber,
  onSubmitLead,
}) => {
  const [parentName, setParentName] = useState('');
  const [phone, setPhone] = useState('');
  const [childAgeOrGrade, setChildAgeOrGrade] = useState('');
  const [programInterest, setProgramInterest] = useState('Genel Bilgi & Ön Kayıt');
  const [note, setNote] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentName || !phone) return;

    // Submit lead object
    onSubmitLead({
      parentName,
      phone,
      childAgeOrGrade,
      programInterest,
      note,
    });

    setIsSubmitted(true);

    // Prepare WhatsApp Message if WhatsApp notification number exists
    if (whatsappNotifyNumber) {
      const cleanPhone = whatsappNotifyNumber.replace(/\D/g, '');
      const msg = `Merhaba *${institutionTitle}*,\n\nSayfanız üzerinden ön kayıt / bilgi talebinde bulundum:\n\n👤 *Veli Adı:* ${parentName}\n📞 *Telefon:* ${phone}\n👶 *Çocuk Yaşı/Sınıfı:* ${childAgeOrGrade || 'Belirtilmedi'}\n🎯 *İlgilendiği Program:* ${programInterest}\n📝 *Not:* ${note || 'Yok'}\n\nGörüşmek üzere!`;
      
      setTimeout(() => {
        window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
      }, 1000);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setParentName('');
    setPhone('');
    setChildAgeOrGrade('');
    setNote('');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl p-6 shadow-2xl text-slate-100 overflow-hidden"
        >
          {/* Decorative Glow */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-rose-500/20 rounded-full blur-2xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="text-center space-y-1 pt-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" /> Veli Danışma & Ön Kayıt
                </div>
                <h3 className="text-lg font-bold text-white">{institutionTitle}</h3>
                <p className="text-xs text-slate-400">
                  Bilgilerinizi bırakın, kayıt uzmanımız en kısa sürede size ulaşsın.
                </p>
              </div>

              {/* Veli Adı */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Veli Ad Soyad <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    placeholder="Örn: Ayşe Yılmaz"
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>
              </div>

              {/* Telefon */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Telefon Numarası <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="05XX XXX XX XX"
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>
              </div>

              {/* Çocuk Yaşı / Sınıfı */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Çocuğunuzun Yaşı veya Sınıfı
                </label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={childAgeOrGrade}
                    onChange={(e) => setChildAgeOrGrade(e.target.value)}
                    placeholder="Örn: 4 Yaş (Kreş) veya 2. Sınıf"
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>
              </div>

              {/* İlgilenilen Program */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  İlgilendiğiniz Konu
                </label>
                <select
                  value={programInterest}
                  onChange={(e) => setProgramInterest(e.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
                >
                  <option value="2026-2027 Erken Kayıt">2026-2027 Erken Kayıt</option>
                  <option value="Bursluluk Sınavı">Bursluluk Sınavı Başvurusu</option>
                  <option value="Okul / Kampüs Gezisi">Okul / Kampüs Gezisi Randevusu</option>
                  <option value="Atölye / Oyun Grubu">Hafta Sonu Atölye / Oyun Grubu</option>
                  <option value="Yemek & Servis Bilgisi">Yemek & Servis Bilgisi</option>
                  <option value="Genel Bilgi & Ön Kayıt">Genel Bilgi & Fiyat Öğrenme</option>
                </select>
              </div>

              {/* Ek Not */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Eklemek İstediğiniz Not (Opsiyonel)
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <textarea
                    rows={2}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Özel talepleriniz veya sorularınız..."
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition resize-none"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition transform active:scale-98"
              >
                <Send className="w-4 h-4" /> Talebi Gönder
              </button>
            </form>
          ) : (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto text-emerald-400 animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-white">Talebiniz Alındı!</h3>
              <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
                Talebiniz **{institutionTitle}** kayıt birimine iletilmiştir.{' '}
                {whatsappNotifyNumber && 'WhatsApp üzerinden yönlendiriliyorsunuz...'}
              </p>
              <button
                onClick={handleReset}
                className="mt-4 px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 rounded-xl transition"
              >
                Kapat
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
