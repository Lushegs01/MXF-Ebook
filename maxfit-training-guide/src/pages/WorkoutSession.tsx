import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { X, Pause, Play, ChevronRight, ChevronLeft, CheckCircle2 } from 'lucide-react';

const MOCK_EXERCISES = [
  { id: 1, name: 'Barbell Bench Press', sets: 4, reps: '8-10', rest: 60, target: 'Chest, Triceps', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop' },
  { id: 2, name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', rest: 60, target: 'Upper Chest', image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800&auto=format&fit=crop' },
];

export default function WorkoutSession() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const exercise = MOCK_EXERCISES[currentIdx];

  useEffect(() => {
    let interval: any;
    if (isResting && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0 && isResting) {
      setIsResting(false);
    }
    return () => clearInterval(interval);
  }, [isResting, timeLeft]);

  const handleNext = () => {
    if (currentIdx < MOCK_EXERCISES.length - 1) {
      setIsResting(true);
      setTimeLeft(exercise.rest);
      setCurrentIdx((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
      setIsResting(false);
    }
  };

  if (isFinished) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] text-white flex flex-col items-center justify-center p-6 text-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-6">
          <div className="h-24 w-24 bg-[#00E676]/20 text-[#00E676] rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-12 w-12" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">Workout Complete</h1>
          <p className="text-white/40 text-lg">Great job crushing your session today.</p>
          <button 
            onClick={() => navigate('/')}
            className="w-full h-14 mt-8 bg-[#00E676] text-black rounded-2xl font-bold text-lg hover:bg-[#00E676]/90 transition-colors shadow-[0_0_20px_rgba(0,230,118,0.2)]"
          >
            Finish
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#0F0F0F] text-white overflow-hidden max-w-md mx-auto relative shadow-2xl">
      {/* Top Bar */}
      <header className="absolute top-0 w-full z-50 p-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
        <button onClick={() => navigate(-1)} className="h-12 w-12 rounded-full bg-black/40 backdrop-blur border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors">
          <X className="h-6 w-6" />
        </button>
        <div className="font-sans text-sm tracking-widest font-bold text-[#00E676] uppercase">
          {currentIdx + 1} / {MOCK_EXERCISES.length}
        </div>
      </header>

      {/* Visual / Timer Area */}
      <div className="flex-1 relative">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-500"
          style={{ backgroundImage: `url(${exercise.image})`, filter: isResting ? 'blur(10px) brightness(40%)' : 'brightness(60%)' }}
        />
        
        {isResting ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
            <h2 className="text-2xl font-bold mb-4 text-white/40 tracking-wide uppercase">Rest</h2>
            <div className="text-[80px] leading-none font-bold text-[#00E676] mb-8 tracking-tighter">
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </div>
            <button 
              onClick={() => setIsResting(false)}
              className="px-8 py-4 rounded-2xl bg-white text-black font-bold uppercase tracking-wider text-sm hover:bg-[#00E676] transition-colors"
            >
              Skip Rest
            </button>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
             <button className="h-24 w-24 rounded-full bg-[#00E676]/90 text-black flex items-center justify-center backdrop-blur-sm animate-pulse shadow-[0_0_30px_rgba(0,230,118,0.3)]">
               <Play className="h-10 w-10 ml-2" />
             </button>
          </div>
        )}
      </div>

      {/* Control Panel */}
      <div className="bg-[#0F0F0F] rounded-t-[32px] border-t border-white/10 p-8 z-30 pb-12 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <div className="mb-8 text-center space-y-2">
          <p className="text-[#00E676] font-bold text-[10px] tracking-widest uppercase mb-2">{exercise.target}</p>
          <h2 className="text-3xl font-bold leading-tight">{exercise.name}</h2>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
           <div className="bg-white/5 rounded-2xl p-5 text-center border border-white/10">
             <p className="text-white/40 text-[10px] font-bold mb-1 uppercase tracking-widest">Sets</p>
             <p className="text-3xl font-bold">{exercise.sets}</p>
           </div>
           <div className="bg-white/5 rounded-2xl p-5 text-center border border-white/10">
             <p className="text-white/40 text-[10px] font-bold mb-1 uppercase tracking-widest">Reps</p>
             <p className="text-3xl font-bold">{exercise.reps}</p>
           </div>
        </div>

        <div className="flex justify-between items-center gap-4">
          <button 
            onClick={handlePrev}
            disabled={currentIdx === 0}
            className="h-[60px] w-[60px] rounded-2xl border border-white/20 flex items-center justify-center disabled:opacity-30 hover:bg-white/5 transition-colors"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          
          <button 
            onClick={handleNext}
            className="flex-1 h-[60px] bg-white text-black rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-[#00E676] transition-colors"
          >
            {currentIdx === MOCK_EXERCISES.length - 1 ? 'Complete' : 'Next Exercise'}
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
