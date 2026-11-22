import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProgressSummary from '../components/ProgressSummary';
import LecturesProgressBreakdown from '../components/LecturesProgressBreakdown';
import SectionsProgressBreakdown from '../components/SectionsProgressBreakdown';
import ExamsProgressBreakdown from '../components/ExamsProgressBreakdown';
import QuizRetakePreparation from '../components/QuizRetakePreparation';

/**
 * Dedicated Progress Page (/progress) supporting 5 views:
 * 1. Overview (الprogress الكل: Overview Analytics + 3 columns: Lectures, Sections, Exams)
 * 2. Lectures Progress Breakdown (المحاضرات)
 * 3. Practical Sections & Topics Breakdown (السكاشن)
 * 4. Exams & Quizzes Performance (الامتحانات والكويزات - Image 1)
 * 5. Prepare for your retake (التحضير لإعادة الكويز - Image 2)
 */
export const ProgressPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') || searchParams.get('view');

  const [currentView, setCurrentView] = useState(() => {
    if (tabParam === 'sections') return 'sections_breakdown';
    if (tabParam === 'lectures') return 'lectures_breakdown';
    if (tabParam === 'exams') return 'exams_breakdown';
    if (tabParam === 'quiz-retake' || tabParam === 'retake') return 'quiz_retake_prep';
    return 'overview';
  });

  const [selectedQuiz, setSelectedQuiz] = useState(null);

  // Sync state if URL query param changes
  useEffect(() => {
    if (tabParam === 'sections') {
      setCurrentView('sections_breakdown');
    } else if (tabParam === 'lectures') {
      setCurrentView('lectures_breakdown');
    } else if (tabParam === 'exams') {
      setCurrentView('exams_breakdown');
    } else if (tabParam === 'quiz-retake' || tabParam === 'retake') {
      setCurrentView('quiz_retake_prep');
    } else if (!tabParam) {
      setCurrentView('overview');
    }
  }, [tabParam]);

  const handleBackToOverview = () => {
    setCurrentView('overview');
    setSearchParams({});
  };

  const handleSelectLectures = () => {
    setCurrentView('lectures_breakdown');
    setSearchParams({ view: 'lectures' });
  };

  const handleSelectSections = () => {
    setCurrentView('sections_breakdown');
    setSearchParams({ view: 'sections' });
  };

  const handleSelectExams = (exam) => {
    if (exam && (exam.status === 'needs_retake' || exam.id === 'q3')) {
      setSelectedQuiz(exam);
      setCurrentView('quiz_retake_prep');
      setSearchParams({ view: 'quiz-retake' });
    } else {
      setCurrentView('exams_breakdown');
      setSearchParams({ view: 'exams' });
    }
  };

  const handleSelectQuizFromTable = (quiz) => {
    setSelectedQuiz(quiz);
    setCurrentView('quiz_retake_prep');
    setSearchParams({ view: 'quiz-retake' });
  };

  const handleBackToAssessments = () => {
    setCurrentView('exams_breakdown');
    setSearchParams({ view: 'exams' });
  };

  const handleOpenSection = (sectionId) => {
    setCurrentView('sections_breakdown');
    setSearchParams({ view: 'sections' });
  };

  return (
    <div className="space-y-6 sm:space-y-7 pb-12 select-none">
      {/* TOP VIEW SWITCHER TABS: All Progress (الكل) | Lectures | Sections | Exams */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="inline-flex items-center rounded-full bg-white border border-[#D7E0E3] p-1 sm:p-1.5 shadow-xs overflow-x-auto max-w-full">
          {[
            { id: 'overview', label: 'All Progress (الكل)' },
            { id: 'lectures_breakdown', label: 'Lectures (المحاضرات)' },
            { id: 'sections_breakdown', label: 'Sections (السكاشن)' },
            { id: 'exams_breakdown', label: 'Exams & Quizzes (الامتحانات والكويزات)' },
          ].map((tab) => {
            const isActive =
              currentView === tab.id ||
              (tab.id === 'exams_breakdown' && currentView === 'quiz_retake_prep');

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  if (tab.id === 'overview') handleBackToOverview();
                  else if (tab.id === 'lectures_breakdown') handleSelectLectures();
                  else if (tab.id === 'sections_breakdown') handleSelectSections();
                  else if (tab.id === 'exams_breakdown') handleSelectExams();
                }}
                className={`px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#15313C] text-[#CCEB74] shadow-xs'
                    : 'text-[#6B8089] hover:text-[#15313C] hover:bg-[#F5F8F9]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* VIEW CONTENT */}
      {currentView === 'lectures_breakdown' ? (
        <LecturesProgressBreakdown onBack={handleBackToOverview} />
      ) : currentView === 'sections_breakdown' ? (
        <SectionsProgressBreakdown onBack={handleBackToOverview} />
      ) : currentView === 'exams_breakdown' ? (
        <ExamsProgressBreakdown
          onBack={handleBackToOverview}
          onSelectQuiz={handleSelectQuizFromTable}
        />
      ) : currentView === 'quiz_retake_prep' ? (
        <QuizRetakePreparation
          quizData={selectedQuiz}
          onBackToAssessments={handleBackToAssessments}
          onOpenSection={handleOpenSection}
        />
      ) : (
        <ProgressSummary
          onSelectLectures={handleSelectLectures}
          onSelectSections={handleSelectSections}
          onSelectExams={handleSelectExams}
        />
      )}
    </div>
  );
};

export default ProgressPage;
