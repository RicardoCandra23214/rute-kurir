import Navbar from "../components/navbar";
import Footer from "../components/footer";
import Home from "./home";
import Fitur from "./fitur";
import Kontak from "./kontak";


export default function LandingPage() {
  return (
    <div className="w-full min-h-screen scroll-smooth">
      <Navbar />
        <section id="beranda"><Home /></section>
        <section id="fitur"><Fitur /></section>
        <section id="kontak"><Kontak /></section>
      <Footer />
    </div>
    
  );
  
}
