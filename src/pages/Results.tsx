import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, AlertTriangle, Compass, Mountain, Flag } from "lucide-react";
import { useAssessment } from "@/store/assessment-context";
import { getParameterIcon } from "@/lib/assessment-data";
import { getPriorityActions } from "@/lib/scoring";
import { motion, AnimatePresence } from "framer-motion";

const priorityColors: Record<string, { border: string; bg: string; text: string }> = {
  Critical: { border: "border-l-[#B91C1C]", bg: "bg-[#FFF5F5]", text: "text-[#B91C1C]" },
  Standard: { border: "border-l-[#B45309]", bg: "bg-[#FFFBF0]", text: "text-[#B45309]" },
  Growth: { border: "border-l-[#15803D]", bg: "bg-[#F0FDF4]", text: "text-[#15803D]" },
};

const successSentences: Record<string, string> = {
  legal: "Your legal foundation is solid. Funders can verify your registration and tax status without any gaps.",
  financial: "Your financial documentation is in order. Audited accounts and ITR filings signal strong transparency to donors.",
  governance: "Your governance structure is well-documented. Board records and KYC demonstrate institutional maturity.",
  operational: "Your operational documentation supports credibility. Impact and structure are clearly evidenced.",
  strategic: "You have a documented strategic direction. This signals long-term thinking to institutional funders.",
  communications: "Your communications presence is established. Beneficiary stories and a website strengthen donor trust.",
};

const attentionSentences: Record<string, string> = {
  legal: "A few statutory documents still need attention. Putting these in place will make funding applications go much more smoothly.",
  financial: "Closing your financial documentation gaps will open the door to more institutional funding. Audited accounts are something most donors like to see.",
  governance: "Governance records are still coming together. CSR funders typically look for board documentation as a baseline.",
  operational: "A few operational documents are still missing. These help demonstrate your capacity to manage grants effectively.",
  strategic: "No strategic documents are in place yet. Adding them isn't essential, but it will widen your appeal to larger institutional funders.",
  communications: "Communication materials are still on the way. Building a visible presence will strengthen funder confidence over time.",
};

