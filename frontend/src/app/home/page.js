import React from "react";
import Navbars from "../nav&product/page";
import ProductsSection from "../../components/ProductsSection";
import Footer from "../../components/Footer";

const page = () => {
  return (
    <div>
      <Navbars />
      <ProductsSection />
      <Footer />
    </div>
  );
};

export default page;
