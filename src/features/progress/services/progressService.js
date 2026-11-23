import { useState, useEffect, useCallback } from 'react';
import { getLecturesByCourse } from '../../lectures/data/mockLectures';
import { getSectionsByCourse } from '../../sections/data/mockSections';

const STORAGE_PREFIX = 'dsp_progress_data_v2_';
const EVENT_NAME = 'dsp_progress_updated';

/**
 * Helper to get currently active course id
 */
export const getActiveCourseId = () => {
  if (typeof window === 'undefined') return 'dsp';
  try {
    const saved = localStorage.getItem('dsp_selected_course');
    return saved === 'signals' ? 'signals' : 'dsp';
  } catch {
    return 'dsp';
  }
};

/**
 * Generate complete progress structure for all 8 lectures and 8 sections of a course
 */
export const generateCourseProgressData = (courseId = 'dsp', existingData = null) => {
  const activeCourse = courseId === 'signals' ? 'signals' : 'dsp';
  const lectures = getLecturesByCourse(activeCourse);
  const sections = getSectionsByCourse(activeCourse);

  const isDsp = activeCourse === 'dsp';
  const courseTitle = isDsp
    ? 'Digital Signal Processing - Progress Summary'
    : 'Signals and Systems - Progress Summary';

  // 1. Build all 8 lectures
  const fullLectures = lectures.map((lec, idx) => {
    const existing = existingData?.lectures?.find(
      (l) => l.id === String(lec.id) || l.number?.endsWith(String(lec.id))
    );

    // Initial demo state if fresh:
    // Lectures 1 & 2 watched, Lecture 3 in_progress, Lectures 4-8 not_started
    const defaultStatus = idx < 2 ? 'watched' : (idx === 2 ? 'in_progress' : 'not_started');
    const status = existing ? existing.status : defaultStatus;

    const isWatched = status === 'watched';
    const isInProgress = status === 'in_progress';

    return {
      id: String(lec.id),
      number: lec.number,
      numberStr: String(lec.id).padStart(2, '0'),
      title: `${lec.number}: ${lec.title}`,
      rawTitle: lec.title,
      meta: `Duration: ${lec.videoDuration || '45m'} • ${
        isWatched ? 'Completed' : isInProgress ? 'In Progress' : 'Not Started'
      }`,
      status,
      progressPercent: isWatched ? 100 : isInProgress ? 50 : 0,
      badgeText: isWatched ? '100% Watched' : isInProgress ? '50% In Progress' : 'Not Started',
      badgeVariant: status,
      numberVariant: isWatched ? 'dark' : isInProgress ? 'lime' : 'gray',
    };
  });

  // 2. Build all 8 sections
  const fullSections = sections.map((sec, idx) => {
    const existing = existingData?.sections?.find(
      (s) => s.id === String(sec.id) || s.number === sec.number
    );

    const defaultTopics = [
      {
        id: `t${sec.id}_1`,
        title: `Topic ${sec.num || sec.id}.1: Handout & Theoretical Problems`,
        status: idx < 3 ? 'completed' : 'pending',
      },
      {
        id: `t${sec.id}_2`,
        title: `Topic ${sec.num || sec.id}.2: Practical Video Demonstration`,
        status: idx < 2 ? 'completed' : 'pending',
      },
    ];

    const topics = existing?.topics || defaultTopics;
    const completedCount = topics.filter((t) => t.status === 'completed').length;
    const pendingCount = topics.length - completedCount;

    let statusText = 'Completed';
    if (pendingCount > 0) {
      statusText = `${pendingCount} Topic${pendingCount > 1 ? 's' : ''} Left`;
    }

    return {
      id: String(sec.id),
      number: sec.number,
      numberStr: `SECTION ${sec.num || String(sec.id).padStart(2, '0')}`,
      title: `${sec.number}: ${sec.title}`,
      rawTitle: sec.title,
      statusText,
      topics,
    };
  });

  // 3. Exams & Quizzes
  const existingExams = existingData?.exams;
  const exams = existingExams && existingExams.length > 0 ? existingExams : [
    {
      id: 'q1',
      name: isDsp ? 'Quiz 1: Discrete Signals & Classification' : 'Quiz 1: Continuous Signals & Classification',
      title: isDsp ? 'Quiz 1: Discrete Signals & Classification' : 'Quiz 1: Continuous Signals & Classification',
      category: 'Quiz',
      highestScore: '85%',
      scoreVal: 85,
      attempts: 1,
      attemptsText: '1 Attempt',
      status: 'passed',
      statusText: 'Passed',
      actionText: 'View Answers',
    },
    {
      id: 'q2',
      name: isDsp ? 'Quiz 2: LTI Systems & Difference Equations' : 'Quiz 2: LTI Systems & Convolution',
      title: isDsp ? 'Quiz 2: LTI Systems & Difference Equations' : 'Quiz 2: LTI Systems & Convolution',
      category: 'Quiz',
      highestScore: '92%',
      scoreVal: 92,
      attempts: 3,
      attemptsText: '3 Attempts',
      status: 'passed',
      statusText: 'Passed',
      actionText: 'View Answers',
    },
    {
      id: 'm1',
      name: 'Midterm Practice Assessment',
      title: 'Midterm Practice Assessment',
      category: 'Major Exam',
      highestScore: '92%',
      scoreVal: 92,
      attempts: 1,
      attemptsText: '1 Attempt',
      status: 'passed',
      statusText: 'Passed',
      actionText: 'View Answers',
    },
    {
      id: 'q3',
      name: isDsp ? 'Quiz 3: Z-Transform & ROC' : 'Quiz 3: Fourier & Laplace Transforms',
      title: isDsp ? 'Quiz 3: Z-Transform & ROC' : 'Quiz 3: Fourier & Laplace Transforms',
      category: 'Quiz',
      highestScore: '63%',
      scoreVal: 63,
      attempts: 2,
      attemptsText: '2 Attempts',
      status: 'needs_retake',
      statusText: 'Needs Retake',
      actionText: 'Retake Quiz',
      relatedSectionId: '2',
      relatedSectionTitle: 'Section 02',
    },
  ];

  // 4. Calculate accurate completion percentages across ALL 8 lectures and 8 sections
  const totalLecturesCount = fullLectures.length; // exactly 8
  const watchedLecturesCount = fullLectures.filter((l) => l.status === 'watched').length;
  const inProgressLecturesCount = fullLectures.filter((l) => l.status === 'in_progress').length;

  // Percentage calculated from ALL lectures in curriculum:
  const lecturesPercent = totalLecturesCount > 0
    ? Math.round(((watchedLecturesCount + (inProgressLecturesCount * 0.5)) / totalLecturesCount) * 100)
    : 0;

  const totalTopicsCount = fullSections.reduce((acc, s) => acc + (s.topics?.length || 0), 0);
  const completedTopicsCount = fullSections.reduce(
    (acc, s) => acc + (s.topics?.filter((t) => t.status === 'completed').length || 0),
    0
  );
  const sectionsPercent = totalTopicsCount > 0
    ? Math.round((completedTopicsCount / totalTopicsCount) * 100)
    : 0;

  const examsAvg = exams.length > 0
    ? Math.round(exams.reduce((acc, ex) => acc + (ex.scoreVal || 80), 0) / exams.length)
    : 85;

  // Weighted overall: 45% Lectures + 45% Sections + 10% Exams
  const overallCompletion = Math.round(
    (lecturesPercent * 0.45) + (sectionsPercent * 0.45) + (examsAvg * 0.10)
  );

  return {
    courseId: activeCourse,
    courseTitle,
    overallCompletion,
    totalLecturesCount,
    watchedLecturesCount,
    inProgressLecturesCount,
    lectures: fullLectures,
    sections: fullSections,
    exams,
    stats: {
      lecturesCompletionBadge: `${lecturesPercent}% Completed`,
      sectionsCompletionBadge: `${sectionsPercent}% Completed`,
      examsAvgBadge: `Avg: ${examsAvg}%`,
      overallScore: `${examsAvg}%`,
    },
  };
};

