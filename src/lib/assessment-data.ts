import { Scale, TrendingUp, Shield, Settings, Target, MessageSquare } from "lucide-react";

export type DocumentCategory = "mandatory" | "conditional" | "good-to-have";
export type AnswerStatus = "yes" | "no" | null;

export interface AssessmentDocument {
  id: string;
  name: string;
  category: DocumentCategory;
  condition?: "foreignFunds" | "always";
  purpose: string;
  whatItIs: string;
  actionStep: string;
  conditionalNote?: string;
}

export interface ParameterSection {
  id: string;
  name: string;
  iconName: string;
  weight: number;
  documents: AssessmentDocument[];
}

export const PARAMETERS: ParameterSection[] = [
  {
    id: "legal",
    name: "Legal & Registration",
    iconName: "Scale",
    weight: 0.30,
    documents: [
      {
        id: "registration-cert",
        name: "Registration Certificate",
        category: "mandatory",
        purpose: "Proves your organisation is a legally registered entity. Without it, no funder or government body will engage directly.",
        whatItIs: "The certificate issued by the Registrar (of Trusts, Societies, or Companies) confirming your legal existence.",
        actionStep: "Contact your state Registrar's office or check the MCA portal (for Section 8 companies). If lost, apply for a certified copy."
      },
      {
        id: "trust-deed",
        name: "Trust Deed / MoA / AoA",
        category: "mandatory",
        purpose: "Defines your organisation's objectives, governance structure, and rules of operation. Funders check alignment with their priorities.",
        whatItIs: "The founding legal document — Trust Deed for trusts, Memorandum of Association for societies, or AoA for Section 8 companies.",
        actionStep: "Retrieve from your founding records. If amendments were made, ensure you have the latest version certified by your governing body."
      },
      {
        id: "12a-registration",
        name: "12AB Registration",
        category: "mandatory",
        purpose: "Grants income tax exemption. Without 12AB, your organisation pays tax on surplus and most institutional funders won't engage.",
        whatItIs: "A registration under Section 12AB of the Income Tax Act that exempts your income from tax.",
        actionStep: "Apply through the Income Tax e-filing portal (Form 10A or 10AB). Consult your CA for documentation. Processing takes 3–6 months."
      },
      {
        id: "80g-certification",
        name: "80G Certification",
        category: "mandatory",
        purpose: "Allows your donors to claim tax deductions. Essential for attracting CSR and individual philanthropy.",
        whatItIs: "A certification under Section 80G of the IT Act that makes donations to your organisation tax-deductible for donors.",
        actionStep: "Apply via Form 10G on the Income Tax portal. Ensure your 12AB is active first. Validity is typically 5 years under the new regime."
      },
      {
        id: "csr1-registration",
        name: "CSR-1 Registration",
        category: "mandatory",
        purpose: "Mandatory for receiving CSR funds from companies. Without CSR-1, companies cannot route their CSR spend to you.",
        whatItIs: "A registration on the MCA portal (Form CSR-1) that lists your organisation as eligible to receive CSR funding.",
        actionStep: "Register on the MCA portal. You'll need your 12AB/80G details, PAN, and a board resolution. Renewal is annual."
      },
      {
        id: "ngo-darpan",
        name: "NGO Darpan ID",
        category: "mandatory",
        purpose: "Required for receiving government grants. It's the national directory of NGOs maintained by NITI Aayog.",
        whatItIs: "A unique ID assigned after registering on the NGO Darpan portal (ngodarpan.gov.in).",
        actionStep: "Register at ngodarpan.gov.in with your registration certificate, PAN, and Aadhaar of the signatory. Approval takes 2–4 weeks."
      },
      {
        id: "pan-card",
        name: "PAN Card",
        category: "mandatory",
        purpose: "Required for all financial transactions, tax filings, and regulatory registrations. Every funder will ask for your organisation's PAN.",
        whatItIs: "Permanent Account Number issued by the Income Tax Department — a 10-digit alphanumeric identifier unique to your organisation.",
        actionStep: "Apply via the NSDL or UTIITSL portal using Form 49A. Processing takes 1–2 weeks. Ensure PAN is in the organisation's name, not a trustee's personal name."
      },
      {
        id: "tan-card",
        name: "TAN Card",
        category: "conditional",
        condition: "always",
        conditionalNote: "Required if your organisation makes payments above ₹30,000 per transaction to contractors, consultants, or service providers.",
        purpose: "Required for deducting Tax Deducted at Source (TDS) on payments. Without TAN, your organisation cannot legally deduct TDS — which is mandatory above the payment threshold.",
        whatItIs: "Tax Deduction Account Number issued by the Income Tax Department — a 10-digit alphanumeric number required for TDS compliance.",
        actionStep: "Apply via the NSDL portal using Form 49B. Processing takes 1–2 weeks. Required before making any payment that attracts TDS."
      },
      {
        id: "fcra-certificate",
        name: "FCRA Certificate",
        category: "conditional",
        condition: "foreignFunds",
        purpose: "Legally required to receive foreign contributions. Operating without FCRA while accepting foreign funds is a criminal offence.",
        whatItIs: "Registration under the Foreign Contribution (Regulation) Act, 2010, issued by the Ministry of Home Affairs.",
        actionStep: "Apply via the FCRA portal (fcraonline.nic.in). Requires 3 years of operations and audited accounts. Renewal every 5 years."
      },
      {
        id: "gst-registration",
        name: "GST Registration",
        category: "conditional",
        condition: "always",
        purpose: "Required if your organisation's annual receipts exceed ₹20 lakhs (₹10 lakhs for special category states). Some funders and government bodies also require GST registration regardless of turnover.",
        whatItIs: "A registration under the Goods and Services Tax Act, issued by the GST Council, giving your organisation a unique GSTIN.",
        actionStep: "Register on the GST portal (gst.gov.in) using your PAN, registration certificate, and bank details. Registration is free and processed within 7 working days."
      }
    ]
  },
  {
    id: "financial",
    name: "Financial",
    iconName: "TrendingUp",
    weight: 0.25,
    documents: [
      {
        id: "audited-financials",
        name: "3-Year Audited Financials",
        category: "mandatory",
        purpose: "Demonstrates financial health, transparency, and track record. Check with your funder for the number of years required — ideally 2–3 years.",
        whatItIs: "Balance sheet, income & expenditure statement, and schedules audited by a Chartered Accountant, for the financial years.",
        actionStep: "Engage a CA firm to audit your books. Ensure statements follow the format prescribed for your entity type."
      },
      {
        id: "itr-acknowledgement",
        name: "ITR Acknowledgement",
        category: "mandatory",
        purpose: "Proves you're filing taxes on time. Non-filing can trigger loss of 12AB/80G registration.",
        whatItIs: "The acknowledgement receipt generated after filing your Income Tax Return each year.",
        actionStep: "File ITR through the e-filing portal (incometax.gov.in). Use ITR-7 for charitable organisations. Deadline is usually October 31."
      },
      {
        id: "financial-policy",
        name: "Financial Policy",
        category: "good-to-have",
        purpose: "Shows funders you have internal controls, budgeting processes, and accountability mechanisms.",
        whatItIs: "A documented policy covering budgeting, expense approval, procurement, petty cash management, and financial reporting.",
        actionStep: "Draft based on templates available from credibility alliance or similar bodies. Get board approval and date it."
      }
    ]
  },
  {
    id: "governance",
    name: "Governance & Policy",
    iconName: "Shield",
    weight: 0.20,
    documents: [
      {
        id: "hr-org-structure",
        name: "HR / Org Structure",
        category: "mandatory",
        purpose: "Shows your organisation has defined roles, reporting lines, and professional capacity.",
        whatItIs: "An organisational chart showing roles, designations, and reporting hierarchy.",
        actionStep: "Create an org chart (even a simple one). Document key roles, JDs, and reporting lines."
      },
      {
        id: "governing-body-list",
        name: "Certified List of Governing Body",
        category: "mandatory",
        purpose: "Funders need to know who governs the organisation, their credentials, and any conflicts of interest.",
        whatItIs: "A list of current trustees/directors/governing body members with names, designations, DINs (if applicable), and signatures.",
        actionStep: "Prepare the list with details and have it certified by the chairperson/president. Update after any changes."
      },
      {
        id: "board-resolution",
        name: "Board Resolution for Authorization",
        category: "mandatory",
        purpose: "Authorises a specific person to sign agreements, open accounts, or apply for grants on behalf of the organisation.",
        whatItIs: "A formal resolution passed by the board/governing body authorising specific actions or individuals.",
        actionStep: "Draft a resolution, present it at a board meeting, get it passed and signed by the chairperson. Maintain in minute book."
      },
      {
        id: "board-minutes",
        name: "Board Minutes & Resolutions (Last 3)",
        category: "mandatory",
        purpose: "Demonstrates active governance and regular board oversight.",
        whatItIs: "Minutes of the last 3 board meetings, including attendance, agenda, discussions, and resolutions passed.",
        actionStep: "If you haven't been maintaining minutes, start now. Use a standard template. Have them signed by the chairperson."
      },
      {
        id: "trustee-kyc",
        name: "Trustee / Director KYC",
        category: "mandatory",
        purpose: "Required for due diligence by funders and for regulatory filings.",
        whatItIs: "Know Your Customer documents for each governing body member — typically Aadhaar, PAN, and address proof.",
        actionStep: "Collect KYC documents from all board members. Store securely with consent. Update when membership changes."
      },
      {
        id: "internal-policies",
        name: "Internal Policies (POSH/HR)",
        category: "good-to-have",
        purpose: "Shows institutional maturity. POSH compliance is legally mandatory for organisations with 10+ employees.",
        whatItIs: "Documented policies on Prevention of Sexual Harassment, HR management, leave, grievance redressal, etc.",
        actionStep: "Draft POSH policy (mandatory if 10+ employees), constitute an Internal Committee. Draft HR manual covering leave, conduct, grievance."
      },
      {
        id: "delegation-matrix",
        name: "Delegation of Power / Escalation Matrix",
        category: "good-to-have",
        purpose: "Shows clear decision-making authority and accountability — signals mature governance.",
        whatItIs: "A document defining who can approve what (financial limits, hiring, contracts) and escalation paths.",
        actionStep: "Map out decision categories, assign authority levels, get board approval."
      },
      {
        id: "fixed-asset-register",
        name: "Fixed Asset Register",
        category: "good-to-have",
        purpose: "Tracks organisational assets for accounting, auditing, and donor reporting.",
        whatItIs: "A register listing all fixed assets (property, equipment, vehicles) with purchase date, cost, depreciation, and current value.",
        actionStep: "Create a spreadsheet or use accounting software. List all assets with required details. Update annually."
      }
    ]
  },
  {
    id: "operational",
    name: "Operational",
    iconName: "Settings",
    weight: 0.12,
    documents: [
      {
        id: "org-two-pager",
        name: "Organizational Two Pager / PPT",
        category: "good-to-have",
        purpose: "A concise overview of your organisation for potential funders, partners, and stakeholders.",
        whatItIs: "A 2-page document or short presentation covering mission, programs, impact, financials summary, and team.",
        actionStep: "Create using a professional template. Include: mission, key programs, impact numbers, team overview, contact info."
      },
      {
        id: "annual-reports",
        name: "Annual Activity Reports",
        category: "good-to-have",
        purpose: "Demonstrates consistent activity, impact, and transparent reporting to stakeholders.",
        whatItIs: "Yearly reports detailing activities undertaken, beneficiaries reached, outcomes achieved, and financial summary.",
        actionStep: "Compile data from the last 2–3 years. Follow a standard format: narrative + data + financials + photos."
      },
      {
        id: "third-party-impact",
        name: "Third Party Impact Report",
        category: "conditional",
        condition: "always",
        purpose: "Independent validation of your impact. Highly valued by institutional funders and CSR departments.",
        whatItIs: "An impact assessment or evaluation conducted by an external agency or academic institution.",
        actionStep: "Commission a study from a research organisation or consultant. Can range from a simple evaluation to a full impact assessment."
      }
    ]
  },
  {
    id: "strategic",
    name: "Strategic",
    iconName: "Target",
    weight: 0.08,
    documents: [
      {
        id: "five-year-roadmap",
        name: "5-Year Roadmap",
        category: "good-to-have",
        purpose: "Shows long-term vision and strategic thinking. Funders want to invest in organisations with direction.",
        whatItIs: "A strategic plan covering 3–5 years with goals, milestones, resource needs, and growth strategy.",
        actionStep: "Conduct a planning workshop with your team and board. Define vision, goals, strategies, and milestones. Document and share."
      }
    ]
  },
  {
    id: "communications",
    name: "Communications",
    iconName: "MessageSquare",
    weight: 0.05,
    documents: [
      {
        id: "website",
        name: "Website",
        category: "good-to-have",
        purpose: "Your digital front door. Funders will Google you — a professional website builds credibility instantly.",
        whatItIs: "A website with your mission, programs, team, annual reports, and contact information.",
        actionStep: "Build a simple, professional website. Include: About, Programs, Impact, Team, Contact. Keep it updated."
      },
      {
        id: "beneficiary-testimonials",
        name: "Beneficiary Testimonials",
        category: "good-to-have",
        purpose: "Human stories that validate your impact. Powerful for proposals and donor communications.",
        whatItIs: "Written or video testimonials from beneficiaries about how your work has impacted their lives.",
        actionStep: "Collect testimonials with consent. Document the person's background, the intervention, and the change. Photos/videos add power."
      },
      {
        id: "social-media-presence",
        name: "Social Media Presence",
        category: "good-to-have",
        purpose: "An active social media presence signals transparency and engagement. Many CSR teams review your digital footprint as part of informal due diligence.",
        whatItIs: "Active profiles on platforms such as LinkedIn, Instagram, or Twitter/X that regularly share updates about your work, impact, and team.",
        actionStep: "Create and maintain profiles on at least LinkedIn and one other platform. Post consistently — even once a week builds credibility over time."
      }
    ]
  }
];

