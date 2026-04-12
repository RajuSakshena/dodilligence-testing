import { Link, useNavigate } from "react-router-dom";
import { useAssessment } from "@/store/assessment-context";
import Logo from "@/components/Logo";

const About = () => {
  const { resetAll } = useAssessment();
  const navigate = useNavigate();

  const handleRetake = () => {
    resetAll();
    navigate("/");
  };

  return (
    <div className="pt-24 pb-16 px-6" style={{ backgroundColor: "#F8F6F1" }}>
      <div className="max-w-[640px] mx-auto text-center">
        <div className="flex flex-col items-center mb-10">
          <Logo size={64} className="mb-4" />
          <h1 className="font-display font-bold text-[#111827] text-2xl md:text-3xl">
            The Metropolitan Institute
          </h1>
        </div>

        <div className="text-left bg-white rounded-2xl border border-[#E5E7EB] p-6 mb-8">
          <p className="text-[#4B5563] font-body leading-relaxed mb-4">
            The Metropolitan Institute (TMI) works at the intersection of governance, capacity building, and institutional strengthening for India's social sector.
          </p>
          <p className="text-[#4B5563] font-body leading-relaxed mb-4">
            We believe that every organisation working towards social impact deserves the tools and guidance to become funding-ready — not just the ones that can afford expensive consultants.
          </p>
          <p className="text-[#4B5563] font-body leading-relaxed">
            DoDiligence is our free contribution to the sector: a structured, honest, and actionable assessment that helps NGOs understand where they stand and what to do next.
          </p>
        </div>

        <div className="bg-[#E4F2F6] rounded-2xl p-6 mb-8">
          <h2 className="font-display font-semibold text-[#0B3D4A] text-lg mb-2">
            Want expert help with your DoDiligence roadmap?
          </h2>
          <p className="text-sm text-[#4B5563] mb-4">
            TMI's advisory team can help you prioritise, plan, and execute your compliance journey — from registration to grant-readiness.
          </p>
          <Link
            to="/connect"
            className="inline-flex px-6 py-3 rounded-xl bg-[#0B3D4A] text-white font-display font-semibold text-sm hover:bg-[#1A6478] transition-all"
          >
            Connect with TMI
          </Link>
        </div>

        <button
          onClick={handleRetake}
          className="px-6 py-3 rounded-xl border border-[#E5E7EB] text-sm font-medium text-[#9CA3AF] hover:text-[#111827] hover:border-[#111827]/20 transition-all"
        >
          Retake Assessment
        </button>

        <footer className="mt-16 pt-6 border-t border-[#E5E7EB] text-xs text-[#9CA3AF]">
          <p>DoDiligence v1.0 | Built by The Metropolitan Institute | &copy; 2026</p>
        </footer>
      </div>
    </div>
  );
};

export default About;