export const INITIAL_PROGRESS_DATA = generateCourseProgressData('dsp');

/**
 * Retrieve saved progress or fallback to generated course data
 */
export const getProgressData = (courseId = null) => {
  const activeCourse = courseId || getActiveCourseId();
  const storageKey = `${STORAGE_PREFIX}${activeCourse}`;

  if (typeof window === 'undefined') {
    return generateCourseProgressData(activeCourse);
  }

  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) {
      const initial = generateCourseProgressData(activeCourse);
      localStorage.setItem(storageKey, JSON.stringify(initial));
      return initial;
    }

    const parsed = JSON.parse(raw);
    // Merge with curriculum to ensure all 8 lectures and 8 sections are always tracked
    const synced = generateCourseProgressData(activeCourse, parsed);
    return synced;
  } catch {
    return generateCourseProgressData(activeCourse);
  }
};

/**
 * Save progress data to localStorage and emit event
 */
export const saveProgressData = (newData, courseId = null) => {
  if (typeof window === 'undefined') return;
  const activeCourse = courseId || newData?.courseId || getActiveCourseId();
  const storageKey = `${STORAGE_PREFIX}${activeCourse}`;
  try {
    localStorage.setItem(storageKey, JSON.stringify(newData));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: newData }));
  } catch (err) {
    console.error('Error saving progress data:', err);
  }
};

