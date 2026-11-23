import React, { useState } from 'react';
import { Play, ExternalLink, Video, HardDrive } from 'lucide-react';

/**
 * UniversalVideoPlayer Component
 * Automatically detects and renders:
 * 1. Google Drive MP4 / video previews via official Drive preview iframe
 * 2. YouTube videos (from full URL or 11-char ID) via embedded YouTube iframe
 * 3. Direct HTML5 MP4 video streams
 * 4. Multi-video tabs / playlists when a lecture has multiple parts or explanation videos
 */
const YouTubeIcon = ({ className = 'w-3.5 h-3.5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

export const UniversalVideoPlayer = ({
  title = 'Video Session',
  videoDriveId = null,
  youtubeId = null,
  videoUrl = null,
  videos = [], // Optional list of video variants: [{ title, type: 'drive'|'youtube'|'url', id, url }]
  driveFolderUrl = null,
  className = '',
}) => {
  // Build normalized videos list
  const allVideos = [];

  if (Array.isArray(videos) && videos.length > 0) {
    allVideos.push(...videos);
  } else {
    if (youtubeId) {
      allVideos.push({
        title: 'YouTube Lecture',
        type: 'youtube',
        id: youtubeId,
      });
    }
    if (videoDriveId) {
      allVideos.push({
        title: 'Drive Video',
        type: 'drive',
        id: videoDriveId,
      });
    }
    if (videoUrl && !youtubeId && !videoDriveId) {
      const parsedYt = extractYouTubeId(videoUrl);
      if (parsedYt) {
        allVideos.push({
          title: 'YouTube Lecture',
          type: 'youtube',
          id: parsedYt,
        });
      } else {
        allVideos.push({
          title: 'Platform Video',
          type: 'url',
          url: videoUrl,
        });
      }
    }
  }

  const [activeIdx, setActiveIdx] = useState(0);
  const currentVideo = allVideos[activeIdx] || allVideos[0] || null;

  // Helper to extract YouTube video ID from various URL formats
  function extractYouTubeId(url) {
    if (!url || typeof url !== 'string') return null;
    if (url.length === 11 && !url.includes('/')) return url;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  }

  // Determine current player source
  let embedUrl = null;
  let isYoutube = false;
  let isDrive = false;
  let isDirectUrl = false;

  if (currentVideo) {
    if (currentVideo.type === 'youtube' || (currentVideo.id && currentVideo.id.length === 11 && !currentVideo.type)) {
      isYoutube = true;
      const yId = currentVideo.id || extractYouTubeId(currentVideo.url);
      embedUrl = `https://www.youtube.com/embed/${yId}?rel=0&modestbranding=1&autoplay=0`;
    } else if (currentVideo.type === 'drive' || currentVideo.driveId || (currentVideo.id && !currentVideo.url)) {
      isDrive = true;
      const dId = currentVideo.id || currentVideo.driveId;
      embedUrl = `https://drive.google.com/file/d/${dId}/preview`;
    } else if (currentVideo.url) {
      const possibleYt = extractYouTubeId(currentVideo.url);
      if (possibleYt) {
        isYoutube = true;
        embedUrl = `https://www.youtube.com/embed/${possibleYt}?rel=0&modestbranding=1&autoplay=0`;
      } else {
        isDirectUrl = true;
        embedUrl = currentVideo.url;
      }
    }
  }

  return (
    <div className={`flex flex-col gap-3 w-full ${className}`}>
      {/* 1. Multi-Video Tabs (if multiple videos exist for this lecture) */}
      {allVideos.length > 1 && (
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-[#0f242c] rounded-2xl border border-white/10 shadow-xs">
          <span className="text-[11px] font-semibold text-[#CCEB74] px-2.5">
            Select Video:
          </span>
          {allVideos.map((vid, idx) => {
            const isActive = idx === activeIdx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveIdx(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#CCEB74] text-[#15313C] shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {vid.type === 'youtube' && <YouTubeIcon className="w-3.5 h-3.5 text-red-500" />}
                {vid.type === 'drive' && <HardDrive className="w-3.5 h-3.5" />}
                {vid.type === 'url' && <Video className="w-3.5 h-3.5" />}
                <span>{vid.title || `Part ${idx + 1}`}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* 2. Main 16:9 Video Display Container */}
      <div className="w-full bg-[#15313C] rounded-[24px] sm:rounded-[28px] overflow-hidden shadow-[0_20px_50px_rgba(21,49,60,0.18)] border border-[#EAF0F2] relative aspect-video min-h-[360px] sm:min-h-[440px] flex items-center justify-center">
        {isYoutube && embedUrl && (
          <iframe
            src={embedUrl}
            title={currentVideo.title || title}
            className="w-full h-full border-0 rounded-[24px] sm:rounded-[28px]"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
            allowFullScreen
          />
        )}

        {isDrive && embedUrl && (
          <iframe
            src={embedUrl}
            title={currentVideo.title || title}
            className="w-full h-full border-0 rounded-[24px] sm:rounded-[28px]"
            allow="autoplay; fullscreen"
            allowFullScreen
          />
        )}

        {isDirectUrl && embedUrl && (
          <video
            controls
            src={embedUrl}
            className="w-full h-full rounded-[24px] sm:rounded-[28px] object-cover"
          >
            Your browser does not support HTML5 video.
          </video>
        )}

        {!embedUrl && (
          <div className="flex flex-col items-center justify-center text-center p-8 max-w-md">
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-[#CCEB74] mb-4">
              <Video className="w-7 h-7 stroke-[1.75]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
              This lecture video is available in the course Google Drive folder.
            </p>
            {driveFolderUrl && (
              <a
                href={driveFolderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#CCEB74] hover:bg-[#bfee50] active:scale-95 text-[#15313C] font-bold text-xs py-2.5 px-6 rounded-full inline-flex items-center gap-2 shadow-sm transition-all"
              >
                <span>Open Google Drive Folder</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        )}
      </div>

      {/* 3. Action bar underneath player */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-2 text-xs text-[#6B8089]">
        <div className="inline-flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-medium text-[#15313C]">
            {currentVideo?.title ? `Playing: ${currentVideo.title}` : title}
          </span>
        </div>

        {driveFolderUrl && (
          <a
            href={driveFolderUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#15313C] hover:text-[#2563eb] transition-colors"
          >
            <span>Open in Google Drive</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  );
};

export default UniversalVideoPlayer;
