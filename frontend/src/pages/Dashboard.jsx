import { useMemo } from "react";

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import useTasks from "../hooks/useTasks";
import AppHeader from "../components/layout/AppHeader";

const LIME = "#C6F24E";
const BORDER = "#e4e4e7";
const MUTED = "#71717a";

const dayKey = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const addDays = (d, n) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};
const pad = (n) => String(n).padStart(2, "0");
const PRIORITY_RANK = { high: 0, medium: 1, low: 2 };
const PRIORITY_STYLE = {
  high: { bg: "#fee2e2", fg: "#b91c1c" },
  medium: { bg: "#fef3c7", fg: "#92400e" },
  low: { bg: "#dcfce7", fg: "#166534" },
};
const BAR_COLORS = [LIME, "#a78bfa", "#22c55e", "#38bdf8"];

function dueLabel(task, today) {
  if (!task.dueDate) return "No date";
  if (task.dueDate === today) return "Today";
  if (task.dueDate < today) return "Overdue";
  return new Date(task.dueDate + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function Ring({ value, total, color = "#111", size = 46 }) {
  const r = 18,
    c = 2 * Math.PI * r;
  const pct = total > 0 ? Math.min(1, value / total) : 0;
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" aria-hidden="true">
      <circle
        cx="22"
        cy="22"
        r={r}
        fill="none"
        stroke="#e4e4e7"
        strokeWidth="5"
      />
      <circle
        cx="22"
        cy="22"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - pct)}
        transform="rotate(-90 22 22)"
      />
    </svg>
  );
}

function Bars({ values }) {
  const max = Math.max(1, ...values);
  return (
    <div
      style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 34 }}
      aria-hidden="true"
    >
      {values.map((v, i) => (
        <div
          key={i}
          style={{
            width: 6,
            height: `${Math.max(12, (v / max) * 100)}%`,
            background:
              i === values.length - 1 ? "#111" : v ? "#a1a1aa" : "#e4e4e7",
          }}
        />
      ))}
    </div>
  );
}

function StatCard({ to, label, value, sub, visual, danger }) {
  return (
    <Link
      to={to}
      className="ff-stat"
      style={{
        padding: 20,
        textDecoration: "none",
        color: "#111",
        background: "white",
        display: "block",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 8,
        }}
      >
        <p style={{ fontSize: 12, color: MUTED, margin: 0 }}>{label}</p>
        {visual}
      </div>
      <p
        style={{
          fontSize: 34,
          fontWeight: 700,
          margin: "6px 0 0",
          color: danger ? "#dc2626" : "#111",
        }}
      >
        {value}
      </p>
      <p style={{ fontSize: 11, color: MUTED, margin: "4px 0 0" }}>{sub}</p>
    </Link>
  );
}

