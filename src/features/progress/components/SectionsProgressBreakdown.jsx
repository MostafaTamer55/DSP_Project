import React, { useState } from 'react';
import { ArrowLeft, Check, Clock, ExternalLink, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProgress } from '../services/progressService';

/**
 * SectionsProgressBreakdown Component
 * Displays the practical sections and topics progress breakdown.
 * Matches the user screenshot:
 * - "Back to Progress Overview" button
 * - "Practical Sections & Topics" title
 * - Grid of Section Cards with Section badges, percentage pills (e.g. 100% Done, 66% Done),
 *   and list of topics with "✓ Completed" (green) and "Pending" (orange with dashed card border).
 * - Allows students to see what they have completed and toggle completion dynamically.
 * - Entirely frontend-driven using reactive local state and localStorage persistence.
 */
export const SectionsProgressBreakdown = ({ onBack, sectionsData: propSections }) => {
  const { progressData, toggleTopicStatus } = useProgress();
  const [filterState, setFilterState] = useState('all'); // 'all' | 'completed' | 'pending'

  // Default sections data matching the screenshot if not yet in storage
  const defaultSections = [
    {
      id: 's1',
      numberStr: 'SECTION 01',
      title: 'Sampling & Reconstruction Labs',
      topics: [
        {
          id: 't1_1',
          title: 'Topic 1.1: Nyquist Rate Calculation',
          status: 'completed',
        },
        {
          id: 't1_2',
          title: 'Topic 1.2: Aliasing Effect Simulation',
          status: 'completed',
        },
        {
          id: 't1_3',
          title: 'Topic 1.3: Anti-Aliasing Filter Design',
          status: 'completed',
        },
      ],
    },
    {
      id: 's2',
      numberStr: 'SECTION 02',
      title: 'Z-Transform & System Stability',
      topics: [
        {
          id: 't2_1',
          title: 'Topic 2.1: Region of Convergence (ROC)',
          status: 'completed',
        },
        {
          id: 't2_2',
          title: 'Topic 2.2: Pole-Zero Plots',
          status: 'completed',
        },
        {
          id: 't2_3',
          title: 'Topic 2.3: Inverse Z-Transform Problems',
          status: 'pending',
        },
      ],
    },
  ];

  // Prioritize progressData from hook, propSections, or defaultSections
  const sectionsSource =
    propSections ||
    (progressData.sections && progressData.sections.length > 0
      ? progressData.sections
      : defaultSections);

  // Calculate overall stats for summary pill
  const allTopics = sectionsSource.flatMap((sec) => sec.topics || []);
  const totalTopicsCount = allTopics.length;
  const completedTopicsCount = allTopics.filter((t) => t.status === 'completed').length;
  const overallPercentage =
    totalTopicsCount > 0
      ? Math.round((completedTopicsCount / totalTopicsCount) * 100)
      : 0;

  return (
    <div className="space-y-6 sm:space-y-7 pb-12 select-none">
      {/* 1. TOP NAV: BACK TO PROGRESS OVERVIEW */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs sm:text-[13px] font-medium text-[#6B8089] hover:text-[#15313C] transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Progress Overview</span>
          </button>

          {/* PAGE TITLE */}
          <h1 className="text-2xl sm:text-3xl font-bold text-[#15313C] tracking-tight mt-3">
            Practical Sections & Topics
          </h1>
        </div>

        {/* Quick Filter Pills */}
        <div className="inline-flex items-center rounded-full bg-white border border-[#D7E0E3] p-1 shadow-xs self-start sm:self-end">
          {[
            { key: 'all', label: 'All Topics' },
            { key: 'completed', label: 'Completed' },
            { key: 'pending', label: 'Pending' },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilterState(tab.key)}
              className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                filterState === tab.key
                  ? 'bg-[#15313C] text-white shadow-xs'
                  : 'text-[#6B8089] hover:text-[#15313C]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. SECTION CARDS GRID (2 Columns matching design) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-7 items-start">
        {sectionsSource.map((sec, secIdx) => {
          const topics = sec.topics || [];
          const totalInSec = topics.length;
          const completedInSec = topics.filter((t) => t.status === 'completed').length;
          const donePercent =
            totalInSec > 0 ? Math.round((completedInSec / totalInSec) * 100) : 0;

          // Filter topics based on active filter tab
          const visibleTopics = topics.filter((t) => {
            if (filterState === 'completed') return t.status === 'completed';
            if (filterState === 'pending') return t.status === 'pending';
            return true;
          });

          // Section number text
          const secNumber =
            sec.numberStr ||
            sec.number ||
            `SECTION ${String(secIdx + 1).padStart(2, '0')}`;

          return (
            <div
              key={sec.id || secIdx}
              className="bg-[#EFF7CD] rounded-[24px] sm:rounded-[26px] p-6 sm:p-7 border border-[#E2EEB5]/80 shadow-[0_10px_30px_rgba(21,49,60,0.03)] flex flex-col justify-between transition-all"
            >
              <div>
                {/* Header Row: SECTION NUMBER & DONE PERCENTAGE PILL */}
                <div className="flex items-center justify-between gap-3 mb-2">
                  <span className="text-[11px] sm:text-xs font-extrabold tracking-wider text-[#2B4938] uppercase">
                    {secNumber}
                  </span>

                  <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-[#15313C] text-white shadow-xs shrink-0">
                    {donePercent}% Done
                  </span>
                </div>

                {/* Section Title */}
                <h3 className="text-lg sm:text-xl font-bold text-[#15313C] tracking-tight mb-5">
                  {sec.title}
                </h3>

                {/* Topics List */}
                <div className="space-y-3">
                  {visibleTopics.map((topic) => {
                    const isCompleted = topic.status === 'completed';

                    return (
                      <div
                        key={topic.id}
                        onClick={() => toggleTopicStatus(sec.id, topic.id)}
                        className={`rounded-2xl px-5 py-3.5 sm:py-4 flex items-center justify-between gap-3 transition-all cursor-pointer group ${
                          isCompleted
                            ? 'bg-white shadow-xs border border-white/90 hover:shadow-sm'
                            : 'border border-dashed border-[#CCD8A3] bg-white/70 hover:bg-white/95'
                        }`}
                        title="Click to toggle status"
                      >
                        {/* Left: Topic Title */}
                        <span
                          className={`text-xs sm:text-sm font-semibold tracking-tight transition-colors ${
                            isCompleted
                              ? 'text-[#15313C] group-hover:text-black'
                              : 'text-[#48636E]'
                          }`}
                        >
                          {topic.title}
                        </span>

                        {/* Right: Status Indicator Pill */}
                        <div className="shrink-0 flex items-center">
                          {isCompleted ? (
                            <span className="inline-flex items-center gap-1.5 text-xs sm:text-[13px] font-bold text-[#15803D]">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                              <span>Completed</span>
                            </span>
                          ) : (
                            <span className="text-xs sm:text-[13px] font-bold text-[#C25E1A]">
                              Pending
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {visibleTopics.length === 0 && (
                    <div className="p-4 rounded-xl text-center text-xs text-[#6B8089] bg-white/40 border border-dashed border-[#CCD8A3]">
                      No topics matching the "{filterState}" filter in this section.
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Quick Action: Open Lab link */}
              <div className="pt-5 mt-4 border-t border-[#E0EBB5] flex items-center justify-between text-xs text-[#526B76]">
                <span className="font-medium">
                  {completedInSec} of {totalInSec} completed
                </span>
                <Link
                  to={`/sections/${sec.id?.replace('s', '') || '1'}`}
                  className="font-semibold text-[#15313C] hover:underline inline-flex items-center gap-1 group"
                >
                  <span>Open Lab Details</span>
                  <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. BOTTOM SUMMARY PILL */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3">
        <p className="text-xs text-[#6B8089]">
          💡 Click on any topic to toggle its status between Completed and Pending. Progress is saved automatically.
        </p>

        <div className="inline-flex items-center px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold text-[#15313C] bg-[#EFF7CD] border border-[#DCECA2]/70 shadow-xs shrink-0">
          <span>
            Total Sections Progress: {completedTopicsCount} / {totalTopicsCount} Topics ({overallPercentage}%)
          </span>
        </div>
      </div>
    </div>
  );
};

export default SectionsProgressBreakdown;
