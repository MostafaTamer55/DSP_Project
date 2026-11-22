import React from 'react';
import {
  BookOpen,
  RotateCcw,
  Check,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';

/**
 * QuizRetakePreparation Component (Image 2)
 * Matches the exact UI from the user screenshot:
 * - Top header: "Prepare for your retake" + "Needs Retake" badge
 * - Dark Hero Banner (QUIZ RETAKE, Quiz 3: Z-Transform & ROC, Highest score 63%, Attempts completed 2)
 * - 2-Column layout:
 *   Left column:
 *     - Recommended preparation heading
 *     - Related Material Card (SECTION 02 Z-Transform & System Stability)
 *       with topics: Region of Convergence (ROC), Pole-Zero Plots, Inverse Z-Transform Problems
 *     - Refresh the essentials card
 *     - Practice the pending topic card
 *   Right column:
 *     - Ready for attempt 3? card with checklist, "Start Retake" button, "Back to Assessments"
 *     - A useful self-check card
 * Pure frontend only.
 */
export const QuizRetakePreparation = ({
  quizData,
  onBackToAssessments,
  onOpenSection,
}) => {
  // Default values matching Image 2
  const quiz = {
    name: 'Quiz 3: Z-Transform & ROC',
    highestScore: '63%',
    attempts: 2,
    ...quizData,
  };

  const section2Topics = [
    { id: 't2_1', title: 'Region of Convergence (ROC)', status: 'completed' },
    { id: 't2_2', title: 'Pole-Zero Plots', status: 'completed' },
    { id: 't2_3', title: 'Inverse Z-Transform Problems', status: 'pending' },
  ];

  return (
    <div className="space-y-6 sm:space-y-7 pb-12 select-none">
      {/* 1. TOP HEADER ROW */}
      <div className="flex items-center justify-between gap-4 pt-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#15313C] tracking-tight">
          Prepare for your retake
        </h1>

        {/* Badge Pill in Top Right (Exact match to screenshot) */}
        <div>
          <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#FEF6EB] text-[#B45309] border border-[#FDE68A]/60 shadow-xs">
            Needs Retake
          </span>
        </div>
      </div>

      {/* 2. DARK HERO BANNER */}
      <div className="bg-[#15313C] rounded-[24px] sm:rounded-[26px] p-6 sm:p-8 text-white shadow-[0_15px_40px_rgba(21,49,60,0.14)] flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left Side: Tag, Title, Description */}
        <div className="max-w-xl">
          <span className="inline-block text-[10px] sm:text-[11px] font-bold tracking-widest text-[#CCEB74] uppercase">
            QUIZ RETAKE
          </span>
          <h2 className="text-2xl sm:text-[28px] font-bold text-white tracking-tight mt-1 mb-2">
            {quiz.name}
          </h2>
          <p className="text-xs sm:text-[13px] text-slate-300 leading-relaxed">
            Revisit the concepts, work through a few problems, then try again.
          </p>
        </div>

        {/* Right Side: Two Stats Badges */}
        <div className="flex items-center gap-8 sm:gap-10 shrink-0 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-8">
          {/* Highest Score */}
          <div>
            <span className="block text-xs text-slate-400 mb-0.5">
              Highest score
            </span>
            <span className="block text-3xl sm:text-[34px] font-extrabold text-[#CCEB74] tracking-tight">
              {quiz.highestScore}
            </span>
            <span className="block text-[11px] text-slate-400 mt-0.5">
              For this quiz
            </span>
          </div>

          {/* Attempts Completed */}
          <div>
            <span className="block text-xs text-slate-400 mb-0.5">
              Attempts completed
            </span>
            <span className="block text-3xl sm:text-[34px] font-extrabold text-[#CCEB74] tracking-tight">
              {quiz.attempts}
            </span>
            <span className="block text-[11px] text-slate-400 mt-0.5">
              Next: attempt {Number(quiz.attempts) + 1}
            </span>
          </div>
        </div>
      </div>

      {/* 3. MAIN CONTENT: 2 COLUMNS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN (8 COLS): RECOMMENDED PREPARATION */}
        <div className="lg:col-span-8 space-y-6">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-[#15313C] tracking-tight">
              Recommended preparation
            </h3>
            <p className="text-xs text-[#6B8089] mt-0.5">
              Start with the related section, then check your understanding.
            </p>
          </div>

          {/* RELATED MATERIAL CARD (Light Lime #EFF7CD) */}
          <div className="bg-[#EFF7CD] rounded-[24px] p-5 sm:p-6 border border-[#E2EEB5]/80 shadow-[0_8px_25px_rgba(21,49,60,0.025)]">
            {/* Header: Book Icon + SECTION 02 Title */}
            <div className="flex items-start gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-white/70 flex items-center justify-center text-[#15313C] shrink-0 mt-0.5">
                <BookOpen className="w-5 h-5 stroke-[1.75]" />
              </div>
              <div>
                <span className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#2B4938]">
                  RELATED MATERIAL • SECTION 02
                </span>
                <h4 className="text-base sm:text-lg font-bold text-[#15313C] tracking-tight mt-0.5">
                  Z-Transform & System Stability
                </h4>
              </div>
            </div>

            {/* List of 3 Topics inside the card */}
            <div className="space-y-2.5">
              {section2Topics.map((t) => {
                const isCompleted = t.status === 'completed';

                return (
                  <div
                    key={t.id}
                    className={`rounded-2xl px-4 sm:px-5 py-3 sm:py-3.5 flex items-center justify-between gap-3 transition-all ${
                      isCompleted
                        ? 'bg-white shadow-xs border border-white/90'
                        : 'border border-dashed border-[#CCD8A3] bg-white/70'
                    }`}
                  >
                    {/* Topic Title */}
                    <span
                      className={`text-xs sm:text-[13px] font-semibold ${
                        isCompleted ? 'text-[#15313C]' : 'text-[#48636E]'
                      }`}
                    >
                      {t.title}
                    </span>

                    {/* Right Side: Status Badge with Dot + Chevron */}
                    <div className="flex items-center gap-2 shrink-0">
                      {isCompleted ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#15803D]">
                          <span className="w-2 h-2 rounded-full bg-[#15803D]" />
                          <span>Completed</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C25E1A]">
                          <span className="w-2 h-2 rounded-full bg-[#C25E1A]" />
                          <span>Pending</span>
                        </span>
                      )}

                      <ChevronRight className="w-4 h-4 text-[#8EA1A9]" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer Summary under topics */}
            <p className="text-xs text-[#526B76] font-medium mt-3.5 pt-2">
              Section progress • 2 topics completed, 1 topic pending.
            </p>
          </div>

          {/* TWO BOTTOM CARDS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Card 1: Refresh the essentials */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#EAF0F2] shadow-xs flex flex-col justify-between hover:shadow-sm transition-shadow">
              <div>
                <h4 className="text-sm sm:text-[15px] font-bold text-[#15313C] mb-2">
                  Refresh the essentials
                </h4>
                <p className="text-xs text-[#6B8089] leading-relaxed mb-4">
                  Identify the ROC from the poles and sequence. Check whether it includes the unit circle.
                </p>
              </div>

              <button
                type="button"
                onClick={() => onOpenSection && onOpenSection('s2')}
                className="text-xs font-bold text-[#15313C] hover:text-[#3A5560] inline-flex items-center gap-1.5 group cursor-pointer text-left"
              >
                <span>Review ROC & pole-zero notes</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* Card 2: Practice the pending topic */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#EAF0F2] shadow-xs flex flex-col justify-between hover:shadow-sm transition-shadow">
              <div>
                <h4 className="text-sm sm:text-[15px] font-bold text-[#15313C] mb-2">
                  Practice the pending topic
                </h4>
                <p className="text-xs text-[#6B8089] leading-relaxed mb-4">
                  Work through an inverse Z-transform and verify the sequence against its ROC.
                </p>
              </div>

              <button
                type="button"
                onClick={() => onOpenSection && onOpenSection('s2')}
                className="text-xs font-bold text-[#15313C] hover:text-[#3A5560] inline-flex items-center gap-1.5 group cursor-pointer text-left"
              >
                <span>Open Inverse Z-Transform Problems</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (4 COLS): READY FOR ATTEMPT 3 */}
        <div className="lg:col-span-4 space-y-4">
          {/* Top Card: Ready for attempt 3? */}
          <div className="bg-white rounded-2xl sm:rounded-[22px] p-6 border border-[#EAF0F2] shadow-[0_8px_25px_rgba(21,49,60,0.025)]">
            {/* Header: Circular Icon + Title */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-[#EFF7CD] text-[#15313C] flex items-center justify-center shrink-0">
                <RotateCcw className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <span className="block text-[10px] uppercase font-bold text-[#6B8089] tracking-wider">
                  YOUR NEXT STEP
                </span>
                <h4 className="text-base font-bold text-[#15313C]">
                  Ready for attempt 3?
                </h4>
              </div>
            </div>

            {/* Paragraph */}
            <p className="text-xs text-[#6B8089] leading-relaxed mb-4">
              Take a moment to prepare. Start the retake when you feel ready to try again.
            </p>

            {/* "Before you begin" Checklist */}
            <div className="mb-6">
              <h5 className="text-xs font-bold text-[#15313C] mb-2.5">
                Before you begin
              </h5>
              <div className="space-y-2 text-xs text-[#526B76]">
                <div className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-[#15313C] stroke-[2.5] shrink-0 mt-0.5" />
                  <span>Review the ROC and pole-zero notes.</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-[#15313C] stroke-[2.5] shrink-0 mt-0.5" />
                  <span>Try the pending inverse Z-transform problems.</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-[#15313C] stroke-[2.5] shrink-0 mt-0.5" />
                  <span>Keep paper nearby for sketches and working.</span>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-2">
              <button
                type="button"
                className="bg-[#CCEB74] hover:bg-[#bce64f] active:scale-[0.98] text-[#15313C] font-bold text-sm py-3 px-5 rounded-full w-full flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 stroke-[2.25]" />
                <span>Start Retake</span>
              </button>

              <button
                type="button"
                onClick={onBackToAssessments}
                className="text-xs font-bold text-[#15313C] py-2 px-4 rounded-full w-full text-center hover:bg-slate-100/70 transition-colors cursor-pointer"
              >
                Back to Assessments
              </button>
            </div>
          </div>

          {/* Bottom Card: A useful self-check */}
          <div className="bg-[#F8FAF5] rounded-2xl p-5 sm:p-6 border border-[#EAF0F2]">
            <h5 className="text-xs font-bold text-[#15313C] mb-2">
              A useful self-check
            </h5>
            <p className="text-xs text-[#6B8089] leading-relaxed">
              Can you explain why the same Z-transform can represent different sequences when the ROC changes?
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizRetakePreparation;
