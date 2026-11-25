import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import noteService from "../services/noteService";
import AppHeader from "../components/layout/AppHeader";

const LIME = "#C6F24E";
const BORDER = "#e4e4e7";
const MUTED = "#71717a";
const MAX_CONTENT = 2000;
const STARTERS = ["Meeting notes", "Idea", "To remember", "Study notes"];

const asList = (data) => (Array.isArray(data) ? data : data?.notes ?? []);
const errText = (err) => err?.response?.data?.error || err?.message || "Something went wrong. Please try again.";

function timeAgo(iso) {
  const t = new Date(iso).getTime();
  if (!iso || Number.isNaN(t)) return "";
  const mins = Math.floor((Date.now() - t) / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs === 1 ? "" : "s"} ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  return new Date(t).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const titleOf = (n) => n.title || (n.content || "").split("\n")[0].slice(0, 60) || "Untitled note";

const css = `
.nt-layout{display:grid;grid-template-columns:360px 1fr;gap:24px;align-items:start}
.nt-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}
.nt-card{background:white;border:1px solid ${BORDER};padding:16px;display:flex;flex-direction:column;gap:8px;transition:border-color .15s}
.nt-card:hover{border-color:#111}
.nt-input{width:100%;box-sizing:border-box;padding:10px 12px;border:1px solid #d4d4d8;font-size:14px;font-family:inherit;background:white;color:#111}
.nt-input:focus{outline:2px solid ${LIME};border-color:#111}
@media (max-width:900px){.nt-layout{grid-template-columns:1fr}}
@media (max-width:600px){.nt-grid{grid-template-columns:1fr}}
`;

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [flash, setFlash] = useState("");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [query, setQuery] = useState("");
  const [confirmId, setConfirmId] = useState(null);
  const flashTimer = useRef(null);

  const showFlash = (msg) => {
    setFlash(msg);
    clearTimeout(flashTimer.current);
    flashTimer.current = setTimeout(() => setFlash(""), 2500);
  };
  useEffect(() => () => clearTimeout(flashTimer.current), []);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setNotes(asList(await noteService.getNotes()));
    } catch (err) {
      setError(errText(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const resetForm = () => {
    setTitle("");
    setContent("");
    setEditingId(null);
    setFormError("");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title.trim() && !content.trim()) {
      setFormError("Add a title or write something first.");
      return;
    }
    setSaving(true);
    setFormError("");
    try {
      const payload = { title: title.trim(), content };
      if (editingId) {
        const updated = await noteService.updateNote(editingId, payload);
        setNotes((prev) => prev.map((n) => (n.id === editingId ? { ...n, ...updated } : n)));
        showFlash("Note updated");
      } else {
        const created = await noteService.createNote(payload);
        if (created?.id) setNotes((prev) => [created, ...prev]);
        else await load();
        showFlash("Note saved");
      }
      resetForm();
    } catch (err) {
      setFormError(errText(err));
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (n) => {
    setEditingId(n.id);
    setTitle(n.title || "");
    setContent(n.content || "");
    setFormError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    try {
      await noteService.deleteNote(id);
      setNotes((prev) => prev.filter((n) => n.id !== id));
      if (editingId === id) resetForm();
      showFlash("Note deleted");
    } catch (err) {
      setError(errText(err));
    } finally {
      setConfirmId(null);
    }
  };

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return notes;
    return notes.filter((n) => `${n.title || ""} ${n.content || ""}`.toLowerCase().includes(q));
  }, [notes, query]);

  const words = content.trim() ? content.trim().split(/\s+/).length : 0;
  const latest = notes[0];

  return (
    <div style={{ minHeight: "100vh", background: "#F4F4F0", color: "#111", fontFamily: "Arial, sans-serif" }}>
      <style>{css}</style>

      <AppHeader bottomSpace={48}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div>
            <p style={{ fontSize: 10, letterSpacing: 2, color: MUTED, textTransform: "uppercase", margin: 0 }}>Personal workspace</p>
            <h1 style={{ fontSize: 40, fontWeight: 700, letterSpacing: -1, margin: "8px 0 0" }}>Notes</h1>
            <p style={{ color: "#a1a1aa", fontSize: 14, marginTop: 8 }}>Capture ideas, decisions and things to remember, all in one place.</p>
          </div>
          <div style={{ display: "flex", gap: 28 }}>
            <div><p style={{ fontSize: 26, fontWeight: 700, margin: 0 }}>{loading ? "--" : notes.length}</p><p style={{ fontSize: 11, color: "#a1a1aa", margin: 0 }}>Notes</p></div>
            <div><p style={{ fontSize: 26, fontWeight: 700, margin: 0 }}>{latest ? timeAgo(latest.updated_at || latest.created_at) : "--"}</p><p style={{ fontSize: 11, color: "#a1a1aa", margin: 0 }}>Last edited</p></div>
          </div>
        </div>
      </AppHeader>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 24px 64px" }}>
        {error && (
          <div role="alert" style={{ background: "#fee2e2", border: "1px solid #ef4444", color: "#991b1b", padding: "10px 14px", fontSize: 13, marginBottom: 16, display: "flex", justifyContent: "space-between", gap: 12 }}>
            <span>{error}</span>
            <button onClick={load} style={{ background: "none", border: "none", color: "#991b1b", textDecoration: "underline", cursor: "pointer", fontSize: 13 }}>Try again</button>
          </div>
        )}
        {flash && (
          <div role="status" style={{ background: LIME, color: "#111", padding: "10px 14px", fontSize: 13, fontWeight: 600, marginBottom: 16 }}>{flash}</div>
        )}

        <div className="nt-layout">
          {/* WRITE */}
          <form onSubmit={handleSave} style={{ background: "white", border: `1px solid ${BORDER}`, padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: 12, height: 12, background: LIME, display: "inline-block" }} />
              <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>{editingId ? "Edit note" : "New note"}</h2>
            </div>

            {!editingId && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {STARTERS.map((s) => (
                  <button key={s} type="button" onClick={() => setTitle(s)} style={{ background: "#f4f4f5", border: `1px solid ${BORDER}`, padding: "4px 10px", fontSize: 11, cursor: "pointer", color: "#111" }}>{s}</button>
                ))}
              </div>
            )}

            <div>
              <label htmlFor="note-title" style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Title</label>
              <input id="note-title" className="nt-input" value={title} maxLength={150} onChange={(e) => setTitle(e.target.value)} placeholder="Give your note a title" />
            </div>
            <div>
              <label htmlFor="note-content" style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Note</label>
              <textarea id="note-content" className="nt-input" rows={8} value={content} maxLength={MAX_CONTENT} onChange={(e) => setContent(e.target.value)} placeholder="Type your note..." style={{ resize: "vertical" }} />
              <p style={{ fontSize: 11, color: MUTED, margin: "4px 0 0", display: "flex", justifyContent: "space-between" }}>
                <span>{words} word{words === 1 ? "" : "s"}</span>
                <span>{content.length}/{MAX_CONTENT}</span>
              </p>
            </div>

            {formError && <p role="alert" style={{ fontSize: 12, color: "#b91c1c", margin: 0 }}>{formError}</p>}

            <div style={{ display: "flex", gap: 8 }}>
              <button type="submit" disabled={saving} style={{ flex: 1, background: "#111", color: "white", border: "none", padding: 12, fontSize: 13, fontWeight: 600, cursor: saving ? "default" : "pointer", opacity: saving ? 0.6 : 1 }}>
                {saving ? "Saving..." : editingId ? "Update note" : "Save note"}
              </button>
              {(editingId || title || content) && (
                <button type="button" onClick={resetForm} style={{ background: "white", color: "#111", border: "1px solid #d4d4d8", padding: "12px 16px", fontSize: 13, cursor: "pointer" }}>
                  {editingId ? "Cancel" : "Clear"}
                </button>
              )}
            </div>
          </form>

          {/* READ */}
          <section>
            <div style={{ display: "flex", gap: 10, marginBottom: 14, alignItems: "center" }}>
              <input className="nt-input" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search your notes" aria-label="Search notes" />
              <span style={{ fontSize: 12, color: MUTED, whiteSpace: "nowrap" }}>{shown.length} shown</span>
            </div>

            {loading ? (
              <p style={{ fontSize: 14, color: MUTED }}>Loading your notes...</p>
            ) : notes.length === 0 ? (
              <div style={{ background: "white", border: `1px dashed #d4d4d8`, padding: 40, textAlign: "center" }}>
                <p style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>No notes yet</p>
                <p style={{ fontSize: 13, color: MUTED, margin: "6px 0 0" }}>Write your first note on the left. It will show up here.</p>
              </div>
            ) : shown.length === 0 ? (
              <p style={{ fontSize: 14, color: MUTED }}>No notes match "{query}".</p>
            ) : (
              <div className="nt-grid">
                {shown.map((n) => (
                  <article key={n.id} className="nt-card" style={editingId === n.id ? { borderColor: "#111", boxShadow: `inset 3px 0 0 ${LIME}` } : undefined}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, wordBreak: "break-word" }}>{titleOf(n)}</h3>
                    {n.content && (
                      <p style={{ fontSize: 13, color: "#3f3f46", margin: 0, lineHeight: 1.5, whiteSpace: "pre-wrap", display: "-webkit-box", WebkitLineClamp: 5, WebkitBoxOrient: "vertical", overflow: "hidden", wordBreak: "break-word" }}>{n.content}</p>
                    )}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: 8, borderTop: `1px solid ${BORDER}` }}>
                      <span style={{ fontSize: 11, color: "#a1a1aa" }}>{timeAgo(n.updated_at || n.created_at)}</span>
                      {confirmId === n.id ? (
                        <span style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 12 }}>
                          Delete?
                          <button onClick={() => handleDelete(n.id)} style={{ background: "#dc2626", color: "white", border: "none", padding: "4px 10px", fontSize: 11, cursor: "pointer" }}>Yes</button>
                          <button onClick={() => setConfirmId(null)} style={{ background: "white", border: "1px solid #d4d4d8", padding: "4px 10px", fontSize: 11, cursor: "pointer" }}>No</button>
                        </span>
                      ) : (
                        <span style={{ display: "flex", gap: 12 }}>
                          <button onClick={() => startEdit(n)} style={{ background: "none", border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer", color: "#111", padding: 0 }}>Edit</button>
                          <button onClick={() => setConfirmId(n.id)} style={{ background: "none", border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer", color: "#dc2626", padding: 0 }}>Delete</button>
                        </span>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
