import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  FileText,
  FolderArchive,
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  ExternalLink,
  Check,
} from 'lucide-react';

import { getLectureById } from '../data/mockLectures';
import { useProgress } from '../../progress/services/progressService';

/**
 * Dedicated Video Page matching:
 * - Case 1: Platform Video Player (or Drive embed)
 * - Case 2: External Google Drive Folder/Link
 */
export const LectureVideoPage = () => {
  const { lectureId = '1' } = useParams();
  const currentId = parseInt(lectureId, 10) || 1;
  const lecture = getLectureById(currentId);

  const [isPlaying, setIsPlaying] = useState(false);

  const { progressData, markLectureWatched, toggleLectureWatched } = useProgress();
  const currentLectureProgress = progressData.lectures?.find(
    (l) => l.id === String(currentId) || l.number?.endsWith(String(currentId))
  );
  const isWatched = currentLectureProgress?.status === 'watched';

  const handleTogglePlay = () => {
    const next = !isPlaying;
    setIsPlaying(next);
    if (next) {
      markLectureWatched(currentId);
    }
  };

  // Current, Previous, and Next lecture calculations
  const currentNumberStr = lecture.number || `Lecture ${currentId.toString().padStart(2, '0')}`;
  const prevId = currentId > 1 ? currentId - 1 : null;
  const nextId = currentId < 8 ? currentId + 1 : null;

  const prevLecture = prevId ? getLectureById(prevId) : null;
  const nextLecture = nextId ? getLectureById(nextId) : null;

  return (
    <div className="space-y-6 sm:space-y-7 pb-12">
      {/* 1. BREADCRUMBS & PAGE HEADER */}
      <div className="pt-1">
        {/* Breadcrumb nav */}
        <nav className="flex items-center gap-2 text-xs font-medium text-[#6B8089] mb-2">
          <Link to="/lectures" className="hover:text-[#15313C] transition-colors">
            Lectures
          </Link>
          <span>/</span>
          <Link to={`/lectures/${currentId}`} className="hover:text-[#15313C] transition-colors">
            {currentNumberStr}
          </Link>
          <span>/</span>
          <span className="font-semibold text-[#15313C]">Video</span>
        </nav>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-[#15313C] tracking-tight">
          {lecture.title}
        </h1>
        <p className="text-xs sm:text-[13px] text-[#6B8089] mt-1.5 leading-relaxed max-w-2xl">
          {lecture.description}
        </p>
      </div>

      {/* 2. MAIN TWO-COLUMN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column (8 cols): Either External Drive Video (Case 2) or Platform Player (Case 1) */}
        {lecture.videoType === 'external' ? (
          /* Case 2: External Link hosted on Drive */
          <div className="lg:col-span-8 bg-[#15313C] rounded-[28px] sm:rounded-[32px] p-7 sm:p-10 shadow-[0_20px_50px_rgba(21,49,60,0.18)] flex flex-col justify-between min-h-[380px] sm:min-h-[440px] relative select-none">
            {/* Top-Left */}
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-[#CCEB74]">
              <ExternalLink className="w-5 h-5 stroke-[2]" />
            </div>

            {/* Bottom Content */}
            <div className="mt-auto pt-16 max-w-lg">
              <span className="text-xs font-semibold text-[#CCEB74] tracking-wide block mb-1">
                Google Drive Video Storage
              </span>
              <h2 className="text-2xl sm:text-[34px] font-bold text-white tracking-tight leading-tight mb-2">
                Watch lecture video on Google Drive
              </h2>
              <p className="text-xs sm:text-[13px] text-slate-300 leading-relaxed mb-6">
                All video recordings, lab recitations, and explanation parts for this lecture are organized in the official course folder.
              </p>

              {/* Open Video Pill Button */}
              <a
                href={lecture.externalDriveUrl || 'https://drive.google.com'}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => markLectureWatched(currentId)}
                className="bg-[#CCEB74] hover:bg-[#bfee50] active:scale-95 text-[#15313C] font-semibold text-xs sm:text-sm py-2.5 px-5 rounded-full inline-flex items-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <span>Open Google Drive Videos</span>
                <ExternalLink className="w-3.5 h-3.5 stroke-[2.25]" />
              </a>
            </div>
          </div>
        ) : (
          /* Case 1: Video Player */
          <div className="lg:col-span-8 bg-[#15313C] rounded-[28px] sm:rounded-[32px] overflow-hidden shadow-[0_20px_50px_rgba(21,49,60,0.18)] flex flex-col justify-between min-h-[380px] sm:min-h-[440px] relative">
            {lecture.videoUrl ? (
              <iframe
                src={lecture.videoUrl}
                title={`${currentNumberStr} Video`}
                className="w-full h-full min-h-[440px] border-none"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            ) : (
              <div className="relative flex-1 flex items-center justify-center p-6">
                <button
                  type="button"
                  onClick={handleTogglePlay}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#CCEB74] hover:bg-[#bfee50] active:scale-95 text-[#15313C] flex items-center justify-center transition-all shadow-[0_10px_35px_rgba(204,235,116,0.4)] cursor-pointer group z-20"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 sm:w-7 sm:h-7 fill-[#15313C] stroke-none" />
                  ) : (
                    <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-[#15313C] stroke-none ml-1 group-hover:scale-110 transition-transform" />
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Right Column (4 cols): Information & Action Sidebar Card */}
        <div className="lg:col-span-4 bg-white rounded-[28px] sm:rounded-[32px] p-6 sm:p-7 border border-[#EAF0F2] shadow-[0_12px_35px_rgba(21,49,60,0.035)] flex flex-col justify-between">
          <div>
            {/* Lecture Meta Header */}
            <div className="mb-6">
              <span className="block text-xs font-semibold text-[#6B8089]">
                {currentNumberStr}
              </span>
              <h2 className="text-xl sm:text-[22px] font-bold text-[#15313C] tracking-tight mt-0.5">
                {lecture.title}
              </h2>

              {/* Pills */}
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <span className="px-3 py-0.5 rounded-full text-xs font-medium bg-[#F5F8F9] border border-[#D7E0E3] text-[#3A5560]">
                  Video
                </span>
                <span className="px-3 py-0.5 rounded-full text-xs font-medium bg-[#F5F8F9] border border-[#D7E0E3] text-[#3A5560]">
                  PDF
                </span>
                <button
                  type="button"
                  onClick={() => toggleLectureWatched(currentId)}
                  className={`px-3 py-0.5 rounded-full text-xs font-semibold inline-flex items-center gap-1 cursor-pointer transition-colors ${
                    isWatched
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                  }`}
                  title="Click to toggle watched completion status"
                >
                  {isWatched ? (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Watched</span>
                    </>
                  ) : (
                    <span>Mark as Watched</span>
                  )}
                </button>
              </div>
            </div>

            {/* Action Item Rows */}
            <div className="space-y-3">
              {/* Row 1: Lecture PDF */}
              <Link
                to={`/lectures/${currentId}/pdf`}
                className="w-full rounded-2xl border border-[#EAF0F2] p-3.5 flex items-center justify-between hover:bg-[#F8FAF5] hover:border-[#D7E0E3] transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F1FBD2] flex items-center justify-center text-[#3D6317] shrink-0">
                    <FileText className="w-5 h-5 stroke-[1.75]" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-xs sm:text-[13px] font-bold text-[#15313C] group-hover:text-black">
                      Lecture PDF
                    </h4>
                    <p className="text-[11px] text-[#6B8089] mt-0.5">
                      {lecture.pdfFileName || 'View presentation slides'}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#6B8089] group-hover:text-[#15313C] group-hover:translate-x-0.5 transition-transform" />
              </Link>

              {/* Row 2: Question files */}
              <Link
                to="/exams"
                className="w-full rounded-2xl border border-[#EAF0F2] p-3.5 flex items-center justify-between hover:bg-[#F8FAF5] hover:border-[#D7E0E3] transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F1FBD2] flex items-center justify-center text-[#3D6317] shrink-0">
                    <FolderArchive className="w-5 h-5 stroke-[1.75]" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-xs sm:text-[13px] font-bold text-[#15313C] group-hover:text-black">
                      Question files
                    </h4>
                    <p className="text-[11px] text-[#6B8089] mt-0.5">
                      Review related quiz and exam sets
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#6B8089] group-hover:text-[#15313C] group-hover:translate-x-0.5 transition-transform" />
              </Link>

              {/* Row 3: Back to lecture */}
              <Link
                to={`/lectures/${currentId}`}
                className="w-full rounded-2xl border border-[#EAF0F2] p-3.5 flex items-center justify-between hover:bg-[#F8FAF5] hover:border-[#D7E0E3] transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F1FBD2] flex items-center justify-center text-[#3D6317] shrink-0">
                    <ArrowLeft className="w-5 h-5 stroke-[1.75]" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-xs sm:text-[13px] font-bold text-[#15313C] group-hover:text-black">
                      Back to lecture
                    </h4>
                    <p className="text-[11px] text-[#6B8089] mt-0.5">
                      {currentNumberStr}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#6B8089] group-hover:text-[#15313C] group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 3. BOTTOM NAVIGATION: PREVIOUS & NEXT LECTURE BARS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
        {prevId ? (
          <Link
            to={`/lectures/${prevId}/video`}
            className="bg-white/85 backdrop-blur-md rounded-full border border-[#EAF0F2] p-3 px-5 flex items-center gap-3.5 shadow-xs hover:bg-white transition-all group"
          >
            <div className="w-9 h-9 rounded-full border border-[#D7E0E3] text-[#15313C] flex items-center justify-center group-hover:bg-slate-50 transition-colors shrink-0">
              <ArrowLeft className="w-4 h-4 stroke-[2]" />
            </div>
            <div className="overflow-hidden">
              <span className="block text-[11px] font-medium text-[#6B8089]">
                Previous lecture
              </span>
              <span className="block text-xs font-bold text-[#15313C] truncate">
                {prevLecture?.number} • {prevLecture?.title}
              </span>
            </div>
          </Link>
        ) : (
          <div className="bg-white/40 rounded-full border border-dashed border-[#D7E0E3] p-3 px-5 flex items-center gap-3.5 opacity-60 cursor-not-allowed">
            <div className="w-9 h-9 rounded-full border border-[#D7E0E3] text-[#6B8089] flex items-center justify-center shrink-0">
              <ArrowLeft className="w-4 h-4 stroke-[1.5]" />
            </div>
            <div>
              <span className="block text-[11px] text-[#6B8089]">First lecture</span>
              <span className="block text-xs font-medium text-[#6B8089]">No previous lecture</span>
            </div>
          </div>
        )}

        {nextId ? (
          <Link
            to={`/lectures/${nextId}/video`}
            className="bg-white/85 backdrop-blur-md rounded-full border border-[#EAF0F2] p-3 px-5 flex items-center justify-between gap-3.5 shadow-xs hover:bg-white transition-all group text-right"
          >
            <div className="overflow-hidden text-left sm:text-right flex-1">
              <span className="block text-[11px] font-medium text-[#6B8089]">
                Next lecture
              </span>
              <span className="block text-xs font-bold text-[#15313C] truncate">
                {nextLecture?.number} • {nextLecture?.title}
              </span>
            </div>
            <div className="w-9 h-9 rounded-full bg-[#CCEB74] group-hover:bg-[#bfee50] text-[#15313C] flex items-center justify-center transition-colors shadow-xs shrink-0">
              <ArrowRight className="w-4 h-4 stroke-[2.25]" />
            </div>
          </Link>
        ) : (
          <div className="bg-white/40 rounded-full border border-dashed border-[#D7E0E3] p-3 px-5 flex items-center justify-between gap-3.5 opacity-60 cursor-not-allowed">
            <div className="text-right flex-1">
              <span className="block text-[11px] text-[#6B8089]">Last lecture</span>
              <span className="block text-xs font-medium text-[#6B8089]">Course syllabus completed</span>
            </div>
            <div className="w-9 h-9 rounded-full border border-[#D7E0E3] text-[#6B8089] flex items-center justify-center shrink-0">
              <ArrowRight className="w-4 h-4 stroke-[1.5]" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LectureVideoPage;
