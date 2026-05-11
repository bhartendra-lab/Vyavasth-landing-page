"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { MessageCircle, ArrowRight, CheckCircle, Loader2 } from "lucide-react";

type FormState = "idle" | "loading" | "success" | "error";

interface FormData {
  studioName: string;
  name: string;
  whatsapp: string;
  city: string;
}

interface FormErrors {
  studioName?: string;
  name?: string;
  whatsapp?: string;
  city?: string;
}

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.studioName.trim()) errors.studioName = "Studio name is required.";
  if (!data.name.trim()) errors.name = "Your name is required.";
  if (!data.whatsapp.trim()) {
    errors.whatsapp = "WhatsApp number is required.";
  } else if (!/^\d{10}$/.test(data.whatsapp.trim())) {
    errors.whatsapp = "Enter a valid 10-digit mobile number.";
  }
  if (!data.city.trim()) errors.city = "City is required.";
  return errors;
}

const inputStyle: React.CSSProperties = {
  background: "#FFFFFF",
  border: "1px solid rgba(26,18,8,0.12)",
  borderRadius: "12px",
  padding: "12px 16px",
  color: "#1A1208",
  fontSize: "15px",
  width: "100%",
  outline: "none",
  fontFamily: "var(--font-dm-sans)",
  transition: "border-color 0.2s, box-shadow 0.2s",
};

function Field({
  label,
  id,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
}: {
  label: string;
  id: keyof FormData;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
  error?: string;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-sm font-medium"
        style={{ color: "#1A1208", fontFamily: "var(--font-dm-sans)" }}
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        autoComplete="off"
        style={{
          ...inputStyle,
          borderColor: error
            ? "#EF4444"
            : focused
            ? "#4F46E5"
            : "rgba(26,18,8,0.12)",
          boxShadow: error
            ? "0 0 0 3px rgba(239,68,68,0.08)"
            : focused
            ? "0 0 0 3px rgba(79,70,229,0.12)"
            : "none",
        }}
      />
      {error && (
        <p className="text-xs" style={{ color: "#DC2626" }}>
          {error}
        </p>
      )}
    </div>
  );
}

export default function ContactSection() {
  const reduced = useReducedMotion();

  const [formData, setFormData] = useState<FormData>({
    studioName: "",
    name: "",
    whatsapp: "",
    city: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [state, setState] = useState<FormState>("idle");
  const [serverError, setServerError] = useState("");

  const setField = (key: keyof FormData) => (val: string) => {
    setFormData((prev) => ({ ...prev, [key]: val }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setState("loading");
    setServerError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setState("success");
      } else {
        setServerError(data.error ?? "Something went wrong. Please try again.");
        setState("error");
      }
    } catch {
      setServerError("Something went wrong. Please try again.");
      setState("error");
    }
  };

  const fadeUp = (delay = 0) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          transition: { duration: 0.5, ease: "easeOut" as const, delay },
        };

  return (
    <section
      id="contact"
      className="py-24"
      style={{ background: "#F2EFE9" }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left — copy */}
          <div className="flex flex-col gap-6">
            <motion.p
              {...fadeUp(0)}
              className="uppercase tracking-[0.12em] text-xs font-medium"
              style={{ color: "#7A6F63", fontFamily: "var(--font-dm-sans)" }}
            >
              Contact Us
            </motion.p>

            <motion.h2
              {...fadeUp(0.05)}
              style={{
                fontFamily: "var(--font-syne)",
                fontWeight: 700,
                fontSize: "clamp(30px, 4vw, 40px)",
                color: "#1A1208",
                letterSpacing: "-0.02em",
                lineHeight: "1.15",
              }}
            >
              Be Part of the
              <br />
              Vyavasth Community.
            </motion.h2>

            <motion.p
              {...fadeUp(0.1)}
              style={{
                fontSize: "17px",
                lineHeight: "1.65",
                color: "#7A6F63",
                fontFamily: "var(--font-dm-sans)",
              }}
            >
              We&rsquo;re onboarding photography and videography studios right
              now. Early access members get hands-on setup support and direct
              access to the team.
            </motion.p>

            {/* WhatsApp CTA block */}
            <motion.a
              {...fadeUp(0.15)}
              href="https://wa.me/919479305333?text=Hi%2C%20I%20want%20to%20know%20more%20about%20Vyavasth%20for%20my%20photography%20studio"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 p-4 rounded-xl transition-all duration-200 no-underline"
              style={{
                background: "rgba(22,163,74,0.05)",
                border: "1px solid rgba(22,163,74,0.15)",
                borderLeft: "3px solid rgba(22,163,74,0.45)",
                textDecoration: "none",
              }}
            >
              <MessageCircle
                size={18}
                className="mt-0.5 shrink-0"
                style={{ color: "#16A34A" }}
              />
              <div className="flex flex-col gap-0.5">
                <span
                  className="text-xs"
                  style={{
                    color: "#7A6F63",
                    fontFamily: "var(--font-dm-sans)",
                  }}
                >
                  Prefer to talk directly?
                </span>
                <span
                  className="text-sm font-medium"
                  style={{ color: "#16A34A" }}
                >
                  Chat with us on WhatsApp →
                </span>
              </div>
            </motion.a>
          </div>

          {/* Right — form */}
          <motion.div
            {...fadeUp(0.1)}
            className="rounded-2xl p-8"
            style={{
              background: "#FFFFFF",
              border: "1px solid rgba(26,18,8,0.08)",
              boxShadow: "0 4px 24px rgba(26,18,8,0.05)",
            }}
          >
            {state === "success" ? (
              <div className="flex flex-col items-center justify-center gap-4 py-8 text-center">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(22,163,74,0.08)" }}
                >
                  <CheckCircle size={28} style={{ color: "#16A34A" }} />
                </div>
                <h3
                  className="text-lg font-semibold"
                  style={{
                    fontFamily: "var(--font-syne)",
                    color: "#1A1208",
                  }}
                >
                  You&rsquo;re on the list.
                </h3>
                <p
                  className="text-sm"
                  style={{
                    color: "#7A6F63",
                    fontFamily: "var(--font-dm-sans)",
                  }}
                >
                  We&rsquo;ll be in touch soon. Keep an eye on your WhatsApp.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
                <Field
                  label="Studio / Agency Name"
                  id="studioName"
                  placeholder="e.g. Sharma Photography, Gwalior"
                  value={formData.studioName}
                  onChange={setField("studioName")}
                  error={errors.studioName}
                />
                <Field
                  label="Your Name"
                  id="name"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={setField("name")}
                  error={errors.name}
                />
                <Field
                  label="WhatsApp Number"
                  id="whatsapp"
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={formData.whatsapp}
                  onChange={setField("whatsapp")}
                  error={errors.whatsapp}
                />
                <Field
                  label="City"
                  id="city"
                  placeholder="e.g. Gwalior, Bhopal, Indore"
                  value={formData.city}
                  onChange={setField("city")}
                  error={errors.city}
                />

                {state === "error" && serverError && (
                  <p
                    className="text-sm px-3 py-2 rounded-lg"
                    style={{
                      color: "#DC2626",
                      background: "rgba(239,68,68,0.06)",
                      border: "1px solid rgba(239,68,68,0.14)",
                    }}
                  >
                    {serverError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={state === "loading"}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-[#0A0A0A] transition-all duration-200 hover:brightness-110 disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F59E0B]/50"
                  style={{
                    backgroundColor: "#F59E0B",
                    fontSize: "15px",
                    fontFamily: "var(--font-dm-sans)",
                  }}
                >
                  {state === "loading" ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Contact Us
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
