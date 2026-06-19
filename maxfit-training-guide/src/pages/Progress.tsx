import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Target, TrendingUp, Calendar, Plus } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { fetchProgressLogs, addProgressLog, ProgressLog } from '../lib/db';

export default function Progress() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<ProgressLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newWeight, setNewWeight] = useState('');

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    const data = await fetchProgressLogs(user.uid);
    setLogs(data);
    setLoading(false);
  };

  const handleAddLog = async () => {
    if (!user || !newWeight) return;
    await addProgressLog(user.uid, {
      weight: parseFloat(newWeight),
      date: new Date().toISOString().split('T')[0]
    });
    setNewWeight('');
    setShowModal(false);
    loadData();
  };

  const latestWeight = logs.length > 0 ? logs[0].weight : 0;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 space-y-6">
      <header className="pt-4 mb-4 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 text-white">Progress</h1>
          <p className="text-white/40 text-[15px] font-medium">Track your journey.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="h-10 w-10 bg-[#00E676] text-black rounded-full flex items-center justify-center hover:bg-[#00E676]/90 transition-colors"
        >
          <Plus className="h-5 w-5 font-bold" />
        </button>
      </header>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/5 rounded-[32px] p-6 border border-white/10">
           <Target className="h-6 w-6 text-orange-400 mb-4 text-opacity-80" />
           <p className="text-white/40 text-[10px] font-bold tracking-widest uppercase mb-1">Current Weight</p>
           <p className="text-3xl font-bold text-white tracking-tight">{latestWeight || '--'} <span className="text-sm font-normal text-white/40">lbs</span></p>
        </div>
        <div className="bg-white/5 rounded-[32px] p-6 border border-white/10">
           <TrendingUp className="h-6 w-6 text-[#00E676] mb-4 text-opacity-80" />
           <p className="text-white/40 text-[10px] font-bold tracking-widest uppercase mb-1">Goal Weight</p>
           <p className="text-3xl font-bold text-white tracking-tight">175 <span className="text-sm font-normal text-white/40">lbs</span></p>
        </div>
      </div>

      <div className="bg-white/5 rounded-[32px] p-6 border border-white/10 mt-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-bold text-lg text-white">Recent Logs</h2>
          <Calendar className="h-5 w-5 text-white/40" />
        </div>
        
        {loading ? (
          <div className="text-center py-4 text-white/40 font-medium">Loading...</div>
        ) : logs.length === 0 ? (
          <div className="text-center py-4 text-white/40 font-medium">No logs yet. Add one!</div>
        ) : (
          <div className="space-y-3">
            {logs.map((log) => (
              <div key={log.id} className="flex justify-between items-center p-4 rounded-2xl bg-black/40 border border-white/5">
                <span className="text-white/60 font-medium text-sm">{log.date}</span>
                <span className="font-bold text-lg text-white">{log.weight} <span className="text-xs text-white/40 font-medium">lbs</span></span>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#1A1A1A] rounded-[32px] p-8 w-full max-w-sm border border-white/10 shadow-2xl">
            <h3 className="text-xl font-bold mb-6 text-white text-center">Log Today's Weight</h3>
            <input 
              type="number" 
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
              placeholder="e.g. 180"
              className="w-full h-14 bg-black/50 border border-white/10 rounded-2xl px-6 text-white text-lg focus:outline-none focus:border-[#00E676] mb-8 transition-colors placeholder:text-white/20 text-center font-bold"
            />
            <div className="flex gap-4">
              <button 
                onClick={() => setShowModal(false)}
                className="flex-1 h-14 bg-white/5 text-white rounded-2xl font-bold hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddLog}
                className="flex-1 h-14 bg-[#00E676] text-black rounded-2xl font-bold hover:bg-[#00E676]/90 transition-colors"
              >
                Save
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
