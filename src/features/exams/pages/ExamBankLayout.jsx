import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

// Shared page shell: soft lime/sky gradient + breadcrumb + title (matches Figma frames)
export const ExamBankLayout = ({ crumbs = [], title, subtitle, action, children }) => (
  <div className="min-h-full space-y-6 rounded-3xl bg-[radial-gradient(ellipse_at_top_left,_rgba(225,247,184,0.48),_transparent_42%),radial-gradient(ellipse_at_top_right,_rgba(210,237,245,0.65),_transparent_45%)] p-4 sm:p-7">
    <header className="flex flex-wrap items-end justify-between gap-3">
      <div className="space-y-1">
        {crumbs.length > 0 && (
          <nav className="flex items-center gap-1 text-[11px] text-slate-500">
            {crumbs.map((c, i) => (
              <React.Fragment key={c.label}>
                {i > 0 && <ChevronRight size={11} />}
                {c.to ? <Link to={c.to} className="hover:text-slate-800">{c.label}</Link> : <span className="font-semibold text-slate-700">{c.label}</span>}
              </React.Fragment>
            ))}
          </nav>
        )}
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{title}</h1>
        {subtitle && <p className="max-w-2xl text-sm text-slate-500">{subtitle}</p>}
      </div>
      {action}
    </header>
    {children}
  </div>
);

export const PdfRow = ({ name, meta, pages, to, first }) => (
  <div className={`flex items-center justify-between gap-3 px-4 py-3 ${first ? '' : 'border-t border-slate-100'}`}>
    <div className="flex min-w-0 items-center gap-3">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-lime-50 text-lime-800 text-[10px] font-bold">PDF</span>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-slate-800">{name}</p>
        {meta && <p className="text-[11px] text-slate-500">{meta}</p>}
      </div>
    </div>
    <div className="flex shrink-0 items-center gap-4">
      <span className="hidden text-[11px] text-slate-500 sm:inline">{pages} pages</span>
      <Link to={to} className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50">Preview</Link>
    </div>
  </div>
);
