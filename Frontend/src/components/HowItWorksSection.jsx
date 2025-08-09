import React from "react";

const HowItWorksSection = () => {
  const steps = [
    { step: "1. Sign Up", desc: "Choose patient or therapist, then create a secure account." },
    { step: "2. Choose a Therapist", desc: "Browse licensed therapists and select the one you like." },
    { step: "3. Book Appointment", desc: "Pick your date and time for the appointment." },
    { step: "4. Begin Therapy", desc: "Join a secure virtual session and start your journey." },
  ];

  return (
    <section className="py-16 max-w-6xl mx-auto">
      <h2 className="text-4xl font-semibold text-center mb-5">How It Works</h2>
      <div className="grid md:grid-cols-4 gap-8 mb-10">
        {steps.map((item, i) => (
          <div
            key={i}
            className="p-6 rounded-lg shadow-md hover:scale-105 transition duration-300 ease-in-out hover:shadow-lg"
          >
            <h3 className="text-2xl font-semibold mb-2">{item.step}</h3>
            <p>{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorksSection;
