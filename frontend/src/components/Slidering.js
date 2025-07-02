"use client";
import React from "react";
import Slider from "react-slick";
import Slide from "./Slide";

const Slidering = () => {
  let settings = {
    dots: true,
    infinite: true,

    autoplay: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    pauseOnHover: false,
  };
  const slideData = [
    {
      id: 0,
      img: "/pp1.jpg",
      title: "BETTER CLARITY",
      mainTitle: "Turning confusion into clarity, one subject at a time.",
    },
    {
      id: 1,
      img: "/pp4.jpg",
      title: "LEARN EASY",
      mainTitle: "Making learning less stressful and more successful.",
    },
    {
      id: 2,
      img: "/pp3.jpg",
      title: "HELPFULL TUTOR",
      mainTitle: "Helping students unlock their full academic potential.",
    },
  ];
  return (
    <div>
      <div className="container pt-6 lg:pt-0">
        <Slider {...settings}>
          {slideData.map((item) => {
            return (
              <Slide
                key={item.id}
                img={item.img}
                title={item.title}
                mainTitle={item.mainTitle}
              />
            );
          })}
        </Slider>
      </div>
    </div>
  );
};

export default Slidering;
