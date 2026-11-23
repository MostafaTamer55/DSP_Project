import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, BookOpen, CalendarDays, Sparkles } from 'lucide-react';
import { ExamBankLayout } from './ExamBankLayout';

export const ExamBankPage = () => (
  <ExamBankLayout title="Exam Bank" subtitle="Practice by lecture or review previous exams, all in one place.">
    <section className="grid gap-4 md:grid-cols-2">
      <Link to="/exam-bank/questions/by-lecture" className="group">
        <div className="relative flex min-h-44 flex-col justify-between overflow-hidden rounded-2xl border border-slate-800 bg-[#153c42] p-5 text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5">
          <div className="flex items-start justify-between">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/10 text-lime-200"><BookOpen size={18} /></span>
            <span className="grid h-7 w-7 place-items-center rounded-full bg-lime-300 text-slate-900"><ArrowUpRight size={15} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></span>
          </div>
          <div>
            <h2 className="text-lg font-bold">Questions by Lecture</h2>
            <p className="mt-1 text-xs text-slate-300">Question files grouped by lecture, ready to preview as PDF.</p>
            <div className="mt-3 flex gap-2">
              <span className="rounded-full border border-white/20 px-3 py-1 text-[10px] font-semibold text-white/90">By lecture</span>
              <span className="rounded-full border border-white/20 px-3 py-1 text-[10px] font-semibold text-white/90">PDF files</span>
            </div>
          </div>
        </div>
      </Link>

      <Link to="/exam-bank/past-exams/default" className="group">
        <div className="flex min-h-44 flex-col justify-between rounded-2xl border border-white bg-white/85 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-start justify-between">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-lime-100 text-lime-800"><CalendarDays size={18} /></span>
            <ArrowUpRight size={16} className="text-slate-400 transition group-hover:text-slate-700" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Past Exams</h2>
            <p className="mt-1 text-xs text-slate-500">Previous midterm and final papers as PDF files.</p>
            <div className="mt-3 flex gap-2">
              <span className="rounded-full border border-slate-200 px-3 py-1 text-[10px] font-semibold text-slate-600">Midterms</span>
              <span className="rounded-full border border-slate-200 px-3 py-1 text-[10px] font-semibold text-slate-600">Finals</span>
            </div>
          </div>
        </div>
      </Link>
    </section>

    <div className="flex items-center gap-3 rounded-xl border border-sky-100 bg-sky-50/80 px-4 py-3 text-xs text-slate-600">
      <Sparkles size={16} className="shrink-0 text-sky-700" />
      <span><strong className="text-slate-800">Study tip:</strong> Start with questions by lecture, then use a past exam to check your overall progress.</span>
    </div>
  </ExamBankLayout>
);

export default ExamBankPage;
