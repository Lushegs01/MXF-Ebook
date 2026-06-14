import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { X, Apple } from 'lucide-react';
import { getNutritionPlan } from '../lib/content';

export default function NutritionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const plan = getNutritionPlan(id);

  if (!plan) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] text-white flex flex-col items-center justify-center p-6 text-center gap-6">
        <h1 className="text-2xl font-bold">Plan not found</h1>
        <button onClick={() => navigate('/nutrition')} className="px-8 py-4 bg-[#138086] text-black rounded-2xl font-bold">
          Back to Nutrition
        </button>
      </div>
    );
  }

  const macros = [
    { label: 'Protein', value: plan.macros.protein },
    { label: 'Carbs', value: plan.macros.carbs },
    { label: 'Fat', value: plan.macros.fat },
  ];

  return (
    <div className="h-screen flex flex-col bg-[#0F0F0F] text-white overflow-hidden max-w-md mx-auto relative">
      <header className="absolute top-0 w-full z-50 p-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
        <button onClick={() => navigate(-1)} className="h-10 w-10 rounded-full bg-black/40 backdrop-blur border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
          <X className="h-5 w-5" />
        </button>
      </header>

      <div className="h-[32vh] relative flex-shrink-0">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${plan.image}')` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-[#0F0F0F]/30 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6">
          <div className="text-[10px] uppercase font-bold tracking-widest text-[#138086] mb-1 flex items-center gap-1.5"><Apple className="h-3 w-3" /> {plan.calories} KCAL / DAY</div>
          <h1 className="text-3xl font-extrabold leading-tight">{plan.title}</h1>
        </div>
      </div>

      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex-1 p-6 space-y-8 overflow-y-auto pb-24">
        <p className="text-white/60 text-[15px] font-medium leading-relaxed">{plan.description}</p>

        <div className="grid grid-cols-3 gap-3">
          {macros.map((m) => (
            <div key={m.label} className="bg-white/5 rounded-2xl p-4 text-center border border-white/10">
              <p className="text-white/40 text-[10px] font-bold mb-1 uppercase tracking-widest">{m.label}</p>
              <p className="text-xl font-bold">{m.value}<span className="text-xs text-white/40 font-medium">g</span></p>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold">Daily Meals</h2>
          {plan.meals.map((meal, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-[24px] p-5">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-white">{meal.name}</h3>
                <span className="text-[#138086] text-xs font-bold">{meal.calories} kcal</span>
              </div>
              <ul className="space-y-2">
                {meal.items.map((item, j) => (
                  <li key={j} className="flex items-center gap-3 text-white/60 text-[15px] font-medium">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#138086]/60 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
