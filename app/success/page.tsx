import type { Metadata } from "next";
import Link from "next/link";
import { PLATFORM_NAMES, SHIPPING_FLAT_RATE, getPrice, formatCurrency } from "@/lib/products";

export const metadata: Metadata = {
  title: "Order Confirmed — LazyCat Trees",
  description: "Your LazyCat Tree order has been confirmed. We'll be in touch within 48 hours to begin the build.",
};

// Success page reads URL params (platforms, color) passed by Stripe redirect
interface SearchParams {
  platforms?: string;
  color?: string;
}

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const platforms = parseInt(params.platforms ?? "3", 10);
  const color = params.color ?? "Black";
  const tierName = PLATFORM_NAMES[platforms] ?? "Custom";
  const price = getPrice(platforms);
  const total = price + SHIPPING_FLAT_RATE;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-24">
      <div className="w-full max-w-lg text-center">

        {/* Success icon */}
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center border border-gold">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#c9a45e"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        {/* Headline */}
        <p className="eyebrow mb-4">Order Confirmed</p>
        <h1 className="font-playfair text-4xl font-bold text-cream leading-tight lg:text-5xl mb-6">
          Your Tree Is{" "}
          <span className="italic text-gold">Being Made</span>
        </h1>
        <p className="font-cormorant text-xl leading-relaxed text-stone-400 mb-12">
          Thank you for your order. We're thrilled to be crafting your tree and
          will reach out within 48 hours to confirm your details and begin the
          build process.
        </p>

        {/* Order summary card */}
        <div className="bg-stone-900 border border-stone-800 p-6 mb-12 text-left">
          <p className="eyebrow mb-5">Order Summary</p>
          <dl className="space-y-3">
            {[
              ["Tree",          `${tierName} — ${platforms} Platforms`],
              ["Carpet Color",  color],
              ["Build Time",    "~30 days from order date"],
              ["Shipping",      `${formatCurrency(SHIPPING_FLAT_RATE)} flat rate · Ships from Cheyenne, WY`],
              ["Tree Price",    formatCurrency(price)],
              ["Order Total",   formatCurrency(total)],
            ].map(([label, value]) => (
              <div key={label} className="flex items-start justify-between gap-4">
                <dt className="font-jost text-xs text-stone-500 uppercase tracking-wider flex-shrink-0">
                  {label}
                </dt>
                <dd className="font-cormorant text-sm text-stone-300 text-right">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Next steps */}
        <div className="mb-12 border border-stone-800 bg-stone-950 p-6 text-left">
          <p className="eyebrow mb-5">What Happens Next</p>
          <ol className="space-y-4">
            {[
              "We'll email you within 48 hours to confirm your order details and answer any questions.",
              "Your tree is handcrafted over approximately 30 days with our signature care and quality.",
              "Before shipping, every tree is cleaned and inspected to meet our standards.",
              "Your tree ships from Cheyenne, Wyoming with full tracking provided.",
            ].map((step, i) => (
              <li key={i} className="flex gap-4">
                <span className="font-playfair text-base font-bold text-gold flex-shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="font-cormorant text-sm text-stone-400 leading-relaxed">{step}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center font-jost text-sm font-semibold tracking-widest uppercase px-7 py-4 bg-gold text-stone-950 hover:bg-gold-light transition-colors"
          >
            Browse More Trees
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center font-jost text-sm font-semibold tracking-widest uppercase px-7 py-4 border border-stone-700 text-cream hover:border-stone-500 transition-colors"
          >
            Contact Us
          </Link>
        </div>

        {/* Return note */}
        <p className="mt-8 font-cormorant text-sm text-stone-600">
          All trees are made to order. No returns or exchanges.
        </p>
      </div>
    </div>
  );
}
