import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { X, Play, Activity } from 'lucide-react';
import { useEffect, useState } from 'react';
import { fetchExerciseById, Exercise } from '../lib/db';

export default function ExerciseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (id) {
        const data = await fetchExerciseById(id);
        setExercise(data);
      }
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

  if (!exercise) {
    return (
      <div className="h-screen flex flex-col bg-[#0F0F0F] text-white overflow-hidden max-w-md mx-auto items-center justify-center">
        <p className="text-white/60 mb-6 font-medium">Exercise not found.</p>
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
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${exercise.image}')` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-transparent to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
           <button onClick={() => navigate(`/workout/${exercise.categoryId}`)} className="h-16 w-16 rounded-full bg-white/20 backdrop-blur border border-white/40 flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer">
             <Play className="h-8 w-8 ml-1 fill-white" />
           </button>
        </div>
      </div>

      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex-1 p-6 space-y-8 overflow-y-auto pb-24">
         <div>
           <div className="inline-block px-3 py-1 bg-[#00E676]/10 text-[#00E676] rounded text-[10px] font-bold tracking-widest mb-4 uppercase">Intermediate</div>
           <h1 className="text-3xl font-extrabold mb-2 leading-tight">{exercise.name}</h1>
           <p className="text-white/40 font-bold text-[10px] tracking-widest uppercase">Target: {exercise.target}</p>
         </div>

         <div className="grid grid-cols-3 gap-3">
           <div className="bg-white/5 rounded-2xl p-4 text-center border border-white/10">
             <p className="text-white/40 text-[10px] font-bold mb-1 uppercase tracking-widest">Sets</p>
             <p className="text-xl font-bold">{exercise.sets}</p>
           </div>
           <div className="bg-white/5 rounded-2xl p-4 text-center border border-white/10">
             <p className="text-white/40 text-[10px] font-bold mb-1 uppercase tracking-widest">Reps</p>
             <p className="text-xl font-bold">{exercise.reps}</p>
           </div>
           <div className="bg-white/5 rounded-2xl p-4 text-center border border-white/10">
             <p className="text-white/40 text-[10px] font-bold mb-1 uppercase tracking-widest">Rest</p>
             <p className="text-xl font-bold">{exercise.rest}s</p>
           </div>
         </div>

         <div>
           <h2 className="text-xl font-bold mb-4">Instructions</h2>
           <ol className="list-decimal list-outside ml-4 space-y-4 text-white/60 text-[15px] font-medium leading-relaxed">
             <li>Follow standard form for {exercise.name}.</li>
             <li>Brace your core and perform the movement smoothly.</li>
             <li>Maintain control during both concentric and eccentric phases.</li>
             <li>Squeeze your {exercise.target} throughout the motion.</li>
           </ol>
         </div>
      </motion.div>
    </div>
  );
}
