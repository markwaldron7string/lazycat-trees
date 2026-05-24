"use client";

import { useState } from "react";
import { FAQ_ITEMS } from "@/lib/products";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items?: FAQItem[];
}

export default function FAQAccordion({ items = FAQ_ITEMS }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <div className="divide-y divide-stone-800">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={i}>
            <button
              aria-expanded={isOpen}
              onClick={() => toggle(i)}
              className="flex w-full items-start justify-between gap-4 py-5 text-left group cursor-pointer"
            >
              <span className="font-cormorant text-lg font-semibold text-cream group-hover:text-gold transition-colors leading-snug">
                {item.question}
              </span>
              <span
                className={`mt-0.5 flex-shrink-0 text-gold transition-transform duration-300 text-xl leading-none ${
                  isOpen ? "rotate-45" : ""
                }`}
                aria-hidden="true"
              >
                +
              </span>
            </button>

            <div
              className={`overflow-hidden transition-all duration-350 ${
                isOpen ? "max-h-96 opacity-100 pb-5" : "max-h-0 opacity-0"
              }`}
              style={{ transitionProperty: "max-height, opacity, padding-bottom" }}
            >
              <p className="font-cormorant text-base leading-relaxed text-stone-400">
                {item.answer}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
