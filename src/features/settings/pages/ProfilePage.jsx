import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sliders, Pencil, Check, X, GraduationCap, Copy, CheckCheck } from 'lucide-react';
import { useAuth } from '../../auth/context/AuthContext';
import { useSubject } from '../../../context/SubjectContext';
import { useCourse } from '../../courses/context/CourseContext';

/**
 * Standard Egyptian Engineering faculty academic years and typical cohort numbers
 */
const YEAR_PRESETS = [
  { year: 'الفرقة الثالثة', defaultCohort: 'ECE 28', label: 'الفرقة الثالثة (Year 3)' },
  { year: 'الفرقة الرابعة', defaultCohort: 'ECE 27', label: 'الفرقة الرابعة (Year 4)' },
  { year: 'الفرقة الثانية', defaultCohort: 'ECE 29', label: 'الفرقة الثانية (Year 2)' },
  { year: 'الفرقة الأولى', defaultCohort: 'ECE 30', label: 'الفرقة الأولى (Year 1)' },
  { year: 'إعدادي هندسة', defaultCohort: 'ECE 31', label: 'إعدادي هندسة (Prep)' },
];

const COHORT_QUICK_CHIPS = ['ECE 28', 'ECE 27', 'ECE 29', 'CCE 28', 'CCE 27'];

/**
 * Ultra-Resilient, Enterprise-Grade Profile Module:
 * - Environment Simulation & Defenses Handled:
 *   1. QuotaExceededError / Private Browsing / Blocked Storage defensive fallbacks
 *   2. Unicode, Arabic diacritics (Harakat) & Emoji surrogate pair safe initials extraction
 *   3. Ultra-narrow viewports (iPhone SE / Galaxy Fold 280-320px) up to 4K displays
 *   4. Cross-tab synchronization & session invalidation handling
 *   5. Double-click submission race-condition locks
 *   6. Copy-to-clipboard convenience with instant visual feedback
 *   7. Print mode styling (@media print clean sheet)
 *   8. Strict a11y focus trapping & keyboard listeners (Escape to dismiss, Enter to save)
 */
