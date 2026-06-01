"use client";

import { useState } from "react";
import Image from "next/image";
import { SHOP_GALLERY_IMAGES } from "@/lib/media";

export default function ShopGallery() {
  const [active, setActive] = useState(0);
  const current = SHOP_GALLERY_IMAGES[active];

  return (
    <div id="real-trees-built" className="mb-14 scroll-mt-28">
      <p className="eyebrow mb-3">Real Trees We&apos;ve Built</p>
      <p className="font-cormorant text-lg text-stone-400 max-w-2xl mb-6">
        Every LazyCat tree is one of a kind. Browse recent builds for shape, carpet, and
        finish inspiration after you dial in the 3D preview.
      </p>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative aspect-4/5 overflow-hidden border border-stone-800 bg-stone-900">
          <Image
            key={current.src}
            src={current.src}
            alt={current.alt}
            fill
            className="object-cover transition-opacity duration-500"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>

        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-2 content-start">
          {SHOP_GALLERY_IMAGES.map((img, i) => (
            <button
              key={img.src}
              type="button"
              onClick={() => setActive(i)}
              className={`relative aspect-square overflow-hidden border transition-colors cursor-pointer ${
                i === active
                  ? "border-gold ring-1 ring-gold/50"
                  : "border-stone-800 hover:border-stone-600"
              }`}
              aria-label={`View ${img.alt}`}
              aria-pressed={i === active}
            >
              <Image src={img.src} alt="" fill className="object-cover" sizes="120px" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
