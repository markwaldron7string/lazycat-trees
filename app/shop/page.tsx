import type { Metadata } from "next";
import CatTree3DConfigurator from "@/components/CatTree3DConfigurator";
import ShopGallery from "@/components/ShopGallery";

export const metadata: Metadata = {
  title: "Shop — Configure Your Natural Wood Cat Tree",
  description:
    "Design your custom LazyCat tree. Choose 2–8 platforms, carpet color from 14 options, and order securely via Stripe. Starting at $2,000. Ships nationwide.",
};

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Page header */}
        <div className="mb-12 border-b border-stone-800 pb-8">
          <p className="eyebrow mb-3">Configure &amp; Order</p>
          <p className="font-cormorant text-lg text-stone-400 max-w-2xl">
            Design your tree in the live 3D preview, then order securely through Stripe.
          </p>
        </div>

        <ShopGallery />
        <CatTree3DConfigurator />
      </div>
    </div>
  );
}
