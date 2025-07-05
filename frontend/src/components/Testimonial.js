import React from "react";

const Testimonial = () => {
  return (
    <div>
      <div className="container py-16 grid-cols-2">
        <h2 className="font-medium text-2xl pb-4">Testimonials</h2>
        <div className="grid lg:grid-cols-[300px,1fr] gap-4">
          <div className="border border-gray-300 rounded-2xl grid place-items-center p-6 lg:p-0">
            <div className="text-center flex flex-col items-center gap-1">
              <img
                className="rounded-full inline-block"
                src="/hulu.jpg"
                width={80}
                height={80}
                alt="profile"
              />
              <h2 className="text-gray-500 font-black text-[20px] ">
                Hulu School
              </h2>
              <p>Learn Easy</p>

              <p className="max-w-[200px] text-gray-500">
                At Hulu School, we believe every student has the potential to
                excel—with the right guidance, support, and inspiration. Whether
                you're catching up, keeping up, or aiming higher, Hulu School is
                your trusted partner in academic success.
              </p>
            </div>
          </div>
          <div className="bg-red-600 bg-[url('/hulu1.jpg')] bg-cover h-[500px] rounded-2xl grid place-items-center">
            <div className="bg-[#ffffffab] min-w-[270px] sm:min-w-[300px] md:min-w-[500px] rounded-xl py-8 sm:px-8 grid place-items-center gap-3">
              <h2 className="font-extrabold text-2xl text-[#272727">
                Summer Courses Are Available
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
