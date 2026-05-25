import Link from "next/link";
import Image from "next/image";
import { BRAND } from "@/lib/products";

const SHOP_LINKS = [
  { href: "/shop",       label: "Configure Your Tree" },
  { href: "/shop#3d-builder", label: "Custom Commission" },
  { href: "/success",    label: "Order Confirmation" },
];

const COMPANY_LINKS = [
  { href: "/story",   label: "Our Story" },
  { href: "/contact", label: "Contact Us" },
];

const CONNECT_LINKS = [
  { href: BRAND.facebook, label: "Facebook", external: true },
  { href: BRAND.etsy,     label: "Etsy Shop", external: true },
];

// Simple SVG icons
function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function EtsyIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M10 3H5v18h5V3zm9 0h-5v18h5V3zM3 3H2v18h1V3zm18 0h-1v18h1V3z" />
    </svg>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="border-[#1e2e50]"
      style={{ backgroundColor: 'rgba(15, 31, 61, 0.55)' }}
    >
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          {/* Brand blurb */}
          <div className="md:col-span-1">
            <Link
              href="/"
              className="font-playfair text-xl font-bold text-cream hover:text-[#d42b40] transition-colors"
            >
              LazyCat Trees
            </Link>
            <p className="mt-4 font-cormorant text-base leading-relaxed text-stone-400">
              Handcrafted natural wood cat trees born out of love for cats and a passion for artistry.
              Made to order in Cheyenne, Wyoming.
            </p>

            {/* Social icons */}
            <div className="mt-6 flex items-center gap-4">
              <a
                href={BRAND.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LazyCat Trees on Facebook"
                className="flex items-center justify-center w-9 h-9 border border-[#1e2e50] text-stone-400 hover:border-white hover:text-white transition-colors duration-300"
              >
                <FacebookIcon />
              </a>
              <a
                href={BRAND.etsy}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LazyCat Trees on Etsy"
                className="flex items-center justify-center w-9 h-9 border border-[#1e2e50] text-stone-400 hover:border-white hover:text-white transition-colors duration-300"
              >
                <EtsyIcon />
              </a>
            </div>
          </div>

          {/* Shop links */}
          <div>
            <h3 className="eyebrow mb-5" style={{ color: '#b22234' }}>Shop</h3>
            <ul className="space-y-3">
              {SHOP_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="font-cormorant text-base text-stone-400 hover:text-white transition-colors duration-300"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h3 className="eyebrow mb-5" style={{ color: '#b22234' }}>Company</h3>
            <ul className="space-y-3">
              {COMPANY_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="font-cormorant text-base text-stone-400 hover:text-white transition-colors duration-300"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect links */}
          <div>
            <h3 className="eyebrow mb-5" style={{ color: '#b22234' }}>Connect</h3>
            <ul className="space-y-3">
              {CONNECT_LINKS.map(({ href, label, external }) => (
                <li key={href}>
                  <a
                    href={href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    className="font-cormorant text-base text-stone-400 hover:text-white transition-colors duration-300"
                  >
                    {label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={`mailto:${BRAND.email}`}
                  className="font-cormorant text-base text-stone-400 hover:text-cream transition-colors"
                >
                  {BRAND.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-6 translate-y-7 pb-5 cursor-default flex flex-col items-center gap-4 border-t border-[#1e2e50] pt-8 md:flex-row md:items-center md:justify-between">
          <p className="font-jost text-xs text-stone-500 tracking-widest uppercase">
            © {year} ★ LazyCat Trees, LLC — Proudly American Made 🇺🇸
          </p>

          <span className="hidden md:block text-stone-600 text-sm">•</span>

          {/* Attribution — centered */}
          <a
            href="https://mark-waldron.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2"
          >
            <Image
              src="/images/MW-Logo.png"
              alt="Mark Waldron logo"
              width={32}
              height={32}
              className="mw-logo"
            />
            <span className="mw-credit font-jost text-xs tracking-widest uppercase">
              Site by Mark Waldron
            </span>
          </a>

          <span className="hidden md:block text-stone-600 text-sm">•</span>

          <p className="font-jost text-xs text-stone-500 tracking-widest uppercase">
            All trees made to order · No returns or exchanges
          </p>
        </div>
      </div>
    </footer>
  );
}
