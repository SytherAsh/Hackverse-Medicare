import React, { useState } from 'react';
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { FeaturesCards } from './FeaturesCards';
import env from "../assets/Happy.svg"

const Features = () => {
  const [showAlternatives, setShowAlternatives] = useState(false);

  const featuresData = [
    {
      title: "Mood Assessment & Emotion Analysis",
      description: "Daily logs with analysis and insights into mood trends for personalized support.",
      steps: [
        "Log daily moods",
        "Receive mood insights",
      ],
      iconColor: "text-yellow-500",
      hoverColor: "#ffb703"
    },
    {
      title: "Personalized Therapy & Wellness Tips",
      description: "Therapy plan suggestions based on assessments, with tailored tips for ongoing well-being.",
      steps: [
        "Complete assessment",
        "Receive therapy suggestions",
      ],
      iconColor: "text-pink-500",
      hoverColor: "#f72585"
    },
    {
      title: "Therapist Directory",
      description: "Browse and connect with therapists and wellness providers.",
      steps: [
        "Search for therapists",
        "Filter by specialization",
      ],
      iconColor: "text-blue-500",
      hoverColor: "#4cc9f0"
    },
    {
      title: "Crisis Support & Emergency Contacts",
      description: "Access articles, crisis guidelines, and emergency contact options for immediate assistance.",
      steps: [
        "Read crisis guidelines",
        "Access emergency contacts",
      ],
      iconColor: "text-red-500",
      hoverColor: "#ff4d6d"
    },
    {
      title: "Mental Health Chatbot",
      description: "AI chatbot offering instant support and guidance.",
      steps: [
        "Start a conversation",
        "Get instant support",
      ],
      iconColor: "text-green-500",
      hoverColor: "#06d6a0"
    },
    {
      title: "Appointment Booking & Video Consultation",
      description: "Seamlessly book appointments and connect with doctors through secure video consultations.",
      steps: [
        "Select a doctor",
        "Schedule an appointment",
      ],
      iconColor: "text-purple-500",
      hoverColor: "#9b5de5"
    }
  ];
  

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#cfc2cb] to-[#aba4da] text-white flex flex-col items-center py-16">
      <h2 className="text-6xl font-bold text-black mb-4">Our Features</h2>
      <h4 className='text-md font-serif text-center text-gray-500 mb-12'>
        Unlock a World of Well-Being: <br/>
        Discover the Features That Make Your Mental Health Journey Personalized, Supportive, and Empowering!
      </h4>

      {/* Toggle Switch for Odoo Effect */}
      <div className="flex items-center justify-center mb-10">
        <Switch
          id="show-alternatives"
          checked={showAlternatives}
          onCheckedChange={setShowAlternatives}
          className={`transition-transform duration-300 ${showAlternatives ? 'bg-blue-600' : 'bg-gray-300'}`}
        />
        <Label htmlFor="show-alternatives" className="ml-3 text-lg font-medium text-gray-700">
          {showAlternatives ? 'Imagine with BeyondCare' : 'Without BeyondCare'}
        </Label>
      </div>

      {/* Feature Cards */}
      <div className="relative flex flex-wrap justify-center gap-8 p-8">
        {/* Overlay Image */}
        {showAlternatives && (
          <div className="absolute inset-0 opacity-50 z-10">
            <img src={env} alt="BeyondCare" className="w-full h-full object-contain opacity-70" />
          </div>
        )}

        {/* Feature Cards */}
        <div className="flex flex-wrap justify-center gap-16 p-8">
          {featuresData.map((feature, index) => (
            <FeaturesCards
              key={index}
              title={feature.title}
              description={feature.description}
              steps={feature.steps}
              iconColor={feature.iconColor}
              hoverColor={feature.hoverColor}
            />
          ))}
      </div>
      </div>
    </div>
  );
};

export default Features;
