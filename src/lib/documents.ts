import { PARAMETERS, type ParameterSection, type AssessmentDocument } from "./assessment-data";

type OrgType = "trust" | "society" | "section8" | "";

/**
 * Returns a filtered copy of PARAMETERS where documents are adjusted
 * based on the organisation type and foreign funds status.
 */
export function getFilteredParameters(orgType: OrgType, foreignFunds: boolean): ParameterSection[] {
  return PARAMETERS.map((param) => {
    const filteredDocs = param.documents
      .filter((doc) => {
        // Filter FCRA by foreign funds
        if (doc.category === "conditional" && doc.condition === "foreignFunds") {
          return foreignFunds;
        }
        return true;
      })
      .map((doc) => {
        // Org-type-specific founding document
        if (doc.id === "trust-deed") {
          return getFoundingDocument(orgType, doc);
        }
        // Org-type-specific registration certificate label
        if (doc.id === "registration-cert") {
          return getRegistrationCertDocument(orgType, doc);
        }
        return doc;
      })
      .filter(Boolean) as AssessmentDocument[];

    return { ...param, documents: filteredDocs };
  });
}

function getFoundingDocument(orgType: OrgType, original: AssessmentDocument): AssessmentDocument | null {
  switch (orgType) {
    case "trust":
      return {
        ...original,
        name: "Trust Deed",
        purpose: "Defines your trust's objectives, governance structure, and rules of operation. Funders check alignment with their priorities.",
        whatItIs: "The founding legal document of your trust, executed on stamp paper and registered with the sub-registrar.",
        actionStep: "Retrieve from your founding records. If amendments were made, ensure you have the latest version certified by the managing trustee.",
      };
    case "society":
      return {
        ...original,
        name: "Memorandum of Association (MoA)",
        purpose: "Defines your society's objectives, governance structure, and rules. Funders check this for alignment with their priorities.",
        whatItIs: "The Memorandum of Association filed with the Registrar of Societies at the time of registration.",
        actionStep: "Retrieve from your founding records. If amendments were made, ensure you have the latest version certified by the governing body.",
      };
    case "section8":
      return {
        ...original,
        name: "Memorandum of Association (MoA) & Articles of Association (AoA)",
        purpose: "Defines your company's objectives, governance, and internal regulations. Required for all statutory filings and funder due diligence.",
        whatItIs: "The MoA and AoA filed with the Registrar of Companies (MCA) at incorporation.",
        actionStep: "Download from the MCA portal or retrieve from your company secretary. Ensure you have the latest amended versions.",
      };
    default:
      return original;
  }
}

function getRegistrationCertDocument(orgType: OrgType, original: AssessmentDocument): AssessmentDocument {
  const shared = {
    purpose: "Proves your organisation is a legally registered entity. Without it, no funder or government body will engage directly.",
    whatItIs: "The certificate issued by the Registrar (of Trusts, Societies, or Companies) confirming your legal existence.",
    actionStep: "Contact your state Registrar's office or check the MCA portal (for Section 8 companies). If lost, apply for a certified copy.",
  };
  switch (orgType) {
    case "trust":
      return { ...original, ...shared, name: "Registration Certificate — Registrar of Trusts" };
    case "society":
      return { ...original, ...shared, name: "Registration Certificate — Registrar of Societies" };
    case "section8":
      return { ...original, ...shared, name: "Certificate of Incorporation — Registrar of Companies (MCA)" };
    default:
      return { ...original, ...shared };
  }
}
