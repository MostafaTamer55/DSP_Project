import React, { createContext, useContext, useState } from 'react';

/**
 * Course definitions for DSP and Signals & Systems.
 * Frontend Mock Data: When backend developers integrate the API,
 * they can connect real data and courses here or through their backend endpoints.
 */
export const COURSES = {
  signals: {
    id: 'signals',
    label: 'Signals',
    code: 'Signals',
    title: 'Signals and Systems',
    heroLine1: 'Signals and',
    heroLine2: 'Systems',
    department: 'Electronics and Communications Engineering',
    courseCode: 'ECE 28',
    badgeText: 'DSP', // Matches the Figma screenshot badge
    instructor: 'Dr. Abeer Tawakol',
    welcomeText: 'Welcome - Electronics and Communications Engineering',
    description: 'Continuous and Discrete-Time Signals, Linear Time-Invariant Systems, Convolution, Fourier Transform, and Laplace Transform.',
  },
  dsp: {
    id: 'dsp',
    label: 'DSP',
    code: 'DSP',
    title: 'Digital Signal Processing',
    heroLine1: 'Digital Signal',
    heroLine2: 'Processing',
    department: 'Electronics and Communications Engineering',
    courseCode: 'ECE 28',
    badgeText: 'DSP',
    instructor: 'Dr. Abeer Tawakol',
    welcomeText: 'Welcome - Electronics and Communications Engineering',
    description: 'Discrete-Time Signals, Z-Transform, Discrete Fourier Transform (DFT), Fast Fourier Transform (FFT), and Digital Filter Design.',
  },
};

const CourseContext = createContext(null);

export const CourseProvider = ({ children }) => {
  // Read saved preference from localStorage or default to 'signals' as shown in the UI mockup
  const [courseId, setCourseIdState] = useState(() => {
    try {
      const saved = localStorage.getItem('dsp_selected_course');
      return saved && COURSES[saved] ? saved : 'signals';
    } catch {
      return 'signals';
    }
  });

  const selectCourse = (id) => {
    if (COURSES[id]) {
      setCourseIdState(id);
      try {
        localStorage.setItem('dsp_selected_course', id);
      } catch {
        // Ignore localStorage restrictions if any
      }
    }
  };

  const currentCourse = COURSES[courseId] || COURSES.signals;

  return (
    <CourseContext.Provider
      value={{
        courseId,
        currentCourse,
        courses: COURSES,
        selectCourse,
        setCourseId: selectCourse,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};

export const useCourse = () => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error('useCourse must be used within a CourseProvider');
  }
  return context;
};

export default CourseContext;
