import type { Metadata } from "next";
import Image from "next/image";
import { COMMISSION_THEMES } from "@/lib/products";
import { COMMISSION_HERO, COMMISSION_INSPIRATION } from "@/lib/media";
import { EyebrowLabel } from "@/components/GoldLine";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Custom Commission — Design a One-of-a-Kind Cat Tree",
  description:
    "Describe your dream cat tree and we'll build it. Mushroom themes, Egyptian hieroglyphs, botanical, celestial — any vision welcome. Custom orders from LazyCat Trees.",
};

export default function CommissionPage() {
  return (
    <div className="min-h-screen bg-background pt-28 pb-24">
      {/* Hero banner */}
      <div className="relative h-64 lg:h-80 mb-16 overflow-hidden">
        <Image
          src={COMMISSION_HERO.src}
          alt={COMMISSION_HERO.alt}
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/50 to-background/20" />
        <div className="absolute bottom-8 left-0 right-0 mx-auto max-w-7xl px-6 lg:px-10">
          <EyebrowLabel>Custom Commission</EyebrowLabel>
          <h1 className="mt-4 font-playfair text-4xl font-bold text-cream lg:text-5xl">
            Your Vision, <span className="italic text-gold">Handcrafted</span>
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-10">

        <p className="font-cormorant text-xl leading-relaxed text-stone-400 max-w-2xl mb-16 -mt-4">
          Every LazyCat tree is already one of a kind — but a custom commission takes it
          further. Tell us your theme, your mood, your inspiration. We&apos;ll bring it to
          life in natural wood, sisal, and carefully chosen carpet.
        </p>

        {/* Theme examples */}
        <div className="mb-16">
          <p className="eyebrow mb-8">Example Themes</p>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {COMMISSION_THEMES.map((theme) => (
              <div
                key={theme.name}
                className="bg-stone-900 border border-stone-800 p-6 card-hover"
              >
                {/* Emoji / icon */}
                <p
                  className="text-3xl mb-4"
                  aria-hidden="true"
                  style={{ fontFamily: "system-ui, sans-serif" }}
                >
                  {theme.emoji}
                </p>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-playfair text-lg font-semibold text-cream">
                    {theme.name}
                  </h3>
                  {theme.built && (
                    <span className="font-jost text-xs text-gold border border-gold/40 px-2 py-0.5">
                      Built
                    </span>
                  )}
                </div>
                <p className="font-cormorant text-sm leading-relaxed text-stone-400">
                  {theme.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Process note */}
        <div className="mb-16 border border-stone-800 bg-stone-950 p-8 max-w-2xl">
          <p className="eyebrow mb-4">How Commissions Work</p>
          <ol className="space-y-4">
            {[
              "Submit the form below with your vision, color palette, and approximate size.",
              "We'll reach out within 48 hours to discuss details, refine the design, and confirm pricing.",
              "A deposit is collected to begin work. The balance is due before shipping.",
              "Your tree is handcrafted over approximately 30 days, then inspected and shipped with care.",
            ].map((step, i) => (
              <li key={i} className="flex gap-4">
                <span className="font-playfair text-lg font-bold text-gold flex-shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="font-cormorant text-base leading-relaxed text-stone-400">{step}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* Commission form */}
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          <div>
            <h2 className="font-playfair text-3xl font-bold text-cream mb-3">
              Tell Us Your Vision
            </h2>
            <p className="font-cormorant text-lg leading-relaxed text-stone-400 mb-8">
              No idea is too wild. We've built mushroom kingdoms and we'd love to
              craft Egyptian hieroglyph towers, forest sanctuaries, or whatever
              you dream up. The more detail, the better.
            </p>
            <ContactForm type="commission" commission />
          </div>

          <div className="hidden lg:flex flex-col gap-5 pt-16">
            <p className="eyebrow">Recent Inspiration</p>
            {COMMISSION_INSPIRATION.map((img) => (
              <div
                key={img.src}
                className="relative aspect-4/3 overflow-hidden border border-stone-800 img-zoom"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover"
                  sizes="400px"
                />
              </div>
            ))}
            <div className="bg-stone-900 border border-stone-800 p-8">
              <p className="eyebrow mb-4">What We Need to Know</p>
              <ul className="space-y-4">
                {[
                  { q: "Theme & Mood", a: "What feeling should the tree evoke? Whimsy, grandeur, nature, mystery?" },
                  { q: "Color Palette", a: "Are there specific colors or tones you love?" },
                  { q: "Scale", a: "How many platforms are you imagining? 2–8 available." },
                  { q: "Inspiration", a: "Share images, art, or descriptions — anything that captures your vision." },
                  { q: "Budget", a: "Standard pricing is $1,000 per platform. Custom elements may add cost." },
                ].map(({ q, a }) => (
                  <li key={q} className="border-b border-stone-800 pb-4 last:border-0 last:pb-0">
                    <p className="font-jost text-xs font-semibold text-cream tracking-widest uppercase mb-1">{q}</p>
                    <p className="font-cormorant text-sm text-stone-500 leading-relaxed">{a}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
