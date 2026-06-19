/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AuthProvider, useAuth } from './lib/AuthContext';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, ReactNode } from 'react';
import { seedDatabaseIfEmpty } from './lib/db';
import AuthScreen from './pages/AuthScreen';
import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';
import Workouts from './pages/Workouts';
import Nutrition from './pages/Nutrition';
import Progress from './pages/Progress';
import Profile from './pages/Profile';
import WorkoutSession from './pages/WorkoutSession';
import NutritionDetail from './pages/NutritionDetail';
import ExerciseDetail from './pages/ExerciseDetail';
import Premium from './pages/Premium';

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  
  useEffect(() => {
    if (user) {
      seedDatabaseIfEmpty();
    }
  }, [user]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] text-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#00E676] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/auth" />;
  }
  
  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<AuthScreen />} />
          
          <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
            <Route index element={<Home />} />
            <Route path="workouts" element={<Workouts />} />
            <Route path="nutrition" element={<Nutrition />} />
            <Route path="progress" element={<Progress />} />
            <Route path="profile" element={<Profile />} />
            <Route path="premium" element={<Premium />} />
          </Route>

          <Route path="/workout/:id" element={<ProtectedRoute><WorkoutSession /></ProtectedRoute>} />
          <Route path="/exercise/:id" element={<ProtectedRoute><ExerciseDetail /></ProtectedRoute>} />
          <Route path="/nutrition/:id" element={<ProtectedRoute><NutritionDetail /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
