"use client";

import { useState } from "react";
import Magnet from "@/components/bits/Magnet";
import { training } from "@/lib/content";

type Status = "idle" | "sending" | "ok" | "error";

/** §9 of the brief: Name, Email, WhatsApp, Business/Creator name, What do you create? */
const FIELDS = [
  { name: "name", label: "Name", type: "text", required: true, autoComplete: "name" },
  { name: "email", label: "Email", type: "email", required: true, autoComplete: "email" },
  { name: "whatsapp", label: "WhatsApp", type: "tel", required: false, autoComplete: "tel" },
  { name: "business", label: "Business / Creator name", type: "text", required: false, autoComplete: "organization" },
] as const;

const field = "field w-full border-b bg-transparent pb-3 pt-2 text-ink placeholder:text-ink focus:outline-none";

export default function PlaybookForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch("/api/playbook", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong");
      setStatus("ok");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (status === "ok") {
    return (
      <div aria-live="polite" className="border-t border-hairline pt-6">
        <p className="poster poster--m">It&rsquo;s on its way.</p>
        <p className="lede mt-4 max-w-[36ch] text-ink-dim">Check your inbox for the {training.product}. If it isn&rsquo;t there in a few minutes, look in promotions or spam.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="border-t border-hairline pt-6">
      <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
        {FIELDS.map((f) => (
          <div key={f.name}>
            <label htmlFor={`pb-${f.name}`} className="small block">
              {f.label}
              {f.required && <span aria-hidden> *</span>}
            </label>
            <input id={`pb-${f.name}`} name={f.name} type={f.type} required={f.required} autoComplete={f.autoComplete} className={field} />
          </div>
        ))}
        <div className="sm:col-span-2">
          <label htmlFor="pb-creates" className="small block">
            What do you create?
          </label>
          <input id="pb-creates" name="creates" type="text" className={field} placeholder="e.g. LinkedIn videos, a weekly podcast" />
        </div>
      </div>
      <div className="mt-10 flex flex-wrap items-center gap-6">
        <Magnet padding={50} magnetStrength={3}>
          <button type="submit" disabled={status === "sending"} className="button">
            {status === "sending" ? "Sending" : `${training.cta} →`}
          </button>
        </Magnet>
        <p aria-live="polite" className="small">
          {status === "error" && <span>{error}</span>}
        </p>
      </div>
    </form>
  );
}
