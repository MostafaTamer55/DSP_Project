import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  FileText,
  FolderArchive,
  ArrowLeft,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';
import VideoPlayerFrame from '../components/VideoPlayerFrame';
import UniversalVideoPlayer from '../../../components/common/UniversalVideoPlayer';
import { getSectionById } from '../data/mockSections';
import { useCourse } from '../../courses/context/CourseContext';
import { recordActivity } from '../../../services/activityTracker';

/**
 * SectionVideoPage Component
 * Dedicated Video Player Page for Practical Sections (Frontend only, zero backend):
 * - Route: /sections/:sectionId/video
 * - Breadcrumbs: Sections / Section XX / Video
 * - 16:9 Video Player Frame with HTML5 video playback & full custom controls
 * - Section sidebar with links to Section PDF, Exam Bank, and Back to section
 * - Previous & Next section navigation capsules
 */
export const SectionVideoPage = () => {
  const { sectionId = '1' } = useParams();
  const currentId = parseInt(sectionId, 10) || 1;
  const { courseId } = useCourse();
  const section = getSectionById(currentId, courseId);
  const sectionNumberStr = section.number || `Section ${currentId.toString().padStart(2, '0')}`;

  useEffect(() => {
    if (section) {
      recordActivity({
        type: 'section',
        courseId,
        id: String(currentId),
        number: sectionNumberStr,
        title: section.title,
        path: `/sections/${currentId}/video`,
        label: 'Section Video',
        duration: section.duration,
      });
    }
  }, [currentId, courseId, section, sectionNumberStr]);

  // Previous and Next section IDs
  const prevId = currentId > 1 ? currentId - 1 : null;
  const nextId = currentId < 8 ? currentId + 1 : null;
  const prevNumberStr = prevId ? `Section ${prevId.toString().padStart(2, '0')}` : null;
  const nextNumberStr = nextId ? `Section ${nextId.toString().padStart(2, '0')}` : null;

  return (
    <div className="space-y-6 sm:space-y-7 pb-14 select-none">
      {/* 1. BREADCRUMBS & PAGE HEADER */}
      <div className="pt-1">
        <nav className="flex items-center gap-2 text-xs font-medium text-[#6B8089] mb-2">
          <Link to="/sections" className="hover:text-[#15313C] transition-colors">
            Sections
          </Link>
          <span>/</span>
          <Link to={`/sections/${currentId}`} className="hover:text-[#15313C] transition-colors">
            {sectionNumberStr}
          </Link>
          <span>/</span>
          <span className="font-semibold text-[#15313C]">Video</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#15313C] tracking-tight">
              {sectionNumberStr} · {section.title}
            </h1>
            <p className="text-xs sm:text-sm text-[#6B8089] mt-1">
              Practical section video session & demonstrations.
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 text-xs text-[#2F5968] font-medium self-start sm:self-center px-3.5 py-1 rounded-full bg-[#E5EEF1] border border-[#D0DFE5]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1F5467]" />
            <span>Interactive Video Frame</span>
          </div>
        </div>
      </div>

      {/* 2. MAIN TWO-COLUMN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column (8 cols): Interactive Video Session (Google Drive, YouTube, or MP4) */}
        <div className="lg:col-span-8 flex flex-col justify-start">
          <UniversalVideoPlayer
            title={`${sectionNumberStr} · ${section.title}`}
            videoDriveId={section.videoDriveId}
            youtubeId={section.youtubeId}
            videoUrl={section.videoUrl}
            videos={section.videos}
            driveFolderUrl={section.driveFolderUrl}
          />
        </div>

        {/* Right Column (4 cols): Information & Action Sidebar Card */}
        <div className="lg:col-span-4 bg-white rounded-[28px] sm:rounded-[32px] p-6 sm:p-7 border border-[#EAF0F2] shadow-[0_12px_35px_rgba(21,49,60,0.035)] flex flex-col justify-between">
          <div>
            {/* Section Meta Header */}
            <div className="mb-6">
              <span className="block text-xs font-semibold text-[#6B8089]">
                {sectionNumberStr}
              </span>
              <h2 className="text-xl sm:text-[22px] font-bold text-[#15313C] tracking-tight mt-0.5">
                {section.title}
              </h2>

              {/* Pills: Video & PDF */}
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-[#F1FBD2] text-[#3D6317] border border-[#d6ec8c]">
                  Video link
                </span>
                <span className="px-3 py-0.5 rounded-full text-xs font-medium bg-[#F5F8F9] border border-[#D7E0E3] text-[#3A5560]">
                  PDF
                </span>
              </div>
            </div>

            {/* Action Item Rows */}
            <div className="space-y-3">
              {/* Row 1: Section PDF */}
              <Link
                to={`/sections/${currentId}/pdf`}
                className="w-full rounded-2xl border border-[#EAF0F2] p-3.5 flex items-center justify-between hover:bg-[#F8FAF5] hover:border-[#D7E0E3] transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F1FBD2] flex items-center justify-center text-[#3D6317] shrink-0">
                    <FileText className="w-5 h-5 stroke-[1.75]" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-xs sm:text-[13px] font-bold text-[#15313C] group-hover:text-black">
                      Section PDF
                    </h4>
                    <p className="text-[11px] text-[#6B8089] mt-0.5">
                      Preview or download
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#6B8089] group-hover:text-[#15313C] group-hover:translate-x-0.5 transition-transform" />
              </Link>

              {/* Row 2: Exam Bank */}
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

              {/* Row 3: Back to Section */}
              <Link
                to={`/sections/${currentId}`}
                className="w-full rounded-2xl border border-[#EAF0F2] p-3.5 flex items-center justify-between hover:bg-[#F8FAF5] hover:border-[#D7E0E3] transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F1FBD2] flex items-center justify-center text-[#3D6317] shrink-0">
                    <ArrowLeft className="w-5 h-5 stroke-[1.75]" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-xs sm:text-[13px] font-bold text-[#15313C] group-hover:text-black">
                      Back to section
                    </h4>
                    <p className="text-[11px] text-[#6B8089] mt-0.5">
                      {sectionNumberStr}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#6B8089] group-hover:text-[#15313C] group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 mt-6">
            <p className="text-[11px] text-[#6B8089] leading-relaxed">
              Frontend demonstration video frame. When the data team connects real video feeds, they will seamlessly play here.
            </p>
          </div>
        </div>
      </div>

      {/* 3. BOTTOM NAVIGATION: PREVIOUS & NEXT SECTION CAPSULES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
        {/* Previous Section Capsule */}
        {prevId ? (
          <Link
            to={`/sections/${prevId}/video`}
            className="bg-white/85 backdrop-blur-md rounded-full border border-[#EAF0F2] p-3 px-5 flex items-center gap-3.5 shadow-xs hover:bg-white transition-all group"
          >
            <div className="w-9 h-9 rounded-full border border-[#D7E0E3] text-[#15313C] flex items-center justify-center group-hover:bg-slate-50 transition-colors shrink-0">
              <ArrowLeft className="w-4 h-4 stroke-[2]" />
            </div>
            <div className="overflow-hidden">
              <span className="block text-[11px] font-medium text-[#6B8089]">
                Previous section
              </span>
              <span className="block text-xs font-bold text-[#15313C] truncate">
                {prevNumberStr} • Section title
              </span>
            </div>
          </Link>
        ) : (
          <div className="bg-white/40 rounded-full border border-dashed border-[#D7E0E3] p-3 px-5 flex items-center gap-3.5 opacity-60 cursor-not-allowed">
            <div className="w-9 h-9 rounded-full border border-[#D7E0E3] text-[#6B8089] flex items-center justify-center shrink-0">
              <ArrowLeft className="w-4 h-4 stroke-[1.5]" />
            </div>
            <div>
              <span className="block text-[11px] text-[#6B8089]">First section</span>
              <span className="block text-xs font-medium text-[#6B8089]">No previous section</span>
            </div>
          </div>
        )}

        {/* Next Section Capsule */}
        {nextId ? (
          <Link
            to={`/sections/${nextId}/video`}
            className="bg-white/85 backdrop-blur-md rounded-full border border-[#EAF0F2] p-3 px-5 flex items-center justify-between gap-3.5 shadow-xs hover:bg-white transition-all group text-right"
          >
            <div className="overflow-hidden text-left sm:text-right flex-1">
              <span className="block text-[11px] font-medium text-[#6B8089]">
                Next section
              </span>
              <span className="block text-xs font-bold text-[#15313C] truncate">
                {nextNumberStr} • Section title
              </span>
            </div>
            <div className="w-9 h-9 rounded-full bg-[#CCEB74] group-hover:bg-[#bfee50] text-[#15313C] flex items-center justify-center transition-colors shadow-xs shrink-0">
              <ArrowRight className="w-4 h-4 stroke-[2.25]" />
            </div>
          </Link>
        ) : (
          <div className="bg-white/40 rounded-full border border-dashed border-[#D7E0E3] p-3 px-5 flex items-center justify-between gap-3.5 opacity-60 cursor-not-allowed">
            <div className="text-right flex-1">
              <span className="block text-[11px] text-[#6B8089]">Last section</span>
              <span className="block text-xs font-medium text-[#6B8089]">Syllabus completed</span>
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

export default SectionVideoPage;
