"use client";

import { useState } from "react";
import Scene from "@/components/layout/Scene";
import Group from "@/components/motion/Group";
import Poster from "@/components/motion/Poster";
import Magnet from "@/components/bits/Magnet";
import { contact } from "@/lib/content";

type Status = "idle" | "sending" | "ok" | "error";

const FIELDS = [
  { name: "name", label: "Your name", type: "text", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "phone", label: "Phone", type: "tel", required: false },
  { name: "country", label: "Country", type: "text", required: false },
] as const;

const field = "field w-full border-b bg-transparent pb-3 pt-2 text-ink placeholder:text-ink focus:outline-none";

/** 10 — start something. The red band. */
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
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
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
    <Scene id="contact" tone="signal" className="redblock">
      <Group>
        <Poster lines={["Brief us in", "a paragraph."]} script="go on" scriptLine={0} />
      </Group>
      <Group className="mt-12 grid gap-12 md:mt-16 md:grid-cols-12">
        <div className="md:col-span-4" data-reveal="fade">
          <p className="lede max-w-[30ch]">What you sell, who it is for, and what is not working. We reply within a day.</p>
          <p className="mt-6">
            <a href={`mailto:${contact.email}`} className="link-underline small">or just email us</a>
          </p>
        </div>

        <form onSubmit={onSubmit} className="md:col-span-7 md:col-start-6" data-reveal="fade">
          <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {FIELDS.map((f) => (
              <div key={f.name}>
                <label htmlFor={f.name} className="small block">
                  {f.label}
                  {f.required && <span aria-hidden> *</span>}
                </label>
                <input id={f.name} name={f.name} type={f.type} required={f.required} autoComplete={f.name === "email" ? "email" : "on"} className={field} />
              </div>
            ))}
            <div className="sm:col-span-2">
              <label htmlFor="message" className="small block">
                What are you trying to move? <span aria-hidden>*</span>
              </label>
              <textarea id="message" name="message" required rows={4} className={`${field} resize-none`} />
            </div>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <Magnet padding={50} magnetStrength={3}>
              <button type="submit" disabled={status === "sending"} className="button">
                {status === "sending" ? "Sending" : "Send it"}
              </button>
            </Magnet>
            <p aria-live="polite" className="small">
              {status === "ok" && <span>Thanks — we&rsquo;ll be in touch.</span>}
              {status === "error" && <span>{error}</span>}
            </p>
          </div>
        </form>
      </Group>
    </Scene>
  );
}
