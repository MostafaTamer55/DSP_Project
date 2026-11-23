import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Lock,
  ArrowRight,
  LogOut,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Check,
  X,
  Pencil,
  GraduationCap,
} from 'lucide-react';
import { useAuth } from '../../auth/context/AuthContext';
import { useSubject } from '../../../context/SubjectContext';
import LogoutConfirmModal from '../components/LogoutConfirmModal';
import { PREDEFINED_ACCOUNTS } from '../../auth/context/mockAccounts';

const YEAR_PRESETS = [
  { year: 'الفرقة الثالثة', defaultCohort: 'ECE 28', label: 'الفرقة الثالثة (Year 3)' },
  { year: 'الفرقة الرابعة', defaultCohort: 'ECE 27', label: 'الفرقة الرابعة (Year 4)' },
  { year: 'الفرقة الثانية', defaultCohort: 'ECE 29', label: 'الفرقة الثانية (Year 2)' },
  { year: 'الفرقة الأولى', defaultCohort: 'ECE 30', label: 'الفرقة الأولى (Year 1)' },
  { year: 'إعدادي هندسة', defaultCohort: 'ECE 31', label: 'إعدادي هندسة (Prep)' },
];

const COHORT_QUICK_CHIPS = ['ECE 28', 'ECE 27', 'ECE 29', 'CCE 28', 'CCE 27'];

/**
 * Enterprise-grade, Resilient Settings & Change Password Module:
 * - Allows modifying and persisting Cohort across Settings & Profile
 * - Full validation, error states, and success toasts
 */
