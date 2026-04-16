import { useState } from "react";
import { ChevronRight, X } from "lucide-react";
import { type AssessmentDocument, type AnswerStatus } from "@/lib/assessment-data";
import { motion, AnimatePresence } from "framer-motion";

interface QuestionCardProps {
  doc: AssessmentDocument;
  answer: AnswerStatus;
  onAnswer: (status: AnswerStatus) => void;
}

const categoryBadges: Record<string, { bg: string; text: string; border: string; label: string }> = {
  mandatory: { bg: "bg-[#FEE2E2]", text: "text-[#B91C1C]", border: "border-[#FCA5A5]", label: "Mandatory" },
  conditional: { bg: "bg-[#FEF3C7]", text: "text-[#92400E]", border: "border-[#FCD34D]", label: "Conditional" },
  "good-to-have": { bg: "bg-[#F3F4F6]", text: "text-[#6B7280]", border: "border-[#D1D5DB]", label: "Good to Have" },
};

const QuestionCard = ({ doc, answer, onAnswer }: QuestionCardProps) => {
  const [showModal, setShowModal] = useState(false);
  const cat = categoryBadges[doc.category];

  return (
    <>
      <div
        className="bg-white rounded-[14px] border-[1.5px] border-[#E5E7EB] p-5 md:p-6 shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:border-[#1A6478] transition-all duration-150"
      >
        {/* Top row: name + badge */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="font-display font-semibold text-[#111827] text-[15px] leading-snug" style={{ wordBreak: "break-word", whiteSpace: "normal" }}>
            {doc.name}
          </h3>
          <span
            id={doc.category === "mandatory" ? "mandatory-badge" : undefined}
            data-tour={doc.category === "mandatory" ? "mandatory-badge" : undefined}
            className={`shrink-0 px-2.5 py-0.5 rounded-full text-xs font-medium border ${cat.bg} ${cat.text} ${cat.border}`}
          >
            {cat.label}
          </span>
        </div>

        {/* Answer buttons */}
        <div className="flex gap-3 mb-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onAnswer(answer === "yes" ? null : "yes")}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
              answer === "yes"
                ? "bg-[#15803D] text-white"
                : "bg-white text-[#4B5563] border-[1.5px] border-[#E5E7EB] hover:border-[#15803D] hover:text-[#15803D]"
            }`}
            style={{ height: "44px" }}
          >
            Yes
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onAnswer(answer === "no" ? null : "no")}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
              answer === "no"
                ? "bg-[#B91C1C] text-white"
                : "bg-white text-[#4B5563] border-[1.5px] border-[#E5E7EB] hover:border-[#B91C1C] hover:text-[#B91C1C]"
            }`}
            style={{ height: "44px" }}
          >
            No
          </motion.button>
        </div>

        {/* Learn more link */}
        <div className="flex justify-end" id="learn-more-link" data-tour="learn-more">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1 text-[13px] text-[#1A6478] font-body hover:underline transition-colors"
          >
            Learn more <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Learn More Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl w-full max-w-[480px] overflow-hidden shadow-xl"
            >
              {/* Header */}
              <div className="p-5 md:p-6 rounded-t-xl" style={{ backgroundColor: "#0B3D4A" }}>
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-display font-semibold text-white text-[17px]">{doc.name}</h2>
                  <button onClick={() => setShowModal(false)} className="text-white/70 hover:text-white">
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 space-y-5">
                {doc.conditionalNote && (
                  <div>
                    <p className="text-[12px] font-medium text-[#0B3D4A] uppercase tracking-wider mb-1.5">
                      When is this required
                    </p>
                    <p className="text-[15px] text-[#111827] font-body leading-relaxed">
                      {doc.conditionalNote}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-[12px] font-medium text-[#0B3D4A] uppercase tracking-wider mb-1.5">Why it matters</p>
                  <p className="text-[15px] text-[#111827] font-body leading-relaxed">{doc.purpose}</p>
                </div>
                <div>
                  <p className="text-[12px] font-medium text-[#0B3D4A] uppercase tracking-wider mb-1.5">What it is</p>
                  <p className="text-[15px] text-[#111827] font-body leading-relaxed">{doc.whatItIs}</p>
                </div>

                <button
                  onClick={() => setShowModal(false)}
                  className="w-full py-3 rounded-xl bg-[#C4872A] text-white font-display font-semibold text-sm hover:bg-[#A8711F] transition-all"
                >
                  Got it
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default QuestionCard;