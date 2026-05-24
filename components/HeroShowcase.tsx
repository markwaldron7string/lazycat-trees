"use client";

import Image from "next/image";
import { HERO_SHOWCASE_IMAGES } from "@/lib/media";

export default function HeroShowcase() {
  return (
    <div
      className="relative hidden lg:block h-[min(580px,72vh)] w-full"
      aria-hidden="true"
    >
      {/* Soft glow behind the collage */}
      <div className="absolute inset-10 rounded-full bg-gold/8 blur-3xl" />

      {HERO_SHOWCASE_IMAGES.map((img, i) => (
        <div
          key={img.src}
          className={`hero-float-card hero-float-${i} absolute overflow-hidden border border-stone-700/80 shadow-2xl shadow-black/50 ${img.className}`}
        >
          <div className="relative aspect-4/5 w-full img-zoom">
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-cover"
              sizes="(max-width: 1280px) 40vw, 320px"
              priority={i < 2}
            />
          </div>
        </div>
      ))}

      {/* Gold accent frame */}
      <div className="absolute top-[12%] right-[18%] w-[28%] h-[28%] border border-gold/25 pointer-events-none" />
    </div>
  );
}
