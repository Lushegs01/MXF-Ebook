import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { X, Play, ChevronRight, ChevronLeft, CheckCircle2, Info } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { addWorkoutSession } from '../lib/db';
import { getWorkout, getWorkoutExercises } from '../lib/content';

export default function WorkoutSession() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const workout = getWorkout(id);
  const exercises = workout ? getWorkoutExercises(workout) : [];

  const [currentIdx, setCurrentIdx] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const savedRef = useRef(false);

  const exercise = exercises[currentIdx];

  useEffect(() => {
    let interval: any;
    if (isResting && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0 && isResting) {
      setIsResting(false);
    }
    return () => clearInterval(interval);
  }, [isResting, timeLeft]);

  const finishWorkout = () => {
    if (!savedRef.current && user && workout) {
      savedRef.current = true;
      addWorkoutSession(user.uid, {
        workoutId: workout.id,
        workoutTitle: workout.title,
        durationMin: workout.duration,
        exerciseCount: exercises.length,
        completedAt: new Date().toISOString().split('T')[0],
      }).catch(() => {
        // history is best-effort; never block the completion screen on it
      });
    }
    setIsFinished(true);
  };

  const handleNext = () => {
    if (currentIdx < exercises.length - 1) {
      setIsResting(true);
      setTimeLeft(exercise.rest);
      setCurrentIdx((prev) => prev + 1);
    } else {
      finishWorkout();
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
      setIsResting(false);
    }
  };

  if (!workout || exercises.length === 0) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] text-white flex flex-col items-center justify-center p-6 text-center gap-6">
        <h1 className="text-2xl font-bold">Workout not found</h1>
        <p className="text-white/40">This session isn’t available.</p>
        <button
          onClick={() => navigate('/workouts')}
          className="px-8 py-4 bg-[#F26F21] text-black rounded-2xl font-bold"
        >
          Browse Workouts
        </button>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] text-white flex flex-col items-center justify-center p-6 text-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-6">
          <div className="h-24 w-24 bg-[#F26F21]/20 text-[#F26F21] rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-12 w-12" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">Workout Complete</h1>
          <p className="text-white/40 text-lg">{workout.title} · {exercises.length} exercises · {workout.duration} min</p>
          <button
            onClick={() => navigate('/')}
            className="w-full h-14 mt-8 bg-[#F26F21] text-black rounded-2xl font-bold text-lg hover:bg-[#F26F21]/90 transition-colors shadow-[0_0_20px_rgba(242,111,33,0.2)]"
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
        <div className="font-sans text-sm tracking-widest font-bold text-[#F26F21] uppercase">
          {currentIdx + 1} / {exercises.length}
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
            <div className="text-[80px] leading-none font-bold text-[#F26F21] mb-8 tracking-tighter">
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </div>
            <button
              onClick={() => setIsResting(false)}
              className="px-8 py-4 rounded-2xl bg-white text-black font-bold uppercase tracking-wider text-sm hover:bg-[#F26F21] transition-colors"
            >
              Skip Rest
            </button>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
             <button
               onClick={() => navigate(`/exercise/${exercise.id}`)}
               aria-label="View exercise instructions"
               className="h-24 w-24 rounded-full bg-[#F26F21]/90 text-black flex items-center justify-center backdrop-blur-sm shadow-[0_0_30px_rgba(242,111,33,0.3)] hover:scale-105 transition-transform"
             >
               <Play className="h-10 w-10 ml-2" />
             </button>
          </div>
        )}
      </div>

      {/* Control Panel */}
      <div className="bg-[#0F0F0F] rounded-t-[32px] border-t border-white/10 p-8 z-30 pb-12 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <div className="mb-8 text-center space-y-2">
          <p className="text-[#F26F21] font-bold text-[10px] tracking-widest uppercase mb-2">{exercise.target}</p>
          <button
            onClick={() => navigate(`/exercise/${exercise.id}`)}
            className="inline-flex items-center gap-2 text-3xl font-bold leading-tight hover:text-[#F26F21] transition-colors"
          >
            {exercise.name}
            <Info className="h-5 w-5 text-white/30" />
          </button>
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
            className="flex-1 h-[60px] bg-white text-black rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-[#F26F21] transition-colors"
          >
            {currentIdx === exercises.length - 1 ? 'Complete' : 'Next Exercise'}
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
