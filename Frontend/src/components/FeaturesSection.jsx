import React from "react";
import { motion } from "framer-motion";

const FeaturesSection = () => {
  const features = [
    { icon: "🧠", title: "Online Therapy Sessions", desc: "Connect with licensed therapists for private and personalized support from the comfort of your home." },
    { icon: "📅", title: "Appointment Booking", desc: "Easily book appointments with your preferred therapist at a time that works best for you." },
    { icon: "🔒", title: "Secure Chat Rooms", desc: "Join a private, secure chat room with your therapist to discuss your progress." },
    { icon: "📹", title: "Relaxing Video Calls", desc: "Attend secure video sessions with your therapist for a more personal touch." },
    { icon: "🤖", title: "AI Chatbot Support", desc: "Talk to our AI-powered chatbot for quick support when therapists are unavailable." },
    { icon: "📝", title: "Therapist Notes", desc: "Therapists can leave notes to track your mental health progress." },
  ];

  return (
    <section className="py-16 rounded-lg shadow-md max-w-5xl mx-auto mt-2">
      <h2 className="text-4xl font-semibold text-center mb-10">Key Features</h2>
      <ul className="grid md:grid-cols-2 gap-8 text-lg">
        {features.map((item, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 + index * 0.2, duration: 0.5 }}
            className="bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition"
          >
            <span className="text-2xl">{item.icon}</span>
            <h3 className="text-xl font-semibold mt-2">{item.title}</h3>
            <p className="mt-2">{item.desc}</p>
          </motion.li>
        ))}
      </ul>
    </section>
  );
};

export default FeaturesSection;
