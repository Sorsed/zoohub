import React from "react";
import { Container } from "react-bootstrap";
import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import CTACards from "../components/CTACards";
import Partners from "../components/Partners";

const Shop = () => {
  return (
    <section className="py-5 bg-light">
      <Container>
        <Hero />
        <HowItWorks />
        <CTACards />
        <Partners />
      </Container>
    </section>
  );
};

export default Shop;
