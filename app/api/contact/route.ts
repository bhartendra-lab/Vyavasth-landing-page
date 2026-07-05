import { NextRequest, NextResponse } from "next/server";
import { createEnquiry } from "@/lib/vyavasth-api";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Receives "Book a demo" enquiries from the landing page and forwards them to
// the Vyavasth onboarding backend. Name, studio, phone and city are required;
// email, website and message are optional extras the backend now records too.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { studioName, name, whatsapp, city, email, website, message } = body;

    if (!name?.trim()) {
      return NextResponse.json(
        { success: false, error: "Your name is required." },
        { status: 400 }
      );
    }
    if (!studioName?.trim()) {
      return NextResponse.json(
        { success: false, error: "Studio name is required." },
        { status: 400 }
      );
    }
    if (!whatsapp?.trim()) {
      return NextResponse.json(
        { success: false, error: "WhatsApp number is required." },
        { status: 400 }
      );
    }
    if (!/^\d{10}$/.test(whatsapp.trim())) {
      return NextResponse.json(
        { success: false, error: "WhatsApp number must be exactly 10 digits." },
        { status: 400 }
      );
    }
    if (!city?.trim()) {
      return NextResponse.json(
        { success: false, error: "City is required." },
        { status: 400 }
      );
    }
    if (email?.trim() && !EMAIL_RE.test(email.trim())) {
      return NextResponse.json(
        { success: false, error: "Enter a valid email address." },
        { status: 400 }
      );
    }

    const result = await createEnquiry({
      name: name.trim(),
      business_name: studioName.trim(),
      phone: whatsapp.trim(),
      city: city.trim(),
      email: email?.trim() ? email.trim().slice(0, 254) : undefined,
      website: website?.trim() ? website.trim().slice(0, 300) : undefined,
      message: message?.trim() ? message.trim().slice(0, 2000) : undefined,
      source: "landing_page",
    });

    if (!result.ok) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: result.status >= 400 && result.status < 600 ? result.status : 502 }
      );
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("[/api/contact] Error:", err);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
