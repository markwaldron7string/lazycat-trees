"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const HERO_SLIDES = [
  { src: "/images/hero-slide-1.png", alt: "LazyCat Trees collection against a red barn wall" },
  { src: "/images/hero-slide-2.png", alt: "Blue five-level natural wood cat tree outside a garage" },
  { src: "/images/hero-slide-3.png", alt: "Pink four-level natural wood cat tree outside a garage" },
  { src: "/images/hero-slide-4.png", alt: "Full market tent display of LazyCat Trees" },
];

/**
 * Full-viewport hero background: 4-image crossfading slideshow with Ken Burns zoom.
 *
 * Each slide displays for 5 seconds, then fades to the next over 1500ms.
 * The active slide plays the `kenburns-active` CSS animation (scale 1 → 1.12 over 5.5s).
 *
 * Animation-restart trick: the inner wrapper uses `key={isActive ? \`${i}-${generation}\` : i}`.
 * - Active slide:  key includes `generation` (changes each transition) → React remounts the
 *   wrapper → CSS animation restarts from scale(1.0). The fade-in hides any brief remount.
 * - Idle slides:   key is stable (`i`) → Image stays mounted throughout its fade-out,
 *   so no visual blank during the 1500ms opacity transition.
 */
export default function HeroBackground() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [generation, setGeneration]   = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % HERO_SLIDES.length);
      setGeneration((g) => g + 1);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="absolute inset-0 z-0">
      {HERO_SLIDES.map((slide, i) => {
        const isActive = i === activeIndex;
        return (
          <div
            key={slide.src}
            className={`absolute inset-0 transition-opacity duration-[1500ms] ${
              isActive ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* New key on each activation → unmount + remount → CSS animation restarts */}
            <div
              key={isActive ? `${i}-${generation}` : i}
              className={`absolute inset-0 overflow-hidden${isActive ? " kenburns-active" : ""}`}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                className="object-cover object-center"
                priority={i === 0}
                sizes="100vw"
              />
            </div>
          </div>
        );
      })}

      {/* Gradient overlay: dark left (text readable) → transparent right (image shows through) */}
      <div className="absolute inset-0 bg-linear-to-r from-stone-950 via-stone-950/80 to-stone-950/25" />
    </div>
  );
}
