// Mock data – replace with API calls later.
export const lecturesByCourse = {
  dsp: [
    { id: 'l1', title: 'Lecture 01', topic: 'Discrete-time signals', files: [
      { id: 'q-dsp-1a', name: 'Question file 01', pages: 4 },
      { id: 'q-dsp-1b', name: 'Question file 02', pages: 6 } ] },
    { id: 'l2', title: 'Lecture 02', topic: 'Z-transform & ROC', files: [
      { id: 'q-dsp-2a', name: 'Question file 01', pages: 5 } ] },
    { id: 'l3', title: 'Lecture 03', topic: 'FFT', files: [] },
    { id: 'l4', title: 'Lecture 04', topic: 'FIR & IIR filters', files: [
      { id: 'q-dsp-4a', name: 'Question file 01', pages: 3 },
      { id: 'q-dsp-4b', name: 'Question file 02', pages: 7 } ] },
  ],
  signals: [
    { id: 'l1', title: 'Lecture 01', topic: 'Signal basics', files: [
      { id: 'q-sig-1a', name: 'Question file 01', pages: 4 },
      { id: 'q-sig-1b', name: 'Question file 02', pages: 5 } ] },
    { id: 'l2', title: 'Lecture 02', topic: 'Convolution & LTI', files: [
      { id: 'q-sig-2a', name: 'Question file 01', pages: 6 } ] },
    { id: 'l3', title: 'Lecture 03', topic: 'Fourier series', files: [] },
    { id: 'l4', title: 'Lecture 04', topic: 'Laplace transform', files: [
      { id: 'q-sig-4a', name: 'Question file 01', pages: 3 },
      { id: 'q-sig-4b', name: 'Question file 02', pages: 8 } ] },
  ],
};

export const pastExamsByCourse = {
  dsp: [
    { id: 'p-dsp-1', name: 'Exam paper 01', meta: 'Final · 2024', pages: 8 },
    { id: 'p-dsp-2', name: 'Exam paper 02', meta: 'Midterm · 2024', pages: 5 },
    { id: 'p-dsp-3', name: 'Exam paper 03', meta: 'Final · 2023', pages: 8 },
    { id: 'p-dsp-4', name: 'Exam paper 04', meta: 'Midterm · 2023', pages: 4 },
    { id: 'p-dsp-5', name: 'Exam paper 05', meta: 'Final · 2022', pages: 7 },
    { id: 'p-dsp-6', name: 'Exam paper 06', meta: 'Midterm · 2022', pages: 4 },
  ],
  signals: [
    { id: 'p-sig-1', name: 'Exam paper 01', meta: 'Final · 2024', pages: 7 },
    { id: 'p-sig-2', name: 'Exam paper 02', meta: 'Midterm · 2024', pages: 5 },
    { id: 'p-sig-3', name: 'Exam paper 03', meta: 'Final · 2023', pages: 8 },
    { id: 'p-sig-4', name: 'Exam paper 04', meta: 'Midterm · 2023', pages: 4 },
    { id: 'p-sig-5', name: 'Exam paper 05', meta: 'Final · 2022', pages: 6 },
    { id: 'p-sig-6', name: 'Exam paper 06', meta: 'Midterm · 2022', pages: 4 },
  ],
};

// Look up a file by id (used by the PDF viewer)
export const findFile = (courseId, id) => {
  const key = courseId === 'signals' ? 'signals' : 'dsp';
  const q = lecturesByCourse[key].flatMap((l) => l.files.map((f) => ({ ...f, kind: 'question', parent: l.title })))
    .find((f) => f.id === id);
  if (q) return q;
  const p = pastExamsByCourse[key].find((f) => f.id === id);
  return p ? { ...p, kind: 'exam', parent: 'Past exams' } : null;
};
