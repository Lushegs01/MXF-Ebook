import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Search, SlidersHorizontal, Clock, Dumbbell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getCategories, searchWorkouts, type Difficulty } from '../lib/content';

const DIFFICULTIES: Difficulty[] = ['Beginner', 'Intermediate', 'Advanced'];

export default function Workouts() {
  const navigate = useNavigate();
  const categories = useMemo(() => getCategories(), []);

  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [categoryId, setCategoryId] = useState<string | null>(null);

  const results = useMemo(
    () => searchWorkouts(search, difficulty, categoryId),
    [search, difficulty, categoryId],
  );

  const isFiltering = search.trim() !== '' || difficulty !== null || categoryId !== null;
  const activeCategory = categoryId ? categories.find((c) => c.id === categoryId) : null;

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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search workouts..."
            className="w-full h-12 bg-white/5 rounded-full pl-12 pr-4 text-sm font-medium border border-white/10 focus:outline-none focus:border-[#00E676] transition-colors text-white placeholder:text-white/40"
          />
        </div>
        <button
          onClick={() => setShowFilters((v) => !v)}
          aria-label="Toggle filters"
          className={`h-12 w-12 rounded-full border flex items-center justify-center transition-colors ${
            showFilters || difficulty ? 'bg-[#00E676] text-black border-[#00E676]' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
          }`}
        >
          <SlidersHorizontal className="h-5 w-5" />
        </button>
      </div>

      {showFilters && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="flex flex-wrap gap-2">
          {DIFFICULTIES.map((d) => (
            <button
              key={d}
              onClick={() => setDifficulty((cur) => (cur === d ? null : d))}
              className={`px-4 py-2 rounded-full text-xs font-bold border transition-colors ${
                difficulty === d ? 'bg-[#00E676] text-black border-[#00E676]' : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
              }`}
            >
              {d}
            </button>
          ))}
        </motion.div>
      )}

      {!isFiltering && (
        <div className="space-y-4 pt-2">
          <h2 className="text-lg font-bold">Categories</h2>
          <div className="grid grid-cols-2 gap-4">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="relative h-48 rounded-[32px] overflow-hidden group border border-white/10 cursor-pointer shadow-lg"
                onClick={() => setCategoryId(cat.id)}
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
      )}

      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">
            {activeCategory ? activeCategory.title : isFiltering ? 'Results' : 'All Workouts'}
          </h2>
          {(categoryId || difficulty || search) && (
            <button
              onClick={() => { setCategoryId(null); setDifficulty(null); setSearch(''); }}
              className="text-xs font-bold text-[#00E676]"
            >
              Clear
            </button>
          )}
        </div>

        {results.length === 0 ? (
          <p className="text-white/40 text-sm font-medium py-6 text-center">No workouts match your filters.</p>
        ) : (
          <div className="space-y-3">
            {results.map((w) => (
              <button
                key={w.id}
                onClick={() => navigate(`/workout/${w.id}`)}
                className="w-full flex items-center gap-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-[24px] p-3 pr-5 transition-colors text-left"
              >
                <div
                  className="h-16 w-16 rounded-2xl bg-cover bg-center flex-shrink-0"
                  style={{ backgroundImage: `url(${w.image})` }}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white leading-tight truncate">{w.title}</h3>
                  <div className="flex items-center gap-4 mt-1.5 text-[11px] font-bold uppercase tracking-wider text-white/40">
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {w.duration} min</span>
                    <span className="flex items-center gap-1"><Dumbbell className="h-3.5 w-3.5" /> {w.intensity}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
