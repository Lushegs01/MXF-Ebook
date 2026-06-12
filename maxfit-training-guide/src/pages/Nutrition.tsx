import { motion } from 'motion/react';
import { Apple } from 'lucide-react';

const PLANS = [
  { id: 1, title: 'High Protein Meals', cals: '2400', image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=600&auto=format&fit=crop' },
  { id: 2, title: 'Fat Loss Guide', cals: '1800', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=600&auto=format&fit=crop' },
];

export default function Nutrition() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 space-y-6">
      <header className="pt-4 mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2 text-white">Nutrition Hub</h1>
        <p className="text-white/40 text-[15px] font-medium">Fuel your body for optimal performance.</p>
      </header>

      <div className="space-y-6">
        {PLANS.map((plan) => (
          <div key={plan.id} className="relative h-[220px] rounded-[32px] overflow-hidden group border border-white/10 shadow-lg cursor-pointer">
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url(${plan.image})` }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 w-full flex justify-between items-end">
              <div>
                <div className="text-[10px] uppercase font-bold tracking-widest text-[#00E676] mb-1 flex items-center gap-1.5"><Apple className="h-3 w-3" /> {plan.cals} KCAL / DAY</div>
                <h3 className="text-2xl font-bold text-white mb-1 leading-tight">{plan.title}</h3>
              </div>
              <button className="px-5 py-2.5 bg-white text-black font-bold text-sm rounded-xl hover:bg-[#00E676] transition-colors">
                VIEW
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
