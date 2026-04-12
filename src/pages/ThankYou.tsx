import { useNavigate } from "react-router-dom";
import { useAssessment } from "@/store/assessment-context";
import { motion } from "framer-motion";

const ThankYou = () => {
  const navigate = useNavigate();
  const { resetAll } = useAssessment();

  const handleRetake = () => {
    resetAll();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ backgroundColor: "#F8F6F1" }}>
      <motion.div
        className="max-w-[560px] w-full mx-auto text-center py-20"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
      >
        {/* TMI Logo */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } }}
          className="flex justify-center mb-10"
        >
          <div className="w-[200px] h-[60px] rounded-lg flex items-center justify-center" style={{ backgroundColor: "#0B3D4A" }}>
            <span className="text-white font-body font-medium text-[13px] tracking-[0.08em]">THE METROPOLITAN INSTITUTE</span>
          </div>
        </motion.div>

        {/* Gold rule */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } }}
          className="flex justify-center mb-10"
        >
          <div className="w-12 h-0.5 rounded-sm" style={{ backgroundColor: "#C4872A" }} />
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } }}
          className="font-display font-bold text-[#0B3D4A] text-3xl md:text-4xl mb-4"
        >
          You've taken the first step.
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } }}
          className="font-body text-[#4B5563] text-lg leading-[1.7] mb-12"
        >
          Thank you for using DoDiligence. Knowing where you stand is the beginning of getting where you want to go.
        </motion.p>

        {/* Buttons */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } }}
          className="flex flex-col gap-4 max-w-[320px] mx-auto"
        >
          <a
            href="https://www.themetropolitaninstitute.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 rounded-[10px] bg-[#C4872A] text-white font-display font-semibold text-[15px] text-center hover:bg-[#A8711F] transition-all"
            style={{ height: "52px", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            Learn more about TMI →
          </a>
          <button
            onClick={handleRetake}
            className="w-full py-3.5 rounded-[10px] bg-white border-[1.5px] border-[#0B3D4A] text-[#0B3D4A] font-display font-semibold text-[15px] hover:bg-[#E4F2F6] transition-all"
            style={{ height: "52px" }}
          >
            Retake Assessment
          </button>
        </motion.div>

        {/* Footer */}
        <motion.p
          variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } }}
          className="text-[13px] text-[#9CA3AF] mt-16"
        >
          DoDiligence v1.0 · Built by The Metropolitan Institute · © 2026
        </motion.p>
      </motion.div>
    </div>
  );
};

export default ThankYou;
