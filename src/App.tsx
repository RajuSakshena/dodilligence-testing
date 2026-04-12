import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AssessmentProvider } from "@/store/assessment-context";
import Navbar from "@/components/Navbar";
import ProgressBar from "@/components/ProgressBar";
import Landing from "./pages/Index";
import Overview from "./pages/Overview";
import Profile from "./pages/Profile";
import Assessment from "./pages/Assessment";
import Results from "./pages/Results";
import Share from "./pages/Share";
import Gift from "./pages/Gift";
import Connect from "./pages/Connect";
import About from "./pages/About";
import ThankYou from "./pages/ThankYou";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppLayout = () => {
  const location = useLocation();
  const isLanding = location.pathname === "/";
  const isConnect = location.pathname === "/connect";
  const isThankYou = location.pathname === "/thankyou";
  const showProgress = location.pathname.startsWith("/assessment") || location.pathname === "/profile";
  const hideNav = isLanding || isConnect || isThankYou;

  return (
    <>
      {!hideNav && <Navbar />}
      {showProgress && <ProgressBar />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/overview" element={<Overview />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/assessment/:sectionId" element={<Assessment />} />
        <Route path="/results" element={<Results />} />
        <Route path="/scorecard" element={<Navigate to="/results" replace />} />
        <Route path="/report" element={<Navigate to="/results" replace />} />
        <Route path="/share" element={<Share />} />
        <Route path="/gift" element={<Gift />} />
        <Route path="/connect" element={<Connect />} />
        <Route path="/about" element={<About />} />
        <Route path="/thankyou" element={<ThankYou />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AssessmentProvider>
          <AppLayout />
        </AssessmentProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
