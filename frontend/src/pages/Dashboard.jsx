// frontend/src/pages/Dashboard.jsx
import { Link, useNavigate } from "react-router-dom";

const stats = [
  { label: "Tasks today", value: "08", sub: "2 completed today", active: true },
  { label: "Overdue tasks", value: "02", sub: "Let's get these back on track", active: false },
  { label: "Active projects", value: "04", sub: "2 deadlines this week", active: false },
  { label: "Completed in 7 days", value: "18", sub: "6 more than the previous 7 days", active: false },
];

const priorities = [
  { id: 1, title: "Build the project dashboard", meta: "FocusFlow / Design", priority: "High", due: "Today" },
  { id: 2, title: "Connect task CRUD endpoints", meta: "FocusFlow / API", priority: "High", due: "Today" },
  { id: 3, title: "Review database relationships", meta: "FocusFlow / Backend", priority: "Medium", due: "Nov 18" },
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", background: "#F4F4F0", color: "#111", fontFamily: "Arial, sans-serif", margin: 0 }}>
      
      {/* TOP NAV */}
      <header style={{ background: "#111", color: "white" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px", height: "56px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
            <Link to="/dashboard" style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "bold", fontSize: "14px", color: "white", textDecoration: "none" }}>
              <span style={{ width: "10px", height: "10px", background: "#C6F24E", display: "inline-block" }} />
              FocusFlow
            </Link>
            <nav style={{ display: "flex", gap: "24px", fontSize: "12px" }}>
              <Link to="/dashboard" style={{ color: "white", textDecoration: "none", borderBottom: "2px solid #C6F24E", paddingBottom: "4px" }}>Overview</Link>
              <Link to="/projects" style={{ color: "#a1a1aa", textDecoration: "none" }}>Projects</Link>
              <Link to="/tasks" style={{ color: "#a1a1aa", textDecoration: "none" }}>Task board</Link>
              <Link to="/notes" style={{ color: "#a1a1aa", textDecoration: "none" }}>Personal workspace</Link>
            </nav>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", fontSize: "12px" }}>
            <Link to="/login" style={{ color: "#a1a1aa", textDecoration: "none" }}>Log in</Link>
            <Link to="/register" style={{ background: "white", color: "black", padding: "6px 12px", fontWeight: "600", textDecoration: "none" }}>Create account</Link>
          </div>
        </div>

        {/* HERO */}
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 24px 64px", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontSize: "10px", letterSpacing: "2px", color: "#71717a", textTransform: "uppercase", margin: 0 }}>Tuesday, November 18, 2026</p>
            <h1 style={{ fontSize: "48px", fontWeight: "bold", letterSpacing: "-1px", margin: "8px 0 0" }}>Good morning, Brian.</h1>
            <p style={{ color: "#a1a1aa", fontSize: "14px", marginTop: "8px" }}>A clear plan for a more focused day.</p>
          </div>
          <button onClick={() => navigate("/tasks?new=true")} style={{ background: "white", color: "black", fontSize: "12px", fontWeight: "600", padding: "8px 12px", border: "none", cursor: "pointer" }}>
            + New task
          </button>
        </div>
      </header>

      {/* STATS */}
      <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px", marginTop: "-32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", background: "white", border: "1px solid #e4e4e7" }}>
          {stats.map((s) => (
            <div key={s.label} style={{ padding: "20px", background: s.active ? "#C6F24E" : "white", borderRight: "1px solid #e4e4e7" }}>
              <p style={{ fontSize: "11px", color: "#71717a", margin: 0 }}>{s.label}</p>
              <p style={{ fontSize: "30px", fontWeight: "bold", margin: "8px 0 0" }}>{s.value}</p>
              <p style={{ fontSize: "11px", color: "#71717a", margin: "4px 0 0" }}>{s.sub}</p>
            </div>
          ))}
        </div>

        {/* PRIORITIES + PROMO */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: "24px", marginTop: "40px", paddingBottom: "64px" }}>
          <section>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
              <div>
                <p style={{ fontSize: "10px", letterSpacing: "2px", color: "#71717a", textTransform: "uppercase", margin: 0 }}>One thing at a time</p>
                <h2 style={{ fontSize: "20px", fontWeight: "bold", margin: "4px 0 0" }}>Your priorities today</h2>
              </div>
              <Link to="/tasks" style={{ fontSize: "12px", fontWeight: "600", color: "#111", textDecoration: "none" }}>View all tasks →</Link>
            </div>

            <div style={{ marginTop: "16px", background: "white", border: "1px solid #e4e4e7" }}>
              {priorities.map((t) => (
                <div key={t.id} style={{ display: "grid", gridTemplateColumns: "1fr 90px 80px 20px", alignItems: "center", padding: "16px", borderBottom: "1px solid #e4e4e7" }}>
                  <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                    <input type="checkbox" style={{ marginTop: "4px", width: "16px", height: "16px" }} />
                    <div>
                      <p style={{ fontSize: "14px", fontWeight: "600", margin: 0 }}>{t.title}</p>
                      <p style={{ fontSize: "11px", color: "#a1a1aa", margin: "2px 0 0" }}>{t.meta}</p>
                    </div>
                  </div>
                  <span style={{ fontSize: "12px" }}>• {t.priority}</span>
                  <span style={{ fontSize: "12px", color: "#71717a" }}>{t.due}</span>
                  <button onClick={() => navigate(`/tasks/${t.id}`)} style={{ background: "none", border: "none", color: "#a1a1aa", cursor: "pointer", fontSize: "18px" }}>›</button>
                </div>
              ))}
            </div>
          </section>

          {/* PROMO CARD */}
          <aside style={{ background: "#111", color: "white", padding: "20px", minHeight: "220px", display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative", overflow: "hidden" }}>
            <div style={{ width: "32px", height: "32px", background: "#C6F24E", display: "flex", alignItems: "center", justifyContent: "center", color: "black", fontWeight: "bold" }}>◎</div>
            <div style={{ marginTop: "40px" }}>
              <p style={{ fontSize: "9px", letterSpacing: "2px", textTransform: "uppercase", color: "#a1a1aa", margin: 0 }}>Keep the important things moving</p>
              <p style={{ fontWeight: "bold", fontSize: "18px", lineHeight: "1.3", marginTop: "8px" }}>Turn a task into 25 minutes of progress.</p>
            </div>
            <button onClick={() => navigate("/focusTimer")} style={{ marginTop: "16px", textAlign: "left", fontSize: "12px", background: "none", border: "none", color: "white", textDecoration: "underline", cursor: "pointer", padding: 0 }}>
              Start a focus session →
            </button>
          </aside>
        </div>
      </main>
    </div>
  );
}