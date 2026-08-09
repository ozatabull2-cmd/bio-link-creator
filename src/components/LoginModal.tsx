import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Mail, ShieldCheck, X, ArrowRight, AlertCircle } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (role: 'superadmin' | 'school', profileId?: string) => void;
  profilesList: { id: string; title: string; adminEmail?: string }[];
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  profilesList,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      // Master Super-Admin Key
      if ((email === 'admin@biolink.com' || email === 'admin') && password === 'admin123') {
        onLoginSuccess('superadmin');
        onClose();
        return;
      }

      // Check if matches any school profile email / password
      const matchingProfile = profilesList.find(
        (p) => p.adminEmail?.toLowerCase() === email.toLowerCase() || p.id.toLowerCase() === email.toLowerCase()
      );

      // Default demo login password for schools
      if (matchingProfile || password === '123456' || password === 'okul123') {
        onLoginSuccess('school', matchingProfile ? matchingProfile.id : profilesList[0]?.id);
        onClose();
        return;
      }

      setErrorMsg('Geçersiz e-posta veya şifre! (Demolar için Şifre: okul123 veya admin123)');
    }, 600);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl p-6 shadow-2xl text-slate-100 overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center space-y-2 pt-2 mb-6">
            <div className="w-12 h-12 bg-indigo-500/20 text-indigo-400 rounded-2xl border border-indigo-500/30 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white">Yönetim Paneli Girişi</h3>
            <p className="text-xs text-slate-400">
              Okulunuza özel bio-link sayfanızı ve veli ön kayıtlarını yönetin.
            </p>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                E-posta veya Kurum Kimliği
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="okul@kolej.k12.tr veya admin"
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Şifre
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition active:scale-98 disabled:opacity-50"
            >
              {isLoading ? (
                'Giriş Yapılıyor...'
              ) : (
                <>
                  Giriş Yap <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-800 text-center">
            <p className="text-[11px] text-slate-500">
              Demo Test Şifresi: <code className="text-indigo-400 bg-slate-950 px-1.5 py-0.5 rounded">okul123</code> veya{' '}
              <code className="text-indigo-400 bg-slate-950 px-1.5 py-0.5 rounded">admin123</code>
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
