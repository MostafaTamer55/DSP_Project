import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { CalendarX } from 'lucide-react';
import { useCourse } from '../../courses/context/CourseContext';
import { ExamBankLayout, PdfRow } from './ExamBankLayout';
import { pastExamsByCourse } from './examBankData';

// Routes: /exam-bank/past-exams/default   and   /exam-bank/past-exams/empty
export const PastExamsPage = () => {
  const { courseId } = useCourse();
  const { state } = useParams();
  const exams = state === 'empty' ? [] : pastExamsByCourse[courseId === 'signals' ? 'signals' : 'dsp'];

  return (
    <ExamBankLayout
      crumbs={[{ label: 'Exam Bank', to: '/exam-bank' }, { label: 'Past Exams' }]}
      title="Past Exams"
      subtitle="Previous exam papers as PDF files."
    >
      {exams.length ? (
        <div className="overflow-hidden rounded-2xl border border-white bg-white/85 shadow-sm">
          {exams.map((e, i) => (
            <PdfRow key={e.id} first={i === 0} name={e.name} meta={e.meta} pages={e.pages}
              to={`/exam-bank/pdf-viewer/default/${e.id}`} />
          ))}
        </div>
      ) : (
        <div className="mx-auto flex max-w-xl flex-col items-center rounded-2xl border border-white bg-white/85 px-6 py-14 text-center shadow-sm">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-lime-100 text-lime-800"><CalendarX size={18} /></span>
          <p className="mt-3 text-sm font-bold text-slate-900">No past exams available yet</p>
          <p className="mt-1 max-w-xs text-xs text-slate-500">Past papers will appear here once your instructor uploads them.</p>
          <Link to="/exam-bank" className="mt-5 rounded-full bg-slate-800 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-700">Back to Exam Bank</Link>
        </div>
      )}
    </ExamBankLayout>
  );
};

export default PastExamsPage;
