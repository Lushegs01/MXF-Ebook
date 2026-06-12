import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { X } from 'lucide-react';
import { getExercise } from '../lib/content';

export default function ExerciseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const exercise = getExercise(id);

  if (!exercise) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] text-white flex flex-col items-center justify-center p-6 text-center gap-6">
        <h1 className="text-2xl font-bold">Exercise not found</h1>
        <button onClick={() => navigate(-1)} className="px-8 py-4 bg-[#00E676] text-black rounded-2xl font-bold">
          Go Back
        </button>
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
      </div>

      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex-1 p-6 space-y-8 overflow-y-auto pb-24">
         <div>
           <div className="inline-block px-3 py-1 bg-[#00E676]/10 text-[#00E676] rounded text-[10px] font-bold tracking-widest mb-4 uppercase">{exercise.difficulty}</div>
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
             {exercise.instructions.map((step, i) => (
               <li key={i}>{step}</li>
             ))}
           </ol>
         </div>

         <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5">
           <h3 className="text-red-500 font-bold text-[10px] mb-2 uppercase tracking-widest">Common Mistake</h3>
           <p className="text-white/60 text-[15px] font-medium leading-relaxed">{exercise.commonMistake}</p>
         </div>
      </motion.div>
    </div>
  );
}
