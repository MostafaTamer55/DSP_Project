import React from 'react';
import { ArrowLeft, Check, AlertCircle } from 'lucide-react';
import { useProgress } from '../services/progressService';

/**
 * ExamsProgressBreakdown Component (Image 1)
 * Matching the exact UI:
 * - "Back to Progress Overview" button
 * - "Exams & Quizzes Performance" title
 * - "Overall Score: 88%" badge card in top right
 * - Clean table matching dark header styling:
 *   Columns: Assessment Name | Category | Highest Score | Attempts | Status | Action
 *   Rows:
 *     - Quiz 1: Sampling Theorem & Aliasing (85%, 1 Attempt, Passed, View Answers)
 *     - Quiz 2: Quantization Noise & ADC (92%, 3 Attempts, Passed, View Answers)
 *     - Midterm Practice Assessment (92%, 1 Attempt, Passed, View Answers)
 *     - Quiz 3: Z-Transform & ROC (63%, 2 Attempts, Needs Retake, Retake Quiz)
 * - Clicking "Retake Quiz" (or Quiz 3) opens the QuizRetakePreparation view (Image 2).
 */
export const ExamsProgressBreakdown = ({ onBack, onSelectQuiz }) => {
  const { progressData } = useProgress();

  const exams = progressData.exams || [
    {
      id: 'q1',
      name: 'Quiz 1: Sampling Theorem & Aliasing',
      category: 'Quiz',
      highestScore: '85%',
      attemptsText: '1 Attempt',
      status: 'passed',
      statusText: 'Passed',
      actionText: 'View Answers',
    },
    {
      id: 'q2',
      name: 'Quiz 2: Quantization Noise & ADC',
      category: 'Quiz',
      highestScore: '92%',
      attemptsText: '3 Attempts',
      status: 'passed',
      statusText: 'Passed',
      actionText: 'View Answers',
    },
    {
      id: 'm1',
      name: 'Midterm Practice Assessment',
      category: 'Major Exam',
      highestScore: '92%',
      attemptsText: '1 Attempt',
      status: 'passed',
      statusText: 'Passed',
      actionText: 'View Answers',
    },
    {
      id: 'q3',
      name: 'Quiz 3: Z-Transform & ROC',
      category: 'Quiz',
      highestScore: '63%',
      attemptsText: '2 Attempts',
      status: 'needs_retake',
      statusText: 'Needs Retake',
      actionText: 'Retake Quiz',
    },
  ];

  const overallScore = progressData.stats?.overallScore || '88%';

  const handleActionClick = (exam) => {
    if (exam.status === 'needs_retake' || exam.id === 'q3') {
      onSelectQuiz(exam);
    } else {
      // For passed exams, also open or show review
      onSelectQuiz(exam);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-7 pb-12 select-none">
      {/* 1. TOP NAV: BACK TO PROGRESS OVERVIEW */}
      <div>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs sm:text-[13px] font-medium text-[#6B8089] hover:text-[#15313C] transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Progress Overview</span>
        </button>
      </div>

      {/* 2. TITLE ROW & OVERALL SCORE BOX */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#15313C] tracking-tight">
          Exams & Quizzes Performance
        </h1>

        {/* Overall Score Box in Top Right (Exact match to screenshot) */}
        <div className="bg-[#15313C] rounded-2xl px-6 sm:px-8 py-3 text-center sm:text-right shrink-0 shadow-sm border border-white/5">
          <span className="block text-[11px] sm:text-xs font-normal text-slate-300">
            Overall Score
          </span>
          <span className="block text-2xl sm:text-3xl font-extrabold text-[#CCEB74] tracking-tight">
            {overallScore}
          </span>
        </div>
      </div>

      {/* 3. PERFORMANCE TABLE */}
      <div className="bg-white rounded-[20px] sm:rounded-[24px] border border-[#EAF0F2] shadow-[0_8px_30px_rgba(21,49,60,0.035)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[680px]">
            {/* Dark Table Header */}
            <thead>
              <tr className="bg-[#15313C] text-white text-xs font-semibold tracking-wide">
                <th className="py-4 px-6 font-semibold">Assessment Name</th>
                <th className="py-4 px-6 font-semibold">Category</th>
                <th className="py-4 px-6 font-semibold">Highest Score</th>
                <th className="py-4 px-6 font-semibold">Attempts</th>
                <th className="py-4 px-6 font-semibold">Status</th>
                <th className="py-4 px-6 font-semibold text-right">Action</th>
              </tr>
            </thead>

            {/* Table Rows */}
            <tbody className="divide-y divide-[#EAF0F2] text-xs sm:text-[13px]">
              {exams.map((exam, idx) => {
                const isPassed = exam.status === 'passed';
                const isNeedsRetake = exam.status === 'needs_retake';

                return (
                  <tr
                    key={exam.id || idx}
                    className="hover:bg-[#F8FAF5] transition-colors"
                  >
                    {/* Assessment Name */}
                    <td className="py-4 px-6 font-bold text-[#15313C]">
                      <button
                        type="button"
                        onClick={() => handleActionClick(exam)}
                        className="text-left font-bold text-[#15313C] hover:text-[#3A5560] transition-colors cursor-pointer"
                      >
                        {exam.name || exam.title}
                      </button>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-6 text-[#6B8089] font-medium">
                      {exam.category || 'Quiz'}
                    </td>

                    {/* Highest Score */}
                    <td className="py-4 px-6 font-bold">
                      <span
                        className={
                          isPassed ? 'text-[#15803D]' : 'text-[#D97706]'
                        }
                      >
                        {exam.highestScore}
                      </span>
                    </td>

                    {/* Attempts */}
                    <td className="py-4 px-6 text-[#6B8089]">
                      {exam.attemptsText || `${exam.attempts || 1} Attempt`}
                    </td>

                    {/* Status Pill Badge */}
                    <td className="py-4 px-6">
                      {isPassed ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#EAF5F0] text-[#15803D]">
                          Passed
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#FEF6EB] text-[#B45309]">
                          Needs Retake
                        </span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-4 px-6 text-right">
                      <button
                        type="button"
                        onClick={() => handleActionClick(exam)}
                        className="font-bold text-xs text-[#15313C] underline hover:text-[#3A5560] transition-colors cursor-pointer"
                      >
                        {exam.actionText || (isNeedsRetake ? 'Retake Quiz' : 'View Answers')}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExamsProgressBreakdown;
