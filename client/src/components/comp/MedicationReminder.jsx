// MedicationReminder.js
import React from "react";
import { medications } from "../data/staticData";

const MedicationReminder = () => (
  <section>
    <h2>Medication Reminders</h2>
    <ul style={{ listStyleType: "none", padding: 0 }}>
      {medications.map((med, index) => (
        <li key={index} style={{ padding: "10px", margin: "10px 0", backgroundColor: "#f1f1f1", borderRadius: "5px" }}>
          <strong>{med.name}</strong> - {med.dose} at {med.time}
        </li>
      ))}
    </ul>
  </section>
);

export default MedicationReminder;
