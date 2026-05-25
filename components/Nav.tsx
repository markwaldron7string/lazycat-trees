"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV_LINKS, BRAND } from "@/lib/products";

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "nav-solid" : "bg-transparent"
        }`}
      >
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Link
            href="/"
            className="font-playfair text-xl font-bold tracking-wide text-cream hover:text-[#d42b40] transition-colors flex items-center gap-2"
            onClick={closeMenu}
          >
            <span
              className="flex items-center justify-center w-7 h-7 border border-[#b22234]"
              aria-hidden="true"
            >
              <span className="text-[#b22234] text-xs">✦</span>
            </span>
            LazyCat Trees
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ href, label }) => {
              const active = pathname === href;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`font-jost text-sm tracking-widest uppercase transition-colors ${
                      active
                        ? "text-[#b22234] border-b border-[#b22234] pb-0.5"
                        : "text-cream/70 hover:text-cream"
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Desktop CTA */}
          <Link href="/shop" className="hidden md:inline-flex btn-primary">
            Build Your Tree
          </Link>

          {/* Mobile hamburger */}
          <button
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="md:hidden flex flex-col gap-1.5 p-2 cursor-pointer"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span
              className={`block w-6 h-0.5 bg-cream transition-all duration-300 ${
                menuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-cream transition-all duration-300 ${
                menuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-cream transition-all duration-300 ${
                menuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>
        </nav>
      </header>

      {/* Mobile full-screen overlay menu */}
      <div
        className={`fixed inset-0 z-40 flex flex-col items-center justify-center transition-all duration-300 md:hidden ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        style={{ backgroundColor: '#0a1628' }}
        aria-hidden={!menuOpen}
      >
        <ul className="flex flex-col items-center gap-8">
          {NAV_LINKS.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={closeMenu}
                  className={`font-playfair text-3xl font-semibold transition-colors ${
                    active ? "text-[#b22234]" : "text-cream hover:text-[#b22234]"
                  }`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-12">
          <Link href="/shop" onClick={closeMenu} className="btn-primary">
            Build Your Tree
          </Link>
        </div>

        <p className="absolute bottom-8 font-jost text-xs text-stone-500 tracking-widest uppercase">
          {BRAND.location}
        </p>
      </div>
    </>
  );
}
