import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'dsp_progress_data_v1';
const EVENT_NAME = 'dsp_progress_updated';

export const INITIAL_PROGRESS_DATA = {
  courseTitle: 'Digital Signal Processing - Progress Summary',
  overallCompletion: 78,
  lectures: [
    {
      id: '1',
      number: 'Lecture 1',
      title: 'Lecture 1: Sampling Theorem',
      status: 'watched', // 'watched' | 'in_progress' | 'not_started'
    },
    {
      id: '2',
      number: 'Lecture 2',
      title: 'Lecture 2: Quantization',
      status: 'watched',
    },
    {
      id: '3',
      number: 'Lecture 3',
      title: 'Lecture 3: Dovantization',
      status: 'in_progress',
    },
  ],
  sections: [
    {
      id: 's1',
      number: 'SECTION 01',
      numberStr: 'SECTION 01',
      title: 'Sampling & Reconstruction Labs',
      statusText: 'Completed',
      topics: [
        {
          id: 't1_1',
          title: 'Topic 1.1: Nyquist Rate Calculation',
          status: 'completed', // 'completed' | 'pending'
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
      number: 'SECTION 02',
      numberStr: 'SECTION 02',
      title: 'Z-Transform & System Stability',
      statusText: '1 Topic Left',
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
    {
      id: 's3',
      number: 'SECTION 03',
      numberStr: 'SECTION 03',
      title: 'Discrete-Time Systems & Filtering',
      statusText: 'Completed',
      topics: [
        {
          id: 't3_1',
          title: 'Topic 3.1: LTI Impulse Response',
          status: 'completed',
        },
        {
          id: 't3_2',
          title: 'Topic 3.2: Convolution & Frequency Response',
          status: 'completed',
        },
        {
          id: 't3_3',
          title: 'Topic 3.3: Digital Filter Structures',
          status: 'completed',
        },
      ],
    },
    {
      id: 's4',
      number: 'SECTION 04',
      numberStr: 'SECTION 04',
      title: 'FFT Algorithms & Spectral Analysis',
      statusText: '1 Topic Left',
      topics: [
        {
          id: 't4_1',
          title: 'Topic 4.1: Radix-2 DIT FFT Implementation',
          status: 'completed',
        },
        {
          id: 't4_2',
          title: 'Topic 4.2: Butterfly Stages & Twiddle Factors',
          status: 'completed',
        },
        {
          id: 't4_3',
          title: 'Topic 4.3: Spectral Leakage & Window Functions',
          status: 'pending',
        },
      ],
    },
  ],
  exams: [
    {
      id: 'q1',
      name: 'Quiz 1: Sampling Theorem & Aliasing',
      title: 'Quiz 1: Sampling Theorem & Aliasing',
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
      name: 'Quiz 2: Quantization Noise & ADC',
      title: 'Quiz 2: Quantization Noise & ADC',
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
      name: 'Quiz 3: Z-Transform & ROC',
      title: 'Quiz 3: Z-Transform & ROC',
      category: 'Quiz',
      highestScore: '63%',
      scoreVal: 63,
      attempts: 2,
      attemptsText: '2 Attempts',
      status: 'needs_retake',
      statusText: 'Needs Retake',
      actionText: 'Retake Quiz',
      relatedSectionId: 's2',
      relatedSectionTitle: 'Z-Transform & System Stability',
    },
  ],
  stats: {
    lecturesCompletionBadge: '85% Completed',
    sectionsCompletionBadge: '70% Completed',
    examsAvgBadge: 'Avg: 88%',
    overallScore: '88%',
  },
};

/**
 * Retrieve saved progress or fallback to initial data
 */
export const getProgressData = () => {
  if (typeof window === 'undefined') return INITIAL_PROGRESS_DATA;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_PROGRESS_DATA;
    const parsed = JSON.parse(raw);
    const hasValidTopics =
      parsed.sections &&
      parsed.sections[0] &&
      Array.isArray(parsed.sections[0].topics);

    const hasValidExams =
      parsed.exams &&
      parsed.exams[0] &&
      Boolean(parsed.exams[0].category);

    return {
      ...INITIAL_PROGRESS_DATA,
      ...parsed,
      lectures: parsed.lectures || INITIAL_PROGRESS_DATA.lectures,
      sections: hasValidTopics ? parsed.sections : INITIAL_PROGRESS_DATA.sections,
      exams: hasValidExams ? parsed.exams : INITIAL_PROGRESS_DATA.exams,
    };
  } catch {
    return INITIAL_PROGRESS_DATA;
  }
};

/**
 * Save progress data to localStorage and emit event
 */
export const saveProgressData = (newData) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: newData }));
  } catch (err) {
    console.error('Error saving progress data:', err);
  }
};

/**
 * Mark a lecture as watched/completed
 */
export const markLectureWatched = (lectureId) => {
  const current = getProgressData();
  const idStr = String(lectureId);
  let found = false;

  const updatedLectures = current.lectures.map((lec) => {
    if (lec.id === idStr || lec.number?.endsWith(idStr)) {
      found = true;
      return { ...lec, status: 'watched' };
    }
    return lec;
  });

  if (!found && idStr === '3') {
    updatedLectures[2] = {
      ...updatedLectures[2],
      status: 'watched',
    };
  }

  const watchedCount = updatedLectures.filter((l) => l.status === 'watched').length;
  const isAllWatched = watchedCount === updatedLectures.length;

  const updated = {
    ...current,
    lectures: updatedLectures,
    overallCompletion: isAllWatched ? 86 : current.overallCompletion,
    stats: {
      ...current.stats,
      lecturesCompletionBadge: isAllWatched ? '100% Completed' : current.stats.lecturesCompletionBadge,
    },
  };

  saveProgressData(updated);
  return updated;
};

