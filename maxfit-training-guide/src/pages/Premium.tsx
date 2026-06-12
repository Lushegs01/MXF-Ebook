import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Crown, Check } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { getUserProfile, updateUserProfile } from '../lib/db';

const FEATURES = [
  'Advanced Custom Programs',
  'Personalized Nutrition Plans',
  'Trainer Consultations',
  'Exclusive Video Library',
  'Advanced Progress Analytics'
];

export default function Premium() {
  const { user } = useAuth();
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);

  useEffect(() => {
    if (!user) return;
    getUserProfile(user.uid).then((p) => {
      setIsPremium(p.isPremium);
      setLoading(false);
    });
  }, [user]);

  const handleUpgrade = async () => {
    if (!user) return;
    setUpgrading(true);
    await updateUserProfile(user.uid, { isPremium: true });
    setIsPremium(true);
    setUpgrading(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 h-full flex flex-col justify-center bg-[#0F0F0F]">
      <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 shadow-2xl relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#00E676]/20 blur-[50px] rounded-full pointer-events-none" />

        <Crown className="h-12 w-12 text-[#00E676] mb-6" />
        <h1 className="text-3xl font-extrabold text-white mb-2">MaxFit Premium</h1>
        <p className="text-white/40 mb-8 text-sm">Unlock your full potential with elite coaching and advanced analytics.</p>

        <div className="space-y-4 mb-8 relative z-10">
          {FEATURES.map((feature, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-6 w-6 rounded-full bg-[#00E676]/10 flex items-center justify-center">
                <Check className="h-3 w-3 text-[#00E676] font-bold" />
              </div>
              <span className="font-bold text-white text-sm">{feature}</span>
            </div>
          ))}
        </div>

        {isPremium ? (
          <div className="w-full h-14 bg-[#00E676]/10 border border-[#00E676]/30 text-[#00E676] rounded-2xl font-bold text-lg flex items-center justify-center gap-2 relative z-10">
            <Crown className="h-5 w-5 fill-current" /> You're Premium
          </div>
        ) : (
          <button
            onClick={handleUpgrade}
            disabled={loading || upgrading}
            className="w-full h-14 bg-[#00E676] text-black rounded-2xl font-bold text-lg hover:bg-[#00E676]/90 transition-colors relative z-10 shadow-[0_0_20px_rgba(0,230,118,0.2)] disabled:opacity-60"
          >
            {upgrading ? 'Upgrading…' : 'Upgrade Now'}
          </button>
        )}
      </div>
    </motion.div>
  );
}
