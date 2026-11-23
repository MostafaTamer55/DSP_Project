import React, { useState, useEffect } from 'react';
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
import UniversalVideoPlayer from '../../../components/common/UniversalVideoPlayer';
import { useCourse } from '../../courses/context/CourseContext';
import { useProgress } from '../../progress/services/progressService';
import { recordActivity } from '../../../services/activityTracker';

/**
 * Dedicated Video Page matching:
 * - Case 1: Platform Video Player (Figma screen/lectures/video/player)
 * - Case 2: External Google Drive Link (Figma screen/lectures/video/external-link)
 */
export const LectureVideoPage = () => {
  const { lectureId = '2' } = useParams();
  const currentId = parseInt(lectureId, 10) || 2;
  const { courseId } = useCourse();
  const lecture = getLectureById(currentId, courseId);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(38); // 38% progress for demo

  useEffect(() => {
    if (lecture) {
      recordActivity({
        type: 'lecture',
        courseId,
        id: String(currentId),
        number: lecture.number || `Lecture ${String(currentId).padStart(2, '0')}`,
        title: lecture.title,
        path: `/lectures/${currentId}/video`,
        label: 'Lecture Video',
        duration: lecture.videoDuration,
      });
    }
  }, [currentId, courseId, lecture]);

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

  const prevNumberStr = prevId ? `Lecture ${prevId.toString().padStart(2, '0')}` : null;
  const nextNumberStr = nextId ? `Lecture ${nextId.toString().padStart(2, '0')}` : null;

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
      </div>

      {/* 2. MAIN TWO-COLUMN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column (8 cols): Interactive Video Session (Google Drive, YouTube, or MP4) */}
        <div className="lg:col-span-8 flex flex-col justify-start">
          <UniversalVideoPlayer
            title={`${currentNumberStr} · ${lecture.title}`}
            videoDriveId={lecture.videoDriveId}
            youtubeId={lecture.youtubeId}
            videoUrl={lecture.videoUrl}
            videos={lecture.videos}
            driveFolderUrl={lecture.driveFolderUrl}
          />
        </div>

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

              {/* Pills: Video & PDF & Watched Status */}
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
                      Preview or download
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#6B8089] group-hover:text-[#15313C] group-hover:translate-x-0.5 transition-transform" />
              </Link>

              {/* Row 2: Related questions */}
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
                      Related questions
                    </h4>
                    <p className="text-[11px] text-[#6B8089] mt-0.5">
                      Exam Bank
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
        {/* Previous Lecture Capsule */}
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
                {prevNumberStr} • Lecture title
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

        {/* Next Lecture Capsule */}
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
                {nextNumberStr} • Lecture title
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
