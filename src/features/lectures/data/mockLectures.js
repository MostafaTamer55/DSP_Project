/**
 * Mock data for DSP Lectures
 */
export const MOCK_DSP_LECTURES = [
  {
    id: '1',
    number: 'Lecture 01',
    title: 'Lecture title',
    description: 'Introduction to Discrete-Time Signals & Systems.',
    videoType: 'platform',
    hasVideo: true,
    hasPdf: true,
    videoDuration: '45:20',
    videoUrl: 'https://example.com/video1.mp4',
    externalDriveUrl: null,
  },
  {
    id: '2',
    number: 'Lecture 02',
    title: 'Lecture title',
    description: 'Discrete Fourier Transform (DFT) and Frequency Analysis.',
    videoType: 'platform',
    hasVideo: true,
    hasPdf: true,
    videoDuration: '52:10',
    videoUrl: 'https://example.com/video2.mp4',
    externalDriveUrl: null,
  },
  {
    id: '3',
    number: 'Lecture 03',
    title: 'Lecture title',
    description: 'Fast Fourier Transform (FFT) Algorithms & Implementations.',
    videoType: 'external',
    hasVideo: true,
    hasPdf: true,
    videoDuration: '48:30',
    videoUrl: null,
    externalDriveUrl: 'https://drive.google.com/drive/folders/example-dsp-lecture-03',
  },
  {
    id: '4',
    number: 'Lecture 04',
    title: 'Lecture title',
    description: 'Z-Transform and LTI Systems Analysis Handouts.',
    videoType: 'none',
    hasVideo: false,
    hasPdf: true,
    videoDuration: null,
    videoUrl: null,
    externalDriveUrl: null,
  },
  {
    id: '5',
    number: 'Lecture 05',
    title: 'Lecture title',
    description: 'Digital Filter Design (FIR Filters - Windowing Method).',
    videoType: 'external',
    hasVideo: true,
    hasPdf: true,
    videoDuration: '55:15',
    videoUrl: null,
    externalDriveUrl: 'https://drive.google.com/drive/folders/example-dsp-lecture-05',
  },
  {
    id: '6',
    number: 'Lecture 06',
    title: 'Lecture title',
    description: 'IIR Digital Filter Design (Bilinear Transformation).',
    videoType: 'none',
    hasVideo: false,
    hasPdf: true,
    videoDuration: null,
    videoUrl: null,
    externalDriveUrl: null,
  },
  {
    id: '7',
    number: 'Lecture 07',
    title: 'Lecture title',
    description: 'Filter Structures and Finite Word Length Effects.',
    videoType: 'platform',
    hasVideo: true,
    hasPdf: true,
    videoDuration: '42:18',
    videoUrl: 'https://example.com/video7.mp4',
    externalDriveUrl: null,
  },
  {
    id: '8',
    number: 'Lecture 08',
    title: 'Lecture title',
    description: 'Multirate DSP, Decimation and Interpolation Applications.',
    videoType: 'external',
    hasVideo: true,
    hasPdf: true,
    videoDuration: '49:00',
    videoUrl: null,
    externalDriveUrl: 'https://drive.google.com/drive/folders/example-dsp-lecture-08',
  },
];

/**
 * Mock data for Signals and Systems Lectures
 * BACKEND TEAM NOTE:
 * When connecting real backend, replace this mock data with backend API data:
 * e.g. api.get('/lectures?course=signals')
 */
