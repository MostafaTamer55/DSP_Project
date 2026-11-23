import React, { createContext, useContext } from 'react';
import { useCourse } from '../features/courses/context/CourseContext';

const SubjectContext = createContext(null);

export const SUBJECT_CONFIGS = {
  DSP: {
    code: 'DSP',
    label: 'DSP',
    title: 'Digital Signal Processing (DSP)',
    shortTitle: 'Digital Signal Processing',
    cohort: 'ECE 28',
    instructor: 'Dr. Abeer Tawakol',
    badges: ['DSP', 'ECE 28'],
  },
  Signals: {
    code: 'Signals',
    label: 'Signals',
    title: 'Signals and Systems',
    shortTitle: 'Signals & Systems',
    cohort: 'ECE 28',
    instructor: 'Dr. Abeer Tawakol',
    badges: ['Signals', 'ECE 28'],
  },
};

export const SubjectProvider = ({ children }) => {
  const { courseId, selectCourse } = useCourse();

  const activeSubject = courseId === 'signals' ? 'Signals' : 'DSP';

  const setSubject = (subject) => {
    if (subject === 'DSP') {
      selectCourse('dsp');
    } else if (subject === 'Signals') {
      selectCourse('signals');
    }
  };

  const toggleSubject = () => {
    setSubject(activeSubject === 'DSP' ? 'Signals' : 'DSP');
  };

  const activeConfig = SUBJECT_CONFIGS[activeSubject] || SUBJECT_CONFIGS.DSP;

  return (
    <SubjectContext.Provider
      value={{
        activeSubject,
        setSubject,
        toggleSubject,
        isDSP: activeSubject === 'DSP',
        isSignals: activeSubject === 'Signals',
        activeConfig,
      }}
    >
      {children}
    </SubjectContext.Provider>
  );
};

export const useSubject = () => {
  const context = useContext(SubjectContext);
  if (!context) {
    throw new Error('useSubject must be used within a SubjectProvider');
  }
  return context;
};

export default SubjectContext;
