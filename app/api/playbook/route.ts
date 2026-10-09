import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";

const schema = z.object({
  name: z.string().min(1, "Name is required").max(120),
  email: z.string().email("Valid email is required"),
  whatsapp: z.string().max(40).optional().or(z.literal("")),
  business: z.string().max(120).optional().or(z.literal("")),
  creates: z.string().max(200).optional().or(z.literal("")),
});

const TO = process.env.CONTACT_TO_EMAIL || "parthmalhotra@experiencemedia.in";
const FROM = process.env.CONTACT_FROM_EMAIL || "Experience Media <onboarding@resend.dev>";
/** Where the playbook lives once it exists; until then the lead is logged and the reader is told it is coming. */
const PLAYBOOK_URL = process.env.PLAYBOOK_URL;

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }
  const { name, email, whatsapp, business, creates } = parsed.data;

  if (!process.env.RESEND_API_KEY) {
    console.info("[playbook] (no RESEND_API_KEY) lead:", parsed.data);
    return NextResponse.json({ ok: true, delivered: false });
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const lead = resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: email,
      subject: `Playbook request from ${name}`,
      text: [`Name: ${name}`, `Email: ${email}`, whatsapp ? `WhatsApp: ${whatsapp}` : "", business ? `Business / Creator: ${business}` : "", creates ? `Creates: ${creates}` : ""].filter(Boolean).join("\n"),
    });
    const reader = resend.emails.send({
      from: FROM,
      to: email,
      subject: "Your 30-Day Content Growth Playbook",
      text: [
        `Hi ${name.split(" ")[0]},`,
        "",
        PLAYBOOK_URL ? `Here is the 30-Day Content Growth Playbook: ${PLAYBOOK_URL}` : "Thanks for asking for the 30-Day Content Growth Playbook. It is on its way to you from this address shortly.",
        "",
        "If anything in it raises a question, reply to this email. It comes straight to me.",
        "",
        "Parth Malhotra",
        "Founder, Experience Media",
      ].join("\n"),
    });
    await Promise.all([lead, reader]);
    return NextResponse.json({ ok: true, delivered: true });
  } catch (err) {
    console.error("[playbook] send failed:", err);
    return NextResponse.json({ error: "Could not send the playbook. Please email us directly." }, { status: 502 });
  }
}
