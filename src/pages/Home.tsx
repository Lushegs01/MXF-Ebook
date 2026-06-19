import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../lib/AuthContext';
import { Play, ChevronRight, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchProgressLogs, fetchWorkoutLogs } from '../lib/db';

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [latestWeight, setLatestWeight] = useState<number | null>(null);
  const [logsCount, setLogsCount] = useState(0);

  useEffect(() => {
    if (user) {
      fetchProgressLogs(user.uid).then(logs => {
        if (logs.length > 0) setLatestWeight(logs[0].weight);
      });
      fetchWorkoutLogs(user.uid).then(logs => {
        setLogsCount(logs.length);
      });
    }
  }, [user]);

  const targetWorkouts = 14;
  const progressPercent = Math.min((logsCount / targetWorkouts) * 100, 100).toFixed(0);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="p-6 space-y-8"
    >
      {/* Header */}
      <header className="flex items-center justify-between pt-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
            Welcome back, {user?.displayName?.split(' ')[0] || 'John'}
          </h1>
          <p className="text-white/40 text-[15px] font-medium">Stay consistent. Results follow.</p>
        </div>
        <div className="flex items-center gap-4 bg-white/5 p-1 pr-4 rounded-full border border-white/10 cursor-pointer" onClick={() => navigate('/progress')}>
          <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-mf-green">
            <img src={user?.photoURL || 'https://api.dicebear.com/7.x/notionists/svg?seed=Felix'} alt="Profile" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Weight</div>
            <div className="text-sm font-bold">{latestWeight || '--'} <span className="text-[#00E676] text-[10px] ml-1">lbs</span></div>
          </div>
        </div>
      </header>

      {/* Today's Workout */}
      <section>
        <div 
          className="bg-white text-black rounded-[32px] p-8 flex flex-col justify-between h-[340px] relative overflow-hidden group cursor-pointer"
          onClick={() => navigate('/workout/muscle-gain')}
        >
          <div className="absolute top-0 right-0 p-8 opacity-10">
             <Activity className="w-48 h-48" />
          </div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <div className="inline-block px-3 py-1 bg-black text-[#00E676] text-[10px] font-bold tracking-widest uppercase rounded mb-4">Today's Session</div>
              <h2 className="text-4xl font-extrabold mb-4 leading-[1.1]">Lower Body<br/>Explosiveness</h2>
              <div className="flex gap-6 mt-6">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase text-black/40 font-bold tracking-wider mb-1">Duration</span>
                  <span className="text-lg font-bold">45 MIN</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase text-black/40 font-bold tracking-wider mb-1">Intensity</span>
                  <span className="text-lg font-bold">ADVANCED</span>
                </div>
              </div>
            </div>
            
            <button 
              className="w-fit px-8 py-4 bg-black text-white font-bold rounded-2xl flex items-center gap-3 hover:bg-[#00E676] hover:text-black transition-all"
              onClick={(e) => { e.stopPropagation(); navigate('/workout/muscle-gain'); }}
            >
              START WORKOUT <Play className="h-5 w-5 fill-current" />
            </button>
          </div>
        </div>
      </section>

      {/* Progress Card */}
      <section className="bg-white/5 border border-white/10 rounded-[32px] p-6 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <span className="text-lg font-bold">Consistency</span>
          <span className="text-[#00E676] text-sm font-bold">{progressPercent}% Goal</span>
        </div>
        
        <div className="flex-1 flex items-end gap-2 h-24">
          <div className="flex-1 bg-[#00E676] rounded-t-lg h-[40%] opacity-20"></div>
          <div className="flex-1 bg-[#00E676] rounded-t-lg h-[60%] opacity-40"></div>
          <div className="flex-1 bg-[#00E676] rounded-t-lg h-[55%] opacity-30"></div>
          <div className="flex-1 bg-[#00E676] rounded-t-lg h-[90%] transition-all"></div>
          <div className="flex-1 bg-white/10 rounded-t-lg h-[10%]"></div>
          <div className="flex-1 bg-white/10 rounded-t-lg h-[10%]"></div>
          <div className="flex-1 bg-white/10 rounded-t-lg h-[10%]"></div>
        </div>
        
        <div className="mt-6 space-y-3">
          <div className="flex justify-between items-center px-1">
            <span className="text-white/40 text-xs font-bold uppercase tracking-wider">Workouts Completed</span>
            <span className="font-bold text-sm">{logsCount} / {targetWorkouts}</span>
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-[#00E676]" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>
      </section>

      {/* Quick Access List */}
      <section className="grid grid-cols-2 gap-4 pb-8">
        {[
          { label: 'Workout Library', desc: '24 Categories', path: '/workouts', icon: Activity },
          { label: 'Nutrition Hub', desc: 'Custom Plans', path: '/nutrition', icon: Activity },
        ].map((item, i) => (
          <button 
            key={i}
            onClick={() => navigate(item.path)}
            className="w-full bg-white/5 hover:bg-white/10 transition-colors border border-white/10 rounded-[24px] p-5 flex flex-col items-start gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-[#00E676]">
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
          className="col-span-2 w-full mt-2 p-5 bg-gradient-to-br from-[#00E676]/20 to-transparent border border-[#00E676]/30 rounded-[24px] flex justify-between items-center"
        >
          <div className="text-left">
             <div className="text-[10px] font-bold text-[#00E676] mb-1 uppercase tracking-widest">Premium Member</div>
             <div className="text-lg font-bold text-white leading-snug">Access 120+ Pro programs</div>
          </div>
          <ChevronRight className="h-6 w-6 text-[#00E676]" />
        </button>
      </section>

    </motion.div>
  );
}
