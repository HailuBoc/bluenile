"use client";

import React, { useState } from "react";
import Slider from "react-slick";
import { useRouter } from "next/navigation";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Slide = () => {
  const router = useRouter();
  const [showFullText, setShowFullText] = useState(false);

  const slideImages = ["/pp1.jpg", "/pp4.jpg", "/pp3.jpg"];

  const settings = {
    autoplay: true,
    infinite: true,
    autoplaySpeed: 5000,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    pauseOnHover: false,
    dots: false,
  };

  const goToSignup = () => {
    router.push("/signup");
  };

  return (
    <div className="relative overflow-hidden w-full px-4 py-16 bg-black text-white">
      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row gap-10 items-center">
        {/* Slider */}
        <div className="w-full lg:w-2/5 shadow-xl rounded-xl overflow-hidden">
          <Slider {...settings}>
            {slideImages.map((img, index) => (
              <div key={index}>
                <img
                  src={img}
                  alt={`Slide ${index}`}
                  className="w-full h-80 object-cover"
                />
              </div>
            ))}
          </Slider>
        </div>

        {/* Text Area */}
        <div className="w-full lg:w-3/5">
          <div className="bg-neutral-900 p-8 rounded-2xl shadow-xl flex flex-col justify-center">
            <h3 className="text-yellow-400 text-xl lg:text-2xl font-semibold tracking-wide">
              HELPFUL TUTOR
            </h3>
            <h2 className="text-white text-3xl lg:text-4xl font-bold leading-snug mt-2">
              Helping students unlock their full academic potential.
            </h2>
            <h3 className="text-lg lg:text-xl text-gray-400 mt-4">
              Anytime, Anywhere, Learn with us{" "}
              <strong className="text-white font-semibold">Free Trial</strong>
            </h3>

            {/* Expandable Paragraph */}
            <div
              className={`text-gray-300 text-base lg:text-lg leading-relaxed text-justify mt-6 transition-all duration-500 ease-in-out ${
                showFullText ? "max-h-full" : "max-h-[300px] overflow-hidden"
              }`}
            >
              <p>
                At <strong>Hulu School</strong>, we believe every student has
                untapped potential waiting to shine. We are more than just a
                tutoring service — we are mentors, motivators, and confidence
                builders...
                <br />
                <br />
                <strong>
                  Together, we rise — one student, one subject, one success at a
                  time.
                </strong>
              </p>
            </div>

            <button
              onClick={() => setShowFullText(!showFullText)}
              className="text-yellow-400 hover:text-white font-semibold underline mt-4"
            >
              {showFullText ? "See Less" : "See More"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Slide;
