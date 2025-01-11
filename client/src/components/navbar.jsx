import React from "react";

const Navbar = ({ scrollToSection, refs = {} }) => {
  const { homeRef, aboutRef, featuresRef, contactRef } = refs;
  return (
    <nav className="fixed top-5 border rounded-full p-3 shadow-xl border-[#4f4f8b] right-10 flex space-x-8 text-[#4f4f8b] font-semibold text-sm">
      <ul className="flex space-x-4">
        <li>
          <button onClick={() => scrollToSection(homeRef)} className="text-xl hover:underline">Home</button>
        </li>
        <li>
          <button onClick={() => scrollToSection(aboutRef)} className="text-xl hover:underline">About</button>
        </li>
        <li>
          <button onClick={() => scrollToSection(featuresRef)} className="text-xl hover:underline">Features</button>
        </li>
        <li>
          <button onClick={() => scrollToSection(contactRef)} className="text-xl hover:underline">Contact</button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