const css = `
.ff-stats{display:grid;grid-template-columns:repeat(4,1fr);background:white;border:1px solid ${BORDER}}
.ff-stat{border-right:1px solid ${BORDER};transition:background .15s}
.ff-stat:last-child{border-right:0}
.ff-stat:hover{background:#fafaf5 !important}
.ff-row{display:grid;grid-template-columns:1.6fr 1fr 1fr;gap:20px;margin-top:28px;padding-bottom:64px}
.ff-task:hover{background:#fafaf5}
@media (max-width:900px){.ff-stats{grid-template-columns:1fr 1fr}.ff-stat:nth-child(2){border-right:0}.ff-row{grid-template-columns:1fr}}
@media (max-width:520px){.ff-stats{grid-template-columns:1fr}.ff-stat{border-right:0;border-bottom:1px solid ${BORDER}}}
`;

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const { tasks, loading, error, loadTasks, toggleComplete } = useTasks();

  const data = useMemo(() => {
    const now = new Date();
    const today = dayKey(now);
    const open = tasks.filter((t) => t.status !== "done");
    const dueToday = tasks.filter((t) => t.dueDate === today);
    const overdue = open.filter((t) => t.dueDate && t.dueDate < today);

    const week = Array.from({ length: 7 }, (_, i) =>
      dayKey(addDays(now, i - 6)),
    );
    const perDay = week.map(
      (k) =>
        tasks.filter((t) => t.status === "done" && t.completedDate === k)
          .length,
    );
    const prev = Array.from({ length: 7 }, (_, i) =>
      dayKey(addDays(now, i - 13)),
    );
    const completed7 = perDay.reduce((a, b) => a + b, 0);
    const completedPrev = tasks.filter(
      (t) => t.status === "done" && prev.includes(t.completedDate),
    ).length;

    const byProject = {};
    tasks.forEach((t) => {
      if (!t.projectName) return;
      const p = (byProject[t.projectName] ||= {
        name: t.projectName,
        total: 0,
        done: 0,
      });
      p.total += 1;
      if (t.status === "done") p.done += 1;
    });
    const projects = Object.values(byProject).sort(
      (a, b) => b.total - b.done - (a.total - a.done),
    );
    const activeProjects = projects.filter((p) => p.done < p.total).length;

    const priorities = [...open]
      .sort((a, b) => {
        const overdueA = a.dueDate && a.dueDate < today ? 0 : 1;
        const overdueB = b.dueDate && b.dueDate < today ? 0 : 1;
        const todayA = a.dueDate === today ? 0 : 1;
        const todayB = b.dueDate === today ? 0 : 1;
        return (
          overdueA - overdueB ||
          todayA - todayB ||
          (PRIORITY_RANK[a.priority] ?? 1) - (PRIORITY_RANK[b.priority] ?? 1) ||
          (a.dueDate || "9999").localeCompare(b.dueDate || "9999")
        );
      })
      .slice(0, 5);

    return {
      today,
      dueToday,
      overdue,
      perDay,
      completed7,
      completedPrev,
      projects,
      activeProjects,
      priorities,
      doneToday: dueToday.filter((t) => t.status === "done").length,
    };
  }, [tasks]);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const firstName = (
    user?.name ||
    user?.username ||
    user?.email?.split("@")[0] ||
    "there"
  ).split(" ")[0];
  const todayLabel = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const diff = data.completed7 - data.completedPrev;
  const focusTask = data.priorities[0];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F4F4F0",
        color: "#111",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <style>{css}</style>

      <AppHeader bottomSpace={64}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div>
            <p
              style={{
                fontSize: 10,
                letterSpacing: 2,
                color: MUTED,
                textTransform: "uppercase",
                margin: 0,
              }}
            >
              {todayLabel}
            </p>
            <h1
              style={{
                fontSize: 44,
                fontWeight: 700,
                letterSpacing: -1,
                margin: "8px 0 0",
              }}
            >
              {greeting}, {firstName}.
            </h1>
            <p style={{ color: "#a1a1aa", fontSize: 14, marginTop: 8 }}>
              A clear plan for a more focused day.
            </p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => navigate("/projects")}
              style={{
                background: "transparent",
                color: "white",
                fontSize: 12,
                fontWeight: 600,
                padding: "9px 14px",
                border: "1px solid #3f3f46",
                cursor: "pointer",
              }}
            >
              Projects Board
            </button>
            <button
              onClick={() => navigate("/tasks?new=true")}
              style={{
                background: LIME,
                color: "#111",
                fontSize: 12,
                fontWeight: 700,
                padding: "9px 14px",
                border: "none",
                cursor: "pointer",
              }}
            >
              + New task
            </button>
          </div>
        </div>
      </AppHeader>

      <main
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 24px",
          marginTop: -32,
        }}
      >
        {error && (
          <div
            role="alert"
            style={{
              background: "#fee2e2",
              border: "1px solid #ef4444",
              color: "#991b1b",
              padding: "10px 14px",
              fontSize: 13,
              marginBottom: 16,
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <span>{error}</span>
            <button
              onClick={loadTasks}
              style={{
                background: "none",
                border: "none",
                color: "#991b1b",
                textDecoration: "underline",
                cursor: "pointer",
                fontSize: 13,
              }}
            >
              Try again
            </button>
          </div>
        )}

        {/* STATS: each card opens the matching list */}
        <div className="ff-stats">
          <StatCard
            to="/tasks?filter=today"
            label="Tasks today"
            value={loading ? "--" : pad(data.dueToday.length)}
            sub={`${data.doneToday} completed`}
            visual={
              <Ring value={data.doneToday} total={data.dueToday.length} />
            }
          />
          <StatCard
            to="/tasks?filter=overdue"
            label="Overdue tasks"
            value={loading ? "--" : pad(data.overdue.length)}
            danger={data.overdue.length > 0}
            sub={
              data.overdue.length === 0 ? "All clear" : "Let's get these done"
            }
            visual={
              <span
                style={{
                  fontSize: 22,
                  color: data.overdue.length ? "#dc2626" : "#a1a1aa",
                }}
              >
                {data.overdue.length ? "▲" : "✓"}
              </span>
            }
          />
          <StatCard
            to="/projects"
            label="Active projects"
            value={loading ? "--" : pad(data.activeProjects)}
            sub={
              data.projects.length
                ? `Across ${data.projects.length} project${data.projects.length === 1 ? "" : "s"}`
                : "No projects yet"
            }
            visual={
              <Ring
                value={data.projects.filter((p) => p.done === p.total).length}
                total={data.projects.length}
                color="#22c55e"
              />
            }
          />
          <StatCard
            to="/tasks?filter=completed"
            label="Completed in 7 days"
            value={loading ? "--" : pad(data.completed7)}
            sub={
              diff === 0
                ? "Same as the previous 7 days"
                : `${Math.abs(diff)} ${diff > 0 ? "more" : "fewer"} than the previous 7 days`
            }
            visual={<Bars values={data.perDay} />}
          />
        </div>

        <div className="ff-row">
          {/* PRIORITIES */}
          <section>
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: 10,
                    letterSpacing: 2,
                    color: MUTED,
                    textTransform: "uppercase",
                    margin: 0,
                  }}
                >
                  One thing at a time
                </p>
                <h2
                  style={{ fontSize: 20, fontWeight: 700, margin: "4px 0 0" }}
                >
                  Your priorities today
                </h2>
              </div>
              <Link
                to="/tasks"
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#111",
                  textDecoration: "none",
                }}
              >
                View all tasks →
              </Link>
            </div>
            <div
              style={{
                marginTop: 14,
                background: "white",
                border: `1px solid ${BORDER}`,
              }}
            >
              {loading ? (
                <p
                  style={{ padding: 16, fontSize: 13, color: MUTED, margin: 0 }}
                >
                  Loading your tasks...
                </p>
              ) : data.priorities.length === 0 ? (
                <div style={{ padding: 24, textAlign: "center" }}>
                  <p style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>
                    Nothing on your list
                  </p>
                  <p
                    style={{ fontSize: 12, color: MUTED, margin: "4px 0 12px" }}
                  >
                    Add a task to plan your day.
                  </p>
                  <button
                    onClick={() => navigate("/tasks?new=true")}
                    style={{
                      background: "#111",
                      color: "white",
                      border: "none",
                      padding: "8px 14px",
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    + New task
                  </button>
                </div>
              ) : (
                data.priorities.map((t) => {
                  const p = PRIORITY_STYLE[t.priority] || PRIORITY_STYLE.medium;
                  const late = t.dueDate && t.dueDate < data.today;
                  return (
                    <div
                      key={t.id}
                      className="ff-task"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "14px 16px",
                        borderBottom: `1px solid ${BORDER}`,
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={t.status === "done"}
                        onChange={() => toggleComplete(t)}
                        aria-label={`Mark "${t.title}" as done`}
                        style={{ width: 16, height: 16, cursor: "pointer" }}
                      />
                      <div
                        style={{ flex: 1, minWidth: 0, cursor: "pointer" }}
                        onClick={() => navigate(`/tasks/${t.id}`)}
                      >
                        <p
                          style={{
                            fontSize: 14,
                            fontWeight: 600,
                            margin: 0,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {t.title}
                        </p>
                        {t.projectName && (
                          <p
                            style={{
                              fontSize: 11,
                              color: "#a1a1aa",
                              margin: "2px 0 0",
                            }}
                          >
                            {t.projectName}
                          </p>
                        )}
                      </div>
                      <span
                        style={{
                          background: p.bg,
                          color: p.fg,
                          fontSize: 11,
                          fontWeight: 600,
                          padding: "2px 8px",
                          textTransform: "capitalize",
                        }}
                      >
                        {t.priority}
                      </span>
                      <span
                        style={{
                          fontSize: 12,
                          color: late ? "#dc2626" : MUTED,
                          minWidth: 52,
                          textAlign: "right",
                          fontWeight: late ? 600 : 400,
                        }}
                      >
                        {dueLabel(t, data.today)}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </section>

          {/* FOCUS SESSION */}
          <aside
            style={{
              background: "#111",
              color: "white",
              padding: 20,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              minHeight: 280,
            }}
          >
            <p
              style={{
                fontSize: 9,
                letterSpacing: 2,
                textTransform: "uppercase",
                color: "#a1a1aa",
                margin: 0,
                alignSelf: "flex-start",
              }}
            >
              Focus session
            </p>
            <div
              style={{
                position: "relative",
                width: 132,
                height: 132,
                margin: "14px 0",
              }}
            >
              <svg
                viewBox="0 0 100 100"
                width="132"
                height="132"
                style={{ transform: "rotate(-90deg)" }}
                aria-hidden="true"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  fill="none"
                  stroke="#27272a"
                  strokeWidth="6"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  fill="none"
                  stroke={LIME}
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray="276.5"
                  strokeDashoffset="69"
                />
              </svg>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ fontSize: 28, fontWeight: 700 }}>25:00</span>
                <span style={{ fontSize: 10, color: "#a1a1aa" }}>
                  Ready to focus
                </span>
              </div>
            </div>
            <p
              style={{
                fontSize: 12,
                color: "#a1a1aa",
                margin: "0 0 12px",
                textAlign: "center",
              }}
            >
              {focusTask ? (
                <>
                  Next up:{" "}
                  <span style={{ color: "white" }}>{focusTask.title}</span>
                </>
              ) : (
                "Turn a task into 25 minutes of progress."
              )}
            </p>
            <button
              onClick={() => navigate("/focusTimer")}
              style={{
                width: "100%",
                background: LIME,
                color: "#111",
                border: "none",
                padding: "11px",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Start session
            </button>
          </aside>

          {/* ACTIVE PROJECTS */}
          <section
            style={{
              background: "white",
              border: `1px solid ${BORDER}`,
              padding: 20,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>
                Active projects
              </h2>
              <Link
                to="/projects"
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#111",
                  textDecoration: "none",
                }}
              >
                All →
              </Link>
            </div>
            {loading ? (
              <p style={{ fontSize: 13, color: MUTED }}>Loading...</p>
            ) : data.projects.length === 0 ? (
              <p style={{ fontSize: 13, color: MUTED, marginTop: 16 }}>
                Give a task a project and its progress shows up here.
              </p>
            ) : (
              <div
                style={{
                  marginTop: 16,
                  display: "flex",
                  flexDirection: "column",
                  gap: 18,
                }}
              >
                {data.projects.slice(0, 4).map((p, i) => {
                  const pct = p.total
                    ? Math.round((p.done / p.total) * 100)
                    : 0;
                  return (
                    <Link
                      key={p.name}
                      to="/projects"
                      style={{ textDecoration: "none", color: "#111" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: 13,
                          marginBottom: 6,
                        }}
                      >
                        <span style={{ fontWeight: 600 }}>{p.name}</span>
                        <span style={{ color: MUTED }}>{pct}%</span>
                      </div>
                      <div style={{ height: 8, background: "#f4f4f5" }}>
                        <div
                          style={{
                            height: 8,
                            width: `${pct}%`,
                            background: BAR_COLORS[i % BAR_COLORS.length],
                          }}
                        />
                      </div>
                      <p
                        style={{
                          fontSize: 11,
                          color: "#a1a1aa",
                          margin: "4px 0 0",
                        }}
                      >
                        {p.done} of {p.total} tasks done
                      </p>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
