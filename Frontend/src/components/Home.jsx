import { useState } from "react";
import { motion } from "framer-motion";
const Home = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How do I book a therapy appointment?",
      answer:
        "Simply sign up as a patient, log in, and navigate to the 'Book Appointment' section. Choose a therapist, pick your date and time, and receive confirmation instantly.",
    },
    {
      question: "Can I attend sessions from my phone?",
      answer:
        "Yes, our platform is mobile-friendly, allowing you to attend secure therapy sessions from your smartphone, tablet, or desktop.",
    },
    {
      question: "Are the therapy sessions confidential?",
      answer:
        "Yes, all therapy sessions are encrypted and conducted in a private and secure virtual room. We prioritize your mental health and privacy.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen text-white bg-transparent mt-5">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="py-16 text-center max-w-4xl mx-auto m"
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

      <section className="py-16 rounded-lg shadow-md max-w-5xl mx-auto mt-2">
        <h2 className="text-4xl font-semibold text-center mb-10">
          Key Features
        </h2>
        <ul className="grid md:grid-cols-2 gap-8 text-lg">
          {[
            {
              icon: "🧠",
              title: "Online Therapy Sessions",
              desc: "Connect with licensed therapists for private and personalized support from the comfort of your home.",
            },
            {
              icon: "📅",
              title: "Appointment Booking",
              desc: "Easily book appointments with your preferred therapist at a time that works best for you.",
            },
            {
              icon: "🔒",
              title: "Secure Chat Rooms",
              desc: "Once your session is booked, join a private, secure chat room with your therapist to discuss your progress.",
            },
            {
              title: "Relaxing Video Calls",
              desc: "Once your session is booked, you can also attend a video call meeting with your therapist to discuss your problems.",
            },
            {
              icon: "🤖",
              title: "AI Chatbot Support",
              desc: "Talk to our AI-powered chatbot when your therapist is unavailable. Get immediate help with your emotional well-being.",
            },
            {
              icon: "📝",
              title: "Therapist Notes",
              desc: "After every session, therapists add notes that help track your mental health journey.",
            },
          ].map((item, index) => (
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

      <section className="py-16 max-w-4xl mx-auto">
        <h2 className="text-4xl font-semibold text-center mb-10">FAQs</h2>
        <ul className="space-y-6 text-lg">
          {faqs.map((faq, index) => (
            <li key={index} className="border-b border-gray-600 pb-4">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full text-left flex justify-between items-center"
              >
                <strong className="text-xl">
                  {index + 1}. {faq.question}
                </strong>
                <span>{openIndex === index ? "−" : "+"}</span>
              </button>
              {openIndex === index && (
                <p className="mt-2 text-white">{faq.answer}</p>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="py-16 max-w-6xl mx-auto">
        <h2 className="text-4xl font-semibold text-center mb-5">
          How It Works
        </h2>
        <div className="grid md:grid-cols-4 gap-8 mb-10">
          {[
           {
            step: "1. Sign Up",
            hover: "scale-150",
            desc: "Choose whether you’re a patient or therapist, and create a secure account with your personal details.",
          },
          {
            step: "2. Choose a Therapist",
            hover: "scale-150",
            desc: "Browse through licensed therapists and book an appointment with one that fits your needs.",
          },
          {
            step: "3. Book Appointment",
            hover: "scale-150",
            desc: "Select your preferred date and time, and confirm your appointment.",
          },
          {
            step: "4. Begin Therapy",
            hover: "scale-150",
            desc: "Join a secure virtual session and begin your therapy journey with confidence.",
          },
          ].map((step, i) => (
            <div
              key={i}
              className={`p-6 rounded-lg shadow-md hover:bg-${step.hover} transition duration-300 ease-in-out hover:shadow-lg`}
            >
              <h3 className={`text-2xl font-semibold mb-2 text-${step.color}`}>
                {step.step}
              </h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
