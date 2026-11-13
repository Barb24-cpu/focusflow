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
                    {loading ? (
            <div className="h-full w-full animate-pulse rounded-lg bg-surface-2" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 8, left: 8, bottom: 0 }}>
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--muted)", fontSize: 12 }}
                />
                <Tooltip
                  cursor={{ fill: "var(--surface-2)" }}
                  contentStyle={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    color: "var(--text)",
                    boxShadow: "var(--shadow-card)",
                  }}
                  labelStyle={{ color: "var(--muted)" }}
                  itemStyle={{ color: "var(--text)" }}
                  formatter={(value) => [value, "Completed"]}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} minPointSize={4} maxBarSize={44}>
                  {data.map((entry, index) => (
                    <Cell
                      key={entry.date}
                      fill={index === data.length - 1 ? "var(--chart-active)" : "var(--chart-muted)"}
                    />
                  ))}
                  <LabelList
                    dataKey="count"
                    position="top"
                    fill="var(--muted)"
                    fontSize={11}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </section>
  );
}

export default ProductivityChart;
