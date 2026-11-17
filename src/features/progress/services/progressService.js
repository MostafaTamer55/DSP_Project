import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../auth/context/AuthContext';
import { loadUserData, saveUserData } from '../../../lib/userData';

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
      number: 'Section 1',
      title: 'Section 1: Intro to DSP',
      statusText: 'Completed',
    },
    {
      id: 's2',
      number: 'Section 2',
      title: 'Section 2: Z-Transform',
      statusText: '1 Topic Left',
    },
    {
      id: 's3',
      number: 'Section 3',
      title: 'Section 3: Filtering Basics',
      statusText: 'Completed',
    },
  ],
  exams: [
    {
      id: 'e1',
      title: 'Quiz/Exam 1',
      score: '85%',
    },
    {
      id: 'e2',
      title: 'Quiz/Exam 2',
      score: '92%',
    },
    {
      id: 'e3',
      title: 'Midterm Exam',
      score: '92%',
    },
  ],
  stats: {
    lecturesCompletionBadge: '85% Completed',
    sectionsCompletionBadge: '70% Completed',
    examsAvgBadge: 'Avg: 88%',
  },
};

/**
 * Retrieve saved progress or fallback to initial data
 */
export const getProgressData = (userId = null) => {
  if (typeof window === 'undefined') return INITIAL_PROGRESS_DATA;
  try {
    const storageKey = userId ? `${STORAGE_KEY}:${userId}` : STORAGE_KEY;
    const raw = localStorage.getItem(storageKey);
    if (!raw) return INITIAL_PROGRESS_DATA;
    const parsed = JSON.parse(raw);
    return {
      ...INITIAL_PROGRESS_DATA,
      ...parsed,
      lectures: parsed.lectures || INITIAL_PROGRESS_DATA.lectures,
    };
  } catch {
    return INITIAL_PROGRESS_DATA;
  }
};

/**
 * Save progress data to localStorage and emit event
 */
export const saveProgressData = (newData, userId = null) => {
  if (typeof window === 'undefined') return;
  try {
    const storageKey = userId ? `${STORAGE_KEY}:${userId}` : STORAGE_KEY;
    localStorage.setItem(storageKey, JSON.stringify(newData));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: newData }));
  } catch (err) {
    console.error('Error saving progress data:', err);
  }
};

/**
 * Mark a lecture as watched/completed
 */
export const markLectureWatched = (lectureId, userId = null) => {
  const current = getProgressData(userId);
  const idStr = String(lectureId);
  let found = false;

  const updatedLectures = current.lectures.map((lec) => {
    if (lec.id === idStr || lec.number.endsWith(idStr)) {
      found = true;
      return { ...lec, status: 'watched' };
    }
    return lec;
  });

  // If lecture wasn't in the initial 3, add or update dynamically
  if (!found && idStr === '3') {
    updatedLectures[2] = {
      ...updatedLectures[2],
      status: 'watched',
    };
  }

  // Recalculate badge & overall completion if all are watched
  const watchedCount = updatedLectures.filter((l) => l.status === 'watched').length;
  const total = updatedLectures.length;
  const isAllWatched = watchedCount === total;

  const updated = {
    ...current,
    lectures: updatedLectures,
    overallCompletion: isAllWatched ? 86 : current.overallCompletion,
    stats: {
      ...current.stats,
      lecturesCompletionBadge: isAllWatched ? '100% Completed' : current.stats.lecturesCompletionBadge,
    },
  };

  saveProgressData(updated, userId);
  return updated;
};

/**
 * Toggle watched status for testing / UI interaction
 */
export const toggleLectureWatched = (lectureId, userId = null) => {
  const current = getProgressData(userId);
  const idStr = String(lectureId);

  const updatedLectures = current.lectures.map((lec) => {
    if (lec.id === idStr || lec.number.endsWith(idStr)) {
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
      lecturesCompletionBadge: isAllWatched ? '100% Completed' : (watchedCount === 2 ? '85% Completed' : `${Math.round((watchedCount / updatedLectures.length) * 100)}% Completed`),
    },
  };

  saveProgressData(updated, userId);
  return updated;
};

/**
 * React hook to reactively subscribe to progress data updates
 */
export const useProgress = (initialOverride = null) => {
  const { currentUser } = useAuth();
  const userId = currentUser?.id || null;
  const [data, setData] = useState(() => initialOverride || getProgressData(userId));

  useEffect(() => {
    if (initialOverride) {
      return;
    }

    let active = true;
    let changedLocally = false;
    if (userId) {
      loadUserData('progress')
        .then((savedData) => {
          if (!active || changedLocally || !savedData) return;
          saveProgressData(savedData, userId);
          setData(savedData);
        })
        .catch((error) => console.error('Failed to load account progress:', error));
    }

    const handleUpdate = (event) => {
      const nextData = event.detail || getProgressData(userId);
      changedLocally = true;
      setData(nextData);
      if (userId) {
        saveUserData('progress', nextData).catch((error) =>
          console.error('Failed to sync account progress:', error),
        );
      }
    };

    window.addEventListener(EVENT_NAME, handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      active = false;
      window.removeEventListener(EVENT_NAME, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [initialOverride, userId]);

  const setWatched = useCallback((id) => {
    markLectureWatched(id, userId);
  }, [userId]);

  const toggleWatched = useCallback((id) => {
    toggleLectureWatched(id, userId);
  }, [userId]);

  return {
    progressData: data,
    markLectureWatched: setWatched,
    toggleLectureWatched: toggleWatched,
  };
};
