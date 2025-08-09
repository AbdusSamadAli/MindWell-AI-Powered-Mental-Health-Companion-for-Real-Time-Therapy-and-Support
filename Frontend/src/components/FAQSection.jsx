import React, { useState } from "react";

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    { question: "How do I book a therapy appointment?", answer: "Sign up as a patient, log in, and book via the 'Book Appointment' section." },
    { question: "Can I attend sessions from my phone?", answer: "Yes, you can join from any device including smartphones." },
    { question: "Are therapy sessions confidential?", answer: "Yes, they are encrypted and secure." },
  ];

  return (
    <section className="py-16 max-w-4xl mx-auto">
      <h2 className="text-4xl font-semibold text-center mb-10">FAQs</h2>
      <ul className="space-y-6 text-lg">
        {faqs.map((faq, index) => (
          <li key={index} className="border-b border-gray-600 pb-4">
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
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
  );
};

export default FAQSection;