/**
 * Mark a lecture as watched/completed across the full 8-lecture curriculum
 */
export const markLectureWatched = (lectureId, courseId = null) => {
  const activeCourse = courseId || getActiveCourseId();
  const current = getProgressData(activeCourse);
  const idStr = String(lectureId);

  const updatedLectures = current.lectures.map((lec) => {
    if (lec.id === idStr || lec.number?.endsWith(idStr)) {
      return {
        ...lec,
        status: 'watched',
        progressPercent: 100,
        badgeText: '100% Watched',
        badgeVariant: 'watched',
        numberVariant: 'dark',
      };
    }
    return lec;
  });

  const updated = generateCourseProgressData(activeCourse, {
    ...current,
    lectures: updatedLectures,
  });

  saveProgressData(updated, activeCourse);
  return updated;
};

/**
 * Toggle watched status for testing / UI interaction
 */
export const toggleLectureWatched = (lectureId, courseId = null) => {
  const activeCourse = courseId || getActiveCourseId();
  const current = getProgressData(activeCourse);
  const idStr = String(lectureId);

  const updatedLectures = current.lectures.map((lec) => {
    if (lec.id === idStr || lec.number?.endsWith(idStr)) {
      const nextStatus =
        lec.status === 'watched'
          ? 'in_progress'
          : lec.status === 'in_progress'
          ? 'not_started'
          : 'watched';

      return {
        ...lec,
        status: nextStatus,
        progressPercent: nextStatus === 'watched' ? 100 : nextStatus === 'in_progress' ? 50 : 0,
        badgeText: nextStatus === 'watched' ? '100% Watched' : nextStatus === 'in_progress' ? '50% In Progress' : 'Not Started',
        badgeVariant: nextStatus,
        numberVariant: nextStatus === 'watched' ? 'dark' : nextStatus === 'in_progress' ? 'lime' : 'gray',
      };
    }
    return lec;
  });

  const updated = generateCourseProgressData(activeCourse, {
    ...current,
    lectures: updatedLectures,
  });

  saveProgressData(updated, activeCourse);
  return updated;
};

/**
 * Toggle a practical section topic status (completed <-> pending)
 */
export const toggleTopicStatus = (sectionId, topicId, courseId = null) => {
  const activeCourse = courseId || getActiveCourseId();
  const current = getProgressData(activeCourse);

  const updatedSections = current.sections.map((sec) => {
    if (sec.id === String(sectionId) || sec.number === sectionId) {
      const updatedTopics = (sec.topics || []).map((t) => {
        if (t.id === topicId || t.title.includes(topicId)) {
          const nextStatus = t.status === 'completed' ? 'pending' : 'completed';
          return { ...t, status: nextStatus };
        }
        return t;
      });

      const completedCount = updatedTopics.filter((t) => t.status === 'completed').length;
      const totalCount = updatedTopics.length;
      const pendingCount = totalCount - completedCount;

      let statusText = 'Completed';
      if (pendingCount > 0) {
        statusText = `${pendingCount} Topic${pendingCount > 1 ? 's' : ''} Left`;
      }

      return {
        ...sec,
        topics: updatedTopics,
        statusText,
      };
    }
    return sec;
  });

  const updated = generateCourseProgressData(activeCourse, {
    ...current,
    sections: updatedSections,
  });

  saveProgressData(updated, activeCourse);
  return updated;
};

/**
 * Mark a specific section topic as completed
 */
export const markTopicCompleted = (sectionId, topicId, courseId = null) => {
  const activeCourse = courseId || getActiveCourseId();
  const current = getProgressData(activeCourse);

  const updatedSections = current.sections.map((sec) => {
    if (sec.id === String(sectionId) || sec.number === sectionId) {
      const updatedTopics = (sec.topics || []).map((t) => {
        if (t.id === topicId || t.title.includes(topicId)) {
          return { ...t, status: 'completed' };
        }
        return t;
      });

      const completedCount = updatedTopics.filter((t) => t.status === 'completed').length;
      const totalCount = updatedTopics.length;
      const pendingCount = totalCount - completedCount;

      let statusText = 'Completed';
      if (pendingCount > 0) {
        statusText = `${pendingCount} Topic${pendingCount > 1 ? 's' : ''} Left`;
      }

      return {
        ...sec,
        topics: updatedTopics,
        statusText,
      };
    }
    return sec;
  });

  const updated = generateCourseProgressData(activeCourse, {
    ...current,
    sections: updatedSections,
  });

  saveProgressData(updated, activeCourse);
  return updated;
};

