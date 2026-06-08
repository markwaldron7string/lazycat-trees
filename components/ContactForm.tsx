"use client";

import { useEffect, useState, FormEvent } from "react";

interface ContactFormProps {
  type?: "general" | "commission";
  /** Extra fields shown for commission forms */
  commission?: boolean;
}

type FormStatus = "idle" | "submitting" | "success" | "error";

const SUBJECT_OPTIONS = [
  "General Inquiry",
  "Custom Order",
  "Shipping Question",
  "Other",
];

const HEAR_ABOUT_OPTIONS = [
  "Google",
  "Facebook",
  "Etsy",
  "Instagram",
  "Friend / Word of Mouth",
  "Other",
];

export default function ContactForm({ type = "general", commission = false }: ContactFormProps) {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [error, setError] = useState("");

  const [fields, setFields] = useState({
    name: "",
    email: "",
    phone: "",
    subject: SUBJECT_OPTIONS[0],
    message: "",
    // Commission-specific
    vision: "",
    palette: "",
    platforms: "",
    hearAbout: HEAR_ABOUT_OPTIONS[0],
  });

  useEffect(() => {
    if (!commission || typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const design = params.get("design");
    const palette = params.get("palette");
    const platforms = params.get("platforms");

    if (!design && !palette && !platforms) return;

    setFields((prev) => ({
      ...prev,
      palette: prev.palette || palette || "",
      platforms: prev.platforms || platforms || "",
      vision:
        prev.vision ||
        [
          "I would like to request a custom LazyCat tree.",
          platforms ? `Approximate platforms: ${platforms}.` : "",
          design ? `Design direction: ${design}.` : "",
          palette ? `Palette/theme: ${palette}.` : "",
        ]
          .filter(Boolean)
          .join(" "),
    }));
  }, [commission]);

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setFields((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setError("");

    const body = commission
      ? {
          type: "commission",
          name: fields.name,
          email: fields.email,
          phone: fields.phone || undefined,
          message: fields.vision,
          vision: fields.vision,
          palette: fields.palette,
          platforms: fields.platforms,
          hearAbout: fields.hearAbout,
        }
      : {
          type: "general",
          name: fields.name,
          email: fields.email,
          subject: fields.subject,
          message: fields.message,
        };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }
      setStatus("success");
    } catch (err: unknown) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    }
  };

  const inputClass =
    "w-full bg-white border border-stone-300 text-stone-900 font-cormorant text-base px-4 py-3 outline-none focus:border-gold transition-colors placeholder:text-stone-400";

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-14 h-14 rounded-full border border-gold flex items-center justify-center mb-6">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9a45e" strokeWidth="2" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 className="font-playfair text-2xl font-semibold text-cream mb-3">
          {commission ? "Custom Order Request Received" : "Message Sent"}
        </h3>
        <p className="font-cormorant text-lg text-stone-400 max-w-sm leading-relaxed">
          Thank you, {fields.name.split(" ")[0]}. We'll be in touch within 48 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Name + Email */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-name" className="eyebrow mb-2 block">
            Name <span className="text-gold">*</span>
          </label>
          <input
            id="cf-name"
            type="text"
            required
            value={fields.name}
            onChange={set("name")}
            placeholder="Your full name"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="cf-email" className="eyebrow mb-2 block">
            Email <span className="text-gold">*</span>
          </label>
          <input
            id="cf-email"
            type="email"
            required
            value={fields.email}
            onChange={set("email")}
            placeholder="your@email.com"
            className={inputClass}
          />
        </div>
      </div>

      {/* Phone (optional, shown on commission) */}
      {commission && (
        <div>
          <label htmlFor="cf-phone" className="eyebrow mb-2 block">
            Phone <span className="text-stone-600">(optional)</span>
          </label>
          <input
            id="cf-phone"
            type="tel"
            value={fields.phone}
            onChange={set("phone")}
            placeholder="+1 (555) 000-0000"
            className={inputClass}
          />
        </div>
      )}

      {/* Subject (general only) */}
      {!commission && (
        <div>
          <label htmlFor="cf-subject" className="eyebrow mb-2 block">
            Subject <span className="text-gold">*</span>
          </label>
          <select
            id="cf-subject"
            required
            value={fields.subject}
            onChange={set("subject")}
            className={`${inputClass} pr-10`}
          >
            {SUBJECT_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      )}

      {/* Vision / Message */}
      {commission ? (
        <>
          <div>
            <label htmlFor="cf-vision" className="eyebrow mb-2 block">
              Describe Your Vision <span className="text-gold">*</span>
            </label>
            <textarea
              id="cf-vision"
              required
              rows={5}
              value={fields.vision}
              onChange={set("vision")}
              placeholder="Tell us about your dream tree - themes, motifs, mood, anything that inspires you..."
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="cf-palette" className="eyebrow mb-2 block">
                Preferred Color Palette
              </label>
              <input
                id="cf-palette"
                type="text"
                value={fields.palette}
                onChange={set("palette")}
                placeholder="e.g. Earth tones, Jewel tones…"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="cf-platforms" className="eyebrow mb-2 block">
                Approx. Number of Platforms
              </label>
              <input
                id="cf-platforms"
                type="text"
                value={fields.platforms}
                onChange={set("platforms")}
                placeholder="2-8"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label htmlFor="cf-hear" className="eyebrow mb-2 block">
              How Did You Hear About Us?
            </label>
            <select
              id="cf-hear"
              value={fields.hearAbout}
              onChange={set("hearAbout")}
              className={`${inputClass} pr-10`}
            >
              {HEAR_ABOUT_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </>
      ) : (
        <div>
          <label htmlFor="cf-message" className="eyebrow mb-2 block">
            Message <span className="text-gold">*</span>
          </label>
          <textarea
            id="cf-message"
            required
            rows={6}
            value={fields.message}
            onChange={set("message")}
            placeholder="How can we help?"
            className={inputClass}
          />
        </div>
      )}

      {/* Error */}
      {status === "error" && (
        <p className="font-cormorant text-sm text-red-400 border border-red-900/60 bg-red-950/30 px-4 py-3">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="flag-btn flex items-center gap-3 font-jost text-md font-bold tracking-widest uppercase px-8 py-4 cursor-pointer"
      >
        {status === "submitting" && <span className="spinner" aria-hidden="true" />}
        {status === "submitting"
          ? "Sending…"
          : commission
          ? "Submit Request"
          : "Send Message"}
      </button>
    </form>
  );
}
