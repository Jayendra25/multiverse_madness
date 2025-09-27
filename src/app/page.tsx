import HeroSection from "./components/HeroSection";
import ProjectInfo from "./components/ProjectInfo";
import Features from "./components/Features";
import AIRiskDashboard from "./components/AIRiskDashboard";
import CallToAction from "./components/CalltoAction";
import EmailAlertRegistration from "./components/EmailAlertRegistration";
import AboutSection from "./components/aboutsection";
import DynamicImpactDashboard from "./components/DynamicImpactDashboard";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      <HeroSection />
      <ProjectInfo />
      <Features />

      {/* AI Risk Prediction Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                AI Risk Analysis
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto">
              Advanced machine learning models predict impact consequences and
              defense success rates
            </p>
          </div>
          <AIRiskDashboard />
          <div id="EmailAlertRegistration">
            <DynamicImpactDashboard />
          </div>
          <AboutSection />
        </div>
      </section>

      <CallToAction />
    </main>
  );
}
