import React, { useState } from "react";

const GeminiTherapySuggestions = () => {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const keywords = [
    "depression","anxiety","stress", "mental health", "therapy", "cbt", "ptsd", "coping", "mindfulness", "panic", "insomnia", "addiction", "burnout", "self-esteem",
    "grief", "trauma", "anger", "bipolar", "phobia", "wellbeing", "emotions", "overthinking", "mood",
    "sickness", "loneliness",
  ];

  const handleAskGemini = async () => {
    setLoading(true);
    setError("");
    setResult("");

    const lowerPrompt = prompt.toLowerCase();
    const isRelevant = keywords.some((word) => lowerPrompt.includes(word));

    if (!isRelevant) {
      setError(
        "❌ I can only answer queries related to therapy, mental health, and well-being."
      );
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/ai/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (data.result) {
        setResult(data.result);
      } else {
        setError("No result returned from AI.");
      }
    } catch (err) {
      setError("Error fetching response from AI.");
      console.error("Frontend fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center mt-11">
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg border border-gray-200 relative overflow-hidden">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">
          Gemini AI Therapy Suggestions
        </h2>

        <textarea
          className="w-full border border-gray-300 p-3 rounded-md mb-6 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          rows={4}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Hi, how can I help you today?"
        />

        <button
          onClick={handleAskGemini}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors duration-300"
        >
          {loading ? "Getting suggestions..." : "Get Suggestions"}
        </button>

        {error && (
          <div className="mt-6 p-4 bg-red-100 border border-red-300 text-red-800 rounded-lg shadow-md">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-6 p-4 rounded-lg shadow-md transition-colors duration-300 relative z-20 w-full max-w-full overflow-hidden">
            <h3 className="text-lg font-semibold mb-2 text-blue-800">
              AI Response:
            </h3>
            <p className="text-gray-700 w-full mx-auto overflow-y-auto max-h-32">
              {result}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeminiTherapySuggestions;
