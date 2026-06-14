import { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../lib/AuthContext';
import { Play, ChevronRight, Activity, Apple } from 'lucide-react';
import Logo from '../components/Logo';
import { useNavigate } from 'react-router-dom';
import { fetchProgressLogs, fetchWorkoutSessions } from '../lib/db';
import { getTodaysWorkout, getCategories, WEEKLY_WORKOUT_GOAL } from '../lib/content';

const WEEKDAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [latestWeight, setLatestWeight] = useState<number | null>(null);
  const [sessionDates, setSessionDates] = useState<Set<string>>(new Set());

  const todaysWorkout = useMemo(() => getTodaysWorkout(), []);
  const categoryCount = useMemo(() => getCategories().length, []);

  useEffect(() => {
    if (!user) return;
    fetchProgressLogs(user.uid).then((logs) => {
      if (logs.length > 0) setLatestWeight(logs[0].weight);
    });
    fetchWorkoutSessions(user.uid).then((sessions) => {
      setSessionDates(new Set(sessions.map((s) => s.completedAt)));
    });
  }, [user]);

  // Build the last 7 days (oldest -> today) and mark which had a workout.
  const week = useMemo(() => {
    const today = new Date();
    return [...Array(7)].map((_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (6 - i));
      const key = d.toISOString().split('T')[0];
      return { key, label: WEEKDAY_LABELS[(d.getDay() + 6) % 7], done: sessionDates.has(key) };
    });
  }, [sessionDates]);

  const completed = week.filter((d) => d.done).length;
  const goalPct = Math.min(100, Math.round((completed / WEEKLY_WORKOUT_GOAL) * 100));

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="p-6 space-y-8"
    >
      {/* Header */}
      <header className="pt-4">
        <div className="flex items-center gap-2 mb-6">
          <Logo variant="mark" className="h-8 w-8" />
          <span className="text-lg font-extrabold tracking-tight text-white">
            MAX<span className="text-[#F26F21]">FIT</span>
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
              Welcome back, {user?.displayName?.split(' ')[0] || 'there'}
            </h1>
            <p className="text-white/40 text-[15px] font-medium">Stay consistent. Results follow.</p>
          </div>
          <div className="flex items-center gap-4 bg-white/5 p-1 pr-4 rounded-full border border-white/10 cursor-pointer" onClick={() => navigate('/progress')}>
            <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-mf-orange">
              <img src={user?.photoURL || 'https://api.dicebear.com/7.x/notionists/svg?seed=Felix'} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Weight</div>
              <div className="text-sm font-bold">{latestWeight || '--'} <span className="text-[#F26F21] text-[10px] ml-1">lbs</span></div>
            </div>
          </div>
        </div>
      </header>

      {/* Today's Workout */}
      <section>
        <div
          className="bg-white text-black rounded-[32px] p-8 flex flex-col justify-between h-[340px] relative overflow-hidden group cursor-pointer"
          onClick={() => navigate(`/workout/${todaysWorkout.id}`)}
        >
          <div className="absolute top-0 right-0 p-8 opacity-10">
             <Activity className="w-48 h-48" />
          </div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <div className="inline-block px-3 py-1 bg-black text-[#F26F21] text-[10px] font-bold tracking-widest uppercase rounded mb-4">Today's Session</div>
              <h2 className="text-4xl font-extrabold mb-4 leading-[1.1]">{todaysWorkout.title}</h2>
              <div className="flex gap-6 mt-6">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase text-black/40 font-bold tracking-wider mb-1">Duration</span>
                  <span className="text-lg font-bold">{todaysWorkout.duration} MIN</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase text-black/40 font-bold tracking-wider mb-1">Intensity</span>
                  <span className="text-lg font-bold uppercase">{todaysWorkout.intensity}</span>
                </div>
              </div>
            </div>

            <button
              className="w-fit px-8 py-4 bg-black text-white font-bold rounded-2xl flex items-center gap-3 hover:bg-[#F26F21] hover:text-black transition-all"
              onClick={(e) => { e.stopPropagation(); navigate(`/workout/${todaysWorkout.id}`); }}
            >
              START WORKOUT <Play className="h-5 w-5 fill-current" />
            </button>
          </div>
        </div>
      </section>

      {/* Progress Card */}
      <section className="bg-white/5 border border-white/10 rounded-[32px] p-6 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <span className="text-lg font-bold">Weekly Progress</span>
          <span className="text-[#F26F21] text-sm font-bold">{goalPct}% Goal</span>
        </div>

        <div className="flex-1 flex items-end gap-2 h-24">
          {week.map((d, i) => (
            <div
              key={i}
              className={`flex-1 rounded-t-lg transition-all ${d.done ? 'bg-[#F26F21]' : 'bg-white/10'}`}
              style={{ height: d.done ? '90%' : '12%' }}
            />
          ))}
        </div>
        <div className="flex gap-2 mt-2">
          {week.map((d, i) => (
            <span key={i} className="flex-1 text-center text-[10px] font-bold text-white/30">{d.label}</span>
          ))}
        </div>

        <div className="mt-6 space-y-3">
          <div className="flex justify-between items-center px-1">
            <span className="text-white/40 text-xs font-bold uppercase tracking-wider">Workouts Completed</span>
            <span className="font-bold text-sm">{completed} / {WEEKLY_WORKOUT_GOAL}</span>
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-[#F26F21] transition-all" style={{ width: `${goalPct}%` }} />
          </div>
        </div>
      </section>

      {/* Quick Access List */}
      <section className="grid grid-cols-2 gap-4 pb-8">
        {[
          { label: 'Workout Library', desc: `${categoryCount} Categories`, path: '/workouts', icon: Activity },
          { label: 'Nutrition Hub', desc: 'Custom Plans', path: '/nutrition', icon: Apple },
        ].map((item, i) => (
          <button
            key={i}
            onClick={() => navigate(item.path)}
            className="w-full bg-white/5 hover:bg-white/10 transition-colors border border-white/10 rounded-[24px] p-5 flex flex-col items-start gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-[#F26F21]">
              <item.icon className="h-6 w-6" />
            </div>
            <div className="text-left mt-2">
              <div className="font-bold text-white leading-tight">{item.label}</div>
              <div className="text-[10px] uppercase tracking-wider font-bold text-white/40 mt-1">{item.desc}</div>
            </div>
          </button>
        ))}

        <button
          onClick={() => navigate('/premium')}
          className="col-span-2 w-full mt-2 p-5 bg-gradient-to-br from-[#F26F21]/20 to-transparent border border-[#F26F21]/30 rounded-[24px] flex justify-between items-center"
        >
          <div className="text-left">
             <div className="text-[10px] font-bold text-[#F26F21] mb-1 uppercase tracking-widest">Premium Member</div>
             <div className="text-lg font-bold text-white leading-snug">Unlock all Pro programs</div>
          </div>
          <ChevronRight className="h-6 w-6 text-[#F26F21]" />
        </button>
      </section>

    </motion.div>
  );
}
