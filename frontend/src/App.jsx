import Header from "./components/Header";
import Hero from "./components/Hero";
import Univers from "./components/Univers";
import Services from "./components/Services";
import Technologies from "./components/Technologies";
import Realisations from "./components/Realisations";
import QuoteForm from "./components/QuoteForm";
import Footer from "./components/Footer";
import Transformations from "./components/showroom/Transformations";
import WhyMecaPrint from "./components/WhyMecaPrint";
import ProcessTimeline from "./components/ProcessTimeline";
import CoverStylAI from "./components/CoverStylAI";



import Admin from "./admin/Admin";
import AdminQuotes from "./admin/AdminQuotes";

import { useSiteContent } from "./lib/useSiteContent";

import "./index.css";

export default function App() {
  const { content, setContent } = useSiteContent();

  const isAdmin = window.location.pathname.startsWith("/admin");

  if (window.location.pathname === "/admin/quotes") {
    return <AdminQuotes />;
  }

  if (isAdmin) {
    return <Admin content={content} setContent={setContent} />;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Header content={content} />

      <main>
        <Hero content={content} />

        <Univers content={content} />

        <Services content={content} />

        <WhyMecaPrint />
        
        <ProcessTimeline />

        <Technologies content={content} />

        <Transformations content={content} />

        <CoverStylAI />

        <Realisations content={content} />
        
        <QuoteForm content={content} />
      </main>

      <Footer content={content} />
    </div>
  );
}