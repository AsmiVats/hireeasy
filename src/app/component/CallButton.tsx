"use client";

import React, { useState } from "react";

const CallButton: React.FC = () => {
  const [to, setTo] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const TWILIO_PHONE_NUMBER = "+19382043039"; // Use your Twilio phone number

  const handleCall = async () => {
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("/api/twilio/makeCall", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to,
          from: TWILIO_PHONE_NUMBER, // Hardcoded Twilio phone number
          message,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setSuccess(true);
      } else {
        setError(result.error || "An error occurred");
      }
    } catch (err) {
      setError("Failed to make a call. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg max-w-md mx-auto mt-10">
      <h2 className="text-lg font-semibold mb-4">Make a Call</h2>
      <div className="mb-4">
        <label htmlFor="to" className="block text-sm font-medium text-gray-700">
          Recipient Phone Number
        </label>
        <input
          type="text"
          id="to"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder="+1234567890"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="message"
          className="block text-sm font-medium text-gray-700"
        >
          Message
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your message"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <button
        onClick={handleCall}
        disabled={loading}
        className={`w-full py-2 px-4 rounded-md text-white font-medium ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-indigo-600 hover:bg-indigo-700"
        }`}
      >
        {loading ? "Calling..." : "Make Call"}
      </button>
      {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
      {success && (
        <p className="mt-4 text-sm text-green-500">Call placed successfully!</p>
      )}
    </div>
  );
};

export default CallButton;
