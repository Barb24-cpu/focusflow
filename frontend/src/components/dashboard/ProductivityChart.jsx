import {
    Bar,
    BarChart,
    Cell,
    LabelList,
    ResponsiveContainer,
    Tooltip,
    XAxis,
}   from "recharts";
import { parseDateKey } from "../../hooks/useTasks";

/**
 * ProductivityChart - "A little progress, every day": tasks completed in the last 7 days.
 * Bar colours come from css variables,
 * so the chart switches with light / dark mode automatically.
 */

const shortdate = (key) =>
    parseDateKey(key).toLocalDateString("en-us", { month: "short", day: "numeric" })

function ProductivityChart({ data =[], total = 0, previousTotal = 0, loading = false }) {
    const range = 
      data.length > 0
      ? `${shortDate(data[0].date)}–${parseDateKey(data [data.length - 1].date).getDate()}`
      : "";

      const summary = data.map((d) => `${d.day}: ${d.count}`).join(", ");


      return (
        <section classname="card p-5" aria-labelledby="progress-heading">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h2 id="progress-heading" className="text-lg font-semibold text-fg">
                        A little progress, every day
                    </h2>
                    <p classname="text-sm text-muted">Tasks completed{range && ` . ${range}`}</p>
                </div>
                <span className="badge bg-primary-soft text-primary-soft-text">
                    {loading ? "--" : total} completed
                </span>

            </div>

            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end">
                <div classname="sm:w-40 sm:shrink-0">
                    <p className="text-5xl fony-semibold tracking-tight text-fg">
                        {loading ? "--" : total}
                    </p>
                    <p className="mt-1 text-xs text-muted">
                        vs. {loading ? "--" : previousTotal} in the previous 7 days
                    </p>

                </div>

                <div className="h-40 w-full min-w-0 flex-1" role="img"
                aria-label={`Tasks completed per day. ${summary}`}
                >

                </div>

            </div>
        </section>
      )
}