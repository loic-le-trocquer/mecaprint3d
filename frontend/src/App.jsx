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
import CortenShowcase from "./components/CortenShowcase";
import QuoteCheckout from "./pages/QuoteCheckout";
import FloatingChat from "./components/FloatingChat";
import AdminChat from "./admin/AdminChat";
import QuickOrder from "./pages/QuickOrder";
import Admin from "./admin/Admin";
import AdminQuotes from "./admin/AdminQuotes";
import AdminMaterials from "./admin/AdminMaterials.jsx";

import { useSiteContent } from "./lib/useSiteContent";

import "./index.css";


export default function App() {

  const isQuoteCheckout =
  window.location.pathname.startsWith("/commande/");

  const { content, setContent } = useSiteContent();

  const isAdmin = window.location.pathname.startsWith("/admin");

  if (window.location.pathname === "/admin/quotes") {
    return <AdminQuotes />;
  }

  if (window.location.pathname === "/admin/chat") {
    return <AdminChat />;
  }

 if (window.location.pathname === "/admin/materials") {
  return <AdminMaterials />;
}

  if (isQuoteCheckout) {
  return <QuoteCheckout />;
}
if (window.location.pathname === "/commande-rapide") {
  return <QuickOrder />;
}
  if (isAdmin) {
    return <Admin content={content} setContent={setContent} />;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Header content={content} />

    <main>
  <Hero content={content} />

  <ProcessTimeline />

  <Technologies content={content} />

  <Services content={content} />

  <Univers content={content} />

  <CortenShowcase />

  <Transformations content={content} />

  <Realisations content={content} />

  <WhyMecaPrint />

  <QuoteForm content={content} />
</main>

        <FloatingChat />

      <Footer content={content} />
    </div>
  );
}
