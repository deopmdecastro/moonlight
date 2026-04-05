import React from "react";
import HeroSection from "../components/landing/HeroSection";
import AboutPreview from "../components/landing/AboutPreview";
import ProductsPreview from "../components/landing/ProductsPreview";
import TimelinePreview from "../components/landing/TimelinePreview";
import QuoteSection from "../components/landing/QuoteSection";
import CTASection from "../components/landing/CTASection";
import InstagramSection from "../components/home/InstagramSection";
import { useLandingContent } from "@/lib/useLandingContent";

export default function Home() {
  const { landing } = useLandingContent();

  return (
    <>
      <HeroSection content={landing.hero} />
      <AboutPreview content={landing.about} />
      <ProductsPreview content={landing.products} />
      <TimelinePreview content={landing.timeline} />
      <QuoteSection content={landing.quote} />
      <InstagramSection />
      <CTASection content={landing.cta} />
    </>
  );
}
