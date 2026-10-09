"use client";

import { useState } from "react";
import Scene from "@/components/layout/Scene";
import Group from "@/components/motion/Group";
import Poster from "@/components/motion/Poster";
import Magnet from "@/components/bits/Magnet";
import { contact } from "@/lib/content";

type Status = "idle" | "sending" | "ok" | "error";

/** §4.15 of the brief: enough to understand the project, no more. */
const FIELDS = [
  {
    name: "name",
    label: "Name",
    type: "text",
    required: true,
    autoComplete: "name",
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    required: true,
    autoComplete: "email",
  },
  {
    name: "phone",
    label: "Phone / WhatsApp",
    type: "tel",
    required: false,
    autoComplete: "tel",
  },
  {
    name: "company",
    label: "Company / Creator name",
    type: "text",
    required: false,
    autoComplete: "organization",
  },
] as const;

const LOOKING = [
  "Social media content",
  "A podcast",
  "Event coverage",
  "A brand film or campaign",
  "VFX, CGI or motion graphics",
  "Not sure yet",
];

const field =
  "field w-full border-b bg-transparent pb-3 pt-2 text-ink placeholder:text-ink focus:outline-none";

/** The direct lines: each one opens the thing itself. */
const DIRECT = [
  {
    label: "WhatsApp",
    href: contact.whatsapp,
    hint: "opens a chat with a message ready",
    external: true,
  },
  {
    label: "Call",
    href: `tel:+${contact.phoneRaw}`,
    hint: contact.phone,
    external: false,
  },
  {
    label: "Email",
    href: `mailto:${contact.email}`,
    hint: contact.email,
    external: false,
  },
];

/** 15 — the conversation. The red band. */
export default function Contact({ page = false }: { page?: boolean }) {
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

  const intro =
    "Tell us what you're trying to achieve. We'll figure out what it takes to get there.";

  return (
    <>
      {/* As a page, the headline sits on paper first, so the nav never reads over red. */}
      {page && (
        <Scene className="pt-32 md:pt-40" tight>
          <Group onLoad stagger={0.07}>
            <Poster
              as="h1"
              lines={["Have something", "worth building?"]}
              script="go on"
              scriptLine={0}
              start="intro"
            />
            <p
              className="lede mt-10 max-w-[46ch] text-ink-dim"
              data-reveal="fade"
            >
              {intro}
            </p>
          </Group>
        </Scene>
      )}
      <Scene id="contact" tone="signal" className="redblock" tight={page}>
        {!page && (
          <Group>
            <Poster
              lines={["Have something", "worth building?"]}
              script="go on"
              scriptLine={0}
            />
          </Group>
        )}
        <Group
          className={`grid gap-12 md:grid-cols-12 ${page ? "" : "mt-12 md:mt-16"}`}
        >
          <div className="md:col-span-4" data-reveal="fade">
            <p className="lede max-w-[30ch]">
              {page
                ? "Or skip the form: every line below opens the thing itself."
                : intro}
            </p>
            <ul className="mt-10 flex flex-col gap-4">
              {DIRECT.map((d) => (
                <li key={d.label}>
                  <a
                    href={d.href}
                    target={d.external ? "_blank" : undefined}
                    rel={d.external ? "noopener noreferrer" : undefined}
                    className="group flex items-baseline gap-3"
                  >
                    <span className="link-underline font-display text-[1.25rem] [font-variation-settings:'wdth'_104,'wght'_600]">
                      {d.label} →
                    </span>
                    <span className="small text-ink-dim [overflow-wrap:anywhere]">
                      {d.hint}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <form
            onSubmit={onSubmit}
            className="md:col-span-7 md:col-start-6"
            data-reveal="fade"
          >
            <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
              {FIELDS.map((f) => (
                <div key={f.name}>
                  <label htmlFor={f.name} className="small block">
                    {f.label}
                    {f.required && <span aria-hidden> *</span>}
                  </label>
                  <input
                    id={f.name}
                    name={f.name}
                    type={f.type}
                    required={f.required}
                    autoComplete={f.autoComplete}
                    className={field}
                  />
                </div>
              ))}
              <div className="sm:col-span-2">
                <label htmlFor="looking" className="small block">
                  What are you looking to build? <span aria-hidden>*</span>
                </label>
                <select
                  id="looking"
                  name="looking"
                  required
                  defaultValue=""
                  className={`${field} appearance-none`}
                >
                  <option value="" disabled>
                    Choose one
                  </option>
                  {LOOKING.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="message" className="small block">
                  Tell us a little about it. <span aria-hidden>*</span>
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
              <Magnet padding={50} magnetStrength={3}>
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="button"
                >
                  {status === "sending"
                    ? "Sending"
                    : "Start the Conversation →"}
                </button>
              </Magnet>
              <p aria-live="polite" className="small">
                {status === "ok" && (
                  <span>
                    Thanks — we&rsquo;ve got it. Expect a reply within a day.
                  </span>
                )}
                {status === "error" && <span>{error}</span>}
              </p>
            </div>
          </form>
        </Group>
      </Scene>
    </>
  );
}