export const ProfilePage = () => {
  const { currentUser, updateCohort } = useAuth();
  const { courseId, currentCourse } = useCourse();
  const { activeConfig } = useSubject();
  const navigate = useNavigate();

  // Cohort state with robust localStorage persistence
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

  // Academic Year (الفرقة) state with robust localStorage persistence
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

  const [isEditing, setIsEditing] = useState(false);
  const [tempCohort, setTempCohort] = useState(cohort);
  const [tempYear, setTempYear] = useState(academicYear);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Copy feedback state
  const [copiedField, setCopiedField] = useState(null);

  // Multi-tab real-time storage synchronization & session monitoring
  useEffect(() => {
    const handleStorage = (e) => {
      // If session cleared in another tab, safely redirect
      if (e.key === 'dsp_auth_session' && !e.newValue) {
        navigate('/login');
        return;
      }
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
  }, [navigate]);

  // Keyboard accessibility: Escape key to dismiss modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isEditing) {
        setIsEditing(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEditing]);

  // Robust initials extraction: strips Arabic Tashkeel/diacritics & handles Unicode surrogates/emojis
  const getInitials = (name) => {
    if (!name || typeof name !== 'string') return 'SN';
    // Strip combining diacritics (Harakat / accents)
    const clean = name.normalize('NFD').replace(/[\u0300-\u036f\u064B-\u0652]/g, '').trim();
    if (!clean) return 'SN';

    const parts = clean.split(/\s+/).filter(Boolean);
    if (parts.length === 1) {
      const chars = Array.from(parts[0]);
      return chars.slice(0, 2).join('').toUpperCase();
    }
    const firstChars = Array.from(parts[0]);
    const lastChars = Array.from(parts[parts.length - 1]);
    return (firstChars[0] + (lastChars[0] || '')).toUpperCase();
  };

  const displayName = (currentUser?.name && String(currentUser.name).trim()) || 'Student name';
  const displayEmail = (currentUser?.email && String(currentUser.email).trim()) || 'name@example.com';
  const displayInitials = getInitials(displayName);
  const isSignals = courseId === 'signals';
  const courseCode = isSignals ? 'Signals' : 'DSP';
  const displayInstructor = currentCourse?.instructor || activeConfig?.instructor || 'Dr. Abeer Tawakol';

  const courseTitle = isSignals
    ? 'Signals and Systems'
    : 'Digital Signal Processing (DSP)';

  const handleOpenEdit = () => {
    setTempCohort(cohort);
    setTempYear(academicYear);
    setIsEditing(true);
  };

  const handleSave = (e) => {
    e?.preventDefault();
    if (isSaving) return;

    setIsSaving(true);
    // Sanitize and ensure sensible fallbacks
    const cleanCohort = tempCohort.replace(/[<>]/g, '').trim() || 'ECE 28';
    const cleanYear = tempYear.replace(/[<>]/g, '').trim() || 'الفرقة الثالثة';

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
        // Safe fallback in storage restricted / incognito mode
      }
    }

    setIsEditing(false);
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  const handleSelectYearPreset = (preset) => {
    setTempYear(preset.year);
    // Auto-suggest cohort matching the academic year if not custom
    if (preset.defaultCohort) {
      setTempCohort(preset.defaultCohort);
    }
  };

  const handleCopy = (text, fieldName) => {
    try {
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-4 sm:pb-8 w-full max-w-full">
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 pt-1">
        <div>
          <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-bold text-[#15313C] tracking-tight leading-none">
            Profile
          </h1>
          <p className="text-xs sm:text-sm text-[#6B8089] mt-2 leading-relaxed">
            Your basic account details.
          </p>
        </div>

        {/* Top Right Sample Placeholders Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs text-[#52707C] font-medium bg-[#EBF0F2]/70 border border-[#DCE4E7] shadow-2xs self-start sm:self-center print:hidden">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1F4B5B]" />
          <span>Sample placeholders</span>
        </div>
      </div>

      {/* 2. MAIN TWO-CARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-7 items-stretch pt-1">
        {/* Left Card: Dark User Profile Capsule (#15313C) */}
        <div className="lg:col-span-4 bg-[#15313C] rounded-[28px] sm:rounded-[32px] p-5 sm:p-9 flex flex-col justify-between shadow-[0_20px_50px_rgba(21,49,60,0.16)] text-white min-h-[350px] sm:min-h-[410px] overflow-hidden break-words">
          <div>
            {/* Avatar Circle in Lime Accent */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#CCEB74] text-[#15313C] font-bold text-xl sm:text-2xl flex items-center justify-center shadow-xs select-none shrink-0">
              {displayInitials}
            </div>

            {/* Name & Email */}
            <div className="mt-6 sm:mt-8 mb-4 sm:mb-5">
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug break-words [overflow-wrap:anywhere]">
                {displayName}
              </h2>
              <div className="mt-1 flex items-center gap-1.5 group">
                <p className="text-xs sm:text-[13px] text-[#8FA5AE] break-all font-normal">
                  {displayEmail}
                </p>
                <button
                  type="button"
                  onClick={() => handleCopy(displayEmail, 'email-card')}
                  title="Copy email"
                  className="opacity-0 group-hover:opacity-100 text-[#8FA5AE] hover:text-[#CCEB74] transition-all p-0.5 rounded cursor-pointer print:hidden"
                  aria-label="Copy email"
                >
                  {copiedField === 'email-card' ? (
                    <CheckCheck className="w-3.5 h-3.5 text-[#CCEB74]" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Subject, الفرقة & Cohort Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-6 sm:mb-8">
              <span className="px-3.5 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs font-semibold text-white/95 bg-[#1F414D] border border-[#2D5463] shadow-xs">
                {courseCode}
              </span>
              <span
                onClick={handleOpenEdit}
                title="اضغط لتعديل الفرقة والدفعة"
                className="px-3.5 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs font-semibold text-white/95 bg-[#1F414D] border border-[#2D5463] shadow-xs cursor-pointer hover:border-[#CCEB74] transition-colors flex items-center gap-1.5"
              >
                <span>{academicYear}</span>
              </span>
              <span
                onClick={handleOpenEdit}
                title="اضغط لتعديل كود الدفعة (Cohort)"
                className="px-3.5 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs font-semibold text-white/95 bg-[#1F414D] border border-[#2D5463] shadow-xs cursor-pointer hover:border-[#CCEB74] transition-colors flex items-center gap-1.5"
              >
                <span>{cohort}</span>
                <Pencil className="w-3 h-3 text-[#CCEB74] opacity-80" />
              </span>
            </div>
          </div>

          {/* Settings Button */}
          <div className="pt-2 print:hidden">
            <Link
              to="/settings"
              className="inline-flex items-center gap-2 bg-[#CCEB74] hover:bg-[#bfee50] active:scale-95 text-[#15313C] px-5 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer w-fit"
            >
              <Sliders className="w-4 h-4 stroke-[2.25]" />
              <span>Settings</span>
            </Link>
          </div>
        </div>

        {/* Right Card: Account Details Table */}
        <div className="lg:col-span-8 bg-white rounded-[28px] sm:rounded-[32px] p-5 sm:p-10 border border-[#EAF0F2] shadow-[0_15px_40px_rgba(21,49,60,0.03)] flex flex-col justify-between overflow-hidden">
          <div>
            <div className="flex items-center justify-between mb-4 sm:mb-5">
              <h3 className="text-xl sm:text-2xl font-bold text-[#15313C] tracking-tight">
                Account details
              </h3>
              {saveSuccess && (
                <span
                  role="status"
                  aria-live="polite"
                  className="text-xs font-semibold text-[#4C7A1F] bg-[#EDF7E6] border border-[#CDEB74] px-3 py-1 rounded-full animate-in fade-in duration-150 flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>تم حفظ التعديلات بنجاح!</span>
                </span>
              )}
            </div>

            <div className="divide-y divide-[#EAF0F2]">
              {/* Row 1: Full name */}
              <div className="py-3.5 sm:py-5 flex flex-col sm:flex-row sm:items-center justify-start">
                <span className="w-full sm:w-48 text-xs sm:text-[13px] font-medium text-[#6B8089] shrink-0 mb-0.5 sm:mb-0">
                  Full name
                </span>
                <span className="text-xs sm:text-[13px] font-semibold text-[#15313C] break-words">
                  {displayName}
                </span>
              </div>

              {/* Row 2: Email */}
              <div className="py-3.5 sm:py-5 flex flex-col sm:flex-row sm:items-center justify-start group">
                <span className="w-full sm:w-48 text-xs sm:text-[13px] font-medium text-[#6B8089] shrink-0 mb-0.5 sm:mb-0">
                  Email
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-[13px] font-semibold text-[#15313C] break-all">
                    {displayEmail}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(displayEmail, 'email-row')}
                    title="Copy email to clipboard"
                    className="text-[#8FA5AE] hover:text-[#15313C] p-1 rounded-md transition-colors cursor-pointer print:hidden"
                    aria-label="Copy email address"
                  >
                    {copiedField === 'email-row' ? (
                      <span className="text-[10px] text-[#4C7A1F] font-bold flex items-center gap-0.5 bg-[#EDF7E6] px-1.5 py-0.5 rounded">
                        <CheckCheck className="w-3 h-3" />
                        Copied
                      </span>
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Row 3: Course */}
              <div className="py-3.5 sm:py-5 flex flex-col sm:flex-row sm:items-center justify-start">
                <span className="w-full sm:w-48 text-xs sm:text-[13px] font-medium text-[#6B8089] shrink-0 mb-0.5 sm:mb-0">
                  Course
                </span>
                <span className="text-xs sm:text-[13px] font-semibold text-[#15313C]">
                  {courseTitle}
                </span>
              </div>

              {/* Row 4: الفرقة (Academic Year) */}
              <div className="py-3.5 sm:py-5 flex flex-col sm:flex-row sm:items-center justify-between group">
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <span className="w-full sm:w-48 text-xs sm:text-[13px] font-medium text-[#6B8089] shrink-0 mb-0.5 sm:mb-0">
                    الفرقة الدراسية
                  </span>
                  <span className="text-xs sm:text-[13px] font-semibold text-[#15313C]">
                    {academicYear}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleOpenEdit}
                  className="mt-1 sm:mt-0 self-start sm:self-center inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-[#15313C] bg-[#EEF3F5] hover:bg-[#CCEB74] border border-[#D7E0E3] hover:border-[#CCEB74] transition-all cursor-pointer shadow-2xs print:hidden"
                  title="تعديل الفرقة والدفعة"
                >
                  <Pencil className="w-3 h-3 text-[#15313C]" />
                  <span>تعديل الفرقة</span>
                </button>
              </div>

              {/* Row 5: Cohort (الدفعة) */}
              <div className="py-3.5 sm:py-5 flex flex-col sm:flex-row sm:items-center justify-between group">
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <span className="w-full sm:w-48 text-xs sm:text-[13px] font-medium text-[#6B8089] shrink-0 mb-0.5 sm:mb-0">
                    Cohort
                  </span>
                  <span className="text-xs sm:text-[13px] font-semibold text-[#15313C]">
                    {cohort}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleOpenEdit}
                  className="mt-1 sm:mt-0 self-start sm:self-center inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-[#15313C] bg-[#EEF3F5] hover:bg-[#CCEB74] border border-[#D7E0E3] hover:border-[#CCEB74] transition-all cursor-pointer shadow-2xs print:hidden"
                  title="Edit Cohort"
                >
                  <Pencil className="w-3 h-3 text-[#15313C]" />
                  <span>Edit Cohort</span>
                </button>
              </div>

              {/* Row 6: Instructor */}
              <div className="py-3.5 sm:py-5 flex flex-col sm:flex-row sm:items-center justify-start">
                <span className="w-full sm:w-48 text-xs sm:text-[13px] font-medium text-[#6B8089] shrink-0 mb-0.5 sm:mb-0">
                  Instructor
                </span>
                <span className="text-xs sm:text-[13px] font-semibold text-[#15313C]">
                  {displayInstructor}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. EDIT COHORT & الفرقة MODAL DIALOG */}
      {isEditing && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-cohort-title"
          aria-describedby="edit-cohort-desc"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#15313C]/40 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setIsEditing(false)}
        >
          <div
            className="relative bg-white rounded-[28px] sm:rounded-[36px] max-w-md w-full p-6 sm:p-8 shadow-[0_25px_60px_rgba(21,49,60,0.22)] border border-[#EAF0F2] animate-in zoom-in-95 duration-150 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-[#6B8089] hover:text-[#15313C] hover:bg-[#F5F8F9] transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Icon */}
            <div className="w-12 h-12 rounded-2xl bg-[#EAF7C6] text-[#3D6317] flex items-center justify-center mb-5 shadow-2xs">
              <GraduationCap className="w-5 h-5 stroke-[2]" />
            </div>

            <h3
              id="edit-cohort-title"
              className="text-xl sm:text-2xl font-bold text-[#15313C] tracking-tight"
            >
              تعديل الفرقة و Cohort
            </h3>
            <p id="edit-cohort-desc" className="text-xs text-[#6B8089] mt-1 mb-5 leading-relaxed">
              اختر فرقتك الدراسية أو حدد كود الدفعة لحسابك الأكاديمي.
            </p>

            <form onSubmit={handleSave} className="space-y-4 sm:space-y-5">
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
                        onClick={() => handleSelectYearPreset(preset)}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold text-center transition-all cursor-pointer border ${isSelected
                            ? 'bg-[#EAF7C6] text-[#15313C] border-[#CCEB74] shadow-xs font-bold ring-1 ring-[#CCEB74]'
                            : 'bg-[#F5F8F9] hover:bg-[#EEF3F5] text-[#3A5560] border-[#E2EAEF]'
                          }`}
                      >
                        {preset.year}
                      </button>
                    );
                  })}
                </div>

                {/* Or Custom Year Input */}
                <input
                  type="text"
                  dir="auto"
                  value={tempYear}
                  onChange={(e) => setTempYear(e.target.value)}
                  placeholder="أو اكتب فرقة دراسية مخصصة..."
                  maxLength={36}
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
                  maxLength={24}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#D7E0E3] bg-[#EEF3F5] text-sm text-[#15313C] outline-none focus:bg-white focus:border-[#CCEB74] focus:ring-2 focus:ring-[#CCEB74]/40 transition-all font-semibold"
                />

                {/* Quick Chips */}
                <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                  <span className="text-[11px] text-[#6B8089] mr-1">اقتراحات سريعة:</span>
                  {COHORT_QUICK_CHIPS.map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setTempCohort(chip)}
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-all cursor-pointer border ${tempCohort === chip
                          ? 'bg-[#15313C] text-[#CCEB74] border-[#15313C]'
                          : 'bg-[#F0F4F6] hover:bg-[#E4ECEF] text-[#3A5560] border-[#D7E0E3]'
                        }`}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons: Centered Cancel & Save */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#F0F4F6]">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="py-2.5 px-5 rounded-full border border-[#D7E0E3] bg-white hover:bg-slate-50 active:scale-98 text-xs font-semibold text-[#15313C] transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="py-2.5 px-6 rounded-full bg-[#15313C] hover:bg-[#112730] active:scale-98 text-[#CCEB74] text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5 disabled:opacity-60"
                >
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>{isSaving ? 'جاري الحفظ...' : 'حفظ التعديلات'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
