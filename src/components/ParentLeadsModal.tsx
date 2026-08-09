import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Users, Phone, Calendar, Download, CheckCircle2, Search, MessageSquare, GraduationCap } from 'lucide-react';
import { ParentLead } from '../types';

interface ParentLeadsModalProps {
  isOpen: boolean;
  onClose: () => void;
  institutionTitle: string;
  leads: ParentLead[];
  onUpdateLeadStatus?: (leadId: string, status: 'new' | 'contacted' | 'registered') => void;
}

export const ParentLeadsModal: React.FC<ParentLeadsModalProps> = ({
  isOpen,
  onClose,
  institutionTitle,
  leads,
  onUpdateLeadStatus,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredLeads = leads.filter(
    (l) =>
      l.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.phone.includes(searchTerm) ||
      l.programInterest?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportToCSV = () => {
    const headers = ['Veli Adı', 'Telefon', 'Çocuk Yaşı/Sınıfı', 'Program', 'Not', 'Tarih', 'Durum'];
    const rows = leads.map((l) => [
      `"${l.parentName}"`,
      `"${l.phone}"`,
      `"${l.childAgeOrGrade || ''}"`,
      `"${l.programInterest || ''}"`,
      `"${l.note || ''}"`,
      `"${new Date(l.createdAt).toLocaleString('tr-TR')}"`,
      `"${l.status}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${institutionTitle}-veli-talepleri.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-3xl p-6 shadow-2xl text-slate-100 overflow-hidden flex flex-col max-h-[85vh]"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pr-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-2xl border border-indigo-500/30">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Veli Ön Kayıt & İletişim Talepleri</h3>
                <p className="text-xs text-slate-400">
                  {institutionTitle} • Toplam {leads.length} Veli Talebi
                </p>
              </div>
            </div>

            <button
              onClick={exportToCSV}
              disabled={leads.length === 0}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-md transition"
            >
              <Download className="w-4 h-4" /> Excel / CSV İndir
            </button>
          </div>

          {/* Search bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Veli adı, telefon veya program ara..."
              className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          {/* Leads Table / List */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {filteredLeads.length > 0 ? (
              filteredLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="bg-slate-950/60 border border-slate-800 hover:border-slate-700 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{lead.parentName}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-medium">
                        {lead.programInterest || 'Genel Bilgi'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                      <span className="flex items-center gap-1 text-slate-200">
                        <Phone className="w-3.5 h-3.5 text-emerald-400" />
                        <a href={`tel:${lead.phone}`} className="hover:underline">
                          {lead.phone}
                        </a>
                      </span>

                      {lead.childAgeOrGrade && (
                        <span className="flex items-center gap-1">
                          <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                          {lead.childAgeOrGrade}
                        </span>
                      )}

                      <span className="flex items-center gap-1 text-[11px] text-slate-500">
                        <Calendar className="w-3 h-3" />
                        {new Date(lead.createdAt).toLocaleString('tr-TR')}
                      </span>
                    </div>

                    {lead.note && (
                      <p className="text-xs text-slate-300 italic bg-slate-900/80 p-2 rounded-lg border border-slate-800/80">
                        "{lead.note}"
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <a
                      href={`https://wa.me/${lead.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                        `Merhaba ${lead.parentName} Bey/Hanım, ${institutionTitle} sayfamız üzerinden ilettiğiniz bilgi talebiniz hakkında ulaşıyorum.`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
                    </a>

                    {onUpdateLeadStatus && (
                      <button
                        onClick={() => onUpdateLeadStatus(lead.id, lead.status === 'contacted' ? 'registered' : 'contacted')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition ${
                          lead.status === 'registered'
                            ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                            : lead.status === 'contacted'
                            ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                            : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {lead.status === 'registered' ? 'Kayıt Yapıldı' : lead.status === 'contacted' ? 'Görüşüldü' : 'İletişime Geç'}
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-slate-500 text-xs">
                {searchTerm ? 'Aramaya uygun veli talebi bulunamadı.' : 'Henüz ön kayıt veya iletişim talebi bulunmuyor.'}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
