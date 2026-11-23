import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../features/auth/context/AuthContext';
import { useSubject } from '../context/SubjectContext';
import LogoutConfirmModal from '../features/settings/components/LogoutConfirmModal';
import {
  LayoutGrid,
  BookOpen,
  Layers,
  FolderArchive,
  User,
  ChevronDown,
  LogOut,
  Sliders,
  PieChart,
} from 'lucide-react';

export const AppLayout = () => {
  const { currentUser, logout } = useAuth();
  const { setSubject, isDSP, isSignals } = useSubject();
  const navigate = useNavigate();
  const location = useLocation();

  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Accessible Escape key handler to close Account Menu
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && accountMenuOpen) {
        setAccountMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [accountMenuOpen]);

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutGrid },
    { name: 'Lectures', path: '/lectures', icon: BookOpen },
    { name: 'Sections', path: '/sections', icon: Layers },
    { name: 'Exam Bank', path: '/exams', icon: FolderArchive },
  ];

  const isAccountActive =
    location.pathname === '/profile' ||
    location.pathname === '/settings' ||
    location.pathname.startsWith('/settings/');

  return (
    <div
      className="min-h-screen text-[#15313C] selection:bg-[#CCEB74] selection:text-[#15313C] flex flex-col relative w-full overflow-x-hidden"
      style={{
        background:
          'radial-gradient(circle at 10% 12%, #F1FBD2 0%, rgba(248, 250, 245, 0.5) 35%, #F8FAF5 65%), radial-gradient(circle at 88% 50%, #E7F6BE 0%, rgba(248, 250, 245, 0.45) 35%, #F8FAF5 70%), #F8FAF5',
      }}
    >
      {/* Top Floating Navigation Bar (Responsive on Mobile, Tablet & Desktop) */}
      <header className="sticky top-2 sm:top-4 z-40 px-3 sm:px-6 max-w-[1140px] w-full mx-auto">
        <div className="bg-white/95 backdrop-blur-md rounded-full border border-[#EAF0F2] shadow-[0_8px_25px_rgba(21,49,60,0.04)] px-3 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-3">
          {/* Left: Course Switcher [ DSP | Signals ] */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="inline-flex items-center rounded-full bg-[#EEF3F5] border border-[#D7E0E3] p-0.5 sm:p-1 shadow-2xs">
              <button
                type="button"
                onClick={() => setSubject('DSP')}
                className={`px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
                  isDSP
                    ? 'bg-[#15313C] text-white shadow-xs'
                    : 'text-[#6B8089] hover:text-[#15313C]'
                }`}
              >
                DSP
              </button>
              <button
                type="button"
                onClick={() => setSubject('Signals')}
                className={`px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
                  isSignals
                    ? 'bg-[#15313C] text-white shadow-xs'
                    : 'text-[#6B8089] hover:text-[#15313C]'
                }`}
              >
                Signals
              </button>
            </div>
            <div className="hidden lg:block h-4 w-[1px] bg-[#D7E0E3]" />
          </div>

          {/* Center Navigation Pills (Desktop & Tablet md+) */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      isActive
                        ? 'bg-[#EAF7C6] text-[#15313C] border border-[#CCEB74]/60 shadow-xs'
                        : 'text-[#6B8089] hover:text-[#15313C] hover:bg-[#F5F8F9]'
                    }`
                  }
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Right: Account Dropdown Pill */}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => setAccountMenuOpen(!accountMenuOpen)}
              aria-expanded={accountMenuOpen}
              aria-haspopup="true"
              aria-label="User Account Menu"
              className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shadow-xs cursor-pointer ${
                isAccountActive
                  ? 'bg-[#EAF7C6] text-[#15313C] border border-[#CCEB74]/80'
                  : 'bg-white text-[#15313C] border border-[#D7E0E3] hover:bg-slate-50'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Account</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  accountMenuOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Account Menu Popover */}
            {accountMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setAccountMenuOpen(false)}
                />
                <div
                  role="menu"
                  aria-label="Account options"
                  className="absolute right-0 mt-2.5 w-60 rounded-[22px] bg-white shadow-[0_15px_35px_rgba(21,49,60,0.12)] border border-[#EAF0F2] p-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <div className="px-3.5 py-2.5 border-b border-slate-100 mb-1">
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-xs font-bold text-[#15313C] truncate">
                        {currentUser?.name || 'Student name'}
                      </p>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#15313C] text-[#CCEB74] shrink-0">
                        {activeSubject || 'DSP'}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#6B8089] truncate mt-0.5">
                      {currentUser?.email || 'name@example.com'}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#F0F4F6] text-[#3A5560] border border-[#D7E0E3] truncate">
                        {currentUser?.academicYear || localStorage.getItem('dsp_user_academic_year') || 'الفرقة الثالثة'}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#F0F4F6] text-[#3A5560] border border-[#D7E0E3] shrink-0">
                        {currentUser?.cohort || localStorage.getItem('dsp_user_cohort') || 'ECE 28'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Link
                      to="/profile"
                      onClick={() => setAccountMenuOpen(false)}
                      className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                        location.pathname === '/profile'
                          ? 'bg-[#EAF7C6] text-[#15313C]'
                          : 'text-[#3A5560] hover:bg-[#F5F8F9] hover:text-[#15313C]'
                      }`}
                    >
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </Link>

                    <Link
                      to="/settings"
                      onClick={() => setAccountMenuOpen(false)}
                      className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                        location.pathname === '/settings' || location.pathname.startsWith('/settings/')
                          ? 'bg-[#EAF7C6] text-[#15313C]'
                          : 'text-[#3A5560] hover:bg-[#F5F8F9] hover:text-[#15313C]'
                      }`}
                    >
                      <Sliders className="w-4 h-4 text-[#6B8089]" />
                      <span>Settings</span>
                    </Link>

                    <Link
                      to="/progress"
                      onClick={() => setAccountMenuOpen(false)}
                      className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                        location.pathname === '/progress'
                          ? 'bg-[#EAF7C6] text-[#15313C]'
                          : 'text-[#3A5560] hover:bg-[#F5F8F9] hover:text-[#15313C]'
                      }`}
                    >
                      <PieChart className="w-4 h-4 text-[#6B8089]" />
                      <span>Progress</span>
                    </Link>
                  </div>

                  <div className="my-1.5 border-t border-slate-100" />

                  <button
                    type="button"
                    onClick={() => {
                      setAccountMenuOpen(false);
                      setShowLogoutModal(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-[#15313C] hover:bg-slate-50 transition-colors cursor-pointer text-left"
                  >
                    <LogOut className="w-4 h-4 text-[#6B8089]" />
                    <span>Log Out</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area: Responsive padding with safe bottom clearance on mobile */}
      <main className="flex-1 max-w-[1140px] w-full mx-auto px-4 sm:px-6 py-5 sm:py-8 pb-28 md:pb-12">
        <Outlet />
      </main>

      {/* Floating Bottom Navigation Bar (Figma Page 11 Mobile Spec - Ultra Clean on Smartphones) */}
      <nav className="fixed bottom-3 left-3 right-3 z-40 md:hidden bg-white/95 backdrop-blur-lg rounded-2xl border border-[#EAF0F2] shadow-[0_10px_35px_rgba(21,49,60,0.12)] p-1.5 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-xl text-[10px] font-semibold flex flex-col items-center gap-1 transition-all ${
                  isActive
                    ? 'bg-[#EAF7C6] text-[#15313C] shadow-2xs font-bold'
                    : 'text-[#6B8089] hover:text-[#15313C]'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `px-3 py-1.5 rounded-xl text-[10px] font-semibold flex flex-col items-center gap-1 transition-all ${
              isActive
                ? 'bg-[#EAF7C6] text-[#15313C] shadow-2xs font-bold'
                : 'text-[#6B8089] hover:text-[#15313C]'
            }`
          }
        >
          <User className="w-4 h-4" />
          <span>Profile</span>
        </NavLink>
      </nav>

      {/* Logout Confirmation Dialog (Requirement 4G) */}
      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
      />
    </div>
  );
};

export default AppLayout;
