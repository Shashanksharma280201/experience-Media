"use client";

import { useState } from "react";
import Section from "@/components/layout/Section";

type Status = "idle" | "sending" | "ok" | "error";

const FIELDS = [
  { name: "name", label: "Your name", type: "text", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "phone", label: "Phone", type: "tel", required: false },
  { name: "country", label: "Country", type: "text", required: false },
] as const;

const field =
  "w-full border-b border-hairline bg-transparent pb-3 pt-2 text-bone placeholder:text-bone-faint focus:border-bone focus:outline-none";

export default function Contact() {
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
    <Section id="contact" label="start something">
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-4">
          <h2 className="display-m max-w-[12ch]">Brief us in a paragraph.</h2>
          <p className="lede mt-8 max-w-[34ch] text-bone-dim">
            What you make, who it is for, and what is not working. We reply
            within a day.
          </p>
        </div>

        <form onSubmit={onSubmit} className="md:col-span-7 md:col-start-6">
          <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {FIELDS.map((f) => (
              <div key={f.name}>
                <label htmlFor={f.name} className="small block text-bone-faint">
                  {f.label}
                  {f.required && <span aria-hidden> *</span>}
                </label>
                <input
                  id={f.name}
                  name={f.name}
                  type={f.type}
                  required={f.required}
                  autoComplete={f.name === "email" ? "email" : "on"}
                  className={field}
                />
              </div>
            ))}

            <div className="sm:col-span-2">
              <label htmlFor="message" className="small block text-bone-faint">
                What are you trying to move? <span aria-hidden>*</span>
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={4}
                className={`${field} resize-none`}
              />
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-6">
            <button
              type="submit"
              disabled={status === "sending"}
              className="border border-bone px-8 py-4 text-bone transition-colors duration-[var(--dur-quick)] hover:bg-bone hover:text-void disabled:opacity-50"
            >
              {status === "sending" ? "Sending" : "Send it"}
            </button>

            <p aria-live="polite" className="small">
              {status === "ok" && (
                <span className="text-bone">Thanks — we&rsquo;ll be in touch.</span>
              )}
              {status === "error" && <span className="text-signal">{error}</span>}
            </p>
          </div>
        </form>
      </div>
    </Section>
  );
}
