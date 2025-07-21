"use client";

import React from "react";

import Slidering from "../../components/Slidering";
import NewPrdouct from "../../components/NewPrdouct";
import Testimonial from "../../components/Testimonial";
import HeaderTop from "../../components/HeaderTop";
import Navbar from "../../components/Navbar";

export default function HeaderCombined() {
  return (
    <div>
      <HeaderTop />
      <Navbar />
      <Slidering />
      <NewPrdouct />
      <Testimonial />
    </div>
  );
}
