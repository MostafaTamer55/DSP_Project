import React, { useState, useEffect } from 'react';
import { Sparkles, ExternalLink, Bot } from 'lucide-react';
import aiAgentPng from '../../assets/ai-agent.png';

// Default fallback link to the user's custom DSP & Signals Gemini Gem
export const DEFAULT_GEMINI_GEM_URL =
  import.meta.env.VITE_GEMINI_GEM_URL ||
  'https://gemini.google.com/gem/1kkxqyHvyP2Wc515PsxIUKoHxcoXFK_Ne?usp=sharing';

export const AIAgentWidget = () => {
  const [showTooltip, setShowTooltip] = useState(true);
  const [imgSrc, setImgSrc] = useState(aiAgentPng || '/ai-agent.png');
  const [imgError, setImgError] = useState(false);
  const gemUrl =
    (typeof window !== 'undefined' && localStorage.getItem('dsp_gemini_gem_url')) ||
    DEFAULT_GEMINI_GEM_URL;

  // Auto-hide tooltip after 6 seconds on initial load
  useEffect(() => {
    const timer = setTimeout(() => setShowTooltip(false), 6000);
    const handleOpen = () => handleOpenGemini();
    window.addEventListener('dsp_open_ai_agent', handleOpen);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('dsp_open_ai_agent', handleOpen);
    };
  }, []);

  const handleOpenGemini = () => {
    window.open(gemUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <aside
      aria-label="AI Study Assistant"
      className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex items-center select-none"
    >
      {/* Animated Tooltip Bubble on Hover / Initial View */}
      {showTooltip && (
        <div
          onClick={handleOpenGemini}
          className="hidden sm:flex items-center gap-2 bg-[#15313C] text-white px-3.5 py-1.5 rounded-full shadow-lg border border-[#CCEB74]/30 text-xs font-semibold mr-3 animate-fade-in cursor-pointer hover:bg-[#1b3d4a] transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#CCEB74] shrink-0 animate-pulse" />
          <span>تحدث مع المساعد الذكي (Gemini Gem)</span>
          <ExternalLink className="w-3 h-3 text-[#CCEB74]/80 ml-0.5" />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(false);
            }}
            className="text-slate-400 hover:text-white ml-1 text-[11px] cursor-pointer"
            title="Dismiss tooltip"
          >
            ✕
          </button>
        </div>
      )}

      {/* Floating Action Button with Robot Avatar - Directly opens Gemini Gem on click */}
      <button
        type="button"
        onClick={handleOpenGemini}
        className="relative group p-1 bg-gradient-to-tr from-[#15313C] to-[#204958] rounded-2xl sm:rounded-3xl shadow-[0_10px_30px_rgba(21,49,60,0.3)] border-2 border-[#CCEB74] hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer"
        title="فتح محادثة المساعد الذكي (Gemini Gem)"
      >
        {/* Avatar Image with Resilient Fallback */}
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl overflow-hidden bg-[#15313C] flex items-center justify-center">
          {!imgError ? (
            <img
              src={imgSrc}
              alt="AI Assistant"
              onError={() => {
                if (imgSrc !== '/ai-agent.png') {
                  setImgSrc('/ai-agent.png');
                } else {
                  setImgError(true);
                }
              }}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-[#15313C] to-[#204958] text-[#CCEB74]">
              <Bot className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
          )}
        </div>

        {/* Glowing Online Status Indicator */}
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#CCEB74] opacity-75" />
          <span className="relative inline-flex rounded-full h-4 w-4 bg-[#CCEB74] border-2 border-[#15313C]" />
        </span>
      </button>
    </aside>
  );
};

export default AIAgentWidget;