const Results = () => {
  const navigate = useNavigate();
  const { answers, orgProfile, scoring, getFilteredParams } = useAssessment();
  const [openSection, setOpenSection] = useState<string | null>(null);
  const filteredParams = getFilteredParams();

  const hasAnswers = Object.values(answers).some((answer) => answer !== null);
  if (!hasAnswers) {
    return (
      <div className="pt-24 pb-16 px-6 min-h-screen flex items-center justify-center" style={{ backgroundColor: "#F8F6F1" }}>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 text-center max-w-md">
          <Compass size={40} className="text-[#C4872A] mx-auto mb-4" />
          <h2 className="font-display font-bold text-[#111827] text-xl mb-2">No results yet</h2>
          <p className="text-[#4B5563] text-sm mb-6">Complete all 6 sections to see your funding-readiness report.</p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 rounded-xl bg-[#C4872A] text-white font-display font-semibold text-sm hover:bg-[#A8711F] transition-all"
          >
            Start Assessment
          </button>
        </div>
      </div>
    );
  }

  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? null : id);
  };

  // Colour logic:
  // RED   -> any mandatory document incomplete
  // AMBER -> all mandatory complete, optional documents still pending
  // GREEN -> both mandatory and optional complete
  const getSectionStatus = (paramId: string) => {
    const param = filteredParams.find((p) => p.id === paramId)!;
    const applicableDocs = param.documents;
    const mandatoryDocs = applicableDocs.filter((d) => d.category === "mandatory");
    const nonMandatoryDocs = applicableDocs.filter((d) => d.category !== "mandatory");
    const hasMandatoryNo = mandatoryDocs.some((d) => answers[d.id] === "no");
    const allMandatoryYes = mandatoryDocs.length === 0 || mandatoryDocs.every((d) => answers[d.id] === "yes");
    const allNonMandatoryYes = nonMandatoryDocs.length === 0 || nonMandatoryDocs.every((d) => answers[d.id] === "yes");

    if (mandatoryDocs.length > 0 && hasMandatoryNo) {
      return { color: "#B91C1C", bgTint: "bg-[#FFF5F5]" };
    }
    if (allMandatoryYes && !allNonMandatoryYes) {
      return { color: "#D97706", bgTint: "bg-[#FFFBF0]" };
    }
    return { color: "#15803D", bgTint: "bg-[#F0FDF4]" };
  };

  // Highest-priority open action for a section, so priority stays visible even when collapsed
  const getSectionPriority = (param: any, actions: any[]) => {
    const docPriorities = param.documents
      .map((doc: any) => actions.find((a: any) => a.docId === doc.id))
      .filter(Boolean)
      .map((a: any) => a.priority);

    if (docPriorities.includes("Critical")) return "Critical";
    if (docPriorities.includes("Standard")) return "Standard";
    if (docPriorities.includes("Growth")) return "Growth";
    return null;
  };

  // Overall completion score for a health area, used for Focus Area / The Peak
  const getSectionScore = (paramId: string) => {
    const param = filteredParams.find((p) => p.id === paramId)!;
    const applicableDocs = param.documents;
    if (applicableDocs.length === 0) return 0;
    const yesCount = applicableDocs.filter((d) => answers[d.id] === "yes").length;
    return (yesCount / applicableDocs.length) * 100;
  };

  const hasMandatoryNo = filteredParams.some((p) => p.documents.some((d) => d.category === "mandatory" && answers[d.id] === "no"));

  // All priority actions (used by every accordion)
  const allActions = getPriorityActions(answers, orgProfile.foreignFunds, 0, filteredParams);

  // Totals across all six health areas, for The Climb summary
  const totalMandatory = filteredParams.reduce((sum, p) => sum + p.documents.filter((d) => d.category === "mandatory").length, 0);
  const totalMandatoryDone = filteredParams.reduce(
    (sum, p) => sum + p.documents.filter((d) => d.category === "mandatory" && answers[d.id] === "yes").length,
    0
  );
  const totalOptional = filteredParams.reduce((sum, p) => sum + p.documents.filter((d) => d.category !== "mandatory").length, 0);
  const totalOptionalDone = filteredParams.reduce(
    (sum, p) => sum + p.documents.filter((d) => d.category !== "mandatory" && answers[d.id] === "yes").length,
    0
  );

  // Weakest area -> single Focus Area. Strongest area above 75% -> The Peak.
  const paramScores = filteredParams
    .filter((p) => p.documents.length > 0)
    .map((p) => ({ param: p, score: getSectionScore(p.id) }));

  const focusArea = paramScores.length > 0 ? paramScores.reduce((min, cur) => (cur.score < min.score ? cur : min)) : null;

  const peakCandidates = paramScores.filter((p) => p.score > 75);
  const peakArea = peakCandidates.length > 0 ? peakCandidates.reduce((max, cur) => (cur.score > max.score ? cur : max)) : null;

  const climbSummary =
    totalMandatory > 0
      ? `You've completed ${totalMandatoryDone} of ${totalMandatory} mandatory documents and ${totalOptionalDone} of ${totalOptional} optional documents across your six health areas. ${
          focusArea ? `${focusArea.param.name} is the next stretch of the climb, ` : ""
        }${peakArea ? `while ${peakArea.param.name} is already showing real strength.` : "and every area still has room to grow — that's normal this early in the climb."}`
      : `You've completed ${totalOptionalDone} of ${totalOptional} optional documents across your six health areas. ${
          peakArea ? `${peakArea.param.name} is already showing real strength.` : "Keep going — your profile is still taking shape."
        }`;

  const DonutChart = ({ percent, color }: { percent: number; color: string }) => {
    const radius = 26;
    const stroke = 6;
    const normalizedRadius = radius - stroke / 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (percent / 100) * circumference;

    return (
      <div className="relative w-[64px] h-[64px]">
        <svg height="64" width="64" role="img" aria-label={`Progress ${Math.round(percent)}%`}>
          <circle
            stroke="#E5E7EB"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx="32"
            cy="32"
          />
          <circle
            stroke={color}
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference + " " + circumference}
            style={{ strokeDashoffset, transition: "stroke-dashoffset 0.6s ease" }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx="32"
            cy="32"
          />
        </svg>

        <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold">
          {Math.round(percent)}%
        </div>
      </div>
    );
  };

  // Reusable accordion with simplified UI
  const HealthAccordion = ({ param }: { param: any }) => {
    const Icon = getParameterIcon(param.iconName);
    const isOpen = openSection === param.id;
    const status = getSectionStatus(param.id);
    const priority = getSectionPriority(param, allActions);
    const applicableDocs = param.documents;
    const mandatoryDocs = applicableDocs.filter((d: any) => d.category === "mandatory");
    const optionalDocs = applicableDocs.filter((d: any) => d.category !== "mandatory");
    const mandatoryYes = mandatoryDocs.filter((d: any) => answers[d.id] === "yes").length;
    const optionalYes = optionalDocs.filter((d: any) => answers[d.id] === "yes").length;

    // Donut percentage reflects progress across ALL applicable documents (mandatory + optional).
    // Status colour (RED/AMBER/GREEN) is unaffected and still comes from getSectionStatus.
    const completedDocuments = applicableDocs.filter((d: any) => answers[d.id] === "yes").length;
    const totalDocuments = applicableDocs.length;
    const barPercent = totalDocuments === 0 ? 0 : (completedDocuments / totalDocuments) * 100;

    return (
      <div
        className={`rounded-xl overflow-hidden border border-[#E5E7EB] border-l-4 shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.01] ${status.bgTint}`}
        style={{ borderLeftColor: status.color }}
      >
        <button
          onClick={() => toggleSection(param.id)}
          aria-expanded={isOpen}
          className="w-full p-5 flex items-center justify-between gap-4 hover:bg-[#F8F6F1]/50 transition-colors"
        >
          <div className="flex items-center gap-4">
            <Icon size={22} style={{ color: status.color }} />
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1.5">
                <span className="font-display font-semibold text-[#0B3D4A] text-[17px]">
                  {param.name}
                </span>
                {priority && (
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium uppercase tracking-wide ${
                      (priorityColors[priority] || priorityColors.Growth).text
                    }`}
                    style={{ backgroundColor: `${status.color}15` }}
                  >
                    {priority}
                  </span>
                )}
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-0.5 text-xs text-[#6B7280] font-body">
                <span>
                  Mandatory completed: <span className="font-semibold text-[#111827]">{mandatoryYes} / {mandatoryDocs.length}</span>
                </span>
                <span>
                  Optional completed: <span className="font-semibold text-[#111827]">{optionalYes} / {optionalDocs.length}</span>
                </span>
              </div>
            </div>
          </div>

          <DonutChart percent={barPercent} color={status.color} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="border-t border-[#E5E7EB] p-4 space-y-1">
                {applicableDocs.map((doc: any) => {
                  const docStatus = answers[doc.id];
                  const docAction = allActions.find((a: any) => a.docId === doc.id);

                  return (
                    <div key={doc.id}>
                      <div className="flex items-center gap-3 py-2 border-b border-[#F3F4F6]">
                        {docStatus === "yes" ? (
                          <CheckCircle size={16} className="text-[#15803D] shrink-0" />
                        ) : (
                          <XCircle size={16} className="text-[#B91C1C] shrink-0" />
                        )}
                        <span className="text-sm text-[#111827] font-body">{doc.name}</span>
                      </div>

                      {docAction && docStatus === "no" && (
                        <div
                          className={`ml-4 my-2 rounded-md p-3 text-xs space-y-1.5 border-l-[3px] ${
                            doc.category === "mandatory"
                              ? "bg-[#FFF5F5] border-l-[#B91C1C]"
                              : "bg-[#FFFBF0] border-l-[#D97706]"
                          }`}
                        >
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium uppercase tracking-wide ${
                              (priorityColors[docAction.priority] || priorityColors.Growth).text
                            }`}
                            style={{ backgroundColor: `${status.color}10` }}
                          >
                            {docAction.priority}
                          </span>
                          <p className="text-[#111827]">
                            <span className="font-medium">What to do:</span> {doc.actionStep}
                          </p>
                          <p className="text-[#6B7280]">
                            <span className="font-medium text-[#111827]">Estimated time:</span> {docAction.timeEstimate}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      {/* CSR Alert Banner - shown once only */}
      {scoring.csrIneligible && (
        <div className="px-6 py-4 mt-16" style={{ backgroundColor: "#B91C1C" }}>
          <div className="max-w-4xl mx-auto flex items-start gap-3">
            <AlertTriangle size={20} className="text-white shrink-0 mt-0.5" />
            <p className="text-sm font-medium text-white">
              One or more statutory documents are missing. This organisation is not currently eligible for CSR or institutional funding. See the details below.
            </p>
          </div>
        </div>
      )}

      {/* Dark Header */}
      <div className={`${scoring.csrIneligible ? "" : "pt-16"} px-6 py-8`} style={{ backgroundColor: "#0B3D4A" }}>
        <div className="max-w-4xl mx-auto">
          <h1 className="font-display font-bold text-white text-xl md:text-[26px]">
            {orgProfile.name || "Organisation"}'s Results
          </h1>
          <span className="text-white/60 text-[13px]">
            {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
          </span>
        </div>
      </div>

      <div className="px-6 py-8" style={{ backgroundColor: "#F8F6F1" }}>
        <div className="max-w-4xl mx-auto">
          {/* The Climb - concise journey summary */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden mb-6 p-6 md:p-8">
            <div className="flex items-center gap-2 mb-4">
              <Compass size={20} className="text-[#C4872A]" />
              <h2 className="font-display font-semibold text-[#0B3D4A] text-lg">The Climb</h2>
            </div>
            <p className="text-sm text-[#111827] font-body leading-relaxed">{climbSummary}</p>
          </div>

          {/* Focus Area - single weakest health area */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden mb-6 p-6 md:p-8">
            <div className="flex items-center gap-2 mb-3">
              <Flag size={18} className="text-[#C4872A]" />
              <h2 className="font-display font-semibold text-[#0B3D4A] text-base">Focus Area</h2>
            </div>
            {focusArea ? (
              <>
                <p className="font-display font-semibold text-[#111827] text-[15px] mb-1">{focusArea.param.name}</p>
                <p className="text-sm text-[#4B5563] font-body leading-relaxed">
                  {attentionSentences[focusArea.param.id] || `${focusArea.param.name} is where focusing your energy next will make the biggest difference.`}
                </p>
              </>
            ) : (
              <p className="text-sm text-[#4B5563] font-body">Great work — no single area stands out as needing focus right now.</p>
            )}
          </div>

          {/* The Peak - highest scoring area above 75%, or encouragement */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden mb-8 p-6 md:p-8">
            <div className="flex items-center gap-2 mb-3">
              <Mountain size={18} className="text-[#15803D]" />
              <h2 className="font-display font-semibold text-[#0B3D4A] text-base">The Peak</h2>
            </div>
            {peakArea ? (
              <>
                <p className="font-display font-semibold text-[#111827] text-[15px] mb-1">{peakArea.param.name}</p>
                <p className="text-sm text-[#4B5563] font-body leading-relaxed">
                  {successSentences[peakArea.param.id] || `${peakArea.param.name} is a genuine strength for your organisation.`}
                </p>
              </>
            ) : (
              <p className="text-sm text-[#4B5563] font-body">Still finding your peak! No area above 75% yet.</p>
            )}
          </div>

          {/* 6 Health Areas */}
          <h2 className="font-display font-bold text-[#0B3D4A] text-[22px] mb-1">Your 6 Health Areas</h2>
          <p className="text-sm text-[#6B7280] font-body mb-6">Select any area to see your detailed status.</p>

          {/* All sections with simplified accordion */}
          <div className="space-y-4 mb-10">
            {filteredParams.map((param) => (
              <HealthAccordion key={param.id} param={param} />
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-4 no-print">
            <Link
              to="/share"
              className="flex-1 py-3 rounded-xl bg-[#C4872A] text-white font-display font-semibold text-sm text-center hover:bg-[#A8711F] transition-all"
            >
              Share & Export
            </Link>
            <a
              href="https://themetropolitaninstitute.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 rounded-xl border-2 border-[#0B3D4A] text-[#0B3D4A] font-display font-semibold text-sm text-center hover:bg-[#E4F2F6] transition-all"
            >
              Connect with Experts
            </a>
          </div>

          {/* CTA section with both links */}
          <div className="mb-4 no-print flex flex-col">
            {hasMandatoryNo && (
              <Link
                to="/gift"
                className="inline-flex items-center gap-1 text-sm text-[#C4872A] hover:underline font-medium transition-colors"
              >
                Claim checklists to strengthen your gaps. <span>→</span>
              </Link>
            )}
            <button
              onClick={() => navigate("/")}
              className={`inline-flex items-center gap-1 text-sm text-[#C4872A] hover:underline font-medium transition-colors ${hasMandatoryNo ? "mt-2" : ""}`}
            >
              Start assessment for a new organisation <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;