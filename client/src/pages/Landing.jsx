import React, { useRef } from "react";
import About from "../components/About";
import Features from "../components/Features";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import TestimonialCard from "../components/Reviews";

function Landing() {
  const homeRef = useRef(null);
  const aboutRef = useRef(null);
  const featuresRef = useRef(null);
  const contactRef = useRef(null);

  const scrollToSection = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-200 to-white">
      <div ref={homeRef}>
        <Hero scrollToSection={scrollToSection} refs={{ homeRef, aboutRef, featuresRef, contactRef }} />
      </div>
      <div ref={aboutRef}><About /></div>
      <div ref={featuresRef}><Features /></div>
      <TestimonialCard />
      <div ref={contactRef}><Footer /></div>
    </div>
  );
}

export default Landing;
