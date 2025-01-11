// Suggestions.js
import React from "react";
import { suggestions } from "../data/staticData";

const Suggestions = () => (
  <section>
    <h2>Suggested Activities for Recovery</h2>
    <ul style={{ listStyleType: "none", padding: 0 }}>
      {suggestions.map((suggestion, index) => (
        <li key={index} style={{ padding: "10px", margin: "10px 0", backgroundColor: "#ffe0b2", borderRadius: "5px" }}>
          <strong>{suggestion.activity}</strong> - {suggestion.description}
        </li>
      ))}
    </ul>
  </section>
);

export default Suggestions;
