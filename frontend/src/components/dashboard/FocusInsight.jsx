import { Link } from "react-router-dom";
import { Timer } from "lucide-react";

/**
 * FocusInsight - the green "Make space for deep work" call-to-action card.
 * Every prop is optional; the defaults match the design.
 */
function FocusInsight({
  eyebrow = "One thing at a time",
  title = "Make space for deep work.",
  message = "Turn a task into 25 minutes of progress. Your next focus session starts here.",
  ctaLabel = "Open focus timer",
  to = "/focus",
}) {
  return (
    <section className="card bg-primary-soft p-6" aria-labelledby="focus-insight-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h2 id="focus-insight-heading" className="mt-2 text-xl font-semibold text-fg">
        {title}
      </h2>
      <p className="mt-2 text-sm text-muted">{message}</p>

      <Link
        to={to}
        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-contrast transition-colors hover:bg-primary-hover"
      >
        <Timer className="h-4 w-4" aria-hidden="true" />
        {ctaLabel}
      </Link>
    </section>
  );
}

export default FocusInsight;