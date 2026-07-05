"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle, Loader2, X } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/lib/site-legal";

interface FormData {
  name: string;
  studioName: string;
  whatsapp: string;
  city: string;
  email: string;
  website: string;
  message: string;
}

const EMPTY_FORM: FormData = {
  name: "",
  studioName: "",
  whatsapp: "",
  city: "",
  email: "",
  website: "",
  message: "",
};

type Status = "idle" | "submitting" | "success" | "error";

const inputStyle: React.CSSProperties = {
  background: "var(--color-surface)",
  border: "1px solid var(--color-line)",
  borderRadius: "10px",
  padding: "11px 14px",
  color: "var(--color-primary)",
  fontSize: "15px",
  width: "100%",
  outline: "none",
  transition: "border-color 0.2s, box-shadow 0.2s",
};

function Field({
  label,
  required = false,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5 min-w-0 flex-1">
      <span
        className="text-[13px] font-semibold"
        style={{ color: "var(--color-primary)" }}
      >
        {label}
        {required && (
          <span style={{ color: "var(--color-accent)" }}> *</span>
        )}
      </span>
      {children}
    </label>
  );
}

export default function EnquiryModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const firstFieldRef = useRef<HTMLInputElement>(null);

  // Lock scroll, wire Escape, and reset the form each time the modal opens.
  useEffect(() => {
    if (!open) return;
    setForm(EMPTY_FORM);
    setStatus("idle");
    setError("");

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    const t = setTimeout(() => firstFieldRef.current?.focus(), 60);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      clearTimeout(t);
    };
  }, [open, onClose]);

  if (!open) return null;

  const update =
    (field: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(form.whatsapp.trim())) {
      setStatus("error");
      setError("Enter a valid 10-digit mobile number.");
      return;
    }
    setStatus("submitting");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      style={{ background: "rgba(42, 34, 24, 0.45)" }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="enquiry-title"
        className="relative w-full max-w-xl rounded-2xl p-6 sm:p-8 my-auto"
        style={{
          background: "var(--color-bg)",
          border: "1px solid var(--color-line)",
          boxShadow: "var(--shadow-floating)",
        }}
      >
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-[var(--color-surface-2)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/50"
          style={{ color: "var(--color-muted)" }}
        >
          <X size={16} />
        </button>

        {status === "success" ? (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-full"
              style={{ background: "var(--color-success-soft)" }}
            >
              <CheckCircle size={28} style={{ color: "var(--color-success)" }} />
            </div>
            <h2
              id="enquiry-title"
              className="text-xl font-bold tracking-tight"
              style={{ color: "var(--color-primary)" }}
            >
              Thanks — we&rsquo;ll be in touch.
            </h2>
            <p
              className="max-w-sm text-sm leading-relaxed"
              style={{ color: "var(--color-muted)" }}
            >
              Your demo request is in. Someone from the Vyavasth team will reach
              out shortly to schedule a walkthrough on your own events.
            </p>
            <div className="mt-2 flex flex-wrap justify-center gap-3">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-[var(--color-surface-2)]"
                style={{
                  border: "1px solid var(--color-line-strong)",
                  color: "var(--color-primary)",
                }}
              >
                Message us on WhatsApp
              </a>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-accent-deep)]"
                style={{ background: "var(--color-accent)" }}
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <>
            <header className="mb-5 flex flex-col gap-2.5 pr-8">
              <span
                className="inline-flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.08em]"
                style={{ color: "var(--color-accent)" }}
              >
                <span
                  className="h-0.5 w-6 rounded-full"
                  style={{ background: "var(--color-accent)" }}
                  aria-hidden
                />
                Book a demo
              </span>
              <h2
                id="enquiry-title"
                className="text-2xl font-extrabold tracking-tight"
                style={{ color: "var(--color-primary)" }}
              >
                See Vyavasth on your own events.
              </h2>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--color-muted)" }}
              >
                Tell us a little about your studio and we&rsquo;ll set up a
                20-minute walkthrough — no setup needed.
              </p>
            </header>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-4 sm:flex-row">
                <Field label="Your name" required>
                  <input
                    ref={firstFieldRef}
                    type="text"
                    required
                    value={form.name}
                    onChange={update("name")}
                    placeholder="e.g. Ravi Sharma"
                    style={inputStyle}
                  />
                </Field>
                <Field label="Studio name" required>
                  <input
                    type="text"
                    required
                    value={form.studioName}
                    onChange={update("studioName")}
                    placeholder="e.g. Golden Hour Studio"
                    style={inputStyle}
                  />
                </Field>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Field label="Phone / WhatsApp" required>
                  <input
                    type="tel"
                    required
                    value={form.whatsapp}
                    onChange={update("whatsapp")}
                    placeholder="10-digit mobile number"
                    style={inputStyle}
                  />
                </Field>
                <Field label="City" required>
                  <input
                    type="text"
                    required
                    value={form.city}
                    onChange={update("city")}
                    placeholder="e.g. Jaipur"
                    style={inputStyle}
                  />
                </Field>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Field label="Email">
                  <input
                    type="email"
                    value={form.email}
                    onChange={update("email")}
                    placeholder="you@studio.com"
                    style={inputStyle}
                  />
                </Field>
                <Field label="Website or Instagram">
                  <input
                    type="text"
                    value={form.website}
                    onChange={update("website")}
                    placeholder="@yourstudio"
                    style={inputStyle}
                  />
                </Field>
              </div>

              <Field label="What would you like to see in the demo?">
                <textarea
                  rows={3}
                  value={form.message}
                  onChange={update("message")}
                  placeholder="The kinds of events you shoot, what you're hoping to fix…"
                  className="resize-y"
                  style={inputStyle}
                />
              </Field>

              {status === "error" && (
                <p
                  role="alert"
                  className="rounded-lg px-3 py-2 text-sm"
                  style={{
                    color: "#c0392b",
                    background: "#fdecea",
                    border: "1px solid rgba(192, 57, 43, 0.2)",
                  }}
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "submitting"}
                className="mt-1 flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-[15px] font-semibold text-white transition-all hover:bg-[var(--color-accent-deep)] disabled:cursor-not-allowed disabled:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/50"
                style={{
                  background: "var(--color-accent)",
                  boxShadow: "0 6px 18px rgba(194, 90, 58, 0.28)",
                }}
              >
                {status === "submitting" ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Sending…
                  </>
                ) : (
                  "Request my demo"
                )}
              </button>
              <p
                className="text-center text-xs"
                style={{ color: "var(--color-faint)" }}
              >
                No spam — we&rsquo;ll only use this to reach out about your demo.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
