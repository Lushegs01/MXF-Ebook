import { Outlet, NavLink, useLocation } from 'react-router-dom';
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
  const location = useLocation();

  return (
    <div className="flex flex-col h-screen bg-[#0F0F0F] text-white overflow-hidden max-w-md mx-auto relative shadow-2xl">
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-24 scroll-smooth">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="absolute bottom-0 w-full bg-[#0A0A0A]/95 backdrop-blur-lg border-t border-white/10 pt-2 px-6 z-50" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
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
