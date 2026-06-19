/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AuthProvider, useAuth } from './lib/AuthContext';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, ReactNode, lazy, Suspense } from 'react';
import { seedDatabaseIfEmpty } from './lib/db';

// Lazy-load route components so they are split into separate chunks
// and the initial bundle stays small.
const AuthScreen = lazy(() => import('./pages/AuthScreen'));
const MainLayout = lazy(() => import('./components/layout/MainLayout'));
const Home = lazy(() => import('./pages/Home'));
const Workouts = lazy(() => import('./pages/Workouts'));
const Nutrition = lazy(() => import('./pages/Nutrition'));
const Progress = lazy(() => import('./pages/Progress'));
const Profile = lazy(() => import('./pages/Profile'));
const WorkoutSession = lazy(() => import('./pages/WorkoutSession'));
const NutritionDetail = lazy(() => import('./pages/NutritionDetail'));
const ExerciseDetail = lazy(() => import('./pages/ExerciseDetail'));
const Premium = lazy(() => import('./pages/Premium'));

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[#00E676] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (user) {
      seedDatabaseIfEmpty();
    }
  }, [user]);

  if (loading) {
    return <LoadingScreen />;
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
        <Suspense fallback={<LoadingScreen />}>
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
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}
