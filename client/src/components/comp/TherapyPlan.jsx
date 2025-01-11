// TherapyPlan.js
import React from "react";
import { therapies } from "../data/staticData";

const TherapyPlan = () => (
  <section>
    <h2>Therapy Sessions</h2>
    <ul style={{ listStyleType: "none", padding: 0 }}>
      {therapies.map((therapy, index) => (
        <li key={index} style={{ padding: "10px", margin: "10px 0", backgroundColor: "#e1f5fe", borderRadius: "5px" }}>
          <strong>{therapy.type}</strong> - {therapy.date} at {therapy.time}
        </li>
      ))}
    </ul>
  </section>
);

export default TherapyPlan;
