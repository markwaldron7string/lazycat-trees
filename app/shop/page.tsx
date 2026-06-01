import type { Metadata } from "next";
import CatTree3DConfigurator from "@/components/CatTree3DConfigurator";
import ShopGallery from "@/components/ShopGallery";

export const metadata: Metadata = {
  title: "Shop — Build & Order Your Natural Wood Cat Tree",
  description:
    "Design your custom LazyCat tree. Choose 2–8 platforms, carpet color, platform themes, and order securely or request a custom quote. Starting at $2,000. Ships nationwide.",
};

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Page header */}
        <div className="mb-12 border-b border-stone-800 pb-8">
          <p className="eyebrow mb-3">Build &amp; Order</p>
          <p className="font-cormorant text-lg text-stone-400 max-w-2xl">
            Design your tree in the live 3D preview. Solid builds can checkout immediately; themed and mixed-platform builds open a custom-order request.
          </p>
        </div>

        <div id="3d-builder" className="mb-20 scroll-mt-28">
          <CatTree3DConfigurator />
        </div>
        <ShopGallery />
      </div>
    </div>
  );
}
