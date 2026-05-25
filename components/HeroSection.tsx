"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { STATS } from "@/lib/products";

const SLIDES = [
  { src: "/images/hero-slide-1.png", portrait: false },
  { src: "/images/hero-slide-2.png", portrait: true  },
  { src: "/images/hero-slide-3.png", portrait: true  },
  { src: "/images/hero-slide-4.png", portrait: false },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setCurrent((c) => (c + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden star-bg">
      {/* Slides — plain <img> avoids next/image fill constraints on crossfade */}
      {SLIDES.map((slide, i) => (
        <div
          key={slide.src}
          className="absolute inset-0 overflow-hidden transition-opacity duration-1000"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          {/* Layer 1: blurred backdrop — always fills the frame, hides letterbox bars */}
          <img
            src={slide.src}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: "blur(24px)", transform: "scale(1.12)", opacity: 0.55 }}
          />

          {/* Layer 2: the actual image */}
          {/* Portrait images use object-contain so the full tree height is visible;
              landscape images use object-cover for a full-bleed look. */}
          <img
            src={slide.src}
            alt=""
            className="absolute inset-0 w-full h-full"
            style={{
              objectFit:      slide.portrait ? "contain" : "cover",
              objectPosition: "center",
              transform: i === current ? "scale(1.05)" : "scale(1)",
              transition: "transform 5500ms ease-in-out",
            }}
          />
        </div>
      ))}

      {/* Gradient overlay — deep navy left (text readable), transparent right (image shows through) */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background: "linear-gradient(to right, rgba(10,22,40,0.96) 0%, rgba(10,22,40,0.80) 50%, rgba(10,22,40,0.25) 100%)"
        }}
      />

      {/* Content */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 lg:px-10 py-32">
        <div className="max-w-xl">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-6">
            <span className="gold-rule" aria-hidden="true" />
            <span className="eyebrow">★ Handcrafted in Cheyenne, Wyoming ★</span>
          </div>

          {/* H1 */}
          <h1 className="font-playfair text-5xl font-bold leading-none tracking-tight text-cream sm:text-6xl lg:text-7xl">
            Where Nature
            <br />
            <em className="text-[#b22234] not-italic italic">Becomes Art</em>
            <span className="text-white/30 text-4xl ml-3">★</span>
          </h1>

          {/* Subtext */}
          <p className="mt-6 font-cormorant text-xl leading-relaxed text-stone-300 max-w-md">
            Handcrafted natural wood cat trees — sustainably sourced, made to
            order, and one-of-a-kind. Built in Wyoming for cats who deserve
            nothing less.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link href="/shop" className="btn-primary">
              Build Your Tree
            </Link>
            <Link href="/story" className="btn-ghost">
              Our Story
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-14 grid grid-cols-2 gap-x-8 gap-y-5 border-t border-[#1e2e50] pt-8 sm:grid-cols-4">
            {STATS.map(({ value, label }) => (
              <div key={label}>
                <p className="font-playfair text-2xl font-bold text-[#b22234]">{value}</p>
                <p className="mt-0.5 font-jost text-xs text-stone-400 tracking-widest uppercase">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 opacity-60">
        <span className="font-jost text-xs tracking-widest uppercase text-stone-400">Scroll</span>
        <div className="w-px h-10 bg-linear-to-b from-stone-400 to-transparent" />
      </div>
    </section>
  );
}
