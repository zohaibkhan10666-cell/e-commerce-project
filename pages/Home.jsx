import React from "react";
import Hero from "./hero.jsx";
import Features from "../src/components/ui/features.jsx";
import Footer from "../src/components/footer.jsx";

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white pt-20">
      <Hero />
      <Features />
      <Footer />
    </div>
  );
}

export default Home;

