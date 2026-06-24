import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";

const schema = z.object({
  name: z.string().min(1, "Name is required").max(120),
  email: z.string().email("Valid email is required"),
  phone: z.string().max(40).optional().or(z.literal("")),
  whatsapp: z.string().max(40).optional().or(z.literal("")),
  country: z.string().max(80).optional().or(z.literal("")),
  message: z.string().min(1, "Message is required").max(4000),
});

const TO = process.env.CONTACT_TO_EMAIL || "parthmalhotra@experiencemedia.in";
const FROM = process.env.CONTACT_FROM_EMAIL || "Experience Media <onboarding@resend.dev>";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const { name, email, phone, whatsapp, country, message } = parsed.data;

  // No key configured (e.g. local/preview without secrets): accept but log.
  if (!process.env.RESEND_API_KEY) {
    console.info("[contact] (no RESEND_API_KEY) submission:", parsed.data);
    return NextResponse.json({ ok: true, delivered: false });
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: email,
      subject: `New enquiry from ${name}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        phone ? `Phone: ${phone}` : "",
        whatsapp ? `WhatsApp: ${whatsapp}` : "",
        country ? `Country: ${country}` : "",
        "",
        message,
      ]
        .filter(Boolean)
        .join("\n"),
    });
    return NextResponse.json({ ok: true, delivered: true });
  } catch (err) {
    console.error("[contact] send failed:", err);
    return NextResponse.json({ error: "Could not send your message. Please email us directly." }, { status: 502 });
  }
}