/**
 * Submit or simulate a quiz retake (e.g. for Quiz 3)
 */
export const submitQuizRetake = (quizId = 'q3', score = 94, courseId = null) => {
  const activeCourse = courseId || getActiveCourseId();
  const current = getProgressData(activeCourse);
  const idStr = String(quizId);

  const updatedExams = (current.exams || []).map((exam) => {
    if (exam.id === idStr || exam.name?.includes(idStr)) {
      const nextAttempts = (exam.attempts || 1) + 1;
      const isPassed = score >= 70;
      return {
        ...exam,
        highestScore: `${score}%`,
        scoreVal: score,
        attempts: nextAttempts,
        attemptsText: `${nextAttempts} Attempts`,
        status: isPassed ? 'passed' : 'needs_retake',
        statusText: isPassed ? 'Passed' : 'Needs Retake',
        actionText: isPassed ? 'View Answers' : 'Retake Quiz',
      };
    }
    return exam;
  });

  const updated = generateCourseProgressData(activeCourse, {
    ...current,
    exams: updatedExams,
  });

  saveProgressData(updated, activeCourse);
  return updated;
};

/**
 * Reset quiz retake for demo testing
 */
export const resetQuizRetake = (quizId = 'q3', courseId = null) => {
  const activeCourse = courseId || getActiveCourseId();
  const current = getProgressData(activeCourse);
  const idStr = String(quizId);

  const updatedExams = (current.exams || []).map((exam) => {
    if (exam.id === idStr || exam.name?.includes(idStr)) {
      return {
        ...exam,
        highestScore: '63%',
        scoreVal: 63,
        attempts: 2,
        attemptsText: '2 Attempts',
        status: 'needs_retake',
        statusText: 'Needs Retake',
        actionText: 'Retake Quiz',
      };
    }
    return exam;
  });

  const updated = generateCourseProgressData(activeCourse, {
    ...current,
    exams: updatedExams,
  });

  saveProgressData(updated, activeCourse);
  return updated;
};

/**
 * React hook to reactively subscribe to progress data updates
 */
export const useProgress = (initialOverride = null, courseIdOverride = null) => {
  const activeCourse = courseIdOverride || getActiveCourseId();
  const [data, setData] = useState(() => initialOverride || getProgressData(activeCourse));

  useEffect(() => {
    if (initialOverride) {
      setData(initialOverride);
      return;
    }

    const handleUpdate = () => {
      const currentCourse = courseIdOverride || getActiveCourseId();
      setData(getProgressData(currentCourse));
    };

    window.addEventListener(EVENT_NAME, handleUpdate);
    window.addEventListener('storage', handleUpdate);

    // Initial sync
    handleUpdate();

    return () => {
      window.removeEventListener(EVENT_NAME, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [initialOverride, courseIdOverride]);

  const setWatched = useCallback(
    (id) => {
      const currentCourse = courseIdOverride || getActiveCourseId();
      return markLectureWatched(id, currentCourse);
    },
    [courseIdOverride]
  );

  const toggleWatched = useCallback(
    (id) => {
      const currentCourse = courseIdOverride || getActiveCourseId();
      return toggleLectureWatched(id, currentCourse);
    },
    [courseIdOverride]
  );

  const toggleTopic = useCallback(
    (sectionId, topicId) => {
      const currentCourse = courseIdOverride || getActiveCourseId();
      return toggleTopicStatus(sectionId, topicId, currentCourse);
    },
    [courseIdOverride]
  );

  const setTopicCompleted = useCallback(
    (sectionId, topicId) => {
      const currentCourse = courseIdOverride || getActiveCourseId();
      return markTopicCompleted(sectionId, topicId, currentCourse);
    },
    [courseIdOverride]
  );

  const retakeQuiz = useCallback(
    (quizId, score) => {
      const currentCourse = courseIdOverride || getActiveCourseId();
      return submitQuizRetake(quizId, score, currentCourse);
    },
    [courseIdOverride]
  );

  const resetQuiz = useCallback(
    (quizId) => {
      const currentCourse = courseIdOverride || getActiveCourseId();
      return resetQuizRetake(quizId, currentCourse);
    },
    [courseIdOverride]
  );

  return {
    progressData: data,
    markLectureWatched: setWatched,
    toggleLectureWatched: toggleWatched,
    toggleTopicStatus: toggleTopic,
    markTopicCompleted: setTopicCompleted,
    submitQuizRetake: retakeQuiz,
    resetQuizRetake: resetQuiz,
  };
};
