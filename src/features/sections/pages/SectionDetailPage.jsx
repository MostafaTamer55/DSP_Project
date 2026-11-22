import React, { useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import {
  FileText,
  Eye,
  Download,
  ExternalLink,
  Play,
  Video,
  X,
} from 'lucide-react';
import VideoPlayerFrame from '../components/VideoPlayerFrame';

/**
 * SectionDetailPage Component
 * Supports both Figma / UI design states (100% Frontend, zero backend):
 *
 * Case 1: Section with BOTH Video and PDF (e.g. Section 01, 03, 04)
 * - Two cards side by side:
 *   - Left: White Section PDF card with Preview & Download buttons
 *   - Right: Dark teal "Watch the section video" card with "Open video ↗" button
 *
 * Case 2: Section with PDF ONLY, no video (e.g. Section 02, 05, 06)
 * - Single full-width white card with FileText icon, Section PDF label, Section title,
 *   and Preview & Download buttons spanning the full container width.
 */
export const SectionDetailPage = () => {
  const { sectionId = '1' } = useParams();
  const [searchParams] = useSearchParams();
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);

  // Format section number (e.g. "Section 01", "Section 02")
  const secNum = parseInt(sectionId, 10) || 1;
  const sectionNumberStr = `Section ${secNum.toString().padStart(2, '0')}`;

  // Check if section has video:
  // In the mock curriculum:
  // Sections 01, 03, 04 have video (Case 1)
  // Sections 02, 05, 06 are PDF only (Case 2)
  // Can also be overridden with query ?video=false or ?video=true for testing
  const videoQuery = searchParams.get('video');
  const hasVideo =
    videoQuery === 'false'
      ? false
      : videoQuery === 'true'
      ? true
      : secNum !== 2 && secNum !== 5 && secNum !== 6;

  // Mock section data (pure frontend)
  const section = {
    id: sectionId,
    number: sectionNumberStr,
    title: 'Section title',
    description: 'Optional section description appears here.',
    hasPdf: true,
    hasVideo,
    videoUrl: 'https://drive.google.com/drive/folders/example-dsp-section',
    pdfUrl: '#',
  };

  const handleDownload = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 sm:space-y-7 pb-12 select-none">
      {/* 1. BREADCRUMBS & PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pt-1">
        <div>
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs font-medium text-[#6B8089] mb-2">
            <Link
              to="/sections"
              className="hover:text-[#15313C] transition-colors"
            >
              Sections
            </Link>
            <span>/</span>
            <span className="font-semibold text-[#15313C]">
              {section.number}
            </span>
          </nav>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#15313C] tracking-tight">
            {section.title}
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-[#6B8089] mt-1.5 leading-relaxed">
            {section.description}
          </p>
        </div>

        {/* Top Right Sample Placeholders Badge */}
        <div className="inline-flex items-center gap-1.5 text-xs text-[#6B8089] font-medium self-start sm:self-center px-3.5 py-1 rounded-full bg-[#EAF0F2]/60 border border-[#D7E0E3]/70">
          <span className="w-1.5 h-1.5 rounded-full bg-[#15313C]" />
          <span>Sample placeholders</span>
        </div>
      </div>

      {/* 2. MAIN CONTENT AREA: CASE 1 (VIDEO + PDF) vs CASE 2 (PDF ONLY) */}
      <div className="pt-2">
        {hasVideo ? (
          /* ========================================================= */
          /* CASE 1: SECTION HAS BOTH VIDEO AND PDF (2-COLUMN CARDS)   */
          /* ========================================================= */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {/* Card 1: Section PDF (White Card) */}
            <div className="bg-white rounded-[26px] p-7 sm:p-8 border border-[#EAF0F2] shadow-[0_10px_30px_rgba(21,49,60,0.035)] flex flex-col justify-between min-h-[250px] sm:min-h-[270px]">
              {/* Top: Pale Lime Box with FileText Icon */}
              <div className="w-11 h-11 rounded-xl bg-[#F1FBD2] text-[#3D6317] flex items-center justify-center">
                <FileText className="w-5 h-5 stroke-[1.75]" />
              </div>

              {/* Middle: Labels & Title */}
              <div className="my-5">
                <span className="block text-xs font-semibold text-[#6B8089] mb-1">
                  Section PDF
                </span>
                <h3 className="text-xl sm:text-[22px] font-bold text-[#15313C] tracking-tight mb-2.5">
                  {section.title}
                </h3>
                <span className="inline-block px-3 py-0.5 rounded-full text-xs font-medium bg-[#F5F8F9] border border-[#D7E0E3] text-[#3A5560]">
                  PDF
                </span>
              </div>

              {/* Bottom Actions: Preview & Download Buttons */}
              <div className="flex items-center gap-3 flex-wrap">
                <Link
                  to={`/sections/${section.id}/pdf`}
                  className="bg-[#15313C] hover:bg-[#1f424f] text-white text-xs sm:text-[13px] font-semibold py-2.5 px-5 rounded-full inline-flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  <span>Preview</span>
                </Link>

                <button
                  type="button"
                  onClick={handleDownload}
                  className="bg-white hover:bg-slate-50 text-[#15313C] border border-[#D7E0E3] text-xs sm:text-[13px] font-semibold py-2.5 px-5 rounded-full inline-flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>{downloadSuccess ? 'Downloaded!' : 'Download'}</span>
                </button>
              </div>
            </div>

            {/* Card 2: Watch the Section Video (Dark Teal Card) */}
            <div className="bg-[#183742] rounded-[26px] p-7 sm:p-8 text-white shadow-[0_15px_40px_rgba(21,49,60,0.12)] flex flex-col justify-between min-h-[250px] sm:min-h-[270px]">
              {/* Top: Icon in Rounded Square & Video Link Pill */}
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-xl bg-white/10 text-[#CCEB74] flex items-center justify-center">
                  <ExternalLink className="w-5 h-5 stroke-[2]" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 border border-white/10 text-white/95">
                  Video link
                </span>
              </div>

              {/* Middle: Video Link Label, Heading & Subtitle */}
              <div className="my-5">
                <span className="block text-xs font-semibold text-[#CCEB74] mb-1">
                  Video link
                </span>
                <h3 className="text-xl sm:text-[22px] font-bold text-white tracking-tight mb-1.5">
                  Watch the section video
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Watch the practical section video player.
                </p>
              </div>

              {/* Bottom: Open Video Button (Lime Pill) & Full Page Link */}
              <div className="flex items-center gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={() => setShowVideoModal(true)}
                  className="bg-[#CCEB74] hover:bg-[#bce64f] active:scale-95 text-[#15313C] font-semibold text-xs sm:text-[13px] py-2.5 px-5 rounded-full inline-flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                  title="Open video frame player"
                >
                  <Play className="w-3.5 h-3.5 fill-[#15313C] stroke-none" />
                  <span>Open video</span>
                </button>

                <Link
                  to={`/sections/${section.id}/video`}
                  className="bg-white/10 hover:bg-white/20 text-white text-xs sm:text-[13px] font-medium py-2.5 px-4 rounded-full inline-flex items-center gap-1.5 border border-white/15 transition-colors cursor-pointer"
                  title="Open dedicated video page"
                >
                  <span>Full page</span>
                  <ExternalLink className="w-3.5 h-3.5 stroke-[2]" />
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================= */
          /* CASE 2: SECTION HAS PDF ONLY (SINGLE FULL-WIDTH CARD)     */
          /* Matches the exact second screenshot provided              */
          /* ========================================================= */
          <div className="w-full bg-white rounded-[26px] p-7 sm:p-9 border border-[#EAF0F2] shadow-[0_10px_30px_rgba(21,49,60,0.035)] flex flex-col justify-between min-h-[220px] sm:min-h-[250px]">
            <div>
              {/* Top: Pale Lime Box with FileText Icon */}
              <div className="w-11 h-11 rounded-xl bg-[#F1FBD2] text-[#3D6317] flex items-center justify-center mb-6">
                <FileText className="w-5 h-5 stroke-[1.75]" />
              </div>

              {/* Middle: Label & Section Title */}
              <div className="mb-6">
                <span className="block text-xs font-semibold text-[#6B8089] mb-1.5">
                  Section PDF
                </span>
                <h3 className="text-xl sm:text-[24px] font-bold text-[#15313C] tracking-tight">
                  {section.title}
                </h3>
              </div>
            </div>

            {/* Bottom Actions: Preview & Download Buttons */}
            <div className="flex items-center gap-3.5 flex-wrap">
              {/* Preview Button (Dark Pill) navigates to PDF viewer page */}
              <Link
                to={`/sections/${section.id}/pdf`}
                className="bg-[#15313C] hover:bg-[#1f424f] text-white text-xs sm:text-[13px] font-semibold py-2.5 px-6 rounded-full inline-flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                <span>Preview</span>
              </Link>

              {/* Download Button (White Outline Pill) */}
              <button
                type="button"
                onClick={handleDownload}
                className="bg-white hover:bg-slate-50 text-[#15313C] border border-[#D7E0E3] text-xs sm:text-[13px] font-semibold py-2.5 px-6 rounded-full inline-flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{downloadSuccess ? 'Downloaded!' : 'Download'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. INTERACTIVE VIDEO PLAYER FRAME MODAL */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#0F242C] rounded-[24px] sm:rounded-[32px] max-w-4xl w-full border border-white/15 shadow-2xl overflow-hidden text-white flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-[#CCEB74]">
                  <Video className="w-4 h-4 stroke-[2]" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-white">
                    {section.number} · Section Video Session
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    Interactive Video Frame
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  to={`/sections/${section.id}/video`}
                  className="hidden sm:inline-flex items-center gap-1.5 text-xs text-[#CCEB74] hover:text-[#bfee50] font-semibold px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 transition-colors"
                >
                  <span>Full page view</span>
                  <ExternalLink className="w-3 h-3 stroke-[2.25]" />
                </Link>
                <button
                  type="button"
                  onClick={() => setShowVideoModal(false)}
                  className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Video Player Frame */}
            <div className="p-3 sm:p-5 bg-black/40">
              <VideoPlayerFrame
                title={`${section.number} - Practical Section Video`}
                autoPlay={true}
              />
            </div>

            {/* Modal Footer */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 border-t border-white/10 text-xs">
              <div className="flex items-center gap-2 text-slate-300 text-[11px]">
                <span className="w-2 h-2 rounded-full bg-[#CCEB74] animate-pulse" />
                <span>Frontend video frame active · Ready for backend video source</span>
              </div>

              <div className="flex items-center gap-2.5 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => setShowVideoModal(false)}
                  className="px-5 py-2 rounded-full font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  Close
                </button>
                <Link
                  to={`/sections/${section.id}/video`}
                  className="bg-[#CCEB74] hover:bg-[#bfee50] text-[#15313C] px-5 py-2 rounded-full font-bold inline-flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <span>Open Full Page</span>
                  <ExternalLink className="w-3.5 h-3.5 stroke-[2.25]" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionDetailPage;
