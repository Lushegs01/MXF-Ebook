import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { LogOut, Settings, Bell, Star, Crown, X } from 'lucide-react';
import { updateProfile } from 'firebase/auth';
import { useAuth } from '../lib/AuthContext';
import { auth } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { getUserProfile, updateUserProfile, type UserProfile, DEFAULT_PROFILE } from '../lib/db';

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.displayName || '');
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [modal, setModal] = useState<null | 'edit' | 'notifications'>(null);
  const [draftName, setDraftName] = useState('');
  const [draftGoal, setDraftGoal] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    getUserProfile(user.uid).then(setProfile);
  }, [user]);

  const handleLogout = () => {
    auth.signOut();
    navigate('/auth');
  };

  const openEdit = () => {
    setDraftName(name);
    setDraftGoal(profile.goalWeight != null ? String(profile.goalWeight) : '');
    setModal('edit');
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    const trimmed = draftName.trim();
    if (trimmed && auth.currentUser && trimmed !== name) {
      await updateProfile(auth.currentUser, { displayName: trimmed });
      setName(trimmed);
    }
    const goalWeight = draftGoal ? parseFloat(draftGoal) : null;
    await updateUserProfile(user.uid, { goalWeight });
    setProfile((p) => ({ ...p, goalWeight }));
    setSaving(false);
    setModal(null);
  };

  const toggleNotifications = async () => {
    if (!user) return;
    const next = !profile.notificationsEnabled;
    setProfile((p) => ({ ...p, notificationsEnabled: next }));
    await updateUserProfile(user.uid, { notificationsEnabled: next });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 space-y-8">
      <div className="flex flex-col items-center pt-8">
        <div className="h-28 w-28 rounded-full overflow-hidden border-4 border-[#00E676] mb-4 shadow-[0_0_20px_rgba(0,230,118,0.2)]">
          <img src={user?.photoURL || 'https://api.dicebear.com/7.x/notionists/svg?seed=Felix'} alt="Profile" className="w-full h-full object-cover" />
        </div>
        <h1 className="text-3xl font-extrabold text-white">{name || 'Athlete'}</h1>
        <p className="text-white/40 font-medium">{user?.email}</p>
        {profile.isPremium ? (
          <div className="mt-6 px-4 py-1.5 bg-[#00E676]/10 border border-[#00E676]/20 text-[#00E676] rounded text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
            <Crown className="h-3 w-3 fill-current" /> PREMIUM MEMBER
          </div>
        ) : (
          <button
            onClick={() => navigate('/premium')}
            className="mt-6 px-4 py-1.5 bg-white/5 border border-white/10 text-white/60 rounded text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Star className="h-3 w-3 fill-current" /> FREE MEMBER · Upgrade
          </button>
        )}
      </div>

      <div className="space-y-4 pt-4">
        <button onClick={openEdit} className="w-full bg-white/5 hover:bg-white/10 rounded-[24px] p-5 flex items-center justify-between border border-white/10 transition-colors">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-white/5 rounded-xl flex items-center justify-center">
              <Settings className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-white">Edit Profile</span>
          </div>
        </button>

        <button onClick={() => setModal('notifications')} className="w-full bg-white/5 hover:bg-white/10 rounded-[24px] p-5 flex items-center justify-between border border-white/10 transition-colors">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-white/5 rounded-xl flex items-center justify-center">
              <Bell className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-white">Notifications</span>
          </div>
          <span className={`text-xs font-bold uppercase tracking-wider ${profile.notificationsEnabled ? 'text-[#00E676]' : 'text-white/40'}`}>
            {profile.notificationsEnabled ? 'On' : 'Off'}
          </span>
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

      {modal === 'edit' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#1A1A1A] rounded-[32px] p-8 w-full max-w-sm border border-white/10 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Edit Profile</h3>
              <button onClick={() => setModal(null)} className="text-white/40 hover:text-white"><X className="h-5 w-5" /></button>
            </div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2 block">Display Name</label>
            <input
              type="text"
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              placeholder="Your name"
              className="w-full h-14 bg-black/50 border border-white/10 rounded-2xl px-5 text-white focus:outline-none focus:border-[#00E676] mb-5 transition-colors placeholder:text-white/20 font-bold"
            />
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2 block">Goal Weight (lbs)</label>
            <input
              type="number"
              value={draftGoal}
              onChange={(e) => setDraftGoal(e.target.value)}
              placeholder="e.g. 175"
              className="w-full h-14 bg-black/50 border border-white/10 rounded-2xl px-5 text-white focus:outline-none focus:border-[#00E676] mb-8 transition-colors placeholder:text-white/20 font-bold"
            />
            <div className="flex gap-4">
              <button onClick={() => setModal(null)} className="flex-1 h-14 bg-white/5 text-white rounded-2xl font-bold hover:bg-white/10 transition-colors">Cancel</button>
              <button onClick={handleSaveProfile} disabled={saving} className="flex-1 h-14 bg-[#00E676] text-black rounded-2xl font-bold hover:bg-[#00E676]/90 transition-colors disabled:opacity-60">
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {modal === 'notifications' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#1A1A1A] rounded-[32px] p-8 w-full max-w-sm border border-white/10 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Notifications</h3>
              <button onClick={() => setModal(null)} className="text-white/40 hover:text-white"><X className="h-5 w-5" /></button>
            </div>
            <div className="flex items-center justify-between bg-black/40 border border-white/5 rounded-2xl p-5 mb-8">
              <span className="font-bold text-white">Workout Reminders</span>
              <button
                onClick={toggleNotifications}
                aria-label="Toggle notifications"
                className={`relative h-7 w-12 rounded-full transition-colors ${profile.notificationsEnabled ? 'bg-[#00E676]' : 'bg-white/15'}`}
              >
                <span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${profile.notificationsEnabled ? 'left-6' : 'left-1'}`} />
              </button>
            </div>
            <button onClick={() => setModal(null)} className="w-full h-14 bg-[#00E676] text-black rounded-2xl font-bold hover:bg-[#00E676]/90 transition-colors">Done</button>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
