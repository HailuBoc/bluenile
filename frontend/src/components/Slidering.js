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
      img: "/img1.jpg",
      title: "Trending Ballons",
      mainTitle: "MODERN BALLONS ARE AROUND THE CORNER",
      price: "$45",
    },
    {
      id: 1,
      img: "/img2.jpg",
      title: "Trending Item",
      mainTitle: "WOMEN'S LATEST FASHION SALE",
      price: "$40",
    },
    {
      id: 2,
      img: "/img3.jpg",
      title: "Trending Ballons",
      mainTitle: "NEW FASHION SUMMER SALE",
      price: "$25",
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
                price={item.price}
              />
            );
          })}
        </Slider>
      </div>
    </div>
  );
};

export default Slidering;
