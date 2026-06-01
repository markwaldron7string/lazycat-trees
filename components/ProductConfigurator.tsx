"use client";

import { useState } from "react";
import Image from "next/image";
import {
  CARPET_COLORS,
  PLATFORM_NAMES,
  MIN_PLATFORMS,
  MAX_PLATFORMS,
  PRICE_PER_PLATFORM,
  SHIPPING_FLAT_RATE,
  getPrice,
  formatCurrency,
  SHOP_IMAGES,
} from "@/lib/products";

export default function ProductConfigurator() {
  const [platforms, setPlatforms] = useState(3);
  const [selectedColor, setSelectedColor] = useState(CARPET_COLORS[0]);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  const price = getPrice(platforms);
  const total = price + SHIPPING_FLAT_RATE;
  const tierName = PLATFORM_NAMES[platforms];

  const decrement = () => setPlatforms((p) => Math.max(MIN_PLATFORMS, p - 1));
  const increment = () => setPlatforms((p) => Math.min(MAX_PLATFORMS, p + 1));

  const handleCheckout = async () => {
    setLoading(true);
    setCheckoutError("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platforms, color: selectedColor.name, price }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Unable to start checkout. Please try again.");
      }
      window.location.href = data.url;
    } catch (err: unknown) {
      setLoading(false);
      setCheckoutError(err instanceof Error ? err.message : "An unexpected error occurred.");
    }
  };

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
      {/* ── Left: Image gallery ──────────────────── */}
      <div className="flex flex-col gap-4">
        {/* Main image */}
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-stone-900">
          <Image
            src={SHOP_IMAGES[activeImage].src}
            alt={SHOP_IMAGES[activeImage].alt}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority={activeImage === 0}
            unoptimized
          />
        </div>

        {/* Thumbnails */}
        <div className="grid grid-cols-7 gap-2">
          {SHOP_IMAGES.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveImage(i)}
              aria-label={`View ${img.alt}`}
              className={`relative aspect-square overflow-hidden cursor-pointer transition-all ${
                activeImage === i
                  ? "ring-2 ring-gold ring-offset-2 ring-offset-background"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover"
                sizes="80px"
                unoptimized
              />
            </button>
          ))}
        </div>
      </div>

      {/* ── Right: Configurator ─────────────────── */}
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div>
          <p className="eyebrow mb-2">Handcrafted Natural Wood</p>
          <h1 className="font-playfair text-4xl font-bold leading-tight text-cream">
            Natural Wood{" "}
            <span className="italic text-gold">Cat Tree</span>
          </h1>
        </div>

        {/* Price */}
        <div className="border-b border-stone-800 pb-6">
          <div className="flex items-baseline gap-3">
            <span className="font-playfair text-4xl font-bold text-cream">
              {formatCurrency(price)}
            </span>
            <span className="font-cormorant text-base text-stone-400">
              + {formatCurrency(SHIPPING_FLAT_RATE)} shipping
            </span>
          </div>
          <p className="mt-1 font-cormorant text-sm text-stone-500">
            Ships from Cheyenne, WY · ~30 day lead time
          </p>
        </div>

        {/* Platform selector */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="eyebrow">Number of Platforms</p>
              <p className="mt-1 font-playfair text-lg font-semibold text-gold">{tierName}</p>
            </div>
            <p className="font-cormorant text-sm text-stone-400">
              {formatCurrency(MIN_PLATFORMS * PRICE_PER_PLATFORM)} – {formatCurrency(MAX_PLATFORMS * PRICE_PER_PLATFORM)}
            </p>
          </div>

          {/* Stepper */}
          <div className="flex items-center gap-5 mb-4">
            <button
              onClick={decrement}
              disabled={platforms <= MIN_PLATFORMS}
              aria-label="Decrease platforms"
              className="flex items-center justify-center w-10 h-10 border border-stone-700 text-cream hover:border-gold hover:text-gold transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer font-jost text-lg"
            >
              −
            </button>
            <span className="font-playfair text-3xl font-bold text-cream w-8 text-center">
              {platforms}
            </span>
            <button
              onClick={increment}
              disabled={platforms >= MAX_PLATFORMS}
              aria-label="Increase platforms"
              className="flex items-center justify-center w-10 h-10 border border-stone-700 text-cream hover:border-gold hover:text-gold transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer font-jost text-lg"
            >
              +
            </button>
          </div>

          {/* Progress bar */}
          <div className="flex gap-1.5" role="presentation">
            {Array.from({ length: MAX_PLATFORMS - MIN_PLATFORMS + 1 }, (_, i) => {
              const level = i + MIN_PLATFORMS;
              const filled = level <= platforms;
              return (
                <button
                  key={level}
                  onClick={() => setPlatforms(level)}
                  aria-label={`${level} platforms`}
                  className={`flex-1 h-1.5 progress-segment cursor-pointer transition-colors ${
                    filled ? "bg-gold" : "bg-stone-800"
                  }`}
                />
              );
            })}
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="font-jost text-xs text-stone-500">{MIN_PLATFORMS} platforms</span>
            <span className="font-jost text-xs text-stone-500">{MAX_PLATFORMS} platforms</span>
          </div>
        </div>

        {/* Color selector */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="eyebrow">Carpet Color</p>
            <span className="font-cormorant text-sm text-gold font-semibold">
              {selectedColor.name}
            </span>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {CARPET_COLORS.map((color) => {
              const isSelected = selectedColor.name === color.name;
              return (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color)}
                  aria-label={`Select ${color.name} carpet`}
                  title={color.name}
                  className={`aspect-square w-full rounded-sm cursor-pointer transition-all duration-150 ${
                    isSelected
                      ? "ring-2 ring-gold ring-offset-2 ring-offset-background scale-110"
                      : "hover:scale-105"
                  } ${color.name === "White" || color.name === "Beige" ? "border border-stone-700" : ""}`}
                  style={{ backgroundColor: color.hex }}
                />
              );
            })}
          </div>
        </div>

        {/* Specs summary */}
        <div className="bg-[#0f1f3d] border border-[#1e2e50] p-5 space-y-3">
          <p className="eyebrow mb-3" style={{ color: '#b22234' }}>Order Summary</p>

          {[
            ["Tier", tierName],
            ["Platforms", `${platforms} platforms`],
            ["Carpet Color", selectedColor.name],
            ["Base Diameter", '24"'],
            ["Sisal Wrapping", "Included"],
            ["Build Time", "~30 days"],
            ["Ships From", "Cheyenne, WY"],
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between">
              <span className="font-jost text-xs text-[#c9a45e] uppercase tracking-wider">{label}</span>
              <span className="font-cormorant text-sm font-semibold text-white">{value}</span>
            </div>
          ))}

          <div className="border-t border-[#1e2e50] pt-3 mt-3 flex items-center justify-between">
            <span className="font-jost text-xs text-stone-400 uppercase tracking-wider">
              Subtotal
            </span>
            <span className="font-cormorant text-sm font-semibold text-white">{formatCurrency(price)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-jost text-xs text-stone-400 uppercase tracking-wider">
              Shipping
            </span>
            <span className="font-cormorant text-sm font-semibold text-white">{formatCurrency(SHIPPING_FLAT_RATE)}</span>
          </div>
          <div className="border-t border-[#1e2e50] pt-3 flex items-center justify-between">
            <span className="font-jost text-xs text-white uppercase tracking-wider font-bold">
              Order Total
            </span>
            <span className="font-playfair text-base font-bold text-[#c9a45e]">
              {formatCurrency(total)}
            </span>
          </div>
        </div>

        {/* Checkout button */}
        {checkoutError && (
          <p className="font-cormorant text-sm text-red-400 border border-red-900/60 bg-red-950/30 px-4 py-3">
            {checkoutError}
          </p>
        )}

        <button
          onClick={handleCheckout}
          disabled={loading}
          className="flex w-full items-center justify-center gap-3 font-jost text-sm font-semibold tracking-widest uppercase px-8 py-5 bg-gold text-stone-950 hover:bg-gold-light transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer text-base"
        >
          {loading && <span className="spinner" aria-hidden="true" />}
          {loading ? "Redirecting to Checkout…" : `Order Now — ${formatCurrency(total)}`}
        </button>

        <p className="text-center font-jost text-xs text-stone-500 tracking-wide">
          Secure checkout via Stripe · Full payment due at time of order
        </p>

        {/* Custom order callout */}
        <div className="border border-stone-800 p-5">
          <p className="eyebrow mb-2">Want Something Unique?</p>
          <p className="font-cormorant text-base text-stone-400 leading-relaxed mb-4">
            We build custom-themed trees — mushroom caps, hieroglyphs, zebra stripes, and beyond.
            Tell us your vision and we'll bring it to life.
          </p>
          <a
            href="/commission"
            className="inline-flex font-jost text-xs font-semibold tracking-widest uppercase text-gold hover:text-gold-light transition-colors"
          >
            Request a Custom Order →
          </a>
        </div>
      </div>
    </div>
  );
}