/**
 * Toggle watched status for testing / UI interaction
 */
export const toggleLectureWatched = (lectureId) => {
  const current = getProgressData();
  const idStr = String(lectureId);

  const updatedLectures = current.lectures.map((lec) => {
    if (lec.id === idStr || lec.number?.endsWith(idStr)) {
      const nextStatus = lec.status === 'watched' ? 'in_progress' : 'watched';
      return { ...lec, status: nextStatus };
    }
    return lec;
  });

  const watchedCount = updatedLectures.filter((l) => l.status === 'watched').length;
  const isAllWatched = watchedCount === updatedLectures.length;

  const updated = {
    ...current,
    lectures: updatedLectures,
    overallCompletion: isAllWatched ? 86 : (watchedCount < 2 ? 65 : 78),
    stats: {
      ...current.stats,
      lecturesCompletionBadge: isAllWatched
        ? '100% Completed'
        : (watchedCount === 2
            ? '85% Completed'
            : `${Math.round((watchedCount / updatedLectures.length) * 100)}% Completed`),
    },
  };

  saveProgressData(updated);
  return updated;
};

/**
 * Toggle a practical section topic status (completed <-> pending)
 */
export const toggleTopicStatus = (sectionId, topicId) => {
  const current = getProgressData();

  const updatedSections = current.sections.map((sec) => {
    if (sec.id === sectionId || sec.number === sectionId) {
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

  // Calculate sections overall completion
  const totalTopics = updatedSections.reduce((acc, s) => acc + (s.topics?.length || 0), 0);
  const totalCompleted = updatedSections.reduce(
    (acc, s) => acc + (s.topics?.filter((t) => t.status === 'completed').length || 0),
    0
  );
  const sectionsPercent = totalTopics > 0 ? Math.round((totalCompleted / totalTopics) * 100) : 70;

  // Recalculate course overall
  const lecturesWatched = current.lectures.filter((l) => l.status === 'watched').length;
  const lecturesTotal = current.lectures.length;
  const lecturesPercent = lecturesTotal > 0 ? Math.round((lecturesWatched / lecturesTotal) * 100) : 85;

  const newOverall = Math.round((lecturesPercent * 0.45) + (sectionsPercent * 0.45) + (88 * 0.10));

  const updated = {
    ...current,
    sections: updatedSections,
    overallCompletion: newOverall,
    stats: {
      ...current.stats,
      sectionsCompletionBadge: `${sectionsPercent}% Completed`,
    },
  };

  saveProgressData(updated);
  return updated;
};

/**
 * Mark a specific section topic as completed
 */
export const markTopicCompleted = (sectionId, topicId) => {
  const current = getProgressData();

  const updatedSections = current.sections.map((sec) => {
    if (sec.id === sectionId || sec.number === sectionId) {
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

  const totalTopics = updatedSections.reduce((acc, s) => acc + (s.topics?.length || 0), 0);
  const totalCompleted = updatedSections.reduce(
    (acc, s) => acc + (s.topics?.filter((t) => t.status === 'completed').length || 0),
    0
  );
  const sectionsPercent = totalTopics > 0 ? Math.round((totalCompleted / totalTopics) * 100) : 70;

  const updated = {
    ...current,
    sections: updatedSections,
    stats: {
      ...current.stats,
      sectionsCompletionBadge: `${sectionsPercent}% Completed`,
    },
  };

  saveProgressData(updated);
  return updated;
};

/**
 * React hook to reactively subscribe to progress data updates
 */
/**
 * Submit or simulate a quiz retake (e.g. for Quiz 3)
 */
export const submitQuizRetake = (quizId = 'q3', score = 94) => {
  const current = getProgressData();
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

  // Calculate new average
  const totalScores = updatedExams.reduce((acc, ex) => acc + (ex.scoreVal || 80), 0);
  const avg = Math.round(totalScores / (updatedExams.length || 1));

  const updated = {
    ...current,
    exams: updatedExams,
    stats: {
      ...current.stats,
      examsAvgBadge: `Avg: ${avg}%`,
      overallScore: `${avg}%`,
    },
  };

  saveProgressData(updated);
  return updated;
};

/**
 * Reset quiz retake for demo testing
 */
export const resetQuizRetake = (quizId = 'q3') => {
  const current = getProgressData();
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

  const updated = {
    ...current,
    exams: updatedExams,
    stats: {
      ...current.stats,
      examsAvgBadge: 'Avg: 88%',
      overallScore: '88%',
    },
  };

  saveProgressData(updated);
  return updated;
};

/**
 * React hook to reactively subscribe to progress data updates
 */
export const useProgress = (initialOverride = null) => {
  const [data, setData] = useState(() => initialOverride || getProgressData());

  useEffect(() => {
    if (initialOverride) {
      setData(initialOverride);
      return;
    }

    const handleUpdate = () => {
      setData(getProgressData());
    };

    window.addEventListener(EVENT_NAME, handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener(EVENT_NAME, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [initialOverride]);

  const setWatched = useCallback((id) => {
    markLectureWatched(id);
  }, []);

  const toggleWatched = useCallback((id) => {
    toggleLectureWatched(id);
  }, []);

  const toggleTopic = useCallback((sectionId, topicId) => {
    toggleTopicStatus(sectionId, topicId);
  }, []);

  const setTopicCompleted = useCallback((sectionId, topicId) => {
    markTopicCompleted(sectionId, topicId);
  }, []);

  const retakeQuiz = useCallback((quizId, score) => {
    return submitQuizRetake(quizId, score);
  }, []);

  const resetQuiz = useCallback((quizId) => {
    return resetQuizRetake(quizId);
  }, []);

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
