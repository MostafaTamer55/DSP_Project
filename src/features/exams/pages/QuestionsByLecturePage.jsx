import React from 'react';
import { FileX } from 'lucide-react';
import { useCourse } from '../../courses/context/CourseContext';
import { ExamBankLayout, PdfRow } from './ExamBankLayout';
import { lecturesByCourse } from './examBankData';

export const QuestionsByLecturePage = () => {
  const { courseId } = useCourse();
  const lectures = lecturesByCourse[courseId === 'signals' ? 'signals' : 'dsp'];

  return (
    <ExamBankLayout
      crumbs={[{ label: 'Exam Bank', to: '/exam-bank' }, { label: 'Questions by Lecture' }]}
      title="Questions by Lecture"
      subtitle="Question files grouped by lecture."
    >
      <div className="space-y-6">
        {lectures.map((lec) => (
          <section key={lec.id} className="space-y-2">
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-2">
                <h2 className="text-base font-bold text-slate-900">{lec.title}</h2>
                <span className="text-[11px] text-slate-500">{lec.topic}</span>
              </div>
              <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${lec.files.length ? 'bg-slate-100 text-slate-600' : 'bg-amber-100 text-amber-800'}`}>
                {lec.files.length ? `${lec.files.length} files` : 'No files yet'}
              </span>
            </div>
            <div className="overflow-hidden rounded-2xl border border-white bg-white/85 shadow-sm">
              {lec.files.length ? lec.files.map((f, i) => (
                <PdfRow key={f.id} first={i === 0} name={f.name} meta={lec.title} pages={f.pages}
                  to={`/exam-bank/pdf-viewer/question-file/${f.id}`} />
              )) : (
                <div className="flex items-center gap-2 px-4 py-4 text-xs text-slate-500">
                  <FileX size={15} className="text-slate-400" />
                  No question files have been added for this lecture yet.
                </div>
              )}
            </div>
          </section>
        ))}
      </div>
    </ExamBankLayout>
  );
};

export default QuestionsByLecturePage;
