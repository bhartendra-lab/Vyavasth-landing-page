import { NextRequest, NextResponse } from "next/server";
import { createEnquiry } from "@/lib/vyavasth-api";

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

    const result = await createEnquiry({
      name: name.trim(),
      business_name: studioName.trim(),
      phone: whatsapp.trim(),
      city: city.trim(),
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
