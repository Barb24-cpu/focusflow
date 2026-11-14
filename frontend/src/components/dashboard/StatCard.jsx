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
       tone === "danger" && Number(value) > 0 ? "text-danger" : "text-fg"     
}