import { useAssessment } from "@/store/assessment-context";

const ProgressBar = () => {
  const { getOverallProgress } = useAssessment();
  const progress = getOverallProgress();

  return (
    <div className="fixed top-16 left-0 right-0 z-40 h-1 bg-[#E5E7EB]">
      <div
        className="h-full bg-[#0B3D4A] rounded-r-sm transition-all duration-[400ms] ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default ProgressBar;
