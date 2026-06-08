import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { EyebrowLabel } from "@/components/GoldLine";
import { PLATFORM_SPECS, WOOD_TYPES } from "@/lib/products";
import { STORY_IMAGES } from "@/lib/media";

export const metadata: Metadata = {
  title: "Our Story - From Animal Shelter to Artisan Workshop",
  description:
    "How LazyCat Trees was born from love for cats, a competition win, and a passion for natural beauty. Read the story of our founder, our craft, and our mission.",
};

export default function StoryPage() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-24">
      {/* Hero image banner */}
      <div className="relative h-72 lg:h-96 mb-20 overflow-hidden">
        <Image
          src={STORY_IMAGES.hero.src}
          alt={STORY_IMAGES.hero.alt}
          fill
          className="object-cover object-[center_40%]"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-linear-to-b from-background/30 via-background/20 to-background" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <EyebrowLabel>Our Story</EyebrowLabel>
            <h1 className="mt-5 font-playfair text-5xl font-bold text-cream lg:text-6xl">
              From Shelter to{" "}
              <span className="italic text-gold">Workshop</span>
            </h1>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Two-column layout */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[280px_1fr] lg:gap-16">

          {/* ── Sidebar ──────────────────────────── */}
          <aside className="lg:sticky lg:top-28 h-fit">
            {/* Portrait photo */}
            <div className="relative aspect-square w-full mb-6 overflow-hidden">
              <Image
                src={STORY_IMAGES.sidebar.src}
                alt={STORY_IMAGES.sidebar.alt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 280px"
              />
            </div>

            {/* At a Glance card */}
            <div className="bg-stone-900 max-[1024px]:hidden border border-stone-800 p-6">
              <p className="eyebrow mb-5">At a Glance</p>
              <dl className="space-y-4">
                {[
                  { label: "Founded",    value: "10+ years ago" },
                  { label: "Location",   value: "Cheyenne, Wyoming" },
                  { label: "Materials",  value: "Apple · Pine · Maple · Madrone" },
                  { label: "Lead Time",  value: PLATFORM_SPECS.leadTime },
                  { label: "Shipping",   value: PLATFORM_SPECS.shippingRate },
                  { label: "Returns",    value: "No returns - made to order" },
                ].map(({ label, value }) => (
                  <div key={label} className="border-b border-stone-800 pb-4 last:border-0 last:pb-0">
                    <dt className="font-jost text-xs text-stone-500 tracking-widest uppercase mb-1">
                      {label}
                    </dt>
                    <dd className="font-cormorant text-lg text-stone-300 leading-snug">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </aside>

          {/* ── Main story ───────────────────────── */}
          <article className="max-w-none">

            {/* Section 1: Origin */}
            <section className="mb-16">
              <EyebrowLabel>The Beginning</EyebrowLabel>
              <h2 className="mt-5 font-playfair text-3xl font-bold text-cream leading-tight lg:text-4xl">
                From Animal Shelter to{" "}
                <span className="italic text-gold">Artisan Workshop</span>
              </h2>

              <div className="mt-8 space-y-6 font-cormorant text-lg leading-relaxed text-stone-400">
                <p>
                  The idea behind LazyCat Trees began more than ten years ago
                  while volunteering at a local animal shelter, which led to a
                  full-time position. I fell in love with the cats. They rescued
                  me from myself and brought me peace and acceptance. I came from
                  nothing, and the cats brought me up and gave me something to
                  believe in.
                </p>
                <p>
                  A local company called Mad Cat Pet Supply hosted a competition
                  on who could build the best cat tree. I used what is now the
                  design for LazyCat Trees as my submission - and won first
                  prize. I fell in love with the natural beauty and artistry in
                  the design. The individuality of the different types of wood
                  and colors used to complement the wood.
                </p>
                <p>
                  Being naturally sourced, clean materials used and the creation
                  process lead me to create a business I love and can be proud
                  of. Now, I have decided to share my creations by promoting on
                  Etsy and social media.
                </p>
                <p>
                  LazyCat Trees was born out of a broken place to bring joy and
                  natural beauty, and I want to share that with as many people as
                  possible. The ultimate goal for LazyCat Trees is to support and
                  fight for all cats out there and to find all cats a safe place
                  for shelter.{" "}
                  <strong className="text-cream font-semibold">
                    At LazyCat Trees, we don't want to see any cats suffer.
                  </strong>
                </p>
              </div>

              {/* Award callout */}
              <div className="mt-10 border-l-2 border-gold pl-6 py-1">
                <p className="font-playfair text-xl italic text-cream leading-relaxed">
                  "I fell in love with the natural beauty and artistry in the
                  design - born from a competition win, built for a lifetime."
                </p>
              </div>
            </section>

            {/* Section 2: Materials */}
            <section className="mb-16">
              <EyebrowLabel>The Materials</EyebrowLabel>
              <h2 className="mt-5 font-playfair text-3xl font-bold text-cream leading-tight lg:text-4xl">
                Sustainably Sourced,{" "}
                <span className="italic text-gold">Hand Selected</span>
              </h2>

              <div className="mt-8 space-y-6 font-cormorant text-lg leading-relaxed text-stone-400">
                <p>
                  Each piece of wood is sustainably collected from apple, pine,
                  maple, and madrone. Sourced through permits to collect downed
                  trees in local forests, networking with landowners needing tree
                  removals, and special requests from customers wanting to
                  repurpose trees from their own property.
                </p>
                <p>
                  The branches are cut to size, inspected to be pest-free, then
                  dried and cured over time. The curing process takes years to
                  reach ideal hardness. After curing, the wood goes through
                  hand-sanding to highlight the natural beauty of the grain and
                  color.
                </p>
                <p>
                  Platforms are made from chemical-free plywood, notched
                  precisely to fit the branches, leveled carefully, and covered
                  in soft carpet stapled tightly for safety. Every tree is
                  cleaned and power-washed before shipping.
                </p>
              </div>

              {/* Wood types */}
              <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {WOOD_TYPES.map((wood) => (
                  <div key={wood.name} className="bg-stone-900 border border-stone-800 p-4">
                    <div className="w-8 h-px bg-gold mb-3" />
                    <h4 className="font-playfair text-base font-semibold text-cream mb-1">
                      {wood.name}
                    </h4>
                    <p className="font-cormorant text-xs text-stone-500 leading-snug">
                      {wood.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Photo grid */}
            <div className="mb-16 grid grid-cols-2 gap-4">
              {STORY_IMAGES.grid.map((img) => (
                <div key={img.src} className="relative aspect-6/5 overflow-hidden img-zoom">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <Link
                href="/shop"
                className="inline-flex items-center font-jost text-sm font-semibold tracking-widest uppercase px-7 py-4 bg-gold text-stone-950 hover:bg-gold-light transition-colors"
              >
                Build &amp; Order
              </Link>
              <Link
                href="/commission"
                className="inline-flex items-center font-jost text-sm font-semibold tracking-widest uppercase px-7 py-4 border border-stone-700 text-cream hover:border-stone-500 transition-colors"
              >
                Custom Order
              </Link>
            </div>

          </article>
        </div>
      </div>
    </div>
  );
}
