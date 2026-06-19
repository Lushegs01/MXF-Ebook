import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { X, Activity, Apple } from 'lucide-react';
import { useEffect, useState } from 'react';
import { fetchNutritionPlans, NutritionPlan } from '../lib/db';

export default function NutritionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState<NutritionPlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const plans = await fetchNutritionPlans();
      const match = plans.find(p => p.id === id);
      setPlan(match || null);
      setLoading(false);
    }
    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#0F0F0F] text-white">
        <Activity className="h-8 w-8 text-[#00E676] animate-pulse" />
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="h-screen flex flex-col bg-[#0F0F0F] text-white overflow-hidden max-w-md mx-auto items-center justify-center">
        <p className="text-white/60 mb-6 font-medium">Plan not found.</p>
        <button onClick={() => navigate(-1)} className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200">Go Back</button>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#0F0F0F] text-white overflow-hidden max-w-md mx-auto relative">
      <header className="absolute top-0 w-full z-50 p-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
        <button onClick={() => navigate(-1)} className="h-10 w-10 rounded-full bg-black/40 backdrop-blur border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
          <X className="h-5 w-5" />
        </button>
      </header>

      <div className="h-[40vh] relative">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${plan.image}')` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-transparent to-transparent" />
      </div>

      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex-1 p-6 space-y-8 overflow-y-auto pb-24">
         <div>
           <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#00E676]/10 text-[#00E676] rounded text-[10px] font-bold tracking-widest mb-4 uppercase">
             <Apple className="h-3 w-3" />
             {plan.cals} KCAL / DAY
           </div>
           <h1 className="text-3xl font-extrabold mb-2 leading-tight">{plan.title}</h1>
           <p className="text-white/40 font-bold text-[10px] tracking-widest uppercase">Target: Fat Loss & Muscle Gain</p>
         </div>

         <div className="bg-white/5 border border-white/10 rounded-[32px] p-6 space-y-4">
           <h2 className="text-lg font-bold">Guidelines</h2>
           <ul className="space-y-3 text-white/60 text-[15px] font-medium leading-relaxed list-disc list-inside">
             <li>Drink at least 3 liters of water daily.</li>
             <li>Prioritize protein in every meal to support recovery.</li>
             <li>Avoid processed sugars and empty calories.</li>
             <li>Eat your largest meal after your workout.</li>
           </ul>
         </div>

         <div className="bg-white/5 border border-white/10 rounded-[32px] p-6 space-y-4">
           <h2 className="text-lg font-bold">Sample Meals</h2>
           <div className="space-y-4">
             <div className="flex justify-between items-center bg-black/30 p-4 rounded-2xl">
               <div>
                 <p className="font-bold text-sm">Breakfast</p>
                 <p className="text-white/40 text-xs">Oats & Protein Shake</p>
               </div>
               <span className="text-[#00E676] text-xs font-bold">400 Kcal</span>
             </div>
             <div className="flex justify-between items-center bg-black/30 p-4 rounded-2xl">
               <div>
                 <p className="font-bold text-sm">Lunch</p>
                 <p className="text-white/40 text-xs">Grilled Chicken & Rice</p>
               </div>
               <span className="text-[#00E676] text-xs font-bold">650 Kcal</span>
             </div>
             <div className="flex justify-between items-center bg-black/30 p-4 rounded-2xl">
               <div>
                 <p className="font-bold text-sm">Dinner</p>
                 <p className="text-white/40 text-xs">Salmon & Veggies</p>
               </div>
               <span className="text-[#00E676] text-xs font-bold">500 Kcal</span>
             </div>
           </div>
         </div>
      </motion.div>
    </div>
  );
}
