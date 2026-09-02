export default function MetricLedger({
  metrics,
}: {
  metrics: { label: string; value: string }[];
}) {
  return (
    <dl className="grid gap-px border border-rule bg-rule sm:grid-cols-3">
      {metrics.map((m) => (
        <div key={m.label} className="bg-void p-8">
          <dt className="eyebrow text-paper/45">{m.label}</dt>
          <dd className="display mt-4 text-[clamp(1.8rem,4vw,3rem)] tabular-nums text-accent">
            {m.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
