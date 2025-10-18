import React, { useContext, useEffect } from "react";
import { Container } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import TypeBar from "../components/TypeBar";
import BrandBar from "../components/BrandBar";
import DeviceList from "../components/DeviceList";
import { observer } from "mobx-react-lite";
import { Context } from "..";
import { fetchBrands, fetchDevices, fetchTypes } from "../http/deviceAPI";
import BrandBar2 from "../components/brandbar2";
import Pages from "../components/Pages";
import Cost from "../components/Cost";
import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import CTACards from "../components/CTACards";
import Partners from "../components/Partners";
const Shop = observer(() => {
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
});

export default Shop;