export const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

export const STATE_CAPITALS: Record<string, string> = {
  "Andhra Pradesh": "Amaravati",
  "Arunachal Pradesh": "Itanagar",
  "Assam": "Dispur",
  "Bihar": "Patna",
  "Chhattisgarh": "Raipur",
  "Goa": "Panaji",
  "Gujarat": "Gandhinagar",
  "Haryana": "Chandigarh",
  "Himachal Pradesh": "Shimla",
  "Jharkhand": "Ranchi",
  "Karnataka": "Bengaluru",
  "Kerala": "Thiruvananthapuram",
  "Madhya Pradesh": "Bhopal",
  "Maharashtra": "Mumbai",
  "Manipur": "Imphal",
  "Meghalaya": "Shillong",
  "Mizoram": "Aizawl",
  "Nagaland": "Kohima",
  "Odisha": "Bhubaneswar",
  "Punjab": "Chandigarh",
  "Rajasthan": "Jaipur",
  "Sikkim": "Gangtok",
  "Tamil Nadu": "Chennai",
  "Telangana": "Hyderabad",
  "Tripura": "Agartala",
  "Uttar Pradesh": "Lucknow",
  "Uttarakhand": "Dehradun",
  "West Bengal": "Kolkata",
  "Andaman and Nicobar Islands": "Port Blair",
  "Chandigarh": "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu": "Daman",
  "Delhi": "New Delhi",
  "Jammu and Kashmir": "Srinagar",
  "Ladakh": "Leh",
  "Lakshadweep": "Kavaratti",
  "Puducherry": "Puducherry"
};

export const getParameterIcon = (iconName: string) => {
  const icons: Record<string, any> = { Scale, TrendingUp, Shield, Settings, Target, MessageSquare };
  return icons[iconName] || Scale;
};

export const SECTION_ORDER = ["legal", "financial", "governance", "operational", "strategic", "communications"];
