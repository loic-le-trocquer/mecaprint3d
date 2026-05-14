import Header from "./components/Header";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Technologies from "./components/Technologies";
import Realisations from "./components/Realisations";
import QuoteForm from "./components/QuoteForm";
import Footer from "./components/Footer";
import Admin from "./admin/Admin";
import { useSiteContent } from "./lib/useSiteContent";
import "./index.css";

export default function App() {
  const { content, setContent } = useSiteContent();
  const isAdmin = window.location.pathname.startsWith("/admin");

  if (isAdmin) {
    return <Admin content={content} setContent={setContent} />;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Header content={content} />
      <main>
        <Hero content={content} />
        <Services content={content} />
        <Technologies content={content} />
        <Realisations content={content} />
        <QuoteForm content={content} />
      </main>
      <Footer content={content} />
    </div>
  );
}
