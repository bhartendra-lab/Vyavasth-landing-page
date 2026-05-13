"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle, Loader2 } from "lucide-react";

type FormState = "idle" | "loading" | "success" | "error";

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.name.trim()) errors.name = "Name is required.";
  if (!data.email.trim()) {
    errors.email = "Email is required.";
  } else if (!EMAIL_RE.test(data.email.trim())) {
    errors.email = "Enter a valid email address.";
  }
  if (data.phone.trim() && data.phone.trim().length > 20) {
    errors.phone = "Phone number is too long.";
  }
  if (!data.subject.trim()) errors.subject = "Subject is required.";
  if (!data.message.trim()) errors.message = "Message is required.";
  else if (data.message.trim().length > 5000) {
    errors.message = "Message must be at most 5000 characters.";
  }
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

function TextField({
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
        autoComplete={id === "email" ? "email" : id === "name" ? "name" : "off"}
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

function TextAreaField({
  label,
  id,
  placeholder,
  value,
  onChange,
  error,
}: {
  label: string;
  id: keyof FormData;
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
      <textarea
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        rows={5}
        className="resize-y min-h-[120px]"
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

export default function ContactPageForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
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
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim() || undefined,
          subject: formData.subject.trim(),
          message: formData.message.trim(),
        }),
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

  return (
    <div
      className="rounded-2xl p-6 sm:p-8"
      style={{
        background: "#FFFFFF",
        border: "1px solid rgba(26,18,8,0.08)",
        boxShadow: "0 4px 24px rgba(26,18,8,0.05)",
      }}
    >
      <h2
        className="text-lg font-semibold mb-1"
        style={{ fontFamily: "var(--font-syne)", color: "#1A1208" }}
      >
        Support ticket
      </h2>
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
            style={{ fontFamily: "var(--font-syne)", color: "#1A1208" }}
          >
            Message received
          </h3>
          <p
            className="text-sm max-w-md"
            style={{ color: "#7A6F63", fontFamily: "var(--font-dm-sans)" }}
          >
            Thank you. We aim to respond within 48 business hours.
          </p>
        </div>
      ) : (
        <>
          <p
            className="text-sm mb-6"
            style={{ color: "#7A6F63", fontFamily: "var(--font-dm-sans)" }}
          >
            Submit the form below and we will get back to you. You can also email
            us directly.
          </p>
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
          <TextField
            label="Your name"
            id="name"
            placeholder="Full name"
            value={formData.name}
            onChange={setField("name")}
            error={errors.name}
          />
          <TextField
            label="Email"
            id="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={setField("email")}
            error={errors.email}
          />
          <TextField
            label="Phone (optional)"
            id="phone"
            type="tel"
            placeholder="+91 or local number"
            value={formData.phone}
            onChange={setField("phone")}
            error={errors.phone}
          />
          <TextField
            label="Subject"
            id="subject"
            placeholder="What is your enquiry about?"
            value={formData.subject}
            onChange={setField("subject")}
            error={errors.subject}
          />
          <TextAreaField
            label="Message"
            id="message"
            placeholder="Describe your question or issue..."
            value={formData.message}
            onChange={setField("message")}
            error={errors.message}
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
                Sending...
              </>
            ) : (
              <>
                Submit
                <ArrowRight size={16} />
              </>
            )}
          </button>
          </form>
        </>
      )}
    </div>
  );
}
