import React, { useState, useEffect } from 'react';
import { Bot, Sparkles, ExternalLink, X, MessageSquare, ArrowRight, BookOpen } from 'lucide-react';
import { useCourse } from '../../features/courses/context/CourseContext';

// Default fallback link (can be replaced by user or env variable)
export const DEFAULT_GEMINI_GEM_URL =
  import.meta.env.VITE_GEMINI_GEM_URL || 'https://gemini.google.com';

export const AIAgentWidget = () => {
  const { currentCourse } = useCourse();
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [gemUrl, setGemUrl] = useState(() => {
    try {
      return localStorage.getItem('dsp_gemini_gem_url') || DEFAULT_GEMINI_GEM_URL;
    } catch {
      return DEFAULT_GEMINI_GEM_URL;
    }
  });

  // Auto-hide tooltip after 6 seconds on initial load
  useEffect(() => {
    const timer = setTimeout(() => setShowTooltip(false), 7000);
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('dsp_open_ai_agent', handleOpen);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('dsp_open_ai_agent', handleOpen);
    };
  }, []);

  const samplePrompts = [
    'اشرح لي فكرة Z-Transform والـ Region of Convergence (ROC)',
    'ما هي خطوات حساب الـ Convolution Sum بيانياً وجبرياً؟',
    'ما الفرق بين Continuous Time Fourier (CTFT) و Discrete (DTFT)؟',
    'كيف أصمم مرشح FIR Filter باستخدام نافذة Hamming Window؟',
  ];

  const handleOpenGemini = (promptText = null) => {
    let targetUrl = gemUrl;
    if (promptText && targetUrl.includes('gemini.google.com')) {
      targetUrl = `${targetUrl}?text=${encodeURIComponent(promptText)}`;
    }
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      {/* 1. FIXED FLOATING AGENT BUTTON (Bottom-Right) */}
      <aside aria-label="AI Assistant" className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex items-center select-none">
        {/* Animated Tooltip Bubble on Hover / Initial View */}
        {showTooltip && !isOpen && (
          <div className="hidden sm:flex items-center gap-2 bg-[#15313C] text-white px-3.5 py-1.5 rounded-full shadow-lg border border-[#CCEB74]/30 text-xs font-semibold mr-3 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-[#CCEB74] shrink-0 animate-pulse" />
            <span>اسأل المساعد الذكي (AI)</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowTooltip(false);
              }}
              className="text-slate-400 hover:text-white ml-1 text-[11px]"
            >
              ✕
            </button>
          </div>
        )}

        {/* Floating Action Button with Robot Avatar */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="relative group p-1 bg-gradient-to-tr from-[#15313C] to-[#204958] rounded-2xl sm:rounded-3xl shadow-[0_10px_30px_rgba(21,49,60,0.3)] border-2 border-[#CCEB74] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
          title="Open AI Study Assistant"
        >
          {/* Avatar Image */}
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl overflow-hidden bg-[#15313C]">
            <img
              src="/ai-agent.png"
              alt="AI Assistant"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </div>

          {/* Glowing Online Status Indicator */}
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#CCEB74] opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-[#CCEB74] border-2 border-[#15313C]" />
          </span>
        </button>
      </aside>

      {/* 2. INTERACTIVE MODAL / POPUP DIALOG */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs animate-fade-in"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white rounded-[28px] sm:rounded-[32px] border border-[#EAF0F2] shadow-[0_25px_60px_rgba(21,49,60,0.25)] max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh] animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="relative bg-[#15313C] p-6 text-white overflow-hidden">
              {/* Background ambient lighting */}
              <div className="absolute top-0 right-0 w-44 h-44 bg-[#CCEB74]/15 blur-3xl rounded-full pointer-events-none" />

              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3.5">
                  <div className="w-13 h-13 rounded-2xl overflow-hidden border-2 border-[#CCEB74]/50 shadow-md shrink-0 bg-[#0c1f26]">
                    <img
                      src="/ai-agent.png"
                      alt="Agent Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#CCEB74]/20 text-[#CCEB74] border border-[#CCEB74]/30 mb-1">
                      <Sparkles className="w-3 h-3 text-[#CCEB74]" />
                      <span>Gemini AI Tutor</span>
                    </div>
                    <h3 className="text-lg font-bold text-white tracking-tight">
                      DSP & Signals AI Assistant
                    </h3>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 overflow-y-auto">
              {/* Description Card */}
              <div className="p-4 rounded-2xl bg-[#F8FAF5] border border-[#E2EBE2] text-xs sm:text-sm text-[#3A5560] leading-relaxed">
                <p className="font-semibold text-[#15313C] mb-1">
                  مرحباً بك! أنا مساعدك الدراسي الذكي لكورس {currentCourse.title}.
                </p>
                <p className="text-[#6B8089] text-xs leading-relaxed">
                  تم تدريبي وتزويدي بجميع محاضرات وسكاشن ومراجع المنهج، للإجابة الفورية عن أي سؤال، شرح المفاهيم، وحل المسائل خطوة بخطوة.
                </p>
              </div>

              {/* Sample Prompts / Quick Questions */}
              <div>
                <span className="block text-xs font-bold text-[#15313C] mb-2.5 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-[#3D6317]" />
                  <span>نماذج لأسئلة يمكنك طرحها:</span>
                </span>
                <div className="space-y-2">
                  {samplePrompts.map((prompt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleOpenGemini(prompt)}
                      className="w-full text-right text-xs p-3 rounded-xl bg-white hover:bg-[#F1FBD2] border border-[#EAF0F2] hover:border-[#CCEB74] text-[#15313C] font-medium transition-all flex items-center justify-between gap-2 group cursor-pointer"
                    >
                      <ArrowRight className="w-3.5 h-3.5 text-[#6B8089] group-hover:text-[#15313C] group-hover:translate-x-0.5 transition-all shrink-0" />
                      <span className="truncate">{prompt}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Action Button to open Gemini Gem */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleOpenGemini()}
                  className="w-full bg-[#CCEB74] hover:bg-[#bfee50] active:scale-[0.98] text-[#15313C] font-bold text-sm py-3 px-6 rounded-full inline-flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  <span>بدء المحادثة مع المساعد (Gemini Gem)</span>
                  <ExternalLink className="w-4 h-4 stroke-[2.25]" />
                </button>
                <p className="text-center text-[11px] text-[#8EA1A9] mt-2">
                  سيتم فتح محادثة مخصصة في نافذة جديدة بناءً على ماتريال المنهج
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAgentWidget;
