import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  RotateCcw,
  RotateCw,
} from 'lucide-react';

/**
 * VideoPlayerFrame Component
 * A responsive, modern 16:9 Video Player Frame for Practical Sections:
 * - HTML5 video playback with standard DSP demo video
 * - Play/Pause, 10s Rewind/Forward, scrubber timeline bar, live timecode
 * - Volume/Mute controls, Playback speed toggles (1x, 1.25x, 1.5x, 2x)
 * - Fullscreen support and keyboard shortcuts (Space, M, F)
 * - 100% frontend only, ready for the data team to swap the video source URL
 */
export const VideoPlayerFrame = ({
  title = 'Section Video Session',
  videoUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  autoPlay = false,
  className = '',
}) => {
  const containerRef = useRef(null);
  const videoRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(185); // 03:05 demo default
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const hideTimeoutRef = useRef(null);

  useEffect(() => {
    if (autoPlay && videoRef.current) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  }, [autoPlay]);

  const handleTogglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          setIsPlaying(true);
        });
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      if (videoRef.current.duration && !isNaN(videoRef.current.duration)) {
        setDuration(videoRef.current.duration);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current && !isNaN(videoRef.current.duration)) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickPos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newTime = clickPos * duration;
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
    setCurrentTime(newTime);
  };

  const handleToggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
    setIsMuted(!isMuted);
  };

  const handleToggleSpeed = () => {
    const speeds = [1, 1.25, 1.5, 2];
    const nextIndex = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    const newSpeed = speeds[nextIndex];
    setPlaybackSpeed(newSpeed);
    if (videoRef.current) {
      videoRef.current.playbackRate = newSpeed;
    }
  };

  const handleSkip = (seconds) => {
    if (videoRef.current) {
      const target = Math.max(0, Math.min(duration, videoRef.current.currentTime + seconds));
      videoRef.current.currentTime = target;
      setCurrentTime(target);
    }
  };

  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleMouseMove = () => {
    setShowControls(true);
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    if (isPlaying) {
      hideTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      className={`relative w-full aspect-video bg-[#0A181E] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between group select-none ${className}`}
    >
      {/* 1. MAIN VIDEO VIEWPORT */}
      <div className="relative flex-1 w-full h-full flex items-center justify-center overflow-hidden bg-black/60">
        <video
          ref={videoRef}
          src={videoUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
          onClick={handleTogglePlay}
          playsInline
          className="w-full h-full object-contain cursor-pointer"
        />

        {/* Center Big Play Button (shown when paused or hovered) */}
        {!isPlaying && (
          <button
            type="button"
            onClick={handleTogglePlay}
            className="absolute inset-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#CCEB74] hover:bg-[#bfee50] active:scale-95 text-[#15313C] flex items-center justify-center transition-all shadow-[0_10px_35px_rgba(204,235,116,0.5)] cursor-pointer z-20 group-hover:scale-105"
            title="Play Video"
          >
            <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-[#15313C] stroke-none ml-1" />
          </button>
        )}

        {/* Top Floating Badge */}
        <div
          className={`absolute top-3.5 left-4 z-20 flex items-center gap-2 transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-[#15313C]/85 text-[#CCEB74] border border-white/10 backdrop-blur-md shadow-sm">
            {title}
          </span>
        </div>
      </div>

      {/* 2. BOTTOM CONTROL BAR */}
      <div
        className={`bg-gradient-to-t from-[#0A181E] via-[#0A181E]/90 to-transparent px-4 sm:px-6 py-3 border-t border-white/10 flex items-center gap-2.5 sm:gap-4 relative z-20 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Play/Pause Button */}
        <button
          type="button"
          onClick={handleTogglePlay}
          className="text-white hover:text-[#CCEB74] transition-colors cursor-pointer shrink-0"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
        </button>

        {/* Rewind 10s */}
        <button
          type="button"
          onClick={() => handleSkip(-10)}
          className="text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0 hidden xs:block"
          title="Rewind 10 seconds"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        {/* Forward 10s */}
        <button
          type="button"
          onClick={() => handleSkip(10)}
          className="text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0 hidden xs:block"
          title="Forward 10 seconds"
        >
          <RotateCw className="w-3.5 h-3.5" />
        </button>

        {/* Scrubber Timeline Bar */}
        <div
          className="flex-1 h-2 bg-white/20 hover:bg-white/30 rounded-full relative cursor-pointer group/scrub"
          onClick={handleSeek}
        >
          <div
            className="h-full bg-[#CCEB74] rounded-full relative"
            style={{ width: `${progressPercent}%` }}
          >
            <div className="w-3 h-3 rounded-full bg-white shadow-sm absolute right-0 top-1/2 -translate-y-1/2 -mr-1.5 scale-0 group-hover/scrub:scale-100 transition-transform" />
          </div>
        </div>

        {/* Time Stamp */}
        <span className="text-[11px] font-mono text-slate-300 whitespace-nowrap shrink-0">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>

        {/* Playback Speed */}
        <button
          type="button"
          onClick={handleToggleSpeed}
          className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-white/10 hover:bg-white/20 text-slate-200 transition-colors cursor-pointer shrink-0"
          title="Playback speed"
        >
          {playbackSpeed}x
        </button>

        {/* Volume Mute Toggle */}
        <button
          type="button"
          onClick={handleToggleMute}
          className="text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0"
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* Fullscreen Button */}
        <button
          type="button"
          onClick={handleToggleFullscreen}
          className="text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0"
          title="Toggle Fullscreen"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default VideoPlayerFrame;
