"use client";

import { useState } from "react";
import { contact } from "@/lib/content";

type Status = "idle" | "sending" | "ok" | "error";

const fields = [
  { name: "name", placeholder: "Full name", type: "text", required: true, half: true },
  { name: "email", placeholder: "Email", type: "email", required: true, half: true },
  { name: "phone", placeholder: "Phone number", type: "tel", required: false, half: true },
  { name: "country", placeholder: "Country", type: "text", required: false, half: true },
];

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong");
      setStatus("ok");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <section id="contact" className="border-t border-line py-20 md:py-28">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="eyebrow text-accent">Start a project</p>
            <h2 className="display mt-5 text-[clamp(2.5rem,7vw,6rem)]">
              Wanna get
              <br />
              in touch?
            </h2>
            <p className="mt-8 max-w-sm text-ink-soft">
              Tell us about your channel, brand or idea. We usually reply within a day.
            </p>
            <div className="mt-8 flex flex-col gap-2 text-sm">
              <a href={`mailto:${contact.email}`} className="w-fit border-b border-line pb-1 hover:border-accent hover:text-accent">
                {contact.email}
              </a>
              <a
                href={contact.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="w-fit border-b border-line pb-1 hover:border-accent hover:text-accent"
              >
                WhatsApp · {contact.phone}
              </a>
            </div>
          </div>

          <form onSubmit={onSubmit} className="md:col-span-6 md:col-start-7">
            <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-2">
              {fields.map((f) => (
                <div key={f.name} className={f.half ? "sm:col-span-1" : "sm:col-span-2"}>
                  <input
                    name={f.name}
                    type={f.type}
                    required={f.required}
                    placeholder={f.placeholder + (f.required ? " *" : "")}
                    className="w-full border-b border-line bg-transparent py-4 text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none"
                  />
                </div>
              ))}
              <div className="sm:col-span-2">
                <input
                  name="whatsapp"
                  type="tel"
                  placeholder="WhatsApp number"
                  className="w-full border-b border-line bg-transparent py-4 text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <textarea
                  name="message"
                  required
                  rows={4}
                  placeholder="Your message *"
                  className="w-full resize-none border-b border-line bg-transparent py-4 text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-5">
              <button
                type="submit"
                disabled={status === "sending"}
                className="eyebrow rounded-full bg-ink px-8 py-4 text-paper transition-colors hover:bg-accent disabled:opacity-50"
              >
                {status === "sending" ? "Sending…" : "Send message"}
              </button>
              {status === "ok" && (
                <span className="text-sm text-accent">Thanks — we&apos;ll be in touch soon.</span>
              )}
              {status === "error" && (
                <span className="text-sm text-red-700">{error}</span>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
