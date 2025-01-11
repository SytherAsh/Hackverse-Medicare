import React from 'react'
import Header from './comp/Header'
import MedicationReminder from './comp/MedicationReminder'
import Suggestions from './comp/Suggestions'
import TherapyPlan from './comp/TherapyPlan'

const Wellness = () => {
  return (
    <div>
      <Header />
      <MedicationReminder />
      <Suggestions />
      <TherapyPlan />
    </div>
  )
}

export default Wellness
