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
}