export const SettingsPage = () => {
  const { currentUser, updatePassword, updateCohort, logout } = useAuth();
  const { activeConfig } = useSubject();
  const location = useLocation();
  const navigate = useNavigate();

  // Detect if on dedicated change-password view (via URL or search param)
  const isChangePasswordView =
    location.pathname === '/settings/change-password' ||
    location.search.includes('view=change-password');

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Cohort state
  const [cohort, setCohort] = useState(() => {
    try {
      return (
        localStorage.getItem('dsp_user_cohort') ||
        currentUser?.cohort ||
        activeConfig?.cohort ||
        'ECE 28'
      );
    } catch {
      return 'ECE 28';
    }
  });

  // Academic Year (الفرقة) state
  const [academicYear, setAcademicYear] = useState(() => {
    try {
      return (
        localStorage.getItem('dsp_user_academic_year') ||
        currentUser?.academicYear ||
        'الفرقة الثالثة'
      );
    } catch {
      return 'الفرقة الثالثة';
    }
  });

  const [isEditingCohort, setIsEditingCohort] = useState(false);
  const [tempCohort, setTempCohort] = useState(cohort);
  const [tempYear, setTempYear] = useState(academicYear);
  const [cohortSuccess, setCohortSuccess] = useState(false);

  // Change Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Focused input tracker for glowing lime focus ring
  const [focusedField, setFocusedField] = useState('current');

  // Field errors matching reference Image 3
  const [fieldErrors, setFieldErrors] = useState({});
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Clean timeout on unmount to avoid memory leaks
  useEffect(() => {
    let timer;
    if (showSuccessToast) {
      timer = setTimeout(() => {
        setShowSuccessToast(false);
      }, 4500);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [showSuccessToast]);

  const displayName = (currentUser?.name && String(currentUser.name).trim()) || 'Student name';
  const displayEmail = (currentUser?.email && String(currentUser.email).trim()) || 'name@example.com';

  // Multi-tab sync
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'dsp_user_cohort' && e.newValue) {
        setCohort(e.newValue);
        setTempCohort(e.newValue);
      }
      if (e.key === 'dsp_user_academic_year' && e.newValue) {
        setAcademicYear(e.newValue);
        setTempYear(e.newValue);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleSaveCohort = (e) => {
    e?.preventDefault();
    const cleanCohort = tempCohort.trim() || 'ECE 28';
    const cleanYear = tempYear.trim() || 'الفرقة الثالثة';

    setCohort(cleanCohort);
    setAcademicYear(cleanYear);

    if (typeof updateCohort === 'function') {
      updateCohort(cleanCohort, cleanYear);
    } else {
      try {
        localStorage.setItem('dsp_user_cohort', cleanCohort);
        localStorage.setItem('dsp_user_academic_year', cleanYear);
        const stored = localStorage.getItem('dsp_auth_session');
        if (stored) {
          const session = JSON.parse(stored);
          session.cohort = cleanCohort;
          session.academicYear = cleanYear;
          localStorage.setItem('dsp_auth_session', JSON.stringify(session));
        }
      } catch {
        // ignore
      }
    }

    setIsEditingCohort(false);
    setCohortSuccess(true);
    setTimeout(() => setCohortSuccess(false), 3000);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const errors = {};

    if (!currentPassword) {
      errors.current = 'Enter your current password';
    }

    if (!newPassword) {
      errors.new = 'Enter a new password';
    } else if (newPassword.length < 6) {
      errors.new = 'Password must be at least 6 characters';
    }

    if (!confirmPassword) {
      errors.confirm = 'Repeat the new password';
    } else if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      errors.confirm = "Passwords don't match";
    }

    if (currentPassword && newPassword && currentPassword === newPassword) {
      errors.new = 'New password cannot be the same as your current password';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      let overrides = {};
      try {
        const overridesRaw = localStorage.getItem('dsp_password_overrides');
        overrides = overridesRaw ? JSON.parse(overridesRaw) : {};
      } catch {
        overrides = {};
      }

      let dynamicAccounts = [];
      try {
        const dynamicRaw = localStorage.getItem('dsp_registered_accounts');
        dynamicAccounts = dynamicRaw ? JSON.parse(dynamicRaw) : [];
      } catch {
        dynamicAccounts = [];
      }

      const allAccounts = [...PREDEFINED_ACCOUNTS, ...dynamicAccounts].map((acc) => {
        const emailLower = (acc.email || '').toLowerCase();
        if (overrides[emailLower]) {
          return { ...acc, password: overrides[emailLower] };
        }
        return acc;
      });

      const userEmail = (currentUser?.email || 'student@dsp.edu').toLowerCase();
      const existingAccount = allAccounts.find(
        (acc) => (acc.email || '').toLowerCase() === userEmail
      );

      const actualPassword = existingAccount?.password || 'Password123!';
      if (currentPassword !== actualPassword) {
        setFieldErrors({ current: 'Incorrect current password' });
        setIsSubmitting(false);
        return;
      }

      await updatePassword(currentUser?.email || 'student@dsp.edu', newPassword);

      setShowSuccessToast(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch {
      setFieldErrors({ current: 'Failed to update password. Please check your storage settings.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // -------------------------------------------------------------
  // VIEW 2: DEDICATED CHANGE PASSWORD VIEW
  // -------------------------------------------------------------
  if (isChangePasswordView) {
    return (
      <div className="space-y-5 sm:space-y-6 pb-12 relative min-h-[500px] w-full max-w-full">
        {/* Floating Success Toast */}
        {showSuccessToast && (
          <div
            role="status"
            aria-live="polite"
            className="fixed top-16 sm:top-20 right-3 sm:right-10 z-50 bg-white border border-[#CDEB74] rounded-2xl p-3.5 sm:p-4 shadow-[0_12px_35px_rgba(21,49,60,0.12)] flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-3 duration-200 max-w-[92vw] sm:max-w-md select-none"
          >
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-[#EDF7E6] text-[#4C7A1F] flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <p className="text-xs sm:text-[13px] font-bold text-[#15313C] leading-tight">
                  Password updated
                </p>
                <p className="text-[11px] text-[#6B8089] mt-0.5 leading-tight">
                  Your password has been changed.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowSuccessToast(false)}
              className="text-[#6B8089] hover:text-[#15313C] p-1 rounded-full transition-colors cursor-pointer"
              aria-label="Close notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Top-Left Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-medium text-[#6B8089] pt-1">
          <Link
            to="/settings"
            className="hover:text-[#15313C] transition-colors"
          >
            Settings
          </Link>
          <span aria-hidden="true">/</span>
          <span className="font-semibold text-[#15313C]">Change password</span>
        </nav>

        {/* Centered Main Card */}
        <div className="max-w-[560px] mx-auto bg-white rounded-[28px] sm:rounded-[36px] p-6 sm:p-12 border border-[#EAF0F2] shadow-[0_15px_45px_rgba(21,49,60,0.035)] mt-3 sm:mt-4">
          <h1 className="text-2xl sm:text-3xl md:text-[36px] font-bold text-[#15313C] tracking-tight leading-tight">
            Change password
          </h1>
          <p className="text-xs sm:text-[13px] text-[#6B8089] mt-1.5 sm:mt-2 mb-6 sm:mb-8 leading-relaxed">
            Enter your current password, then choose a new one.
          </p>

          <form onSubmit={handlePasswordSubmit} className="space-y-4 sm:space-y-5" noValidate>
            {/* 1. Current Password */}
            <div>
              <label
                htmlFor="current-pw"
                className="block text-xs sm:text-[13px] font-semibold text-[#15313C] mb-1.5"
              >
                Current password
              </label>
              <div className="relative">
                <div
                  className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors ${
                    fieldErrors.current ? 'text-[#E5484D]' : 'text-[#8FA5AE]'
                  }`}
                >
                  <Lock className="w-4 h-4 stroke-[1.75]" aria-hidden="true" />
                </div>
                <input
                  id="current-pw"
                  name="currentPassword"
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  autoComplete="current-password"
                  onFocus={() => setFocusedField('current')}
                  onChange={(e) => {
                    setCurrentPassword(e.target.value);
                    if (fieldErrors.current) {
                      setFieldErrors((prev) => ({ ...prev, current: undefined }));
                    }
                  }}
                  placeholder="Enter current password"
                  className={`w-full pl-10 pr-11 py-2.5 sm:py-3 rounded-[14px] text-xs sm:text-sm text-[#15313C] placeholder:text-[#B5C2C7] outline-none transition-all ${
                    fieldErrors.current
                      ? 'border border-[#E5484D] bg-[#FCEDED]/30 focus:border-[#E5484D] focus:ring-1 focus:ring-[#E5484D]'
                      : focusedField === 'current'
                      ? 'border border-[#CCEB74] ring-2 ring-[#CCEB74]/40 bg-[#FAFDED]'
                      : 'border border-[#D7E0E3] bg-[#EEF3F5] focus:border-[#CCEB74] focus:ring-2 focus:ring-[#CCEB74]/40 focus:bg-[#FAFDED]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#8FA5AE] hover:text-[#15313C] transition-colors cursor-pointer"
                  tabIndex={0}
                  aria-label={showCurrentPassword ? 'Hide current password' : 'Show current password'}
                >
                  {showCurrentPassword ? (
                    <EyeOff className="w-4 h-4 stroke-[1.75]" />
                  ) : (
                    <Eye className="w-4 h-4 stroke-[1.75]" />
                  )}
                </button>
              </div>
              {fieldErrors.current && (
                <div role="alert" className="flex items-center gap-1.5 mt-2 text-[#E5484D] text-xs font-normal">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 stroke-[2]" aria-hidden="true" />
                  <span>{fieldErrors.current}</span>
                </div>
              )}
            </div>

            {/* 2. New Password */}
            <div>
              <label
                htmlFor="new-pw"
                className="block text-xs sm:text-[13px] font-semibold text-[#15313C] mb-1.5"
              >
                New password
              </label>
              <div className="relative">
                <div
                  className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors ${
                    fieldErrors.new ? 'text-[#E5484D]' : 'text-[#8FA5AE]'
                  }`}
                >
                  <Lock className="w-4 h-4 stroke-[1.75]" aria-hidden="true" />
                </div>
                <input
                  id="new-pw"
                  name="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  autoComplete="new-password"
                  onFocus={() => setFocusedField('new')}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (fieldErrors.new) {
                      setFieldErrors((prev) => ({ ...prev, new: undefined }));
                    }
                  }}
                  placeholder="Enter a new password"
                  className={`w-full pl-10 pr-11 py-2.5 sm:py-3 rounded-[14px] text-xs sm:text-sm text-[#15313C] placeholder:text-[#B5C2C7] outline-none transition-all ${
                    fieldErrors.new
                      ? 'border border-[#E5484D] bg-[#FCEDED]/30 focus:border-[#E5484D] focus:ring-1 focus:ring-[#E5484D]'
                      : focusedField === 'new'
                      ? 'border border-[#CCEB74] ring-2 ring-[#CCEB74]/40 bg-[#FAFDED]'
                      : 'border border-[#D7E0E3] bg-[#EEF3F5] focus:border-[#CCEB74] focus:ring-2 focus:ring-[#CCEB74]/40 focus:bg-[#FAFDED]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#8FA5AE] hover:text-[#15313C] transition-colors cursor-pointer"
                  tabIndex={0}
                  aria-label={showNewPassword ? 'Hide new password' : 'Show new password'}
                >
                  {showNewPassword ? (
                    <EyeOff className="w-4 h-4 stroke-[1.75]" />
                  ) : (
                    <Eye className="w-4 h-4 stroke-[1.75]" />
                  )}
                </button>
              </div>
              {fieldErrors.new && (
                <div role="alert" className="flex items-center gap-1.5 mt-2 text-[#E5484D] text-xs font-normal">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 stroke-[2]" aria-hidden="true" />
                  <span>{fieldErrors.new}</span>
                </div>
              )}
            </div>

            {/* 3. Confirm New Password */}
            <div>
              <label
                htmlFor="confirm-pw"
                className="block text-xs sm:text-[13px] font-semibold text-[#15313C] mb-1.5"
              >
                Confirm new password
              </label>
              <div className="relative">
                <div
                  className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors ${
                    fieldErrors.confirm ? 'text-[#E5484D]' : 'text-[#8FA5AE]'
                  }`}
                >
                  <Lock className="w-4 h-4 stroke-[1.75]" aria-hidden="true" />
                </div>
                <input
                  id="confirm-pw"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  autoComplete="new-password"
                  onFocus={() => setFocusedField('confirm')}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (fieldErrors.confirm) {
                      setFieldErrors((prev) => ({ ...prev, confirm: undefined }));
                    }
                  }}
                  placeholder="Repeat the new password"
                  className={`w-full pl-10 pr-11 py-2.5 sm:py-3 rounded-[14px] text-xs sm:text-sm text-[#15313C] placeholder:text-[#B5C2C7] outline-none transition-all ${
                    fieldErrors.confirm
                      ? 'border border-[#E5484D] bg-[#FCEDED]/30 focus:border-[#E5484D] focus:ring-1 focus:ring-[#E5484D]'
                      : focusedField === 'confirm'
                      ? 'border border-[#CCEB74] ring-2 ring-[#CCEB74]/40 bg-[#FAFDED]'
                      : 'border border-[#D7E0E3] bg-[#EEF3F5] focus:border-[#CCEB74] focus:ring-2 focus:ring-[#CCEB74]/40 focus:bg-[#FAFDED]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#8FA5AE] hover:text-[#15313C] transition-colors cursor-pointer"
                  tabIndex={0}
                  aria-label={showConfirmPassword ? 'Hide confirmation password' : 'Show confirmation password'}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4 stroke-[1.75]" />
                  ) : (
                    <Eye className="w-4 h-4 stroke-[1.75]" />
                  )}
                </button>
              </div>
              {fieldErrors.confirm && (
                <div role="alert" className="flex items-center gap-1.5 mt-2 text-[#E5484D] text-xs font-normal">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 stroke-[2]" aria-hidden="true" />
                  <span>{fieldErrors.confirm}</span>
                </div>
              )}
            </div>

            {/* Bottom Actions: Centered Cancel & Save password */}
            <div className="flex items-center justify-center gap-3 pt-4 sm:pt-6">
              <Link
                to="/settings"
                className="py-2.5 px-6 sm:px-7 rounded-full border border-[#D7E0E3] bg-white hover:bg-slate-50 active:scale-98 text-xs sm:text-sm font-semibold text-[#15313C] transition-all cursor-pointer text-center outline-none focus:ring-2 focus:ring-[#15313C]/20"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#15313C] hover:bg-[#112730] active:scale-98 text-[#CCEB74] py-2.5 px-6 sm:px-7 rounded-full font-bold text-xs sm:text-sm inline-flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-60 outline-none focus:ring-2 focus:ring-[#CCEB74]"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-[#CCEB74]/30 border-t-[#CCEB74] rounded-full animate-spin" />
                ) : (
                  <>
                    <Check className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
                    <span>Save password</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 1: MAIN SETTINGS VIEW (3 CARDS LAYOUT)
  // -------------------------------------------------------------
  return (
    <div className="space-y-6 sm:space-y-8 pb-4 sm:pb-8 w-full max-w-full">
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 pt-1">
        <div>
          <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-bold text-[#15313C] tracking-tight leading-none">
            Settings
          </h1>
          <p className="text-xs sm:text-sm text-[#6B8089] mt-2 leading-relaxed">
            Manage your account and password.
          </p>
        </div>

        {/* Top Right Sample Placeholders Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs text-[#52707C] font-medium bg-[#EBF0F2]/70 border border-[#DCE4E7] shadow-2xs self-start sm:self-center">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1F4B5B]" />
          <span>Sample placeholders</span>
        </div>
      </div>

      {/* 2. TOP ROW: TWO CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-7 items-stretch">
        {/* Left Card: Account Information */}
        <div className="bg-white rounded-[28px] sm:rounded-[32px] p-6 sm:p-9 border border-[#EAF0F2] shadow-[0_15px_40px_rgba(21,49,60,0.03)] flex flex-col justify-between min-h-[250px] sm:min-h-[260px] overflow-hidden">
          <div>
            <div className="flex items-center justify-between mb-4 sm:mb-5">
              <h2 className="text-xl sm:text-2xl font-bold text-[#15313C] tracking-tight">
                Account information
              </h2>
              {cohortSuccess && (
                <span className="text-xs font-semibold text-[#4C7A1F] bg-[#EDF7E6] border border-[#CDEB74] px-2.5 py-0.5 rounded-full">
                  Saved!
                </span>
              )}
            </div>

            <div className="divide-y divide-[#EAF0F2]">
              {/* Row 1: Full name */}
              <div className="py-3.5 sm:py-5 flex flex-col sm:flex-row sm:items-center">
                <span className="w-32 sm:w-44 text-xs sm:text-[13px] font-medium text-[#6B8089] shrink-0 mb-0.5 sm:mb-0">
                  Full name
                </span>
                <span className="text-xs sm:text-[13px] font-semibold text-[#15313C] break-words">
                  {displayName}
                </span>
              </div>

              {/* Row 2: Email */}
              <div className="py-3.5 sm:py-5 flex flex-col sm:flex-row sm:items-center">
                <span className="w-32 sm:w-44 text-xs sm:text-[13px] font-medium text-[#6B8089] shrink-0 mb-0.5 sm:mb-0">
                  Email
                </span>
                <span className="text-xs sm:text-[13px] font-semibold text-[#15313C] break-all">
                  {displayEmail}
                </span>
              </div>

              {/* Row 3: الفرقة الدراسية (Academic Year) */}
              <div className="py-3.5 sm:py-5 flex flex-col sm:flex-row sm:items-center justify-between group">
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <span className="w-32 sm:w-44 text-xs sm:text-[13px] font-medium text-[#6B8089] shrink-0 mb-0.5 sm:mb-0">
                    الفرقة الدراسية
                  </span>
                  <span className="text-xs sm:text-[13px] font-semibold text-[#15313C]">
                    {academicYear}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setTempCohort(cohort);
                    setTempYear(academicYear);
                    setIsEditingCohort(true);
                  }}
                  className="mt-1 sm:mt-0 self-start sm:self-center inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-[#15313C] bg-[#EEF3F5] hover:bg-[#CCEB74] border border-[#D7E0E3] hover:border-[#CCEB74] transition-all cursor-pointer shadow-2xs"
                  title="تعديل الفرقة"
                >
                  <Pencil className="w-3 h-3 text-[#15313C]" />
                  <span>تعديل</span>
                </button>
              </div>

              {/* Row 4: Cohort */}
              <div className="py-3.5 sm:py-5 flex flex-col sm:flex-row sm:items-center justify-between group">
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <span className="w-32 sm:w-44 text-xs sm:text-[13px] font-medium text-[#6B8089] shrink-0 mb-0.5 sm:mb-0">
                    Cohort
                  </span>
                  <span className="text-xs sm:text-[13px] font-semibold text-[#15313C]">
                    {cohort}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setTempCohort(cohort);
                    setTempYear(academicYear);
                    setIsEditingCohort(true);
                  }}
                  className="mt-1 sm:mt-0 self-start sm:self-center inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-[#15313C] bg-[#EEF3F5] hover:bg-[#CCEB74] border border-[#D7E0E3] hover:border-[#CCEB74] transition-all cursor-pointer shadow-2xs"
                  title="Edit Cohort"
                >
                  <Pencil className="w-3 h-3 text-[#15313C]" />
                  <span>Edit</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: Password */}
        <div className="bg-white rounded-[28px] sm:rounded-[32px] p-6 sm:p-9 border border-[#EAF0F2] shadow-[0_15px_40px_rgba(21,49,60,0.03)] flex flex-col justify-between min-h-[250px] sm:min-h-[260px] overflow-hidden">
          <div>
            {/* Lime Lock Icon Box */}
            <div className="w-12 h-12 rounded-2xl bg-[#EAF7C6] text-[#3D6317] flex items-center justify-center mb-5 shadow-2xs">
              <Lock className="w-5 h-5 stroke-[2]" aria-hidden="true" />
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-[#15313C] tracking-tight">
              Password
            </h2>
            <p className="text-xs sm:text-[13px] text-[#6B8089] mt-1 leading-relaxed">
              Change the password you use to log in.
            </p>
          </div>

          {/* Action: Change password -> */}
          <div className="mt-6 sm:mt-8">
            <Link
              to="/settings/change-password"
              className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 rounded-full border border-[#D7E0E3] bg-white hover:bg-slate-50 active:scale-98 text-xs sm:text-sm font-semibold text-[#15313C] shadow-2xs transition-all cursor-pointer group w-fit outline-none focus:ring-2 focus:ring-[#15313C]/20"
            >
              <span>Change password</span>
              <ArrowRight className="w-4 h-4 text-[#15313C] group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>

      {/* 3. BOTTOM ROW: SESSION CARD */}
      <div className="bg-white rounded-[26px] sm:rounded-[32px] p-5 sm:p-7 border border-[#EAF0F2] shadow-[0_15px_40px_rgba(21,49,60,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 overflow-hidden">
        {/* Left: Icon & Text */}
        <div className="flex items-center gap-3.5 sm:gap-4">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#EAF7C6] text-[#3D6317] flex items-center justify-center shrink-0 shadow-2xs">
            <LogOut className="w-5 h-5 stroke-[2]" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-[#15313C] tracking-tight">
              Session
            </h3>
            <p className="text-xs sm:text-[13px] text-[#6B8089] mt-0.5">
              Log out of your account on this device.
            </p>
          </div>
        </div>

        {/* Right: Log out Button */}
        <div>
          <button
            type="button"
            onClick={() => setShowLogoutModal(true)}
            className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 rounded-full border border-[#D7E0E3] bg-white hover:bg-slate-50 active:scale-98 text-xs sm:text-sm font-semibold text-[#15313C] shadow-2xs transition-all cursor-pointer w-full sm:w-auto outline-none focus:ring-2 focus:ring-[#15313C]/20"
          >
            <LogOut className="w-4 h-4 stroke-[2]" aria-hidden="true" />
            <span>Log out</span>
          </button>
        </div>
      </div>

      {/* 4. EDIT COHORT & الفرقة MODAL POPUP */}
      {isEditingCohort && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-cohort-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#15313C]/40 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setIsEditingCohort(false)}
        >
          <div
            className="relative bg-white rounded-[28px] sm:rounded-[36px] max-w-md w-full p-6 sm:p-8 shadow-[0_25px_60px_rgba(21,49,60,0.22)] border border-[#EAF0F2] animate-in zoom-in-95 duration-150 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsEditingCohort(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-[#6B8089] hover:text-[#15313C] hover:bg-[#F5F8F9] transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-[#EAF7C6] text-[#3D6317] flex items-center justify-center mb-5 shadow-2xs">
              <GraduationCap className="w-5 h-5 stroke-[2]" />
            </div>

            <h3 id="edit-cohort-modal-title" className="text-xl sm:text-2xl font-bold text-[#15313C] tracking-tight">
              تعديل الفرقة و Cohort
            </h3>
            <p className="text-xs text-[#6B8089] mt-1 mb-5">
              اختر فرقتك الدراسية أو حدد كود الدفعة لحسابك الأكاديمي.
            </p>

            <form onSubmit={handleSaveCohort} className="space-y-4 sm:space-y-5">
              {/* SECTION 1: خيار الفرقة (Academic Year Presets) */}
              <div>
                <label className="block text-xs font-bold text-[#15313C] mb-2 flex items-center justify-between">
                  <span>خيار الفرقة الدراسية (Academic Year)</span>
                  <span className="text-[11px] font-normal text-[#6B8089]">اختر بضغطة واحدة</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {YEAR_PRESETS.map((preset) => {
                    const isSelected = tempYear === preset.year;
                    return (
                      <button
                        key={preset.year}
                        type="button"
                        onClick={() => {
                          setTempYear(preset.year);
                          if (preset.defaultCohort) {
                            setTempCohort(preset.defaultCohort);
                          }
                        }}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold text-center transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-[#EAF7C6] text-[#15313C] border-[#CCEB74] shadow-xs font-bold ring-1 ring-[#CCEB74]'
                            : 'bg-[#F5F8F9] hover:bg-[#EEF3F5] text-[#3A5560] border-[#E2EAEF]'
                        }`}
                      >
                        {preset.year}
                      </button>
                    );
                  })}
                </div>

                <input
                  type="text"
                  dir="auto"
                  value={tempYear}
                  onChange={(e) => setTempYear(e.target.value)}
                  placeholder="أو اكتب فرقة دراسية مخصصة..."
                  maxLength={40}
                  className="mt-2 w-full px-3.5 py-2 rounded-xl border border-[#D7E0E3] bg-[#FAFDED] text-xs font-semibold text-[#15313C] outline-none focus:border-[#CCEB74] focus:ring-2 focus:ring-[#CCEB74]/40 transition-all placeholder:text-[#A1B3B9]"
                />
              </div>

              {/* SECTION 2: كود الدفعة (Cohort Code) */}
              <div>
                <label className="block text-xs font-bold text-[#15313C] mb-1.5 flex items-center justify-between">
                  <span>كود الدفعة (Cohort Code)</span>
                  <span className="text-[11px] font-normal text-[#6B8089]">مثل: ECE 28</span>
                </label>
                <input
                  type="text"
                  dir="auto"
                  value={tempCohort}
                  onChange={(e) => setTempCohort(e.target.value)}
                  placeholder="e.g. ECE 28, ECE 29"
                  maxLength={30}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#D7E0E3] bg-[#EEF3F5] text-sm text-[#15313C] outline-none focus:bg-white focus:border-[#CCEB74] focus:ring-2 focus:ring-[#CCEB74]/40 transition-all font-semibold"
                />

                <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                  <span className="text-[11px] text-[#6B8089] mr-1">اقتراحات سريعة:</span>
                  {COHORT_QUICK_CHIPS.map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setTempCohort(chip)}
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-all cursor-pointer border ${
                        tempCohort === chip
                          ? 'bg-[#15313C] text-[#CCEB74] border-[#15313C]'
                          : 'bg-[#F0F4F6] hover:bg-[#E4ECEF] text-[#3A5560] border-[#D7E0E3]'
                      }`}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#F0F4F6]">
                <button
                  type="button"
                  onClick={() => setIsEditingCohort(false)}
                  className="py-2.5 px-5 rounded-full border border-[#D7E0E3] bg-white hover:bg-slate-50 text-xs font-semibold text-[#15313C] transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-6 rounded-full bg-[#15313C] hover:bg-[#112730] text-[#CCEB74] text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>حفظ التعديلات</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. LOGOUT CONFIRMATION MODAL */}
      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={() => {
          setShowLogoutModal(false);
          logout();
          navigate('/login');
        }}
      />
    </div>
  );
};

export default SettingsPage;
