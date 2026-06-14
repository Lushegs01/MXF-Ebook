import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { motion } from 'motion/react';
import Logo from '../components/Logo';

export default function AuthScreen() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0F0F0F] text-white px-8 pt-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 flex flex-col pt-12"
      >
        <div className="flex justify-center mb-16">
          <Logo variant="full" className="h-52 w-auto select-none" />
        </div>

        <div className="space-y-4 mb-10">
          <h2 className="text-5xl font-extrabold tracking-tight leading-[1.1]">Train <br/><span className="text-[#00E676]">Like a Pro.</span></h2>
          <p className="text-white/40 text-[17px] font-medium max-w-sm mt-4">
            Your premium interactive workout handbook and training guide.
          </p>
        </div>

        {error && (
          <div className="p-4 mb-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 font-medium">
            {error}
          </div>
        )}

        {/* Minimalist modern card approach */}
        <div className="mt-auto pb-16 space-y-6">
          <button 
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full h-16 bg-white text-black rounded-2xl font-bold text-lg hover:bg-[#00E676] transition-colors flex items-center justify-center disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Continue with Google"}
          </button>
          
          <p className="text-center text-white/40 text-xs font-bold uppercase tracking-widest leading-loose">
            By continuing, you agree to our<br/>Terms and Privacy Policy.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
