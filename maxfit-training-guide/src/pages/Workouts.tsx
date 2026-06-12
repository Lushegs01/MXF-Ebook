import { motion } from 'motion/react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = [
  { id: 'fat-loss', title: 'Fat Loss', count: 24, image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=600&auto=format&fit=crop' },
  { id: 'muscle-gain', title: 'Muscle Gain', count: 18, image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=600&auto=format&fit=crop' },
  { id: 'strength', title: 'Strength', count: 15, image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop' },
  { id: 'cardio', title: 'Cardio', count: 30, image: 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?q=80&w=600&auto=format&fit=crop' },
];

export default function Workouts() {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 space-y-6"
    >
      <header className="pt-4">
        <h1 className="text-3xl font-bold tracking-tight mb-2 text-white">Workouts</h1>
        <p className="text-white/40 text-[15px] font-medium">Find the perfect session for today.</p>
      </header>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
          <input 
            type="text" 
            placeholder="Search workouts..." 
            className="w-full h-12 bg-white/5 rounded-full pl-12 pr-4 text-sm font-medium border border-white/10 focus:outline-none focus:border-[#00E676] transition-colors disabled:opacity-50 text-white placeholder:text-white/40"
          />
        </div>
        <button className="h-12 w-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors">
          <SlidersHorizontal className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-4 pt-2">
        <h2 className="text-lg font-bold">Categories</h2>
        <div className="grid grid-cols-2 gap-4">
          {CATEGORIES.map((cat) => (
            <div 
              key={cat.id} 
              className="relative h-48 rounded-[32px] overflow-hidden group border border-white/10 cursor-pointer shadow-lg"
              onClick={() => navigate(`/workout/${cat.id}`)}
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" 
                style={{ backgroundImage: `url(${cat.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              <div className="absolute bottom-0 left-0 p-5">
                <div className="text-[10px] uppercase tracking-widest text-[#00E676] font-bold mb-1">{cat.count} Workouts</div>
                <h3 className="font-bold text-white text-lg leading-tight">{cat.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
