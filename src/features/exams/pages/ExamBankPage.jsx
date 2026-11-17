import React, { useState } from 'react';
import Card, { CardBody } from '../../../components/common/Card';
import Badge from '../../../components/common/Badge';
import { FileQuestion, Clock, Inbox, Sparkles } from 'lucide-react';

// Left empty as requested until materials are provided
const mockExams = [];

export const ExamBankPage = () => {
  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-brand-50/70 border border-brand-200/60 rounded-xl text-xs text-brand-900">
        <div className="flex items-center gap-2">
          <Badge variant="brand" size="sm">Exam Bank</Badge>
          <span className="font-medium">Assessments, Quizzes & Midterms</span>
        </div>
        <span className="text-brand-700 text-[11px]">Route: <code className="bg-white px-1.5 py-0.5 rounded border border-brand-200">/exams</code></span>
      </div>

      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Exam Bank & Assessments</h2>
        <p className="text-xs text-slate-500 mt-1">Timed quizzes, past midterm assessments, and final exam simulations.</p>
      </div>

      {/* Clean Empty State */}
      <div className="bg-white rounded-[28px] border border-dashed border-[#B5C2C7] p-12 sm:p-16 text-center max-w-xl mx-auto shadow-xs">
        <div className="w-16 h-16 rounded-3xl bg-[#F1FBD2] text-[#3D6317] flex items-center justify-center mx-auto mb-4">
          <FileQuestion className="w-8 h-8 stroke-[1.75]" />
        </div>
        <h3 className="text-lg font-bold text-[#15313C] tracking-tight">
          Exam Bank is Currently Empty
        </h3>
        <p className="text-xs sm:text-[13px] text-[#6B8089] mt-2 leading-relaxed">
          Questions, past midterm exams, and practice quizzes will be uploaded soon. Check back once assessment materials are ready!
        </p>

        <div className="mt-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F5F8F9] border border-[#D7E0E3] text-[11px] font-semibold text-[#15313C]">
          <Sparkles className="w-3.5 h-3.5 text-[#86A820]" />
          <span>Awaiting Course Assessment Materials</span>
        </div>
      </div>
    </div>
  );
};

export default ExamBankPage;
