/**
 * Statcard - one number with a label, "Tasks today 08".
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


    const valuecolor =
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