export const MOCK_SIGNALS_LECTURES = [
  {
    id: 's1',
    number: 'Lecture 01',
    title: 'Lecture title',
    description: 'Introduction to Continuous and Discrete-Time Signals & Classifications.',
    videoType: 'platform',
    hasVideo: true,
    hasPdf: true,
    videoDuration: '48:10',
    videoUrl: 'https://example.com/signals1.mp4',
    externalDriveUrl: null,
  },
  {
    id: 's2',
    number: 'Lecture 02',
    title: 'Lecture title',
    description: 'Linear Time-Invariant (LTI) Systems and Convolution Integral.',
    videoType: 'platform',
    hasVideo: true,
    hasPdf: true,
    videoDuration: '50:40',
    videoUrl: 'https://example.com/signals2.mp4',
    externalDriveUrl: null,
  },
  {
    id: 's3',
    number: 'Lecture 03',
    title: 'Lecture title',
    description: 'Continuous-Time Fourier Series (CTFS) Representation of Periodic Signals.',
    videoType: 'external',
    hasVideo: true,
    hasPdf: true,
    videoDuration: '44:20',
    videoUrl: null,
    externalDriveUrl: 'https://drive.google.com/drive/folders/example-signals-lecture-03',
  },
  {
    id: 's4',
    number: 'Lecture 04',
    title: 'Lecture title',
    description: 'Continuous-Time Fourier Transform (CTFT) Properties & Applications.',
    videoType: 'none',
    hasVideo: false,
    hasPdf: true,
    videoDuration: null,
    videoUrl: null,
    externalDriveUrl: null,
  },
  {
    id: 's5',
    number: 'Lecture 05',
    title: 'Lecture title',
    description: 'Sampling Theorem, Nyquist Criteria, and Reconstruction of Signals.',
    videoType: 'external',
    hasVideo: true,
    hasPdf: true,
    videoDuration: '53:15',
    videoUrl: null,
    externalDriveUrl: 'https://drive.google.com/drive/folders/example-signals-lecture-05',
  },
  {
    id: 's6',
    number: 'Lecture 06',
    title: 'Lecture title',
    description: 'The Laplace Transform and Region of Convergence (ROC).',
    videoType: 'platform',
    hasVideo: true,
    hasPdf: true,
    videoDuration: '47:30',
    videoUrl: 'https://example.com/signals6.mp4',
    externalDriveUrl: null,
  },
  {
    id: 's7',
    number: 'Lecture 07',
    title: 'Lecture title',
    description: 'Transfer Function, Poles, Zeros, and System Stability Analysis.',
    videoType: 'none',
    hasVideo: false,
    hasPdf: true,
    videoDuration: null,
    videoUrl: null,
    externalDriveUrl: null,
  },
  {
    id: 's8',
    number: 'Lecture 08',
    title: 'Lecture title',
    description: 'Frequency Response and Bode Plots for Continuous-Time Systems.',
    videoType: 'external',
    hasVideo: true,
    hasPdf: true,
    videoDuration: '51:00',
    videoUrl: null,
    externalDriveUrl: 'https://drive.google.com/drive/folders/example-signals-lecture-08',
  },
];

// Default backward-compatible export
export const MOCK_LECTURES = MOCK_DSP_LECTURES;

/**
 * Get lectures according to selected course (DSP or Signals)
 */
export const getLecturesByCourse = (courseId = 'signals') => {
  return courseId === 'signals' ? MOCK_SIGNALS_LECTURES : MOCK_DSP_LECTURES;
};

/**
 * Helper to fetch a lecture by ID with fallback
 */
export const getLectureById = (id, courseId = 'signals') => {
  const dataset = getLecturesByCourse(courseId);
  const found = dataset.find((lec) => lec.id === String(id)) || MOCK_DSP_LECTURES.find((lec) => lec.id === String(id));
  if (found) return found;

  const num = parseInt(id, 10) || 1;
  return {
    id: String(id),
    number: `Lecture ${num.toString().padStart(2, '0')}`,
    title: 'Lecture title',
    description: 'Optional lecture description appears here.',
    videoType: num % 2 === 1 ? 'external' : 'platform',
    hasVideo: true,
    hasPdf: true,
    videoDuration: '45:00',
    videoUrl: num % 2 === 0 ? 'https://example.com/video.mp4' : null,
    externalDriveUrl: 'https://drive.google.com/drive/folders/example',
  };
};
