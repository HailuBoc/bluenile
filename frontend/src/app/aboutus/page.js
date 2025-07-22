"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const team = [
  { name: "Dr. Abrham Yalember", role: "Biology Tutor", image: "/abre.jpg" },
  {
    name: "Hailegebrel Yalember",
    role: "General Science Tutor",
    image: "/hailu.jpg",
  },
  { name: "Meklit A.", role: "English Tutor", image: "/profile pic.jpg" },
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#111]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 border-solid"></div>
      </div>
    );
  }

  return (
    <main className="bg-[#111] text-gray-200">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-700 px-6 py-20 text-center">
        <h1 className="text-5xl font-bold mb-4">About HuluSchool</h1>
        <p className="text-xl max-w-3xl mx-auto">
          Empowering students across Ethiopia with personalized online and
          in-person tutoring.
        </p>
      </section>

      {/* Overview */}
      <section className="max-w-5xl mx-auto py-12 px-6">
        <h2 className="text-3xl font-bold mb-4 text-white">Who We Are</h2>
        <p className="text-gray-300 text-lg leading-relaxed">
          HuluSchool is Ethiopia’s trusted tutoring company, offering both
          virtual and face-to-face support.
        </p>
      </section>

      {/* Mission & Vision */}
      <section className="bg-[#1a1a1a] py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-white">
            Our Mission & Vision
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#222] p-6 shadow rounded-lg">
              <h3 className="text-xl font-semibold mb-2 text-white">Mission</h3>
              <p className="text-gray-300">
                To provide accessible, high-quality tutoring and bridge academic
                gaps with care.
              </p>
            </div>
            <div className="bg-[#222] p-6 shadow rounded-lg">
              <h3 className="text-xl font-semibold mb-2 text-white">Vision</h3>
              <p className="text-gray-300">
                A future where every student in Ethiopia can succeed with the
                right support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="max-w-5xl mx-auto py-12 px-6">
        <h2 className="text-3xl font-bold mb-6 text-white">What We Offer</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-[#193b64] p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-2 text-white">
              Online Tutoring
            </h3>
            <p className="text-gray-300">
              Zoom sessions, quizzes, recordings, and individual feedback.
            </p>
          </div>
          <div className="bg-[#22603b] p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-2 text-white">
              In-Person Tutoring
            </h3>
            <p className="text-gray-300">
              Private and group sessions in Addis Ababa — at home or
              center-based.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-[#1f1f1f] py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-white">
            Why Choose HuluSchool?
          </h2>
          <ul className="list-disc pl-6 text-gray-300 text-lg space-y-2">
            <li>Custom learning plans</li>
            <li>Evening & weekend flexibility</li>
            <li>Qualified, trusted tutors</li>
            <li>Progress tracking & feedback</li>
            <li>Supportive learning environment</li>
          </ul>
        </div>
      </section>

      {/* Meet the Team */}
      <section className="max-w-5xl mx-auto py-12 px-6">
        <h2 className="text-3xl font-bold mb-6 text-white">Meet Our Tutors</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {team.map((member, index) => (
            <div
              key={index}
              className="bg-[#222] p-4 rounded-lg shadow text-center"
            >
              <Image
                src={member.image}
                alt={member.name}
                width={120}
                height={120}
                className="rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-lg font-semibold text-white">
                {member.name}
              </h3>
              <p className="text-sm text-gray-400">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-[#0f2a40] py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center text-white">
            What Parents & Students Say
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-[#1f3b54] p-6 rounded-lg shadow">
                <p className="italic text-gray-200 mb-2">“{t.quote}”</p>
                <p className="font-semibold text-right text-white">
                  - {t.name}
                </p>
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
            href="https://t.me/+tXsbIL4G0TM0ZGM0"
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
      <footer className="bg-black text-gray-400 py-8 px-6">
        <div className="max-w-5xl mx-auto text-center space-y-2">
          <p>📍 Addis Ababa, Ethiopia</p>
          <p id="phone-number" className="transition-all duration-500">
            📞 +251 93 924 9299
          </p>
          <p>
            📧{" "}
            <a
              href="mailto:tutor@huluschool.com"
              className="underline text-white"
            >
              tutor@huluschool.com
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
