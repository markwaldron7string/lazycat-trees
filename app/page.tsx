import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  MARQUEE_ITEMS,
  FEATURED_ITEMS,
  CRAFT_FEATURES,
  HOW_IT_WORKS_STEPS,
  COMMISSION_THEMES,
  formatCurrency,
} from "@/lib/products";
import {
  CRAFT_COLLAGE_IMAGES,
  GALLERY_STRIP_IMAGES,
} from "@/lib/media";
import { EyebrowLabel } from "@/components/GoldLine";
import HeroSection from "@/components/HeroSection";
import LifestyleStrip from "@/components/LifestyleStrip";

export const metadata: Metadata = {
  title: "LazyCat Trees — Handcrafted Natural Wood Cat Trees",
  description:
    "Where nature becomes art. Luxury handcrafted cat trees made from sustainably sourced natural wood in Cheyenne, Wyoming. Custom-built to order.",
};

// Photo strip images — 12 images rendered twice for a seamless infinite loop
const PHOTO_STRIP = [
  { src: "/images/product-classic.png",     alt: "Classic natural wood cat tree" },
  { src: "/images/product-grand.png",       alt: "Grand multi-level cat tree" },
  { src: "/images/product-pinnacle.png",    alt: "Pinnacle eight-level cat tree" },
  { src: "/images/hero-slide-1.png",        alt: "LazyCat Trees at red barn market" },
  { src: "/images/hero-slide-2.png",        alt: "Blue cat tree outside garage" },
  { src: "/images/hero-slide-3.png",        alt: "Pink cat tree outside garage" },
  { src: "/images/hero-slide-4.png",        alt: "Full market tent display" },
  { src: "/images/tree-4-level-store.png",  alt: "Black & white kitty" },
  { src: "/images/cat-orange-lounge.png",   alt: "4 level pink" },
  { src: "/images/cat-orange-store.png",    alt: "peeking/biting yarn" },
  { src: "/images/cats-store-display.png",  alt: "Orange and oreo" },
  { src: "/images/detail-carpet.png",       alt: "peeking and swatting" },
];

// Badge color mapping
const BADGE_STYLES: Record<string, string> = {
  // Legacy product badges
  Popular:        "bg-stone-800 text-cream",
  Bestseller:     "bg-[#b22234] text-white",
  // Featured Items badges
  "Entry Level":  "bg-stone-800 text-cream",
  "Most Popular": "bg-[#b22234] text-white",
  Signature:      "bg-[#0f1f3d] border border-[#b22234] text-[#b22234]",
};

