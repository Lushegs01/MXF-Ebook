import { motion, AnimatePresence } from 'motion/react';
import { LogOut, Settings, Bell, Star, X, Check } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { auth } from '../lib/firebase';
import { updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/auth');
  };

  const handleSaveProfile = async () => {
    if (!auth.currentUser) return;
    setSaving(true);
    try {
      await updateProfile(auth.currentUser, { displayName });
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setShowEditModal(false);
      }, 1200);
    } catch {
      // silently handle error
    } finally {
      setSaving(false);
    }
  };

  const handleToggleNotifications = () => {
    const next = !notificationsEnabled;
    setNotificationsEnabled(next);
    setNotificationToast(next ? 'Notifications enabled' : 'Notifications disabled');
    setTimeout(() => setNotificationToast(null), 2000);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 space-y-8">
      <div className="flex flex-col items-center pt-8">
        <div className="h-28 w-28 rounded-full overflow-hidden border-4 border-[#00E676] mb-4 shadow-[0_0_20px_rgba(0,230,118,0.2)]">
          <img src={user?.photoURL || 'https://api.dicebear.com/7.x/notionists/svg?seed=Felix'} alt="Profile" className="w-full h-full object-cover" />
        </div>
        <h1 className="text-3xl font-extrabold text-white">{user?.displayName || 'John'}</h1>
        <p className="text-white/40 font-medium">{user?.email}</p>
        <div className="mt-6 px-4 py-1.5 bg-[#00E676]/10 border border-[#00E676]/20 text-[#00E676] rounded text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
          <Star className="h-3 w-3 fill-current" /> FREE MEMBER
        </div>
      </div>

      <div className="space-y-4 pt-4">
        {/* Edit Profile */}
        <button onClick={() => { setDisplayName(user?.displayName || ''); setShowEditModal(true); }} className="w-full bg-white/5 hover:bg-white/10 rounded-[24px] p-5 flex items-center justify-between border border-white/10 transition-colors">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-white/5 rounded-xl flex items-center justify-center">
              <Settings className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-white">Edit Profile</span>
          </div>
        </button>

        {/* Notifications */}
        <button onClick={handleToggleNotifications} className="w-full bg-white/5 hover:bg-white/10 rounded-[24px] p-5 flex items-center justify-between border border-white/10 transition-colors">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-white/5 rounded-xl flex items-center justify-center">
              <Bell className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-white">Notifications</span>
          </div>
          <div className={`w-12 h-7 rounded-full relative transition-colors duration-200 ${notificationsEnabled ? 'bg-[#00E676]' : 'bg-white/20'}`}>
            <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${notificationsEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
          </div>
        </button>
        
        <button onClick={handleLogout} className="w-full bg-red-500/10 hover:bg-red-500/20 rounded-[24px] p-5 flex items-center justify-between border border-red-500/10 transition-colors mt-8 text-red-500">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-red-500/10 rounded-xl flex items-center justify-center">
              <LogOut className="h-5 w-5" />
            </div>
            <span className="font-bold">Log Out</span>
          </div>
        </button>
      </div>

      {/* Notification Toast */}
      <AnimatePresence>
        {notificationToast && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="fixed bottom-28 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur border border-white/20 text-white text-sm font-bold px-6 py-3 rounded-2xl z-[100] flex items-center gap-2"
          >
            <Check className="h-4 w-4 text-[#00E676]" />
            {notificationToast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#1A1A1A] rounded-[28px] border border-white/10 p-8 w-full max-w-sm space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-extrabold text-white">Edit Profile</h2>
                <button onClick={() => setShowEditModal(false)} className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <X className="h-4 w-4 text-white" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-white/40 text-[10px] font-bold uppercase tracking-widest mb-2">Display Name</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-medium focus:outline-none focus:border-[#00E676]/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-white/40 text-[10px] font-bold uppercase tracking-widest mb-2">Email</label>
                  <div className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white/60 font-medium">
                    {user?.email || '—'}
                  </div>
                </div>
              </div>

              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="w-full h-12 rounded-xl font-bold text-black bg-[#00E676] hover:bg-[#00C853] transition-colors active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saveSuccess ? (
                  <><Check className="h-5 w-5" /> Saved!</>
                ) : saving ? 'Saving...' : 'Save Changes'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
