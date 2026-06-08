import type { Metadata } from "next";
import Link from "next/link";
import { EyebrowLabel } from "@/components/GoldLine";
import ContactForm from "@/components/ContactForm";
import FAQAccordion from "@/components/FAQAccordion";
import { BRAND } from "@/lib/products";

export const metadata: Metadata = {
  title: "Contact Us - LazyCat Trees",
  description:
    "Get in touch with LazyCat Trees. Questions about ordering, shipping, custom trees, or anything else - we're happy to help. Based in Cheyenne, Wyoming.",
};

function MapPinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M12 22s8-4.5 8-11.8A8 8 0 0 0 4 10.2C4 17.5 12 22 12 22z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  );
}

function ShopIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M3 9l1-5h16l1 5"/>
      <path d="M3 9h18v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <path d="M9 21v-6h6v6"/>
    </svg>
  );
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background pt-28 pb-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">

        {/* Header */}
        <div className="mb-16">
          <EyebrowLabel>Get in Touch</EyebrowLabel>
          <h1 className="mt-5 font-playfair text-5xl font-bold text-cream leading-tight lg:text-6xl">
            We'd Love to{" "}
            <span className="italic text-gold">Hear From You</span>
          </h1>
          <p className="mt-5 font-cormorant text-xl leading-relaxed text-stone-400 max-w-xl">
            Questions about ordering, custom trees, shipping, or just want to
            say hello - we're here and happy to help.
          </p>
        </div>

        {/* Two-column: contact info + form */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[300px_1fr] lg:gap-16 mb-24">

          {/* Left: contact info */}
          <div className="space-y-8">
            <div>
              <p className="eyebrow mb-5">Contact Info</p>
              <div className="space-y-4">
                {/* Location */}
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 text-gold shrink-0">
                    <MapPinIcon />
                  </span>
                  <div>
                    <p className="font-jost text-sm text-cream font-semibold">Location</p>
                    <p className="font-cormorant text-base text-stone-400">
                      {BRAND.location}
                    </p>
                  </div>
                </div>

                {/* Facebook */}
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 text-gold shrink-0">
                    <FacebookIcon />
                  </span>
                  <div>
                    <p className="font-jost text-sm text-cream font-semibold">Facebook</p>
                    <a
                      href={BRAND.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-cormorant text-base text-stone-400 hover:text-gold transition-colors"
                    >
                      LazyCat Trees
                    </a>
                  </div>
                </div>

                {/* Etsy */}
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 text-gold shrink-0">
                    <ShopIcon />
                  </span>
                  <div>
                    <p className="font-jost text-sm text-cream font-semibold">Etsy Shop</p>
                    <a
                      href={BRAND.etsy}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-cormorant text-base text-stone-400 hover:text-gold transition-colors"
                    >
                      LazyCatTrees on Etsy
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Response time note */}
            <div className="bg-stone-900 border border-stone-800 p-5">
              <p className="font-jost text-xs text-stone-500 uppercase tracking-wider mb-2">Response Time</p>
              <p className="font-cormorant text-base text-stone-300 leading-relaxed">
                We respond to all inquiries within 48 hours. For urgent questions
                about an existing order, please mention your order details.
              </p>
            </div>

            {/* Custom order promo */}
            <div className="border border-gold/30 bg-stone-950 p-5">
              <p className="eyebrow mb-2">Want Something Custom?</p>
              <p className="font-cormorant text-sm text-stone-400 leading-relaxed mb-3">
                For custom-themed trees, use our dedicated custom-order form for
                the best experience.
              </p>
              <Link
                href="/commission"
                className="font-jost text-xs font-semibold tracking-widest uppercase text-gold hover:text-gold-light transition-colors"
              >
                Custom Order Page →
              </Link>
            </div>
          </div>

          {/* Right: Contact form */}
          <div>
            <h2 className="font-playfair text-2xl font-bold text-cream mb-8">
              Send a Message
            </h2>
            <ContactForm type="general" />
          </div>
        </div>

        {/* FAQ Section */}
        <section>
          <div className="text-center mb-12">
            <EyebrowLabel>Frequently Asked Questions</EyebrowLabel>
            <h2 className="mt-5 font-playfair text-3xl font-bold text-cream lg:text-4xl">
              Common <span className="italic text-gold">Questions</span>
            </h2>
          </div>

          <div className="mx-auto max-w-2xl">
            <FAQAccordion />

            <div className="mt-10 text-center">
              <p className="font-cormorant text-base text-stone-500">
                Don't see your question?{" "}
                <a href="/contact#form" className="text-gold hover:text-gold-light transition-colors">
                  Send us a message
                </a>
                .
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
