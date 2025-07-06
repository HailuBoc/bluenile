"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const team = [
  {
    name: "Dr. Abrham Yalember",
    role: "Biology tutor",
    image: "/abre.jpg",
  },
  {
    name: "Hailegebrel Yalember",
    role: "General-Science Tutor",
    image: "/hailu.jpg",
  },
  {
    name: "Meklit A.",
    role: "English Tutor",
    image: "/profile pic.jpg",
  },
];

const testimonials = [
  {
    name: "Hanna M.",
    quote:
      "HuluSchool helped my son catch up in math over the summer — now he’s ahead of his class!",
  },
  {
    name: "Bereket G.",
    quote:
      "Their online tutoring is so convenient. I saw a real difference in my daughter’s confidence.",
  },
];

export default function AboutPage() {
  return (
    <main className="bg-white text-gray-800">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-800 to-blue-600 text-white px-6 py-20 text-center">
        <h1 className="text-5xl font-bold mb-4">About HuluSchool</h1>
        <p className="text-xl max-w-3xl mx-auto">
          Empowering students across Ethiopia with personalized online and
          in-person tutoring. We make learning effective, flexible, and fun.
        </p>
      </section>

      {/* Overview */}
      <section className="max-w-5xl mx-auto py-12 px-6">
        <h2 className="text-3xl font-bold mb-4">Who We Are</h2>
        <p className="text-lg leading-relaxed">
          HuluSchool is Ethiopia’s trusted tutoring company, offering both
          virtual and face-to-face learning support. With experienced tutors and
          structured plans, we help students build knowledge and confidence.
        </p>
      </section>

      {/* Mission & Vision */}
      <section className="bg-gray-50 py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Our Mission & Vision</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 shadow rounded">
              <h3 className="text-xl font-semibold mb-2">Mission</h3>
              <p>
                To provide accessible, high-quality tutoring for all students
                and bridge academic gaps with care and strategy.
              </p>
            </div>
            <div className="bg-white p-6 shadow rounded">
              <h3 className="text-xl font-semibold mb-2">Vision</h3>
              <p>
                A future where every student in Ethiopia can succeed with the
                right support, regardless of background.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="max-w-5xl mx-auto py-12 px-6">
        <h2 className="text-3xl font-bold mb-6">What We Offer</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-blue-100 p-6 rounded shadow">
            <h3 className="text-xl font-semibold mb-2">Online Tutoring</h3>
            <p>
              Interactive Zoom sessions, recorded lessons, quizzes, and progress
              tracking.
            </p>
          </div>
          <div className="bg-green-100 p-6 rounded shadow">
            <h3 className="text-xl font-semibold mb-2">In-Person Tutoring</h3>
            <p>
              Small group or private sessions in Addis Ababa, at your home or
              our center.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-gray-100 py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Why Choose HuluSchool?</h2>
          <ul className="list-disc pl-6 text-lg space-y-2">
            <li>Customized learning paths for each student</li>
            <li>Flexible scheduling – evenings, weekends, and holidays</li>
            <li>Trusted tutors with subject expertise</li>
            <li>Trackable progress and regular feedback</li>
            <li>Safe, supportive, student-centered environment</li>
          </ul>
        </div>
      </section>

      {/* Team */}
      <section className="max-w-5xl mx-auto py-12 px-6">
        <h2 className="text-3xl font-bold mb-6">Meet Our Tutors</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {team.map((member, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded shadow text-center"
            >
              <Image
                src={member.image}
                alt={member.name}
                width={120}
                height={120}
                className="rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-lg font-semibold">{member.name}</h3>
              <p className="text-sm text-gray-600">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-blue-50 py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">
            What Parents & Students Say
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white p-6 rounded shadow">
                <p className="italic mb-2">“{t.quote}”</p>
                <p className="font-semibold text-right">- {t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 text-center bg-gradient-to-r from-blue-700 to-green-600 text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
        <p className="mb-6 text-lg">
          Join hundreds of students getting ahead with HuluSchool!
        </p>
        <div className="space-x-4">
          <Link
            href="/signup"
            className="bg-white text-blue-700 font-semibold py-2 px-4 rounded shadow"
          >
            Join Now
          </Link>
          <button
            onClick={() => {
              const el = document.getElementById("phone-number");
              if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "center" });
                el.classList.add(
                  "bg-yellow-200",
                  "text-black",
                  "px-2",
                  "py-1",
                  "rounded"
                );
                setTimeout(() => {
                  el.classList.remove(
                    "bg-yellow-200",
                    "text-black",
                    "px-2",
                    "py-1",
                    "rounded"
                  );
                }, 2000);
              }
            }}
            className="bg-blue-900 text-white font-semibold py-2 px-4 rounded shadow"
          >
            Contact Us
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-6">
        <div className="max-w-5xl mx-auto text-center space-y-2">
          <p>📍 Addis Ababa, Ethiopia</p>
          <p id="phone-number" className="transition-all duration-500">
            📞 +251 93 924 9299
          </p>
          <p>
            📧{" "}
            <a href="mailto:info@huluschool.com" className="underline">
              info@huluschool.com
            </a>
          </p>
          <p>
            © {new Date().getFullYear()} HuluSchool Tutoring. All rights
            reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
