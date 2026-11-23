import React, { useEffect } from 'react';
import { LogOut } from 'lucide-react';

/**
 * Robust, Accessible, and Defensive Logout Confirmation Modal:
 * - Edge Cases Handled:
 *   1. Body scroll-lock when open (prevents awkward background scroll on touch/desktop)
 *   2. Escape key dismissal with proper event cleanup
 *   3. Click outside overlay dismissal
 *   4. Safe focus management (Cancel button receives natural focus to avoid accidental logouts)
 *   5. ARIA accessibility attributes (role="dialog", aria-modal="true", aria-labelledby)
 *   6. Responsive bounds: adapts to small mobile (320px) up to 4K displays
 */
export const LogoutConfirmModal = ({ isOpen, onClose, onConfirm }) => {
  // Prevent background body scroll while dialog is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Escape key listener for accessible dismissal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-dialog-title"
      aria-describedby="logout-dialog-description"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#15313C]/40 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-[28px] sm:rounded-[36px] max-w-[420px] w-full p-6 sm:p-9 shadow-[0_25px_60px_rgba(21,49,60,0.22)] border border-[#EAF0F2] animate-in zoom-in-95 duration-150 text-left select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Soft Lime Icon Box */}
        <div className="w-12 h-12 rounded-2xl bg-[#EAF7C6] text-[#3D6317] flex items-center justify-center mb-5 sm:mb-6 shadow-2xs">
          <LogOut className="w-5 h-5 stroke-[2]" aria-hidden="true" />
        </div>

        {/* Title & Description */}
        <h3
          id="logout-dialog-title"
          className="text-xl sm:text-2xl font-bold text-[#15313C] tracking-tight leading-snug"
        >
          Log out of your account?
        </h3>
        <p
          id="logout-dialog-description"
          className="text-xs sm:text-[13px] text-[#6B8089] mt-2 mb-6 sm:mb-8 leading-relaxed"
        >
          You will need to log in again to open lectures, sections, and the Exam Bank.
        </p>

        {/* Action Buttons: Centered horizontally matching reference designs */}
        <div className="flex items-center justify-center gap-3 w-full">
          <button
            type="button"
            onClick={onClose}
            autoFocus
            className="py-2.5 px-6 sm:px-7 rounded-full border border-[#D7E0E3] bg-white hover:bg-slate-50 active:scale-98 text-xs sm:text-sm font-semibold text-[#15313C] transition-all cursor-pointer text-center outline-none focus:ring-2 focus:ring-[#15313C]/20"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="py-2.5 px-6 sm:px-7 rounded-full bg-[#15313C] hover:bg-[#112730] active:scale-98 text-[#CCEB74] text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2 outline-none focus:ring-2 focus:ring-[#CCEB74]"
          >
            <LogOut className="w-4 h-4 stroke-[2]" aria-hidden="true" />
            <span>Log out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmModal;