export default function HomePage() {
  return (
    <>
      {/* ═══════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════ */}
      <HeroSection />

      {/* ═══════════════════════════════════════════
          PHOTO STRIP  (hero → marquee transition)
      ═══════════════════════════════════════════ */}
      <div className="overflow-hidden bg-[#0a1628] py-2" aria-hidden="true">
        <div
          className="flex gap-2"
          style={{ animation: "photo-strip 45s linear infinite", width: "max-content" }}
        >
          {[...PHOTO_STRIP, ...PHOTO_STRIP].map((img, i) => (
            <div key={i} className="shrink-0 w-40 h-24 overflow-hidden">
              <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          PATRIOT MARQUEE BAR
      ═══════════════════════════════════════════ */}
      <div className="border-y border-[#b22234]/40 py-4 overflow-hidden" style={{ backgroundColor: '#b22234' }}>
        <div
          className="flex gap-0 animate-marquee whitespace-nowrap"
          aria-hidden="true"
        >
          {/* Duplicate for seamless loop */}
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-6 px-6">
              <span className="text-white/80" aria-hidden="true">★</span>
              <span className="font-jost text-xs tracking-widest uppercase text-white font-semibold">
                {item}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          FEATURED COLLECTION
      ═══════════════════════════════════════════ */}
      <section className="py-24 lg:py-32 bg-[#0a1628]">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center mb-16">
            <EyebrowLabel>Shop by Style</EyebrowLabel>
            <h2 className="mt-5 font-playfair text-4xl font-bold text-cream lg:text-5xl">
              Find Your{" "}
              <span className="italic text-[#b22234]">Perfect Match</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {FEATURED_ITEMS.map((item) => (
              <div
                key={item.slug}
                className="group flex flex-col product-card card-hover"
              >
                {/* Image */}
                <div className="relative h-80 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Badge */}
                  <span
                    className={`absolute top-4 left-4 font-jost text-xs font-semibold tracking-widest uppercase px-3 py-1 ${
                      BADGE_STYLES[item.badge] ?? "bg-stone-800 text-cream"
                    }`}
                  >
                    {item.badge}
                  </span>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-6">
                  <p className="font-jost text-xs text-stone-500 tracking-widest uppercase mb-1">
                    {item.platformRange}
                  </p>
                  <h3 className="font-playfair text-2xl font-semibold text-cream mb-3">
                    {item.name}
                  </h3>
                  <p className="font-cormorant text-base leading-relaxed text-stone-400 flex-1 mb-6">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-playfair text-xl font-bold text-[#b22234]">
                      From {formatCurrency(item.fromPrice)}
                    </span>
                    <Link
                      href="/shop"
                      className="font-jost text-xs font-semibold tracking-widest uppercase text-[#b22234] hover:text-[#d42b40] transition-colors"
                    >
                      Build This Tree →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          THE CRAFT (2-column)
      ═══════════════════════════════════════════ */}
      <section className="py-24 lg:py-32 bg-[#0f1f3d]">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20 items-center">
            {/* Left: image collage */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="relative aspect-4/5 col-span-1">
                  <Image
                    src={CRAFT_COLLAGE_IMAGES[0].src}
                    alt={CRAFT_COLLAGE_IMAGES[0].alt}
                    fill
                    className="object-cover"
                    sizes="300px"
                  />
                </div>
                <div className="relative aspect-4/5 col-span-1 mt-10">
                  <Image
                    src={CRAFT_COLLAGE_IMAGES[1].src}
                    alt={CRAFT_COLLAGE_IMAGES[1].alt}
                    fill
                    className="object-cover"
                    sizes="300px"
                  />
                </div>
              </div>
              {/* Red badge overlay */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-[#b22234] text-white px-6 py-4 text-center min-w-35">
                <p className="font-playfair text-3xl font-bold">10+</p>
                <p className="font-jost text-xs tracking-widest uppercase">Years of Craft</p>
              </div>
            </div>

            {/* Right: story + features */}
            <div>
              <EyebrowLabel>The Craft</EyebrowLabel>
              <h2 className="mt-5 font-playfair text-4xl font-bold text-cream leading-tight lg:text-5xl">
                Every Branch<br />
                <span className="italic text-[#b22234]">Hand Selected</span>
              </h2>
              <p className="mt-6 font-cormorant text-lg leading-relaxed text-stone-400">
                Each LazyCat tree begins with a walk in the forest. We source
                branches from sustainably collected downed trees — apple, pine,
                maple, and madrone — then cure them for years before a single
                cut is made.
              </p>

              {/* Features grid */}
              <div className="mt-10 grid grid-cols-2 gap-6">
                {CRAFT_FEATURES.map((feature) => (
                  <div key={feature.title} className="flex flex-col gap-2">
                    <div className="w-8 h-px bg-[#b22234]" />
                    <h4 className="font-jost text-sm font-semibold text-cream tracking-wide">
                      {feature.title}
                    </h4>
                    <p className="font-cormorant text-sm leading-relaxed text-stone-500">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>

              <Link
                href="/story"
                className="mt-10 inline-flex items-center font-jost text-xs font-semibold tracking-widest uppercase text-[#b22234] border-b border-[#b22234]/40 pb-0.5 hover:border-[#b22234] transition-colors"
              >
                Read Our Full Story →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <LifestyleStrip />

      {/* ═══════════════════════════════════════════
          HOW IT WORKS
      ═══════════════════════════════════════════ */}
      <section className="py-24 lg:py-32 bg-[#0a1628]">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center mb-16">
            <EyebrowLabel>Process</EyebrowLabel>
            <h2 className="mt-5 font-playfair text-4xl font-bold text-cream lg:text-5xl">
              How It <span className="italic text-[#b22234]">Works</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {HOW_IT_WORKS_STEPS.map((step, i) => (
              <div key={step.number} className="relative flex flex-col gap-4">
                {/* Connector line (not last) */}
                {i < HOW_IT_WORKS_STEPS.length - 1 && (
                  <div
                    className="hidden lg:block absolute top-5 left-full w-full h-px bg-[#1e2e50] z-0"
                    aria-hidden="true"
                  />
                )}
                <span className="relative z-10 font-playfair text-5xl font-bold text-[#1e2e50] leading-none">
                  {step.number}
                </span>
                <div className="w-8 h-px bg-[#b22234]" />
                <h3 className="font-playfair text-xl font-semibold text-cream">{step.title}</h3>
                <p className="font-cormorant text-base leading-relaxed text-stone-400">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-14 text-center">
            <Link href="/shop" className="btn-primary">
              Start Configuring
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          GALLERY STRIP
      ═══════════════════════════════════════════ */}
      <section className="bg-[#0f1f3d]">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
          {GALLERY_STRIP_IMAGES.map((img) => (
            <div key={img.src} className="relative aspect-square img-zoom">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
              />
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          COMMISSION CTA BANNER
      ═══════════════════════════════════════════ */}
      <section className="py-24 lg:py-32 bg-[#0a1628] border-t border-[#1e2e50] star-bg">
        <div className="mx-auto max-w-3xl px-6 text-center lg:px-10">
          <EyebrowLabel>Custom Commission</EyebrowLabel>
          <h2 className="mt-6 font-playfair text-4xl font-bold text-cream leading-tight lg:text-5xl">
            Commission Your
            <br />
            <span className="italic text-[#b22234]">Dream Tree</span>
          </h2>
          <p className="mt-6 font-cormorant text-xl leading-relaxed text-stone-400 max-w-xl mx-auto">
            We've built mushroom-inspired masterpieces and Egyptian hieroglyph
            tributes. We can bring any theme to life — just describe your vision
            and we'll make it real.
          </p>

          {/* Theme chips */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {COMMISSION_THEMES.map((theme) => (
              <span
                key={theme.name}
                className="inline-flex items-center gap-2 border border-[#1e2e50] px-4 py-2 font-cormorant text-sm text-stone-400"
              >
                <span>{theme.emoji}</span>
                {theme.name}
                {theme.built && (
                  <span className="font-jost text-xs text-[#b22234]">✓ Built</span>
                )}
              </span>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/commission" className="btn-primary">
              Start Your Commission
            </Link>
            <Link href="/contact" className="btn-ghost">
              Ask a Question
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
