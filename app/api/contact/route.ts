import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Waitlist from "@/lib/models/Waitlist";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { studioName, name, whatsapp, city } = body;

    if (!studioName?.trim()) {
      return NextResponse.json(
        { success: false, error: "Studio name is required." },
        { status: 400 }
      );
    }
    if (!name?.trim()) {
      return NextResponse.json(
        { success: false, error: "Your name is required." },
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

    await connectDB();

    await Waitlist.create({
      studioName: studioName.trim(),
      name: name.trim(),
      whatsapp: whatsapp.trim(),
      city: city.trim(),
      source: "landing_page",
      submittedAt: new Date(),
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("[/api/contact] Error:", err);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
