import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  Download,
  ExternalLink,
} from 'lucide-react';

import { getLectureById } from '../data/mockLectures';

/**
 * Dedicated PDF Viewer Page with Real Google Drive Embed
 */
export const LecturePdfPage = () => {
  const { lectureId = '1' } = useParams();
  const currentId = parseInt(lectureId, 10) || 1;
  const lecture = getLectureById(currentId);

  const [zoomLevel, setZoomLevel] = useState(100);

  const currentNumberStr = lecture.number || `Lecture ${currentId.toString().padStart(2, '0')}`;

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 10, 150));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 10, 70));
  };

  const downloadUrl = lecture.pdfDriveId
    ? `https://drive.google.com/uc?export=download&id=${lecture.pdfDriveId}`
    : lecture.pdfUrl || '#';

  const previewUrl = lecture.pdfDriveId
    ? `https://drive.google.com/file/d/${lecture.pdfDriveId}/preview`
    : lecture.pdfEmbedUrl || null;

  return (
    <div className="space-y-5 pb-16">
      {/* 1. BREADCRUMBS */}
      <nav className="flex items-center gap-2 text-xs font-medium text-[#6B8089] pt-1">
        <Link to="/lectures" className="hover:text-[#15313C] transition-colors">
          Lectures
        </Link>
        <span>/</span>
        <Link to={`/lectures/${currentId}`} className="hover:text-[#15313C] transition-colors">
          {currentNumberStr}
        </Link>
        <span>/</span>
        <span className="font-bold text-[#15313C]">PDF</span>
      </nav>

      {/* 2. FLOATING PDF TOOLBAR */}
      <div className="bg-white/95 backdrop-blur-md rounded-full border border-[#EAF0F2] shadow-[0_8px_30px_rgba(21,49,60,0.04)] py-2.5 px-4 sm:px-6 flex flex-wrap items-center justify-between gap-3 sm:gap-4">
        {/* Left: Back to Lecture Button */}
        <Link
          to={`/lectures/${currentId}`}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#D7E0E3] bg-white hover:bg-slate-50 text-xs font-bold text-[#15313C] transition-colors shadow-2xs shrink-0"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2]" />
          <span>Back to Lecture</span>
        </Link>

        {/* Center-Left: Lecture Title & PDF Pill Badge */}
        <div className="flex flex-col justify-center min-w-0 mr-auto sm:ml-2">
          <div className="flex items-center gap-2">
            <h2 className="text-xs sm:text-sm font-bold text-[#15313C] truncate">
              {currentNumberStr} · {lecture.title}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold bg-[#F5F8F9] border border-[#D7E0E3] text-[#15313C]">
              PDF
            </span>
          </div>
          <p className="text-[11px] text-[#6B8089]">{lecture.pdfFileName || 'Lecture PDF'}</p>
        </div>

        {/* Right Controls: Zoom, Open in Drive, and Download */}
        <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
          {/* Zoom Controls */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleZoomOut}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[#D7E0E3] text-[#15313C] hover:bg-slate-50 flex items-center justify-center text-xs transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
            <span className="text-xs font-semibold text-[#15313C] px-1 min-w-[38px] text-center">
              {zoomLevel}%
            </span>
            <button
              type="button"
              onClick={handleZoomIn}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[#D7E0E3] text-[#15313C] hover:bg-slate-50 flex items-center justify-center text-xs transition-colors cursor-pointer"
              title="Zoom In"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>

          {/* Open in Drive Button */}
          {lecture.pdfDriveId && (
            <a
              href={`https://drive.google.com/file/d/${lecture.pdfDriveId}/view?usp=sharing`}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-[#D7E0E3] hover:bg-slate-50 text-[#15313C] font-semibold text-xs py-2 px-3.5 sm:px-4 rounded-full inline-flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
              title="Open in Google Drive"
            >
              <ExternalLink className="w-3.5 h-3.5 stroke-[2]" />
              <span className="hidden sm:inline">Drive</span>
            </a>
          )}

          {/* Download Button */}
          <a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#CCEB74] hover:bg-[#bfee50] active:scale-95 text-[#15313C] font-bold text-xs py-2 px-4 sm:px-5 rounded-full inline-flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer ml-1"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.25]" />
            <span>Download</span>
          </a>
        </div>
      </div>

      {/* 3. PDF VIEWER MAIN DISPLAY AREA */}
      <div className="w-full bg-white/70 backdrop-blur-sm rounded-[32px] sm:rounded-[36px] border border-[#EAF0F2] shadow-[0_15px_45px_rgba(21,49,60,0.035)] p-4 sm:p-6 min-h-[760px] relative overflow-hidden flex flex-col items-center">
        {/* Top-Left Badge */}
        <div className="self-start mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DCE8ED]/70 border border-[#D0DFE5] text-[11px] font-medium text-[#2F5968] shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2F5968]" />
          <span>{lecture.pdfFileName || 'PDF Viewer'}</span>
        </div>

        {/* Embedded PDF Viewer */}
        {previewUrl ? (
          <div
            className="w-full h-[760px] rounded-2xl overflow-hidden border border-[#EAF0F2] shadow-sm bg-white transition-transform duration-200"
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
          >
            <iframe
              src={previewUrl}
              title={`${currentNumberStr} PDF`}
              className="w-full h-full border-none"
              allow="autoplay"
            />
          </div>
        ) : (
          /* Fallback Skeleton if no PDF url */
          <div
            className="w-full max-w-[580px] sm:max-w-[620px] bg-white rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.05)] border border-[#EAF0F2] p-8 sm:p-14 min-h-[720px] text-center flex flex-col justify-center items-center"
          >
            <p className="text-sm font-semibold text-[#15313C] mb-2">No PDF available for this lecture</p>
            <p className="text-xs text-[#6B8089]">Please check back later or contact your instructor.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LecturePdfPage;
