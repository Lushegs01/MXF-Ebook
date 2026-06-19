import { motion } from 'motion/react';
import { Crown, Check, Zap, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TIERS = [
  {
    id: 'free',
    name: 'Free Membership',
    price: '₦0 / month',
    description: 'Perfect for getting started.',
    icon: Zap,
    color: 'text-white',
    bg: 'bg-white/5',
    border: 'border-white/10',
    button: 'bg-white text-black',
    glow: 'bg-white/10',
    features: [
      'Workout library access',
      'Basic exercise guides',
      'Nutrition articles',
      'Limited progress tracking'
    ]
  },
  {
    id: 'pro',
    name: 'MaxFit Pro',
    price: '₦7,500 / month',
    description: 'Level up your training with AI and personalization.',
    icon: Star,
    color: 'text-[#00E676]',
    bg: 'bg-white/10',
    border: 'border-[#00E676]/30',
    button: 'bg-[#00E676] text-black',
    glow: 'bg-[#00E676]/20',
    features: [
      'Personalized Workout Plans',
      'Smart Progress Gamification',
      'AI Fitness Coach & Chat',
      'Daily Check-ins & Adjustments'
    ]
  },
  {
    id: 'elite',
    name: 'MaxFit Elite',
    price: '₦35,000 / month',
    description: 'For serious clients who want direct coaching.',
    icon: Crown,
    color: 'text-[#FFD700]',
    bg: 'bg-gradient-to-br from-white/10 to-[#FFD700]/10',
    border: 'border-[#FFD700]/40',
    button: 'bg-[#FFD700] text-black',
    glow: 'bg-[#FFD700]/20',
    features: [
      'Direct Trainer Access & Feedback',
      'Form Analysis & Video Reviews',
      'Custom Meal Plans (Nigerian Foods)',
      'Everything in MaxFit Pro'
    ]
  }
];

export default function Premium() {
  const navigate = useNavigate();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 pb-32 space-y-8 bg-[#0F0F0F] min-h-screen">
      <header className="pt-4 mb-2 text-center">
        <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Upgrade Your Plan</h1>
        <p className="text-white/40 text-sm font-medium">Choose the tier that fits your goals.</p>
      </header>

      <div className="space-y-6">
        {TIERS.map((tier) => (
          <div key={tier.id} className={`rounded-[32px] p-8 shadow-2xl relative overflow-hidden border ${tier.bg} ${tier.border}`}>
            {/* Glow effect */}
            <div className={`absolute top-0 right-0 w-32 h-32 blur-[60px] rounded-full pointer-events-none ${tier.glow}`} />
            
            <tier.icon className={`h-10 w-10 mb-4 ${tier.color}`} />
            <h2 className="text-2xl font-extrabold text-white mb-1">{tier.name}</h2>
            <div className={`text-xl font-bold mb-4 ${tier.color}`}>{tier.price}</div>
            <p className="text-white/60 mb-6 text-sm font-medium leading-relaxed max-w-[250px]">{tier.description}</p>
            
            <div className="space-y-4 mb-8 relative z-10 p-4 bg-black/20 rounded-2xl">
              {tier.features.map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`mt-0.5 min-w-[20px] w-5 h-5 rounded-full flex items-center justify-center bg-black/40`}>
                    <Check className={`h-3 w-3 ${tier.color} font-bold`} />
                  </div>
                  <span className="font-medium text-white/90 text-sm leading-tight">{feature}</span>
                </div>
              ))}
            </div>

            <button 
              className={`w-full h-14 rounded-2xl font-bold text-lg transition-transform active:scale-95 relative z-10 shadow-lg ${tier.button}`}
              onClick={() => navigate('/')}
            >
              {tier.id === 'free' ? 'Current Plan' : `Upgrade to ${tier.name.split(' ')[1] || 'Pro'}`}
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
