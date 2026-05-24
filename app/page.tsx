import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  STATS,
  MARQUEE_ITEMS,
  FEATURED_PRODUCTS,
  CRAFT_FEATURES,
  HOW_IT_WORKS_STEPS,
  GALLERY_IMAGES,
  COMMISSION_THEMES,
} from "@/lib/products";
import { EyebrowLabel } from "@/components/GoldLine";

export const metadata: Metadata = {
  title: "LazyCat Trees — Handcrafted Natural Wood Cat Trees",
  description:
    "Where nature becomes art. Luxury handcrafted cat trees made from sustainably sourced natural wood in Cheyenne, Wyoming. Custom-built to order.",
};

// Badge color mapping
const BADGE_STYLES: Record<string, string> = {
  Popular:    "bg-stone-800 text-cream",
  Bestseller: "bg-gold text-stone-950",
  Signature:  "bg-stone-900 border border-gold text-gold",
};

export default function HomePage() {
  return (
    <>
      {/* ═══════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://placehold.co/1920x1080/0c0a08/1c1917?text=."
            alt="LazyCat Trees — natural wood cat tree"
            fill
            className="object-cover"
            priority
            sizes="100vw"
            unoptimized
          />
          {/* Readability gradient — left-side bias */}
          <div className="absolute inset-0 bg-linear-to-r from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-t from-background/60 via-transparent to-transparent" />
        </div>

        {/* Hero content */}
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-32 lg:px-10">
          <div className="max-w-xl">
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-6">
              <span className="gold-rule" aria-hidden="true" />
              <span className="eyebrow">Cheyenne, Wyoming</span>
            </div>

            {/* H1 */}
            <h1 className="font-playfair text-5xl font-bold leading-none tracking-tight text-cream sm:text-6xl lg:text-7xl">
              Where Nature
              <br />
              <span className="italic text-gold">Becomes Art</span>
            </h1>

            {/* Subtext */}
            <p className="mt-6 font-cormorant text-xl leading-relaxed text-stone-300 max-w-md">
              Handcrafted natural wood cat trees — sustainably sourced, made to
              order, and one-of-a-kind. Built in Wyoming for cats who deserve
              nothing less.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/shop"
                className="inline-flex items-center font-jost rounded-2xl text-sm font-semibold tracking-widest uppercase px-7 py-4 bg-gold text-stone-950 hover:bg-gold-light transition-colors"
              >
                Build Your Tree
              </Link>
              <Link
                href="/story"
                className="inline-flex items-center font-jost rounded-2xl text-sm font-semibold tracking-widest uppercase px-7 py-4 border border-stone-700 text-cream hover:border-stone-500 transition-colors"
              >
                Our Story
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-14 grid grid-cols-2 gap-x-8 gap-y-5 border-t border-stone-800 pt-8 sm:grid-cols-4">
              {STATS.map(({ value, label }) => (
                <div key={label}>
                  <p className="font-playfair text-2xl font-bold text-gold">{value}</p>
                  <p className="mt-0.5 font-jost text-xs text-stone-500 tracking-widest uppercase">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-60">
          <span className="font-jost text-xs tracking-widest uppercase text-stone-500">Scroll</span>
          <div className="w-px h-10 bg-linear-to-b from-stone-500 to-transparent" />
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          GOLD MARQUEE BAR
      ═══════════════════════════════════════════ */}
      <div className="border-y border-gold/30 bg-stone-950 py-4 overflow-hidden">
        <div
          className="flex gap-0 animate-marquee whitespace-nowrap"
          aria-hidden="true"
        >
          {/* Duplicate for seamless loop */}
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-6 px-6">
              <span className="text-gold" aria-hidden="true">✦</span>
              <span className="font-jost text-xs tracking-widest uppercase text-stone-400">
                {item}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          FEATURED COLLECTION
      ═══════════════════════════════════════════ */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center mb-16">
            <EyebrowLabel>Featured Collection</EyebrowLabel>
            <h2 className="mt-5 font-playfair text-4xl font-bold text-cream lg:text-5xl">
              Crafted for the <span className="italic text-gold">Discerning Cat</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {FEATURED_PRODUCTS.map((product) => (
              <div
                key={product.id}
                className="group flex flex-col bg-stone-900 border border-stone-800 card-hover"
              >
                {/* Image */}
                <div className="relative aspect-3/4 overflow-hidden img-zoom">
                  <Image
                    src={product.imageSrc}
                    alt={product.imageAlt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    unoptimized
                  />
                  {/* Badge */}
                  <span
                    className={`absolute top-4 left-4 font-jost text-xs font-semibold tracking-widest uppercase px-3 py-1 ${
                      BADGE_STYLES[product.badge]
                    }`}
                  >
                    {product.badge}
                  </span>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-6">
                  <p className="font-jost text-xs text-stone-500 tracking-widest uppercase mb-1">
                    {product.platforms} platforms
                  </p>
                  <h3 className="font-playfair text-2xl font-semibold text-cream mb-3">
                    {product.name}
                  </h3>
                  <p className="font-cormorant text-base leading-relaxed text-stone-400 flex-1 mb-6">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-playfair text-xl font-bold text-gold">
                      ${(product.platforms * 1000).toLocaleString()}
                    </span>
                    <Link
                      href="/shop"
                      className="font-jost text-xs font-semibold tracking-widest uppercase text-gold hover:text-gold-light transition-colors"
                    >
                      Configure →
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
      <section className="py-24 lg:py-32 bg-stone-950">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20 items-center">
            {/* Left: image collage */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="relative aspect-4/5 col-span-1">
                  <Image
                    src="https://placehold.co/600x750/1c1917/c9a45e?text=Craft+1"
                    alt="Artisan crafting natural wood cat tree"
                    fill
                    className="object-cover"
                    sizes="300px"
                    unoptimized
                  />
                </div>
                <div className="relative aspect-4/5 col-span-1 mt-10">
                  <Image
                    src="https://placehold.co/600x750/0c0a08/c9a45e?text=Craft+2"
                    alt="Wood grain and sisal detail"
                    fill
                    className="object-cover"
                    sizes="300px"
                    unoptimized
                  />
                </div>
              </div>
              {/* Gold badge overlay */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-gold text-stone-950 px-6 py-4 text-center min-w-35">
                <p className="font-playfair text-3xl font-bold">10+</p>
                <p className="font-jost text-xs tracking-widest uppercase">Years of Craft</p>
              </div>
            </div>

            {/* Right: story + features */}
            <div>
              <EyebrowLabel>The Craft</EyebrowLabel>
              <h2 className="mt-5 font-playfair text-4xl font-bold text-cream leading-tight lg:text-5xl">
                Every Branch<br />
                <span className="italic text-gold">Hand Selected</span>
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
                    <div className="w-8 h-px bg-gold" />
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
                className="mt-10 inline-flex items-center font-jost text-xs font-semibold tracking-widest uppercase text-gold border-b border-gold/40 pb-0.5 hover:border-gold transition-colors"
              >
                Read Our Full Story →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          HOW IT WORKS
      ═══════════════════════════════════════════ */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center mb-16">
            <EyebrowLabel>Process</EyebrowLabel>
            <h2 className="mt-5 font-playfair text-4xl font-bold text-cream lg:text-5xl">
              How It <span className="italic text-gold">Works</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {HOW_IT_WORKS_STEPS.map((step, i) => (
              <div key={step.number} className="relative flex flex-col gap-4">
                {/* Connector line (not last) */}
                {i < HOW_IT_WORKS_STEPS.length - 1 && (
                  <div
                    className="hidden lg:block absolute top-5 left-full w-full h-px bg-stone-800 z-0"
                    aria-hidden="true"
                  />
                )}
                <span className="relative z-10 font-playfair text-5xl font-bold text-stone-800 leading-none">
                  {step.number}
                </span>
                <div className="w-8 h-px bg-gold" />
                <h3 className="font-playfair text-xl font-semibold text-cream">{step.title}</h3>
                <p className="font-cormorant text-base leading-relaxed text-stone-400">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-14 text-center">
            <Link
              href="/shop"
              className="inline-flex items-center font-jost text-sm rounded-2xl font-semibold tracking-widest uppercase px-8 py-4 bg-gold text-stone-950 hover:bg-gold-light transition-colors"
            >
              Start Configuring →
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          GALLERY STRIP
      ═══════════════════════════════════════════ */}
      <section className="bg-stone-950">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
          {GALLERY_IMAGES.map((img, i) => (
            <div key={i} className="relative aspect-square img-zoom">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                unoptimized
              />
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          COMMISSION CTA BANNER
      ═══════════════════════════════════════════ */}
      <section className="py-24 lg:py-32 bg-background border-t border-stone-800">
        <div className="mx-auto max-w-3xl px-6 text-center lg:px-10">
          <EyebrowLabel>Custom Commission</EyebrowLabel>
          <h2 className="mt-6 font-playfair text-4xl font-bold text-cream leading-tight lg:text-5xl">
            Commission Your
            <br />
            <span className="italic text-gold">Dream Tree</span>
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
                className="inline-flex items-center gap-2 border border-stone-700 px-4 py-2 font-cormorant text-sm text-stone-400"
              >
                <span>{theme.emoji}</span>
                {theme.name}
                {theme.built && (
                  <span className="font-jost text-xs text-gold">✓ Built</span>
                )}
              </span>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/commission"
              className="inline-flex items-center rounded-2xl font-jost text-sm font-semibold tracking-widest uppercase px-8 py-4 bg-gold text-stone-950 hover:bg-gold-light transition-colors"
            >
              Start Your Commission
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center rounded-2xl font-jost text-sm font-semibold tracking-widest uppercase px-8 py-4 border border-stone-700 text-cream hover:border-stone-500 transition-colors"
            >
              Ask a Question
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
