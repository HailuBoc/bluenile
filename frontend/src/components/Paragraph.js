// import React from "react";

const Paragraph = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4 py-12">
      <div className="w-full max-w-3xl bg-white p-8 rounded-2xl shadow-lg space-y-6 text-center">
        <h3 className="text-red-500 text-xl lg:text-2xl font-semibold tracking-wide">
          HELPFUL TUTOR
        </h3>
        <h2 className="text-black text-3xl lg:text-4xl font-bold leading-snug">
          Helping students unlock their full academic potential.
        </h2>
        <h3 className="text-lg lg:text-xl text-gray-600">
          Anytime, Anywhere, Learn with us{" "}
          <strong className="text-black font-semibold">Free Trial</strong>
        </h3>
        <button className="bg-blue-600 hover:bg-black text-white font-medium px-6 py-3 rounded-xl transition duration-300 ease-in-out">
          Register Now
        </button>
        <p className="text-gray-700 text-base lg:text-lg leading-relaxed text-justify">
          At <strong>Hulu School</strong>, we believe every student has untapped
          potential waiting to shine. We are more than just a tutoring service —
          we are mentors, motivators, and confidence builders. Our mission is to
          turn struggles into strengths and confusion into clarity.
          <br />
          <br />
          We walk hand-in-hand with our students, lighting the path to success.
          At Hulu School, no question is too small, and no dream is too big. We
          create a supportive environment where learning feels exciting and
          achievable. Every session is a step forward — toward better grades,
          deeper understanding, and greater self-belief.
          <br />
          <br />
          We don’t just teach subjects; we nurture self-confidence and a love
          for learning. Your success is our passion, and your growth is our
          goal. We celebrate every “aha” moment and push through every “I can’t”
          with “yes, you can.” Hulu School is a safe space to ask, explore, and
          grow without fear. With us, students find not only answers but also
          their voice, vision, and value.
          <br />
          <br />
          <strong>
            Together, we rise — one student, one subject, one success at a time.
          </strong>
        </p>
      </div>
    </div>
  );
};

export default Paragraph;
