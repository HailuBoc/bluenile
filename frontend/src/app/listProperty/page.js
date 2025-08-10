// src/app/list-property/page.js  (App Router)
// or pages/list-property.js     (Pages Router)

"use client";
import React, { useState } from "react";

export default function ListPropertyPage() {
  const [step, setStep] = useState(1);

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center">
      {/* Header */}
      <header className="w-full bg-blue-950 py-4 text-white">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">List Your Property</h1>
          <button className="bg-white text-blue-700 px-4 py-2 rounded hover:bg-gray-100">
            Help
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-10 flex gap-8">
        {/* Left: Form */}
        <div className="flex-1 bg-gray-500 p-8 rounded shadow">
          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            {["Property Info", "Rooms", "Facilities", "Pricing"].map(
              (label, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center">
                  <div
                    className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold 
                    ${
                      step === idx + 1
                        ? "bg-blue-700 text-white"
                        : step > idx + 1
                        ? "bg-green-500 text-white"
                        : "bg-gray-300 text-gray-700"
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <span className="text-xs mt-2">{label}</span>
                </div>
              )
            )}
          </div>

          {/* Step Forms */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Tell us about your property
              </h2>
              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="Property Name"
                  className="w-full border border-gray-300 rounded p-3"
                />
                <input
                  type="text"
                  placeholder="Address"
                  className="w-full border border-gray-300 rounded p-3"
                />
                <select
                  className="w-full border text-gray-400 border-gray-300 rounded p-3"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Property Type
                  </option>
                  <option>Hotel</option>
                  <option>Apartment</option>
                  <option>Guesthouse</option>
                  <option>Villa</option>
                </select>
              </form>
            </div>
          )}

          {/* Step Navigation */}
          <div className="mt-8 flex justify-between">
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="px-6 py-3 border border-gray-400 rounded hover:bg-gray-100"
              >
                Back
              </button>
            ) : (
              <span />
            )}
            {step < 4 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="px-6 py-3 bg-blue-700 text-white rounded hover:bg-blue-800"
              >
                Next
              </button>
            ) : (
              <button className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700">
                Submit
              </button>
            )}
          </div>
        </div>

        {/* Right: Info / Benefits */}
        <aside className="w-1/3 bg-gray-200 p-8 rounded shadow">
          <h3 className="text-lg text-blue-950 font-semibold mb-4">
            Why list with us?
          </h3>
          <ul className="space-y-3 text-gray-700">
            <li>✔ Reach millions of guests worldwide</li>
            <li>✔ Secure and reliable payments</li>
            <li>✔ Easy-to-use property management tools</li>
            <li>✔ 24/7 customer support</li>
          </ul>
          <div className="mt-6">
            <img src="/oppp.jpg" alt="Promo" className="rounded shadow" />
          </div>
        </aside>
      </main>
    </div>
  );
}
