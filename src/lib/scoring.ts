import { PARAMETERS, AnswerStatus, type ParameterSection } from "./assessment-data";

export type Tier = "Needs Foundation" | "Building Strength" | "Funding Ready" | "Grant Champion";

export interface ParameterScore {
  id: string;
  name: string;
  score: number;
  redFlagCount: number;
  totalMandatory: number;
  answeredMandatory: number;
  missingMandatory: number;
}

export interface ScoringResult {
  parameterScores: ParameterScore[];
  overallScore: number;
  tier: Tier;
  redFlags: string[];
  csrIneligible: boolean;
}

const STATUS_WEIGHTS: Record<string, number> = {
  yes: 1.0,
  no: 0.0,
};

export function computeScores(
  answers: Record<string, AnswerStatus>,
  foreignFunds: boolean,
  filteredParams?: ParameterSection[]
): ScoringResult {
  const redFlags: string[] = [];
  const csrCriticalIds = ["registration-cert", "12a-registration", "80g-certification", "csr1-registration"];
  const params = filteredParams || PARAMETERS;

  const parameterScores: ParameterScore[] = params.map((param) => {
    const applicableDocs = param.documents;
    const mandatoryDocs = applicableDocs.filter((d) => d.category === "mandatory");
    let score = 0;
    let redFlagCount = 0;

    if (mandatoryDocs.length === 0) {
      if (applicableDocs.length === 0) return { id: param.id, name: param.name, score: 100, redFlagCount: 0, totalMandatory: 0, answeredMandatory: 0, missingMandatory: 0 };
      const sum = applicableDocs.reduce((acc, doc) => {
        const status = answers[doc.id];
        return acc + (status ? STATUS_WEIGHTS[status] ?? 0 : 0);
      }, 0);
      score = (sum / applicableDocs.length) * 100;
      return { id: param.id, name: param.name, score: Math.round(score), redFlagCount: 0, totalMandatory: 0, answeredMandatory: applicableDocs.length, missingMandatory: 0 };
    }

    const sum = mandatoryDocs.reduce((acc, doc) => {
      const status = answers[doc.id];
      if (status === "no") {
        redFlags.push(doc.id);
        redFlagCount++;
      }
      return acc + (status ? STATUS_WEIGHTS[status] ?? 0 : 0);
    }, 0);

    score = (sum / mandatoryDocs.length) * 100;
    const answeredMandatory = mandatoryDocs.filter((d) => answers[d.id] != null).length;
    const missingMandatory = mandatoryDocs.filter((d) => answers[d.id] === "no").length;

    return { id: param.id, name: param.name, score: Math.round(score), redFlagCount, totalMandatory: mandatoryDocs.length, answeredMandatory, missingMandatory };
  });

  const overallScore = Math.round(
    parameterScores.reduce((acc, ps) => {
      const param = PARAMETERS.find((p) => p.id === ps.id);
      return acc + ps.score * (param?.weight || 0);
    }, 0)
  );

  const tier = getTier(overallScore);
  const csrIneligible = csrCriticalIds.some((id) => answers[id] === "no");

  return { parameterScores, overallScore, tier, redFlags: [...new Set(redFlags)], csrIneligible };
}

export function getTier(score: number): Tier {
  if (score < 40) return "Needs Foundation";
  if (score < 65) return "Building Strength";
  if (score < 85) return "Funding Ready";
  return "Grant Champion";
}

export function getTierColor(tier: Tier): string {
  switch (tier) {
    case "Needs Foundation": return "#B91C1C";
    case "Building Strength": return "#B45309";
    case "Funding Ready": return "#2563EB";
    case "Grant Champion": return "#15803D";
  }
}

export function getScoreColor(score: number): string {
  if (score < 40) return "#B91C1C";
  if (score < 65) return "#B45309";
  if (score < 85) return "#2563EB";
  return "#15803D";
}

export function getNextTier(tier: Tier): Tier | null {
  switch (tier) {
    case "Needs Foundation": return "Building Strength";
    case "Building Strength": return "Funding Ready";
    case "Funding Ready": return "Grant Champion";
    case "Grant Champion": return null;
  }
}

function getTimeEstimate(docId: string, priority: string): string {
  if (docId === "third-party-impact") return "2–3 months";
  if (priority === "Critical") return "Immediate";
  return "2–4 weeks";
}

export function getPriorityActions(
  answers: Record<string, AnswerStatus>,
  foreignFunds: boolean,
  limit = 3,
  filteredParams?: ParameterSection[]
) {
  const actions: { docId: string; docName: string; paramName: string; priority: string; actionStep: string; timeEstimate: string }[] = [];
  const params = filteredParams || PARAMETERS;

  for (const param of params) {
    for (const doc of param.documents) {
      const status = answers[doc.id];
      if (status === "no") {
        let priority = "Growth";
        if (doc.category === "mandatory") priority = "Critical";
        else if (doc.category === "conditional") priority = "Standard";

        actions.push({
          docId: doc.id,
          docName: doc.name,
          paramName: param.name,
          priority,
          actionStep: doc.actionStep,
          timeEstimate: getTimeEstimate(doc.id, priority),
        });
      }
    }
  }

  const priorityOrder = ["Critical", "Standard", "Growth"];
  actions.sort((a, b) => priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority));
  return limit ? actions.slice(0, limit) : actions;
}

export function getKeyTakeaways(
  parameterScores: ParameterScore[],
  answers: Record<string, AnswerStatus>,
  foreignFunds: boolean,
  filteredParams?: ParameterSection[]
) {
  const takeaways: string[] = [];
  const params = filteredParams || PARAMETERS;

  const strongest = [...parameterScores].sort((a, b) => b.score - a.score)[0];
  if (strongest) {
    takeaways.push(`Your strongest area is ${strongest.name} at ${strongest.score}%.`);
  }

  const weakest = [...parameterScores].sort((a, b) => a.score - b.score)[0];
  if (weakest && weakest.score < 100) {
    takeaways.push(`${weakest.name} needs the most attention with a score of ${weakest.score}%.`);
  }

  for (const param of params) {
    for (const doc of param.documents) {
      if (doc.category === "good-to-have" && answers[doc.id] === "no") {
        takeaways.push(`Quick win: Preparing your ${doc.name} could strengthen your ${param.name} profile.`);
        return takeaways;
      }
    }
  }

  return takeaways;
}
