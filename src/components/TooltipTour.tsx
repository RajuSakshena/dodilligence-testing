import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TourStep {
  targetAttr: string;
  headline: string;
  body: string;
  position: "below" | "right" | "below-right";
}

const tourSteps: TourStep[] = [
  {
    targetAttr: "progress-bar",
    headline: "Your six checkpoints, at a glance",
    body: "These 6 checkpoints show where you are. Each fills as you answer questions in that section.",
    position: "below",
  },
  {
    targetAttr: "question-card",
    headline: "Simple yes or no.",
    body: "For each document, just tell us if your organisation has it. Answer honestly, this is for your benefit.",
    position: "right",
  },
  {
    targetAttr: "learn-more",
    headline: "Are you a curious person?",
    body: "Select the arrow on any card to see what a document is, why it matters to funders, and exactly how to get it.",
    position: "below-right",
  },
  {
    targetAttr: "mandatory-badge",
    headline: "Not all documents are equal.",
    body: "Mandatory documents are critical for funding eligibility. Good to Have documents strengthen your profile.",
    position: "below",
  },
];

const TooltipTour = () => {
  const [step, setStep] = useState(-1);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const seen = sessionStorage.getItem("hasSeenTour");
    if (seen) return;
    const timer = setTimeout(() => setStep(0), 800);
    return () => clearTimeout(timer);
  }, []);

  const updatePosition = useCallback(() => {
    if (step < 0 || step >= tourSteps.length) return;
    const el = document.querySelector(`[data-tour="${tourSteps[step].targetAttr}"]`) as HTMLElement;
    if (!el) return;

    // Scroll into view if needed
    el.scrollIntoView({ behavior: "smooth", block: "nearest" });

    setTimeout(() => {
      const rect = el.getBoundingClientRect();
      setTargetRect(rect);

      const tooltipW = 320;
      const tooltipH = 200;
      const pos = tourSteps[step].position;
      let top = 0;
      let left = 0;

      if (pos === "below") {
        top = rect.bottom + 20;
        left = Math.max(16, Math.min(rect.left + rect.width / 2 - tooltipW / 2, window.innerWidth - tooltipW - 16));
      } else if (pos === "right") {
        top = rect.top + rect.height / 2 - tooltipH / 2;
        left = rect.right + 20;
        // On mobile, fall back to below
        if (left + tooltipW > window.innerWidth - 16) {
          top = rect.bottom + 20;
          left = Math.max(16, Math.min(rect.left + rect.width / 2 - tooltipW / 2, window.innerWidth - tooltipW - 16));
        }
      } else {
        top = rect.bottom + 16;
        left = Math.max(16, Math.min(rect.right - tooltipW / 2, window.innerWidth - tooltipW - 16));
      }

      setTooltipPos({ top, left });
    }, 300);
  }, [step]);

  useEffect(() => {
    updatePosition();
    window.addEventListener("resize", updatePosition);
    return () => window.removeEventListener("resize", updatePosition);
  }, [updatePosition]);

  const closeTour = () => {
    setStep(-1);
    sessionStorage.setItem("hasSeenTour", "true");
  };

  const handleNext = () => {
    if (step >= tourSteps.length - 1) {
      closeTour();
    } else {
      setStep(step + 1);
    }
  };

  useEffect(() => {
    if (step < 0) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeTour();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [step]);

  if (step < 0 || step >= tourSteps.length || !targetRect) return null;

  const currentStep = tourSteps[step];
  const ringPadding = 8;
  const ringRect = {
    top: targetRect.top - ringPadding,
    left: targetRect.left - ringPadding,
    width: targetRect.width + ringPadding * 2,
    height: targetRect.height + ringPadding * 2,
  };

  // Calculate arrow line from tooltip edge to ring center
  const ringCenterX = ringRect.left + ringRect.width / 2;
  const ringCenterY = ringRect.top + ringRect.height / 2;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-[9998]"
        style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
        onClick={closeTour}
      />

      {/* Highlight ring */}
      <div
        className="fixed z-[9999] pointer-events-none rounded-full border-2 border-[#C4872A]"
        style={{
          top: ringRect.top,
          left: ringRect.left,
          width: ringRect.width,
          height: ringRect.height,
          animation: "tourPulse 1.5s ease-in-out infinite",
        }}
      />

      {/* Connecting arrow SVG */}
      <svg
        className="fixed inset-0 z-[9999] pointer-events-none"
        width="100%"
        height="100%"
        style={{ overflow: "visible" }}
      >
        <line
          x1={tooltipPos.left + 160}
          y1={tooltipPos.top}
          x2={ringCenterX}
          y2={ringCenterY}
          stroke="#C4872A"
          strokeWidth="1.5"
          strokeDasharray="4 3"
          markerEnd="url(#tourArrowHead)"
        />
        <defs>
          <marker id="tourArrowHead" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" fill="#C4872A" />
          </marker>
        </defs>
      </svg>

      {/* Tooltip */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          ref={tooltipRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed z-[10000] bg-white rounded-xl p-5 shadow-[0_8px_32px_rgba(0,0,0,0.18)]"
          style={{
            top: tooltipPos.top,
            left: tooltipPos.left,
            width: 320,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-semibold text-[#111827] text-base">{currentStep.headline}</h3>
            <span className="text-xs text-[#9CA3AF]">{step + 1} of 4</span>
          </div>
          <p className="text-sm text-[#4B5563] font-body leading-relaxed mb-4">{currentStep.body}</p>
          <div className="flex items-center gap-3">
            <button
              onClick={handleNext}
              className="px-4 py-2 rounded-lg bg-[#C4872A] text-white text-sm font-medium hover:bg-[#A8711F] transition-all"
            >
              {step === tourSteps.length - 1 ? "Got it, let's begin" : "Next →"}
            </button>
            {step < tourSteps.length - 1 && (
              <button
                onClick={closeTour}
                className="text-sm text-[#9CA3AF] hover:underline transition-colors"
              >
                Skip
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      <style>{`
        @keyframes tourPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(196,135,42,0.4); }
          50% { box-shadow: 0 0 0 12px rgba(196,135,42,0); }
        }
      `}</style>
    </>
  );
};

export default TooltipTour;
