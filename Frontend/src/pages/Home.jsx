import React from "react";
import { motion } from "framer-motion";
import FeaturesSection from "../components/FeaturesSection";
import FAQSection from "../components/FAQSection";
import HowItWorksSection from "../components/HowItWorksSection";

const Home = () => {
  return (
    <div className="min-h-screen text-white bg-transparent mt-5">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="py-16 text-center max-w-4xl mx-auto"
      >
        <h1 className="text-5xl font-bold mb-4 mt-4">
          Heal Mindfully with MindWell
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-lg mb-6"
        >
          Your safe space for online therapy, anytime, anywhere.
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-md mb-4"
        >
          Struggling with stress, anxiety, or emotional challenges? <br />
          Let certified professionals guide you towards clarity and healing.
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-md"
        >
          Book appointments, chat securely, and track your progress — all in one
          platform.
        </motion.p>
      </motion.div>

      <FeaturesSection />
      <FAQSection />
      <HowItWorksSection />
    </div>
  );
};

export default Home;
