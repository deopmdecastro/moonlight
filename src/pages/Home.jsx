import React from "react";
import HeroSection from "../components/landing/HeroSection";
import AboutPreview from "../components/landing/AboutPreview";
import ProductsPreview from "../components/landing/ProductsPreview";
import TimelinePreview from "../components/landing/TimelinePreview";
import QuoteSection from "../components/landing/QuoteSection";
import CTASection from "../components/landing/CTASection";
import InstagramSection from "../components/home/InstagramSection";

const HERO_IMG = "https://media.base44.com/images/public/69cc376dc1ad26b57bf8eecd/fb2700b90_generated_25361021.png";
const ABOUT_IMG = "https://media.base44.com/images/public/69cc376dc1ad26b57bf8eecd/d9d7bc902_generated_a845f4fd.png";
const PRODUCTS_IMG = "https://media.base44.com/images/public/69cc376dc1ad26b57bf8eecd/319b58075_generated_888a5b9c.png";
const RITUAL_IMG = "https://media.base44.com/images/public/69cc376dc1ad26b57bf8eecd/6eee5f2d7_generated_acd6eda3.png";

export default function Home() {
  return (
    <>
      <HeroSection heroImage={HERO_IMG} />
      <AboutPreview aboutImage={ABOUT_IMG} />
      <ProductsPreview productsImage={PRODUCTS_IMG} />
      <TimelinePreview />
      <QuoteSection image={RITUAL_IMG} />
      <InstagramSection />
      <CTASection />
    </>
  );
}
