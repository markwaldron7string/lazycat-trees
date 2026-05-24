import Image from "next/image";
import { LIFESTYLE_IMAGES } from "@/lib/media";
import { EyebrowLabel } from "@/components/GoldLine";

export default function LifestyleStrip() {
  return (
    <section className="py-24 lg:py-28 bg-stone-950 border-y border-stone-800 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 mb-12">
        <EyebrowLabel>Happy Cats</EyebrowLabel>
        <h2 className="mt-5 font-playfair text-4xl font-bold text-cream lg:text-5xl max-w-2xl">
          Made for <span className="italic text-gold">Real Climbers</span>
        </h2>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {LIFESTYLE_IMAGES.map((img, i) => (
            <figure
              key={img.src}
              className={`reveal-up reveal-delay-${i} group relative overflow-hidden border border-stone-800 bg-stone-900`}
            >
              <div className="relative aspect-4/5 img-zoom">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              {img.caption && (
                <figcaption className="absolute bottom-0 inset-x-0 bg-linear-to-t from-background/95 via-background/70 to-transparent px-5 py-5">
                  <p className="font-cormorant text-lg text-cream">{img.caption}</p>
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
