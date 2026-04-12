import React, { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react";
import { AnswerStatus, PARAMETERS, SECTION_ORDER } from "@/lib/assessment-data";
import { getFilteredParameters } from "@/lib/documents";
import { computeScores, type ScoringResult } from "@/lib/scoring";

export type RegistrationType = "trust" | "society" | "section8" | "";

export interface OrgProfile {
  name: string;
  registrationType: RegistrationType;
  state: string;
  city: string;
  yearEstablished: string;
  foreignFunds: boolean;
}

interface AssessmentState {
  orgProfile: OrgProfile;
  answers: Record<string, AnswerStatus>;
  currentSectionIndex: number;
  completedSections: string[];
  confidentialityAccepted: boolean;
  setOrgProfile: (p: OrgProfile) => void;
  setAnswer: (docId: string, status: AnswerStatus) => void;
  setCurrentSectionIndex: (i: number) => void;
  setConfidentialityAccepted: (v: boolean) => void;
  scoring: ScoringResult;
  resetAll: () => void;
  isProfileComplete: boolean;
  getSectionProgress: (sectionId: string) => { answered: number; total: number };
  getOverallProgress: () => number;
  isSectionComplete: (sectionId: string) => boolean;
  isSectionUnlocked: (sectionId: string) => boolean;
  markSectionComplete: (sectionId: string) => void;
  getFilteredParams: () => ReturnType<typeof getFilteredParameters>;
}

const defaultProfile: OrgProfile = { name: "", registrationType: "", state: "", city: "", yearEstablished: "", foreignFunds: false };

const AssessmentContext = createContext<AssessmentState | null>(null);

export function AssessmentProvider({ children }: { children: ReactNode }) {
  const [orgProfile, setOrgProfile] = useState<OrgProfile>(defaultProfile);
  const [answers, setAnswers] = useState<Record<string, AnswerStatus>>({});
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const [confidentialityAccepted, setConfidentialityAccepted] = useState(false);

  const setAnswer = useCallback((docId: string, status: AnswerStatus) => {
    setAnswers((prev) => ({ ...prev, [docId]: status }));
  }, []);

  const getFilteredParams = useCallback(() => {
    return getFilteredParameters(orgProfile.registrationType as any, orgProfile.foreignFunds);
  }, [orgProfile.registrationType, orgProfile.foreignFunds]);

  const scoring = useMemo(() => {
    const filteredParams = getFilteredParams();
    return computeScores(answers, orgProfile.foreignFunds, filteredParams);
  }, [answers, orgProfile.foreignFunds, getFilteredParams]);

  const isProfileComplete = orgProfile.name.trim() !== "" && orgProfile.registrationType !== "" && orgProfile.state !== "" && orgProfile.yearEstablished.length === 4;

  const getSectionProgress = useCallback((sectionId: string) => {
    const filteredParams = getFilteredParameters(orgProfile.registrationType as any, orgProfile.foreignFunds);
    const param = filteredParams.find((p) => p.id === sectionId);
    if (!param) return { answered: 0, total: 0 };
    const answered = param.documents.filter((d) => answers[d.id] != null).length;
    return { answered, total: param.documents.length };
  }, [answers, orgProfile.registrationType, orgProfile.foreignFunds]);

  const isSectionComplete = useCallback((sectionId: string) => {
    const filteredParams = getFilteredParameters(orgProfile.registrationType as any, orgProfile.foreignFunds);
    const param = filteredParams.find((p) => p.id === sectionId);
    if (!param) return false;
    return param.documents.every((d) => answers[d.id] != null);
  }, [answers, orgProfile.registrationType, orgProfile.foreignFunds]);

  const isSectionUnlocked = useCallback((sectionId: string) => {
    const idx = SECTION_ORDER.indexOf(sectionId);
    if (idx <= 0) return true;
    const prevSection = SECTION_ORDER[idx - 1];
    return isSectionComplete(prevSection);
  }, [isSectionComplete]);

  const markSectionComplete = useCallback((sectionId: string) => {
    setCompletedSections((prev) => prev.includes(sectionId) ? prev : [...prev, sectionId]);
  }, []);

  const getOverallProgress = useCallback(() => {
    let total = 0;
    let answered = 0;
    const filteredParams = getFilteredParameters(orgProfile.registrationType as any, orgProfile.foreignFunds);
    filteredParams.forEach((p) => {
      const prog = getSectionProgress(p.id);
      total += prog.total;
      answered += prog.answered;
    });
    return total === 0 ? 0 : Math.round((answered / total) * 100);
  }, [getSectionProgress, orgProfile.registrationType, orgProfile.foreignFunds]);

  const resetAll = useCallback(() => {
    setOrgProfile(defaultProfile);
    setAnswers({});
    setCurrentSectionIndex(0);
    setCompletedSections([]);
    setConfidentialityAccepted(false);
  }, []);

  return (
    <AssessmentContext.Provider value={{
      orgProfile, answers, currentSectionIndex, completedSections, confidentialityAccepted,
      setOrgProfile, setAnswer, setCurrentSectionIndex, setConfidentialityAccepted,
      scoring, resetAll, isProfileComplete, getSectionProgress, getOverallProgress,
      isSectionComplete, isSectionUnlocked, markSectionComplete, getFilteredParams,
    }}>
      {children}
    </AssessmentContext.Provider>
  );
}

export function useAssessment() {
  const ctx = useContext(AssessmentContext);
  if (!ctx) throw new Error("useAssessment must be used within AssessmentProvider");
  return ctx;
}
