import { Outlet, NavLink } from 'react-router-dom';
import { Home, Dumbbell, Apple, TrendingUp, User } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const NAV_ITEMS = [
  { label: 'Home', path: '/', icon: Home },
  { label: 'Workouts', path: '/workouts', icon: Dumbbell },
  { label: 'Nutrition', path: '/nutrition', icon: Apple },
  { label: 'Progress', path: '/progress', icon: TrendingUp },
  { label: 'Profile', path: '/profile', icon: User },
];

export default function MainLayout() {
  return (
    <div className="flex flex-col h-screen bg-[#0F0F0F] text-white overflow-hidden max-w-md mx-auto relative shadow-2xl">
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-24 scroll-smooth">
        <AnimatePresence mode="wait">
          <Outlet />
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="absolute bottom-0 w-full bg-[#0A0A0A]/95 backdrop-blur-lg border-t border-white/10 pb-safe pt-2 px-6 z-50">
        <div className="flex justify-between items-center mb-2">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center p-2 rounded-xl transition-all duration-300 relative',
                  isActive ? 'text-mf-green' : 'text-mf-muted-foreground hover:text-mf-white'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className="h-6 w-6 relative z-10" strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-[10px] mt-1 font-medium tracking-wide z-10">
                    {item.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="bottom-nav-active"
                      className="absolute inset-0 bg-mf-green/10 rounded-xl"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
