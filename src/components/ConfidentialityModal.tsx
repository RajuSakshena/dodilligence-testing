import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ConfidentialityModalProps {
  open: boolean;
  onClose: () => void;
  onAccept: () => void;
}

const ConfidentialityModal = ({ open, onClose, onAccept }: ConfidentialityModalProps) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl w-full max-w-[560px] overflow-hidden shadow-xl max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div
              className="p-5 md:p-6 rounded-t-xl flex items-center justify-between"
              style={{ backgroundColor: "#0B3D4A" }}
            >
              <h2 className="font-display font-semibold text-white text-lg">
                Privacy & Confidentiality Notice
              </h2>
              <button onClick={onClose} className="text-white/70 hover:text-white">
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="p-8 overflow-y-auto space-y-5 text-[#111827] font-body text-[15px] leading-relaxed">
              <p className="font-display font-semibold text-[#0B3D4A]">
                Your information is handled securely and used only to generate and improve your organisation's funding-readiness assessment.
              </p>
              <p>
                Everything you share with DoDiligence is securely stored and used to
                generate your funding-readiness assessment. We do not sell or share your
                organisation's information with any third party without your consent,
                except where required to do so by law.
              </p>

              <div>
                <p className="font-display font-semibold text-[#0B3D4A] mb-2">
                  What we collect:
                </p>
                <ul className="space-y-1.5 text-[#4B5563]">
                  <li className="flex items-start gap-2">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#0B3D4A]" />
                    Your organisation's name, registration type, state, and year of establishment
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#0B3D4A]" />
                    Your answers to the 27 assessment documents
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#0B3D4A]" />
                    Your email address, if you choose to share your report or claim the TMI checklist
                  </li>
                </ul>
              </div>

              <div>
                <p className="font-display font-semibold text-[#0B3D4A] mb-2">
                  What we do not do:
                </p>
                <ul className="space-y-1.5 text-[#4B5563]">
                  <li className="flex items-start gap-2">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#0B3D4A]" />
                    We do not sell your organisation's information
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#0B3D4A]" />
                    We do not share your assessment with funders, donors or external organisations without your consent
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#0B3D4A]" />
                    We do not use your information for advertising or commercial profiling
                  </li>
                </ul>
              </div>

              <div>
                <p className="font-display font-semibold text-[#0B3D4A] mb-2">
                  Why we ask:
                </p>
                <p className="text-[#4B5563]">
                  The information you provide is used only to personalise your assessment and generate your report.
                </p>
              </div>

              <div>
                <p className="font-display font-semibold text-[#0B3D4A] mb-2">
                  Your session:
                </p>
                <p className="text-[#4B5563]">
                  Your assessment responses are securely stored so you can continue
                  your assessment and review your results later.
                </p>
              </div>

              {/* ✅ FINAL FIX */}
              <div className="text-sm text-[#374151] mt-4">
                <p>
                  DoDiligence is an initiative of The Metropolitan Institute. For any questions about how your data is handled, write to us at:
                </p>

                <a
                  href="mailto:namaste@themetropolitaninstitute.com"
                  className="block mt-2 text-[#1A6478] hover:underline font-medium break-all"
                >
                  namaste@themetropolitaninstitute.com
                </a>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 pt-0">
              <button
                onClick={onAccept}
                className="w-full py-3 rounded-xl bg-[#C4872A] text-white font-display font-semibold text-sm hover:bg-[#A8711F]"
              >
                I understand
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfidentialityModal;