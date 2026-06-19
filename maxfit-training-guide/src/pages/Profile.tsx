import { motion } from 'motion/react';
import { LogOut, Settings, Bell, Star } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { auth } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.signOut();
    navigate('/auth');
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
        {[
          { label: 'Edit Profile', icon: Settings },
          { label: 'Notifications', icon: Bell },
        ].map((item, i) => (
          <button key={i} className="w-full bg-white/5 hover:bg-white/10 rounded-[24px] p-5 flex items-center justify-between border border-white/10 transition-colors">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-white/5 rounded-xl flex items-center justify-center">
                <item.icon className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-white">{item.label}</span>
            </div>
          </button>
        ))}
        
        <button onClick={handleLogout} className="w-full bg-red-500/10 hover:bg-red-500/20 rounded-[24px] p-5 flex items-center justify-between border border-red-500/10 transition-colors mt-8 text-red-500">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-red-500/10 rounded-xl flex items-center justify-center">
              <LogOut className="h-5 w-5" />
            </div>
            <span className="font-bold">Log Out</span>
          </div>
        </button>
      </div>
    </motion.div>
  );
}
