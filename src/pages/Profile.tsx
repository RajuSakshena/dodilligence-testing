import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Info, Check } from "lucide-react";
import { useAssessment, type RegistrationType } from "@/store/assessment-context";
import { INDIAN_STATES } from "@/lib/assessment-data";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import ConfidentialityModal from "@/components/ConfidentialityModal";

const Profile = () => {
  const navigate = useNavigate();
  const { orgProfile, setOrgProfile, confidentialityAccepted, setConfidentialityAccepted } = useAssessment();
  const [localProfile, setLocalProfile] = useState(orgProfile);
  const [localConfidentiality, setLocalConfidentiality] = useState(confidentialityAccepted);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [shakeField, setShakeField] = useState<string | null>(null);
  const [showConfModal, setShowConfModal] = useState(false);

  // New states for track organisation section (completely optional)
  const [showTrackForm, setShowTrackForm] = useState(false);
  const [trackForm, setTrackForm] = useState({
    orgName: "",
    email: "",
    designation: ""
  });

  const isLocalProfileComplete =
    localProfile.name.trim() !== "" &&
    localProfile.registrationType !== "" &&
    localProfile.state !== "" &&
    localProfile.yearEstablished.length === 4;

  const canSubmit = isLocalProfileComplete && localConfidentiality;

  const update = (field: string, value: any) => {
    setLocalProfile((p: any) => ({ ...p, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: false }));
  };

  const updateTrackForm = (field: string, value: string) => {
    setTrackForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const newErrors: Record<string, boolean> = {};
    if (!localProfile.name.trim()) newErrors.name = true;
    if (!localProfile.registrationType) newErrors.registrationType = true;
    if (!localProfile.state) newErrors.state = true;
    if (localProfile.yearEstablished.length !== 4) newErrors.yearEstablished = true;
    if (!localConfidentiality) newErrors.confidentiality = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstError = Object.keys(newErrors)[0];
      setShakeField(firstError);
      setTimeout(() => setShakeField(null), 500);
      return;
    }

    setOrgProfile(localProfile);
    setConfidentialityAccepted(true);
    navigate("/assessment/legal");

    // API call runs in background - non-blocking
    try {
      const response = await fetch("https://tmi-backend.onrender.com/save-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: localProfile.name,
          registration_type: localProfile.registrationType,
          state: localProfile.state,
          city: localProfile.city,
          year_established: parseInt(localProfile.yearEstablished),
          foreign_funds: localProfile.foreignFunds || false,
          confidentiality_accepted: true
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to save profile: ${response.status}`);
      }

      const data = await response.json();

      localStorage.setItem("orgId", data.id);
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  const fieldClass = (field: string) =>
    `${errors[field] ? "border-[#B91C1C]" : "border-[#E5E7EB]"} ${shakeField === field ? "animate-shake" : ""} focus:border-[#0B3D4A] focus:ring-[#0B3D4A]`;

  const errorMessages: Record<string, string> = {
    name: "Organisation name is required.",
    registrationType: "Please select a registration type.",
    state: "Please select your state or UT.",
    yearEstablished: "Please enter a valid 4-digit year.",
    confidentiality: "Please tick the confidentiality box to continue.",
  };

  const handleConfModalAccept = () => {
    setShowConfModal(false);
    setLocalConfidentiality(true);
    setErrors((prev) => ({ ...prev, confidentiality: false }));
  };

  // Basic email validation (contains "@") - only shows error if user has typed something (UI only)
  const showEmailError = trackForm.email.length > 0 && !trackForm.email.includes("@");

  return (
    <div className="pt-24 pb-16 px-6" style={{ backgroundColor: "#F8F6F1" }}>
      <div className="max-w-[640px] mx-auto">
        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${i === 0 ? "bg-[#0B3D4A]" : "bg-[#E5E7EB]"}`}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-6 md:p-8"
        >
          <h1 className="font-display font-bold text-[#111827] text-xl md:text-2xl mb-6">
            Tell us about your organisation
          </h1>

          <div className="space-y-6">
            {/* Org Name */}
            <div className={shakeField === "name" ? "animate-shake" : ""}>
              <label className="block text-sm font-medium text-[#111827] mb-1.5">Organisation Name</label>
              <Input
                value={localProfile.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="e.g. ABC Foundation"
                className={fieldClass("name")}
              />
              {errors.name && <p className="text-xs text-[#B91C1C] mt-1">{errorMessages.name}</p>}
            </div>

            {/* Registration Type */}
            <div className={shakeField === "registrationType" ? "animate-shake" : ""}>
              <label className="block text-sm font-medium text-[#111827] mb-2">Registration Type</label>
              <div className="grid grid-cols-3 gap-3">
                {([
                  { value: "trust", label: "Trust" },
                  { value: "society", label: "Society" },
                  { value: "section8", label: "Section 8" },
                ] as const).map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => update("registrationType", opt.value)}
                    className={`p-3 rounded-xl border text-sm font-medium text-center transition-all duration-150 ${
                      localProfile.registrationType === opt.value
                        ? "border-[#0B3D4A] bg-[#E4F2F6] text-[#0B3D4A]"
                        : `border-[#E5E7EB] text-[#9CA3AF] hover:border-[#1A6478] ${errors.registrationType ? "border-[#B91C1C]" : ""}`
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              {errors.registrationType && <p className="text-xs text-[#B91C1C] mt-1">{errorMessages.registrationType}</p>}
            </div>

            {/* State */}
            <div className={shakeField === "state" ? "animate-shake" : ""}>
              <label className="block text-sm font-medium text-[#111827] mb-1.5">State / Union Territory</label>
              <select
                value={localProfile.state}
                onChange={(e) => update("state", e.target.value)}
                className={`w-full rounded-xl border bg-white px-3 py-2.5 text-sm outline-none ${fieldClass("state")}`}
              >
                <option value="">Select state...</option>
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              {errors.state && <p className="text-xs text-[#B91C1C] mt-1">{errorMessages.state}</p>}
            </div>

            {/* City - Headquartered In with validation (alphabets + spaces only) */}
            <div>
              <label className="block text-sm font-medium text-[#111827] mb-1.5">Headquartered In</label>
              <Input
                value={localProfile.city}
                onChange={(e) => {
                  let value = e.target.value.replace(/[^a-zA-Z\s]/g, "");
                  value = value.replace(/\s+/g, " "); // collapse multiple spaces
                  update("city", value);
                }}
                placeholder=""
                className="border-[#E5E7EB] focus:border-[#0B3D4A] focus:ring-[#0B3D4A]"
              />
            </div>

            {/* Year */}
            <div className={shakeField === "yearEstablished" ? "animate-shake" : ""}>
              <label className="block text-sm font-medium text-[#111827] mb-1.5">Year Established</label>
              <Input
                type="number"
                value={localProfile.yearEstablished}
                onChange={(e) => update("yearEstablished", e.target.value.slice(0, 4))}
                placeholder=""
                min="1900"
                max="2026"
                className={fieldClass("yearEstablished")}
              />
              {errors.yearEstablished && <p className="text-xs text-[#B91C1C] mt-1">{errorMessages.yearEstablished}</p>}
            </div>

            {/* Foreign Funds */}
            <div>
              <label className="block text-sm font-medium text-[#111827] mb-2">
                Does your organisation receive or plan to receive foreign funds?
              </label>
              <div className="flex gap-3">
                {[true, false].map((val) => (
                  <button
                    key={String(val)}
                    onClick={() => update("foreignFunds", val)}
                    className={`px-6 py-2.5 rounded-xl border text-sm font-medium transition-all duration-150 ${
                      localProfile.foreignFunds === val
                        ? "border-[#0B3D4A] bg-[#E4F2F6] text-[#0B3D4A]"
                        : "border-[#E5E7EB] text-[#9CA3AF] hover:border-[#1A6478]"
                    }`}
                  >
                    {val ? "Yes" : "No"}
                  </button>
                ))}
              </div>
              {localProfile.foreignFunds && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-3 bg-[#E4F2F6] border border-[#0B3D4A]/20 rounded-xl p-3 flex items-start gap-2"
                >
                  <Info size={14} className="text-[#0B3D4A] mt-0.5 shrink-0" />
                  <p className="text-xs text-[#0B3D4A]">
                    We will include FCRA registration in your assessment. This is a legal requirement for any organisation receiving foreign contributions.
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Confidentiality link + NEW Track section (completely optional) + Checkbox */}
        <div className="mt-8 mb-6">
          {/* Confidentiality note link */}
          <button
            onClick={() => setShowConfModal(true)}
            className="text-[13px] text-[#1A6478] hover:underline mb-3 block"
          >
            Read our confidentiality note →
          </button>

          {/* NEW expandable Track Organisation section - completely optional */}
          <button
            onClick={() => setShowTrackForm(!showTrackForm)}
            className="text-[13px] text-[#1A6478] hover:underline mb-3 block"
          >
            Have you tracked your organisation before? →
          </button>

          <motion.div
            initial={false}
            animate={{
              opacity: showTrackForm ? 1 : 0,
              height: showTrackForm ? "auto" : 0,
            }}
            className="overflow-hidden"
          >
            <div className="space-y-4">
              {/* Helper text */}
              <p className="text-xs text-[#4B5563]">
                This helps us personalise your experience
              </p>

              {/* Track Organisation Name */}
              <div>
                <label className="block text-sm font-medium text-[#111827] mb-1.5">Organisation Name</label>
                <Input
                  value={trackForm.orgName}
                  onChange={(e) => updateTrackForm("orgName", e.target.value)}
                  placeholder="e.g. ABC Foundation"
                  className="border-[#E5E7EB] focus:border-[#0B3D4A] focus:ring-[#0B3D4A]"
                />
              </div>

              {/* Track Email ID with basic validation (UI only) */}
              <div>
                <label className="block text-sm font-medium text-[#111827] mb-1.5">Email ID</label>
                <Input
                  value={trackForm.email}
                  onChange={(e) => updateTrackForm("email", e.target.value)}
                  placeholder="e.g. founder@org.com"
                  className={`border-[#E5E7EB] focus:border-[#0B3D4A] focus:ring-[#0B3D4A] ${
                    showEmailError ? "border-[#B91C1C]" : ""
                  }`}
                />
                {showEmailError && (
                  <p className="text-xs text-[#B91C1C] mt-1">Please enter a valid email (must contain @)</p>
                )}
              </div>

              {/* Track Designation */}
              <div>
                <label className="block text-sm font-medium text-[#111827] mb-1.5">Designation</label>
                <Input
                  value={trackForm.designation}
                  onChange={(e) => updateTrackForm("designation", e.target.value)}
                  placeholder="e.g. Founder / Director"
                  className="border-[#E5E7EB] focus:border-[#0B3D4A] focus:ring-[#0B3D4A]"
                />
              </div>
            </div>
          </motion.div>

          {/* Confidentiality Checkbox */}
          <div className={shakeField === "confidentiality" ? "animate-shake" : ""}>
            <label className="flex items-start gap-3 cursor-pointer group">
              <button
                type="button"
                onClick={() => {
                  setLocalConfidentiality(!localConfidentiality);
                  setErrors((prev) => ({ ...prev, confidentiality: false }));
                }}
                className={`mt-0.5 w-4 h-4 rounded-[3px] border-[1.5px] flex items-center justify-center shrink-0 transition-all duration-150 ${
                  localConfidentiality
                    ? "bg-[#0B3D4A] border-[#0B3D4A]"
                    : errors.confidentiality
                      ? "bg-white border-[#B91C1C]"
                      : "bg-white border-[#9CA3AF] group-hover:border-[#0B3D4A]"
                }`}
              >
                {localConfidentiality && (
                  <Check size={12} className="text-white" strokeWidth={3} />
                )}
              </button>
              <span className="text-sm text-[#4B5563] font-body leading-relaxed">
                I have read the confidentiality note. DoDiligence does not store or share my organisation's data with any third party.
              </span>
            </label>
            {errors.confidentiality && <p className="text-xs text-[#B91C1C] mt-1.5 ml-7">{errorMessages.confidentiality}</p>}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={`w-full py-4 rounded-2xl font-display font-bold text-base tracking-[0.02em] transition-all duration-200 ${
            canSubmit
              ? "bg-[#C4872A] text-white hover:bg-[#A8711F]"
              : "bg-[#9CA3AF] text-white cursor-not-allowed"
          }`}
        >
          Begin Assessment
        </button>
      </div>

      <ConfidentialityModal
        open={showConfModal}
        onClose={() => setShowConfModal(false)}
        onAccept={handleConfModalAccept}
      />
    </div>
  );
};

export default Profile;