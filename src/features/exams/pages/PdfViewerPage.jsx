import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Download, Minus, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCourse } from '../../courses/context/CourseContext';
import { ExamBankLayout } from './ExamBankLayout';
import { findFile } from './examBankData';

// Routes: /exam-bank/pdf-viewer/default/:fileId  (past exam)
//         /exam-bank/pdf-viewer/question-file/:fileId
export const PdfViewerPage = () => {
  const { courseId } = useCourse();
  const { variant, fileId } = useParams();
  const file = findFile(courseId, fileId) || { name: 'Document', pages: 1, kind: variant === 'question-file' ? 'question' : 'exam', parent: '' };
  const [page, setPage] = useState(1);
  const [zoom, setZoom] = useState(100);

  const isQuestion = file.kind === 'question';
  const backTo = isQuestion ? '/exam-bank/questions/by-lecture' : '/exam-bank/past-exams/default';
  const backLabel = isQuestion ? 'Back to questions' : 'Back to past exams';

  return (
    <ExamBankLayout
      crumbs={[
        { label: 'Exam Bank', to: '/exam-bank' },
        { label: isQuestion ? 'Questions by Lecture' : 'Past Exams', to: backTo },
        { label: file.name },
      ]}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white bg-white/90 px-4 py-2.5 shadow-sm">
        <Link to={backTo} className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"><ArrowLeft size={14} />{backLabel}</Link>
        <div className="text-center">
          <p className="text-sm font-bold text-slate-900">{file.name}</p>
          <p className="text-[11px] text-slate-500">PDF{file.parent ? ` · ${file.parent}` : ''}</p>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-1">
            <button aria-label="Previous page" disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="rounded p-1 hover:bg-slate-100 disabled:opacity-30"><ChevronLeft size={14} /></button>
            <span>{page} / {file.pages}</span>
            <button aria-label="Next page" disabled={page === file.pages} onClick={() => setPage((p) => p + 1)} className="rounded p-1 hover:bg-slate-100 disabled:opacity-30"><ChevronRight size={14} /></button>
          </div>
          <div className="flex items-center gap-1">
            <button aria-label="Zoom out" onClick={() => setZoom((z) => Math.max(50, z - 10))} className="rounded p-1 hover:bg-slate-100"><Minus size={14} /></button>
            <span className="w-9 text-center">{zoom}%</span>
            <button aria-label="Zoom in" onClick={() => setZoom((z) => Math.min(200, z + 10))} className="rounded p-1 hover:bg-slate-100"><Plus size={14} /></button>
          </div>
          <button onClick={() => { const id = file.driveId || file.id; window.open(`https://drive.google.com/uc?export=download&id=${id}`, "_blank"); }} className="inline-flex items-center gap-1.5 rounded-full bg-lime-400 px-3.5 py-1.5 font-semibold text-slate-900 hover:bg-lime-300 cursor-pointer"><Download size={13} />Download</button>
        </div>
      </div>

      <div className="overflow-auto rounded-2xl border border-white bg-slate-100/80 p-6 shadow-inner" style={{ minHeight: 520 }}>
        <div className="mx-auto origin-top rounded bg-white p-8 shadow-md transition-[width]" style={{ width: `${(560 * zoom) / 100}px`, maxWidth: 'none' }}>
          {file.driveId ? (
            <iframe
              src={`https://drive.google.com/file/d/${file.driveId}/preview`}
              title={file.name}
              className="w-full h-[680px] rounded-lg border-0 shadow-sm"
              allow="autoplay"
            />
          ) : (
            <div className="space-y-3 py-12 text-center">
              <p className="font-semibold text-slate-800">{file.name}</p>
              <p className="text-xs text-slate-500">Preview will be available soon.</p>
            </div>
          )}
        </div>
      </div>
    </ExamBankLayout>
  );
};

export default PdfViewerPage;
