import { useState, useEffect, useCallback } from 'react';
import { getProgressData } from '../features/progress/services/progressService';
import { getLecturesByCourse } from '../features/lectures/data/mockLectures';

const ACTIVITY_STORAGE_KEY = 'dsp_recent_activity_v1';
const ACTIVITY_EVENT = 'dsp_activity_updated';

/**
 * Record a user learning activity (opened lecture, section, or exam)
 */
export const recordActivity = (item) => {
  if (typeof window === 'undefined' || !item) return;
  try {
    const raw = localStorage.getItem(ACTIVITY_STORAGE_KEY);
    const existing = raw ? JSON.parse(raw) : [];

    // Filter out duplicate by id, type, and courseId
    const filtered = existing.filter(
      (it) => !(it.id === String(item.id) && it.type === item.type && it.courseId === item.courseId)
    );

    const newItem = {
      ...item,
      id: String(item.id),
      timestamp: Date.now(),
    };

    const updated = [newItem, ...filtered].slice(0, 15);
    localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(ACTIVITY_EVENT, { detail: newItem }));
  } catch (err) {
    console.error('Error saving recent activity:', err);
  }
};

/**
 * Retrieve recent activities list
 */
export const getRecentActivities = (courseId = null) => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(ACTIVITY_STORAGE_KEY);
    const list = raw ? JSON.parse(raw) : [];
    if (!courseId) return list;
    return list.filter((it) => !it.courseId || it.courseId === courseId);
  } catch {
    return [];
  }
};

/**
 * Get the most relevant item to resume for "Continue learning"
 * 1. Checks explicitly recorded activities
 * 2. If none, checks in-progress or watched lectures from progressData
 * 3. Fallback to first lecture of course if progress exists
 */
export const getMostRecentItem = (courseId = 'dsp') => {
  const activities = getRecentActivities(courseId);
  if (activities.length > 0) {
    return activities[0];
  }

  // Fallback: check progress service for in-progress or watched lecture
  try {
    const progress = getProgressData(courseId);
    const inProgressLec = progress?.lectures?.find((l) => l.status === 'in_progress');
    if (inProgressLec) {
      return {
        type: 'lecture',
        courseId,
        id: String(inProgressLec.id),
        number: inProgressLec.number,
        title: inProgressLec.rawTitle || inProgressLec.title,
        path: `/lectures/${inProgressLec.id}/video`,
        label: 'Lecture Video',
        duration: inProgressLec.meta || '45m',
      };
    }

    const watchedLecs = progress?.lectures?.filter((l) => l.status === 'watched');
    if (watchedLecs && watchedLecs.length > 0) {
      const lastWatched = watchedLecs[watchedLecs.length - 1];
      return {
        type: 'lecture',
        courseId,
        id: String(lastWatched.id),
        number: lastWatched.number,
        title: lastWatched.rawTitle || lastWatched.title,
        path: `/lectures/${lastWatched.id}/video`,
        label: 'Lecture Video',
        duration: lastWatched.meta || '45m',
      };
    }

    // Default to Lecture 1 if course exists
    const lecs = getLecturesByCourse(courseId);
    if (lecs && lecs.length > 0) {
      const first = lecs[0];
      return {
        type: 'lecture',
        courseId,
        id: String(first.id),
        number: first.number,
        title: first.title,
        path: `/lectures/${first.id}/video`,
        label: 'Lecture Video',
        duration: first.videoDuration || '45:20',
      };
    }
  } catch (err) {
    console.error('Error getting fallback recent item:', err);
  }

  return null;
};

/**
 * Hook to reactively track the most recent learning item
 */
export const useRecentActivity = (courseId = 'dsp') => {
  const [mostRecent, setMostRecent] = useState(() => getMostRecentItem(courseId));

  useEffect(() => {
    const update = () => {
      setMostRecent(getMostRecentItem(courseId));
    };

    update();

    window.addEventListener(ACTIVITY_EVENT, update);
    window.addEventListener('storage', update);
    window.addEventListener('dsp_progress_updated', update);

    return () => {
      window.removeEventListener(ACTIVITY_EVENT, update);
      window.removeEventListener('storage', update);
      window.removeEventListener('dsp_progress_updated', update);
    };
  }, [courseId]);

  return {
    mostRecentItem: mostRecent,
    recordLearningActivity: recordActivity,
  };
};
