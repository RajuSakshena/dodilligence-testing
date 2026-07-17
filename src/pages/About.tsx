import { Link, useNavigate } from "react-router-dom";
import { useAssessment } from "@/store/assessment-context";

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
          <img
            src="/TMI.png"
            alt="The Metropolitan Institute"
            className="w-20 h-auto object-contain mb-4"
          />

          <h1 className="font-display font-bold text-[#111827] text-2xl md:text-3xl">
            The Metropolitan Institute
          </h1>

          <p className="mt-2 text-sm text-[#6B7280]">
            An Initiative by The Metropolitan Institute
          </p>
        </div>

        <div className="text-left bg-white rounded-2xl border border-[#E5E7EB] p-6 mb-8">
          <p className="text-[#4B5563] font-body leading-relaxed mb-4">
            The Metropolitan Institute (TMI) works at the intersection of
            governance, capacity building, and institutional strengthening for
            India's social sector.
          </p>

          <p className="text-[#4B5563] font-body leading-relaxed mb-4">
            We believe that every organisation working towards social impact
            deserves the tools and guidance to become funding-ready — not just
            the ones that can afford expensive consultants.
          </p>

          <p className="text-[#4B5563] font-body leading-relaxed">
            DoDiligence is our free contribution to the sector: a structured,
            honest, and actionable assessment that helps NGOs understand where
            they stand and what to do next.
          </p>
        </div>

        <div className="bg-[#E4F2F6] rounded-2xl p-6 mb-8">
          <h2 className="font-display font-semibold text-[#0B3D4A] text-lg mb-2">
            Want expert help with your DoDiligence roadmap?
          </h2>

          <p className="text-sm text-[#4B5563] mb-4">
            TMI's advisory team can help you prioritise, plan, and execute your
            compliance journey — from registration to grant-readiness.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/connect"
              className="inline-flex justify-center px-6 py-3 rounded-xl bg-[#0B3D4A] text-white font-display font-semibold text-sm hover:bg-[#1A6478] transition-all"
            >
              Connect with TMI
            </Link>

            <a
              href="https://themetropolitaninstitute.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex justify-center px-6 py-3 rounded-xl border border-[#0B3D4A] text-[#0B3D4A] font-display font-semibold text-sm hover:bg-[#F8F6F1] transition-all"
            >
              Visit TMI Website
            </a>
          </div>
        </div>

        <button
          onClick={handleRetake}
          className="px-6 py-3 rounded-xl border border-[#E5E7EB] text-sm font-medium text-[#9CA3AF] hover:text-[#111827] hover:border-[#111827]/20 transition-all"
        >
          Retake Assessment
        </button>

        <footer className="mt-16 pt-6 border-t border-[#E5E7EB] text-xs text-[#9CA3AF]">
          <p>
            DoDiligence v1.0 | An Initiative by The Metropolitan Institute |
            &copy; 2026
          </p>

          <a
            href="https://themetropolitaninstitute.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 text-[#0B3D4A] hover:underline"
          >
            www.themetropolitaninstitute.com
          </a>
        </footer>
      </div>
    </div>
  );
};

export default About;