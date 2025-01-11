'use client';
import React from "react";
import { InfiniteMovingCards } from "./ui/infinite-moving-cards";

const mentalHealthTestimonials = [
    {
      quote:
        'Regular usage of the website transformed my understanding of my mental health and helped me discover my unknown sides. The therapists are world-class!',
      name: 'Alex Johnson',
      title: 'Depression Patient',
    },
    {
      quote:
        "The community and support from the professionals here are unmatched. I've grown not just as an anxiety patient, but also as a person, thanks to their comprehensive approach.",
      name: 'Samantha Lee',
      title: 'Anxiety Patient',
    },
    {
      quote:
        "The resources and insights on this platform helped me navigate through my mental health struggles with more confidence. The personalized advice has been life-changing.",
      name: 'Michael Chen',
      title: 'A Regular User',
    },
    {
      quote:
        'As someone dealing with PTSD, the personalized therapy plan and support from the therapists here made a significant impact on my healing journey.',
      name: 'Emily Taylor',
      title: 'PTSD Patient',
    },
    {
      quote:
        'The mental health resources and crisis support available on this platform gave me the strength to seek help. Highly recommend it for anyone facing mental health challenges!',
      name: 'Chris Morales',
      title: 'Schizophrenia Patient',
    },
  ];
  

const TestimonialCard = () => {
  return (
    <div className="h-[40rem] w-full flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-r from-[#cfc2cb] to-[#aba4da] shadow-lg">
      <h2 className="font-extrabold text-4xl mb-6 z-10 text-center text-black uppercase tracking-wide">
        Hear Our Harmony: Voices of Success
      </h2>
      <p className="text-lg mb-10 text-center text-gray-500 z-10 max-w-3xl px-6">
        Discover the stories of growth, passion, and Health transformation over the years.
      </p>
      <div className="flex justify-center w-full overflow-hidden px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-6xl">
          <InfiniteMovingCards
            items={mentalHealthTestimonials}
            direction="right"
            speed="slow"
          />
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
