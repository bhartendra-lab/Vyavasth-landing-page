import { NextRequest, NextResponse } from "next/server";
import { createSupportTicket } from "@/lib/vyavasth-api";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_MESSAGE = 5000;
const MAX_SUBJECT = 200;
const MAX_NAME = 120;
const MAX_PHONE = 20;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, subject, message } = body;

    if (!name?.trim()) {
      return NextResponse.json(
        { success: false, error: "Name is required." },
        { status: 400 }
      );
    }
    if (name.trim().length > MAX_NAME) {
      return NextResponse.json(
        { success: false, error: "Name is too long." },
        { status: 400 }
      );
    }
    if (!email?.trim()) {
      return NextResponse.json(
        { success: false, error: "Email is required." },
        { status: 400 }
      );
    }
    if (!EMAIL_RE.test(String(email).trim())) {
      return NextResponse.json(
        { success: false, error: "Enter a valid email address." },
        { status: 400 }
      );
    }
    if (phone != null && String(phone).trim().length > MAX_PHONE) {
      return NextResponse.json(
        { success: false, error: "Phone number is too long." },
        { status: 400 }
      );
    }
    if (!subject?.trim()) {
      return NextResponse.json(
        { success: false, error: "Subject is required." },
        { status: 400 }
      );
    }
    if (subject.trim().length > MAX_SUBJECT) {
      return NextResponse.json(
        { success: false, error: "Subject is too long." },
        { status: 400 }
      );
    }
    if (!message?.trim()) {
      return NextResponse.json(
        { success: false, error: "Message is required." },
        { status: 400 }
      );
    }
    if (message.trim().length > MAX_MESSAGE) {
      return NextResponse.json(
        { success: false, error: `Message must be at most ${MAX_MESSAGE} characters.` },
        { status: 400 }
      );
    }

    const trimmedPhone = phone?.trim();
    const result = await createSupportTicket({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: trimmedPhone || undefined,
      subject: subject.trim(),
      message: message.trim(),
    });

    if (!result.ok) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: result.status >= 400 && result.status < 600 ? result.status : 502 }
      );
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("[/api/support] Error:", err);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
