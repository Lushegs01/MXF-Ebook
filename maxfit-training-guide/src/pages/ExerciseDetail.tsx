import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { X, Play } from 'lucide-react';

export default function ExerciseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col bg-[#0F0F0F] text-white overflow-hidden max-w-md mx-auto relative">
      <header className="absolute top-0 w-full z-50 p-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
        <button onClick={() => navigate(-1)} className="h-10 w-10 rounded-full bg-black/40 backdrop-blur border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
          <X className="h-5 w-5" />
        </button>
      </header>

      <div className="h-[40vh] relative">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800&auto=format&fit=crop')" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-transparent to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
           <button className="h-16 w-16 rounded-full bg-white/20 backdrop-blur border border-white/40 flex items-center justify-center hover:bg-white/30 transition-colors">
             <Play className="h-8 w-8 ml-1 fill-white" />
           </button>
        </div>
      </div>

      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex-1 p-6 space-y-8 overflow-y-auto pb-24">
         <div>
           <div className="inline-block px-3 py-1 bg-[#00E676]/10 text-[#00E676] rounded text-[10px] font-bold tracking-widest mb-4 uppercase">Intermediate</div>
           <h1 className="text-3xl font-extrabold mb-2 leading-tight">Barbell Squat</h1>
           <p className="text-white/40 font-bold text-[10px] tracking-widest uppercase">Target: Quads, Glutes, Hamstrings</p>
         </div>

         <div className="grid grid-cols-3 gap-3">
           <div className="bg-white/5 rounded-2xl p-4 text-center border border-white/10">
             <p className="text-white/40 text-[10px] font-bold mb-1 uppercase tracking-widest">Sets</p>
             <p className="text-xl font-bold">4</p>
           </div>
           <div className="bg-white/5 rounded-2xl p-4 text-center border border-white/10">
             <p className="text-white/40 text-[10px] font-bold mb-1 uppercase tracking-widest">Reps</p>
             <p className="text-xl font-bold">8-10</p>
           </div>
           <div className="bg-white/5 rounded-2xl p-4 text-center border border-white/10">
             <p className="text-white/40 text-[10px] font-bold mb-1 uppercase tracking-widest">Rest</p>
             <p className="text-xl font-bold">90s</p>
           </div>
         </div>

         <div>
           <h2 className="text-xl font-bold mb-4">Instructions</h2>
           <ol className="list-decimal list-outside ml-4 space-y-4 text-white/60 text-[15px] font-medium leading-relaxed">
             <li>Stand with feet shoulder-width apart, resting the barbell on your upper back.</li>
             <li>Brace your core and lower your hips down and back as if sitting in a chair.</li>
             <li>Keep your chest up and back straight until thighs are parallel to the floor.</li>
             <li>Push through your heels to return to the starting position.</li>
           </ol>
         </div>

         <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5">
           <h3 className="text-red-500 font-bold text-[10px] mb-2 uppercase tracking-widest">Common Mistake</h3>
           <p className="text-white/60 text-[15px] font-medium leading-relaxed">Letting knees cave inward during the upward movement. Keep knees tracking over your toes.</p>
         </div>
      </motion.div>
    </div>
  );
}
