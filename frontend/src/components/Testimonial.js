"use client";
import React, { useState } from "react";

const Testimonial = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="container py-16">
      <h2 className="font-medium text-2xl pb-4">Testimonials</h2>
      <div className="grid lg:grid-cols-[300px,1fr] gap-4">
        {/* Profile Card */}
        <div
          className="border border-gray-300 rounded-2xl grid place-items-center p-6 lg:p-0 cursor-pointer"
          onClick={() => setShowModal(true)}
        >
          <div className="text-center flex flex-col items-center gap-1">
            <img
              className="rounded-full inline-block"
              src="/hulu.jpg"
              width={80}
              height={80}
              alt="profile"
            />
            <h2 className="text-gray-500 font-black text-[20px]">
              Hulu School
            </h2>
            <p>Learn Easy</p>
          </div>
        </div>

        {/* Background Image Section */}
        <div className="bg-red-600 bg-[url('/hulu1.jpg')] bg-cover h-[500px] rounded-2xl grid place-items-center">
          <div className="bg-[#ffffffab] min-w-[270px] sm:min-w-[300px] md:min-w-[500px] rounded-xl py-8 sm:px-8 grid place-items-center gap-3">
            <h2 className="font-extrabold text-2xl text-[#272727]">
              Summer Courses Are Available
            </h2>
          </div>
        </div>
      </div>

      {/* 🔲 Modal Popup */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowModal(false)} // Close when clicking outside
        >
          <div
            className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()} // Prevent modal from closing on click inside
          >
            <div className="flex flex-col items-center text-center gap-3">
              <img
                className="rounded-full"
                src="/hulu.jpg"
                width={100}
                height={100}
                alt="profile"
              />
              <h2 className="text-xl font-bold text-gray-700">Hulu School</h2>
              <p className="text-sm text-gray-500">Learn Easy</p>
              <p className="text-gray-600">
                At Hulu School, we believe every student has the potential to
                excel—with the right guidance, support, and inspiration. Whether
                you're catching up, keeping up, or aiming higher, Hulu School is
                your trusted partner in academic success.
              </p>
              <button
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Testimonial;
