import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, ChevronDown, AlertTriangle, Compass } from "lucide-react";
import { useAssessment } from "@/store/assessment-context";
import { PARAMETERS, getParameterIcon } from "@/lib/assessment-data";
import { getPriorityActions, getScoreColor } from "@/lib/scoring";
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
  legal: "Critical statutory documents are missing. Without these, you will struggle with funding applications.",
  financial: "Financial documentation gaps may disqualify you from institutional funding. Audited accounts are non-negotiable for most donors.",
  governance: "Governance records are incomplete. CSR requires board documentation as a baseline.",
  operational: "Operational documents are missing. These demonstrate your capacity to manage grants effectively.",
  strategic: "No strategic documents are in place. While not critical, this limits your appeal to larger institutional funders.",
  communications: "Communication materials are absent. Building a visible presence strengthens funder confidence.",
};

const Results = () => {
  const navigate = useNavigate();
  const { answers, orgProfile, scoring, getFilteredParams } = useAssessment();
  const [openSection, setOpenSection] = useState<string | null>(null);
  const filteredParams = getFilteredParams();

  const hasAnswers = Object.keys(answers).length > 0;
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

  const getSectionStatus = (paramId: string) => {
    const param = filteredParams.find((p) => p.id === paramId)!;
    const applicableDocs = param.documents;
    const mandatoryDocs = applicableDocs.filter((d) => d.category === "mandatory");
    const nonMandatoryDocs = applicableDocs.filter((d) => d.category !== "mandatory");
    const hasMandatoryNo = mandatoryDocs.some((d) => answers[d.id] === "no");
    const allMandatoryYes = mandatoryDocs.every((d) => answers[d.id] === "yes");
    const allNonMandatoryYes = nonMandatoryDocs.every((d) => answers[d.id] === "yes");

    if (hasMandatoryNo) return { label: "Needs Attention", color: "#B91C1C", bgTint: "bg-[#FFF5F5]" };
    if (allMandatoryYes && !allNonMandatoryYes) return { label: "In Progress", color: "#D97706", bgTint: "bg-[#FFFBF0]" };
    if (allMandatoryYes && allNonMandatoryYes) return { label: "Complete", color: "#15803D", bgTint: "bg-[#F0FDF4]" };
    return { label: "In Progress", color: "#D97706", bgTint: "bg-[#FFFBF0]" };
  };

  const getSuccessAnalysis = () => {
    const lines: string[] = [];
    filteredParams.forEach((param) => {
      const mandatoryDocs = param.documents.filter((d) => d.category === "mandatory");
      const mandatoryYes = mandatoryDocs.filter((d) => answers[d.id] === "yes").length;
      if (mandatoryDocs.length > 0 && mandatoryYes === mandatoryDocs.length) {
        lines.push(successSentences[param.id] || `${param.name} is complete.`);
      } else if (mandatoryDocs.length > 0 && mandatoryYes > 0) {
        lines.push(`${param.name} is developing — ${mandatoryYes} of ${mandatoryDocs.length} mandatory documents are in place.`);
      }
    });
    return lines;
  };

  const getAttentionAnalysis = () => {
    const lines: string[] = [];
    filteredParams.forEach((param) => {
      const mandatoryDocs = param.documents.filter((d) => d.category === "mandatory");
      const hasMandatoryNo = mandatoryDocs.some((d) => answers[d.id] === "no");
      if (hasMandatoryNo) {
        lines.push(attentionSentences[param.id] || `${param.name} has mandatory gaps.`);
      }
    });
    return lines;
  };

  const successLines = getSuccessAnalysis();
  const attentionLines = getAttentionAnalysis();
  const hasMandatoryNo = filteredParams.some(p => p.documents.some(d => d.category === "mandatory" && answers[d.id] === "no"));

  // All priority actions (used by every accordion)
  const allActions = getPriorityActions(answers, orgProfile.foreignFunds, 0, filteredParams);

  // Reusable accordion with simplified UI
  const HealthAccordion = ({ param }: { param: any }) => {
    const Icon = getParameterIcon(param.iconName);
    const isOpen = openSection === param.id;
    const status = getSectionStatus(param.id);
    const applicableDocs = param.documents;
    const mandatoryDocs = applicableDocs.filter((d: any) => d.category === "mandatory");
    const mandatoryYes = mandatoryDocs.filter((d: any) => answers[d.id] === "yes").length;
    const barColor = status.color;
    const barPercent = mandatoryDocs.length > 0 ? (mandatoryYes / mandatoryDocs.length) * 100 : 100;

    return (
      <div
        className={`rounded-xl overflow-hidden border border-[#E5E7EB] border-l-4 shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.01] ${status.bgTint}`}
        style={{ borderLeftColor: status.color }}
      >
        <button
          onClick={() => toggleSection(param.id)}
          className="w-full p-5 flex items-center gap-4 hover:bg-[#F8F6F1]/50 transition-colors"
        >
          {/* Icon + Parameter name + Status pill */}
          <Icon size={22} style={{ color: status.color }} className="shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-display font-semibold text-[#0B3D4A] text-[17px]">{param.name}</span>
              <span
                className="px-3 py-0.5 rounded-full text-xs font-medium whitespace-nowrap"
                style={{ backgroundColor: `${status.color}15`, color: status.color }}
              >
                {status.label}
              </span>
            </div>
          </div>
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
                {/* Thinner progress bar */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 h-1 bg-[#E5E7EB] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${barPercent}%` }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      style={{ backgroundColor: barColor }}
                    />
                  </div>
                  <span className="font-mono text-sm font-bold" style={{ color: barColor }}>
                    {Math.round(barPercent)}%
                  </span>
                </div>

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
      {/* CSR Alert Banner */}
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
          {/* Key Successes + Red Flags */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden mb-8">
            <div className="grid md:grid-cols-2">
              <div className="p-6 md:p-8 bg-[#F0FDF4]/30 md:border-r md:border-[#E5E7EB]">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle size={18} className="text-[#15803D]" />
                  <h2 className="font-display font-semibold text-[#15803D] text-base">What you've got right</h2>
                </div>
                {successLines.length > 0 ? (
                  <ul className="space-y-3">
                    {successLines.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#15803D] shrink-0" />
                        <span className="text-[#111827] font-body leading-relaxed">{s}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-[#9CA3AF]">Complete the assessment to see your strengths here.</p>
                )}
              </div>

              <div className="p-6 md:p-8 bg-[#FFF5F5]/30">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle size={18} className="text-[#B91C1C]" />
                  <h2 className="font-display font-semibold text-[#B91C1C] text-base">What needs attention</h2>
                </div>
                {attentionLines.length > 0 ? (
                  <ul className="space-y-3">
                    {attentionLines.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#B91C1C] shrink-0" />
                        <span className="text-[#111827] font-body leading-relaxed">{f}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-[#15803D] font-medium">No critical gaps found. Review the Good to Have documents below to further strengthen your profile.</p>
                )}
              </div>
            </div>
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
              href="#"
              className="flex-1 py-3 rounded-xl border-2 border-[#0B3D4A] text-[#0B3D4A] font-display font-semibold text-sm text-center hover:bg-[#E4F2F6] transition-all"
            >
              Connect with us to support you in your journey!
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
              onClick={() => (window.location.href = "http://localhost:8080/")}
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