/**
 * StatCard - one number with a label, e.g. "Tasks today  08".
 *
 * Props:
 *   label    string            "Tasks today"
 *   value    number | string   8  (numbers 0-9 show as "08")
 *   helper   string            small line under the number
 *   icon     lucide icon       e.g. icon={Check}  (pass the component, not <Check />)
 *   tone     "default" | "danger"   danger colours the number red when value > 0
 *   loading  boolean           shows "--" while data loads
 */
function StatCard({
  label,
  value,
  helper,
  icon: Icon,
  tone = "default",
  loading = false,
}) {
  const display =
    loading || value === undefined || value === null
      ? "--"
      : typeof value === "number"
      ? String(value).padStart(2, "0")
      : value;

  const valueColor =
    tone === "danger" && Number(value) > 0 ? "text-danger" : "text-fg";

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-muted">{label}</p>
        {Icon && <Icon className="h-5 w-5 shrink-0 text-muted" aria-hidden="true" />}
      </div>

      <p
        className={`mt-3 text-4xl font-semibold tracking-tight ${valueColor}`}
        aria-busy={loading}
      >
        {display}
      </p>

      {helper && <p className="mt-2 text-xs text-muted">{helper}</p>}
    </div>
  );
}

export default StatCard;