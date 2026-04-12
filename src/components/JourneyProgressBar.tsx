import { Scale, TrendingUp, Shield, Settings, Target, MessageSquare, Check } from "lucide-react";
import { useAssessment } from "@/store/assessment-context";
import { SECTION_ORDER } from "@/lib/assessment-data";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const sectionIcons: Record<string, any> = { Scale, TrendingUp, Shield, Settings, Target, MessageSquare };

const JourneyProgressBar = ({ currentSectionId }: { currentSectionId: string }) => {
  const navigate = useNavigate();
  const { getSectionProgress, isSectionComplete, isSectionUnlocked, getFilteredParams } = useAssessment();
  const filteredParams = getFilteredParams();
  const currentIndex = SECTION_ORDER.indexOf(currentSectionId);

  const handleNodeClick = (sectionId: string, index: number) => {
    if (!isSectionUnlocked(sectionId)) {
      const prevName = filteredParams[index - 1]?.name || "previous section";
      toast.info(`Answer all questions in ${prevName} first.`);
      return;
    }
    if (isSectionComplete(sectionId) && index < currentIndex) {
      toast.info("Going back will let you change answers. Your score will update automatically.", { duration: 3000 });
    }
    navigate(`/assessment/${sectionId}`);
  };

  return (
    <>
      {/* Desktop full bar */}
      <div className="hidden md:block mb-8" id="journey-progress-bar">
        <div className="relative flex items-center justify-between px-2">
          {/* Background track */}
          <div className="absolute left-[12px] right-[12px] top-1/2 -translate-y-1/2 h-1.5 bg-[#E5E7EB] rounded-[3px]" />

          {/* Filled segments */}
          {SECTION_ORDER.map((id, i) => {
            if (i === SECTION_ORDER.length - 1) return null;
            const progress = getSectionProgress(id);
            const fillPercent = progress.total === 0 ? 100 : (progress.answered / progress.total) * 100;
            const segmentWidth = `calc(${100 / (SECTION_ORDER.length - 1)}% - 4px)`;
            const segmentLeft = `calc(${(i / (SECTION_ORDER.length - 1)) * 100}% + 12px)`;

            return (
              <div
                key={`seg-${id}`}
                className="absolute top-1/2 -translate-y-1/2 h-1.5 bg-[#E5E7EB] rounded-[3px] overflow-hidden"
                style={{ left: segmentLeft, width: segmentWidth }}
              >
                <div
                  className="h-full bg-[#0B3D4A] rounded-[3px]"
                  style={{
                    width: `${isSectionComplete(id) ? 100 : fillPercent}%`,
                    transition: "width 300ms cubic-bezier(0.34, 1.56, 0.64, 1)",
                  }}
                />
              </div>
            );
          })}

          {/* Nodes */}
          {SECTION_ORDER.map((id, i) => {
            const param = filteredParams[i];
            if (!param) return null;
            const Icon = sectionIcons[param.iconName] || Scale;
            const complete = isSectionComplete(id);
            const active = id === currentSectionId;
            const unlocked = isSectionUnlocked(id);

            let nodeClass = "bg-[#E5E7EB] border-[#9CA3AF]";
            let iconClass = "text-[#9CA3AF]";
            let cursor = "cursor-not-allowed";

            if (complete) {
              nodeClass = "bg-[#0B3D4A] border-[#0B3D4A]";
              iconClass = "text-white";
              cursor = "cursor-pointer";
            } else if (active) {
              nodeClass = "bg-[#C4872A] border-[#C4872A] animate-pulse-ring";
              iconClass = "text-white";
              cursor = "cursor-pointer";
            } else if (unlocked) {
              nodeClass = "bg-white border-[#1A6478] border-2";
              iconClass = "text-[#1A6478]";
              cursor = "cursor-pointer";
            }

            return (
              <Tooltip key={id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => handleNodeClick(id, i)}
                    className={`relative z-10 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${nodeClass} ${cursor}`}
                  >
                    {complete ? <Check size={12} className={iconClass} /> : <Icon size={12} className={iconClass} />}
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  {!unlocked ? `Complete ${filteredParams[i - 1]?.name} to unlock` : param.name}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>

        {/* Labels below */}
        <div className="flex items-center justify-between px-2 mt-2">
          {SECTION_ORDER.map((id, i) => {
            const active = id === currentSectionId;
            const param = filteredParams[i];
            if (!param) return null;
            return (
              <span
                key={`label-${id}`}
                className={`text-[10px] font-medium text-center w-6 ${
                  active ? "text-[#C4872A]" : "text-[#9CA3AF]"
                }`}
              >
                {param.name.split(" ")[0]}
              </span>
            );
          })}
        </div>
      </div>

      {/* Mobile compact */}
      <div className="md:hidden mb-6 flex items-center gap-3">
        {(() => {
          const param = filteredParams[currentIndex];
          if (!param) return null;
          const Icon = sectionIcons[param.iconName] || Scale;
          return (
            <>
              <div className="w-8 h-8 rounded-full bg-[#C4872A] flex items-center justify-center">
                <Icon size={14} className="text-white" />
              </div>
              <span className="font-display font-semibold text-[#111827] text-sm">
                Step {currentIndex + 1} of 6 — {param.name}
              </span>
            </>
          );
        })()}
      </div>
    </>
  );
};

export default JourneyProgressBar;
