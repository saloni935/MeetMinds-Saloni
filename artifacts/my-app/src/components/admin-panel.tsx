import { useState } from "react";
import { useEvents } from "@/hooks/use-events";
import {
  useCreateEvent,
  useUpdateEvent,
  useDeleteEvent,
  toEventInput,
  type EventInput,
} from "@/hooks/use-event-mutations";
import type { Event } from "@/hooks/use-events";

const EMPTY_FORM: EventInput = {
  company: "",
  logo: "",
  color: "#6366f1",
  type: "Workshop",
  mode: "offline",
  title: "",
  date: "",
  time: "",
  venue: "",
  distance: 0,
  city: "",
  paid: false,
  price: 0,
  freebies: [],
  eligibility: [],
  link: "",
  tags: [],
  totalSeats: 100,
  taken: 0,
};

function arrToStr(arr: string[]) {
  return arr.join(", ");
}
function strToArr(s: string) {
  return s
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

interface FormModalProps {
  title: string;
  initial: EventInput;
  onSave: (data: EventInput) => void;
  onClose: () => void;
  saving: boolean;
  error: string | null;
}

function FormModal({ title, initial, onSave, onClose, saving, error }: FormModalProps) {
  const [form, setForm] = useState<EventInput>(initial);

  function set(key: keyof EventInput, value: unknown) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "7px 10px",
    borderRadius: 7,
    border: "1px solid #e2e8f0",
    fontSize: 13,
    color: "#1e293b",
    background: "#fff",
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 600,
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    marginBottom: 4,
    display: "block",
  };

  const fieldStyle: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 4 };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
        padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: 18,
          padding: 28,
          width: "100%",
          maxWidth: 640,
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 24px 60px rgba(0,0,0,0.22)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: "#1e293b" }}>{title}</h2>
          <button onClick={onClose} style={{ fontSize: 22, color: "#94a3b8", lineHeight: 1, background: "none", border: "none", cursor: "pointer" }}>×</button>
        </div>

        {error && (
          <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#dc2626" }}>
            {error}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {/* Company */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Company *</label>
            <input style={inputStyle} value={form.company} onChange={(e) => set("company", e.target.value)} placeholder="Google" data-testid="input-company" />
          </div>

          {/* Logo */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Logo (1–2 chars) *</label>
            <input style={inputStyle} value={form.logo} onChange={(e) => set("logo", e.target.value)} placeholder="G" maxLength={2} data-testid="input-logo" />
          </div>

          {/* Title */}
          <div style={{ ...fieldStyle, gridColumn: "span 2" }}>
            <label style={labelStyle}>Event Title *</label>
            <input style={inputStyle} value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="AI/ML Bootcamp 2025" data-testid="input-title" />
          </div>

          {/* Type */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Type *</label>
            <select style={inputStyle} value={form.type} onChange={(e) => set("type", e.target.value as Event["type"])} data-testid="select-type">
              <option value="Workshop">Workshop</option>
              <option value="Hackathon">Hackathon</option>
              <option value="Seminar">Seminar</option>
            </select>
          </div>

          {/* Mode */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Mode *</label>
            <select style={inputStyle} value={form.mode} onChange={(e) => set("mode", e.target.value as Event["mode"])} data-testid="select-mode">
              <option value="offline">In-person</option>
              <option value="virtual">Virtual</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>

          {/* Date */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Date *</label>
            <input style={inputStyle} type="date" value={form.date} onChange={(e) => set("date", e.target.value)} data-testid="input-date" />
          </div>

          {/* Time */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Time *</label>
            <input style={inputStyle} value={form.time} onChange={(e) => set("time", e.target.value)} placeholder="10:00 AM" data-testid="input-time" />
          </div>

          {/* Venue */}
          <div style={{ ...fieldStyle, gridColumn: "span 2" }}>
            <label style={labelStyle}>Venue *</label>
            <input style={inputStyle} value={form.venue} onChange={(e) => set("venue", e.target.value)} placeholder="JEC Auditorium, Jaipur" data-testid="input-venue" />
          </div>

          {/* City */}
          <div style={fieldStyle}>
            <label style={labelStyle}>City *</label>
            <input style={inputStyle} value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="Jaipur" data-testid="input-city" />
          </div>

          {/* Distance */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Distance (km, 0 = online)</label>
            <input style={inputStyle} type="number" min={0} value={form.distance} onChange={(e) => set("distance", parseFloat(e.target.value) || 0)} data-testid="input-distance" />
          </div>

          {/* Color */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Brand Color *</label>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input type="color" value={form.color} onChange={(e) => set("color", e.target.value)} style={{ width: 40, height: 36, border: "1px solid #e2e8f0", borderRadius: 7, cursor: "pointer" }} data-testid="input-color" />
              <input style={{ ...inputStyle, flex: 1 }} value={form.color} onChange={(e) => set("color", e.target.value)} placeholder="#6366f1" />
            </div>
          </div>

          {/* Registration link */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Registration Link *</label>
            <input style={inputStyle} value={form.link} onChange={(e) => set("link", e.target.value)} placeholder="https://events.google.com" data-testid="input-link" />
          </div>

          {/* Paid / Price */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Paid Event?</label>
            <div style={{ display: "flex", alignItems: "center", gap: 10, height: 36 }}>
              <input type="checkbox" checked={form.paid} onChange={(e) => set("paid", e.target.checked)} style={{ width: 16, height: 16, accentColor: "#6366f1", cursor: "pointer" }} data-testid="input-paid" />
              <span style={{ fontSize: 13, color: "#64748b" }}>Yes, this event is paid</span>
            </div>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Price (₹)</label>
            <input style={inputStyle} type="number" min={0} value={form.price} disabled={!form.paid} onChange={(e) => set("price", parseInt(e.target.value) || 0)} data-testid="input-price" />
          </div>

          {/* Total seats / Taken */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Total Seats *</label>
            <input style={inputStyle} type="number" min={1} value={form.totalSeats} onChange={(e) => set("totalSeats", parseInt(e.target.value) || 0)} data-testid="input-total-seats" />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Seats Taken</label>
            <input style={inputStyle} type="number" min={0} value={form.taken} onChange={(e) => set("taken", parseInt(e.target.value) || 0)} data-testid="input-taken" />
          </div>

          {/* Freebies */}
          <div style={{ ...fieldStyle, gridColumn: "span 2" }}>
            <label style={labelStyle}>Freebies (comma-separated)</label>
            <input style={inputStyle} value={arrToStr(form.freebies)} onChange={(e) => set("freebies", strToArr(e.target.value))} placeholder="Certificate, T-Shirt, Lunch" data-testid="input-freebies" />
          </div>

          {/* Eligibility */}
          <div style={{ ...fieldStyle, gridColumn: "span 2" }}>
            <label style={labelStyle}>Eligibility (comma-separated)</label>
            <input style={inputStyle} value={arrToStr(form.eligibility)} onChange={(e) => set("eligibility", strToArr(e.target.value))} placeholder="CSE, IT, All Branches" data-testid="input-eligibility" />
          </div>

          {/* Tags */}
          <div style={{ ...fieldStyle, gridColumn: "span 2" }}>
            <label style={labelStyle}>Topic Tags (comma-separated)</label>
            <input style={inputStyle} value={arrToStr(form.tags)} onChange={(e) => set("tags", strToArr(e.target.value))} placeholder="AI, ML, Cloud" data-testid="input-tags" />
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 24 }}>
          <button
            onClick={onClose}
            style={{ padding: "9px 20px", borderRadius: 9, border: "1px solid #e2e8f0", background: "#f8fafc", color: "#64748b", fontSize: 13, fontWeight: 500, cursor: "pointer" }}
            data-testid="button-cancel"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            disabled={saving}
            style={{ padding: "9px 22px", borderRadius: 9, border: "none", background: "#6366f1", color: "#fff", fontSize: 13, fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1 }}
            data-testid="button-save"
          >
            {saving ? "Saving…" : "Save Event"}
          </button>
        </div>
      </div>
    </div>
  );
}

interface ConfirmDeleteProps {
  eventTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
  deleting: boolean;
}

function ConfirmDelete({ eventTitle, onConfirm, onCancel, deleting }: ConfirmDeleteProps) {
  return (
    <div
      onClick={onCancel}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2100, padding: 16 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: "#fff", borderRadius: 16, padding: 28, maxWidth: 380, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}
      >
        <div style={{ fontSize: 32, textAlign: "center", marginBottom: 12 }}>🗑️</div>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", textAlign: "center", marginBottom: 8 }}>Delete event?</h3>
        <p style={{ fontSize: 13, color: "#64748b", textAlign: "center", marginBottom: 22 }}>
          <strong>{eventTitle}</strong> will be permanently removed from Supabase.
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onCancel}
            style={{ flex: 1, padding: "10px", borderRadius: 9, border: "1px solid #e2e8f0", background: "#f8fafc", color: "#64748b", fontSize: 13, fontWeight: 500, cursor: "pointer" }}
            data-testid="button-cancel-delete"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            style={{ flex: 1, padding: "10px", borderRadius: 9, border: "none", background: "#ef4444", color: "#fff", fontSize: 13, fontWeight: 600, cursor: deleting ? "not-allowed" : "pointer", opacity: deleting ? 0.7 : 1 }}
            data-testid="button-confirm-delete"
          >
            {deleting ? "Deleting…" : "Yes, delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

interface AdminPanelProps {
  onClose: () => void;
  onLogout: () => void;
}

export default function AdminPanel({ onClose, onLogout }: AdminPanelProps) {
  const { data: events = [], isLoading } = useEvents();
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();
  const deleteEvent = useDeleteEvent();

  const [modal, setModal] = useState<
    | { mode: "add" }
    | { mode: "edit"; event: Event }
    | { mode: "delete"; event: Event }
    | null
  >(null);

  const [formError, setFormError] = useState<string | null>(null);

  async function handleSaveNew(data: EventInput) {
    setFormError(null);
    try {
      await createEvent.mutateAsync(data);
      setModal(null);
    } catch (err) {
      setFormError((err as Error).message);
    }
  }

  async function handleSaveEdit(data: EventInput) {
    if (modal?.mode !== "edit") return;
    setFormError(null);
    try {
      await updateEvent.mutateAsync({ id: modal.event.id, input: data });
      setModal(null);
    } catch (err) {
      setFormError((err as Error).message);
    }
  }

  async function handleDelete() {
    if (modal?.mode !== "delete") return;
    try {
      await deleteEvent.mutateAsync(modal.event.id);
      setModal(null);
    } catch {
      setModal(null);
    }
  }

  const typeColors: Record<string, string> = {
    Workshop: "#6366f1",
    Hackathon: "#f97316",
    Seminar: "#10b981",
  };

  return (
    <>
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "#f8fafc",
          zIndex: 1500,
          overflowY: "auto",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        {/* Header */}
        <div
          style={{
            position: "sticky",
            top: 0,
            background: "#fff",
            borderBottom: "1px solid #e2e8f0",
            padding: "14px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 10,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 20 }}>⚙️</span>
            <div>
              <span style={{ fontSize: 16, fontWeight: 700, color: "#1e293b" }}>Admin Panel</span>
              <span style={{ fontSize: 12, color: "#94a3b8", marginLeft: 8 }}>MeetMinds event management</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button
              onClick={() => { setFormError(null); setModal({ mode: "add" }); }}
              style={{ padding: "8px 18px", borderRadius: 9, border: "none", background: "#6366f1", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
              data-testid="button-add-event"
            >
              + Add Event
            </button>
            <button
              onClick={onClose}
              style={{ padding: "8px 16px", borderRadius: 9, border: "1px solid #e2e8f0", background: "#fff", color: "#64748b", fontSize: 13, fontWeight: 500, cursor: "pointer" }}
              data-testid="button-close-admin"
            >
              ← Back to app
            </button>
            <button
              onClick={onLogout}
              style={{ padding: "8px 14px", borderRadius: 9, border: "1px solid #fca5a5", background: "#fef2f2", color: "#dc2626", fontSize: 13, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}
              data-testid="button-logout"
            >
              🔒 Logout
            </button>
          </div>
        </div>

        {/* Stats bar */}
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "16px 20px 0" }}>
          <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
            {[
              { label: "Total Events", val: events.length, color: "#6366f1" },
              { label: "Workshops", val: events.filter((e) => e.type === "Workshop").length, color: "#6366f1" },
              { label: "Hackathons", val: events.filter((e) => e.type === "Hackathon").length, color: "#f97316" },
              { label: "Seminars", val: events.filter((e) => e.type === "Seminar").length, color: "#10b981" },
            ].map(({ label, val, color }) => (
              <div key={label} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, padding: "10px 16px", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 17, fontWeight: 700, color }}>{val}</span>
                <span style={{ fontSize: 12, color: "#64748b" }}>{label}</span>
              </div>
            ))}
          </div>

          {/* Table */}
          {isLoading ? (
            <div style={{ textAlign: "center", padding: "4rem", color: "#94a3b8", fontSize: 14 }}>Loading events…</div>
          ) : events.length === 0 ? (
            <div style={{ textAlign: "center", padding: "4rem", color: "#94a3b8" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
              <p style={{ fontSize: 14 }}>No events yet.</p>
              <p style={{ fontSize: 12, marginTop: 4 }}>Click "+ Add Event" to create your first one.</p>
            </div>
          ) : (
            <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                    {["Company", "Title", "Type", "Mode", "Date", "City", "Seats", "Actions"].map((h) => (
                      <th key={h} style={{ padding: "11px 14px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {events.map((event, i) => {
                    const pct = Math.round((event.taken / event.totalSeats) * 100);
                    return (
                      <tr
                        key={event.id}
                        style={{ borderBottom: i < events.length - 1 ? "1px solid #f8fafc" : "none", transition: "background 0.1s" }}
                        onMouseEnter={(e) => ((e.currentTarget as HTMLTableRowElement).style.background = "#fafafa")}
                        onMouseLeave={(e) => ((e.currentTarget as HTMLTableRowElement).style.background = "")}
                        data-testid={`event-row-${event.id}`}
                      >
                        {/* Company */}
                        <td style={{ padding: "11px 14px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ width: 30, height: 30, borderRadius: 8, background: event.color + "20", border: `1.5px solid ${event.color}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: event.color, flexShrink: 0 }}>
                              {event.logo}
                            </div>
                            <span style={{ fontSize: 13, fontWeight: 500, color: "#1e293b" }}>{event.company}</span>
                          </div>
                        </td>

                        {/* Title */}
                        <td style={{ padding: "11px 14px", maxWidth: 220 }}>
                          <span style={{ fontSize: 13, color: "#334155", display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {event.title}
                          </span>
                        </td>

                        {/* Type */}
                        <td style={{ padding: "11px 14px" }}>
                          <span style={{ fontSize: 11, fontWeight: 600, color: typeColors[event.type], background: typeColors[event.type] + "18", padding: "3px 8px", borderRadius: 6 }}>
                            {event.type}
                          </span>
                        </td>

                        {/* Mode */}
                        <td style={{ padding: "11px 14px" }}>
                          <span style={{ fontSize: 12, color: "#64748b" }}>
                            {event.mode === "offline" ? "📍" : event.mode === "virtual" ? "💻" : "🌐"} {event.mode}
                          </span>
                        </td>

                        {/* Date */}
                        <td style={{ padding: "11px 14px", whiteSpace: "nowrap" }}>
                          <span style={{ fontSize: 12, color: "#64748b" }}>
                            {new Date(event.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                          </span>
                        </td>

                        {/* City */}
                        <td style={{ padding: "11px 14px" }}>
                          <span style={{ fontSize: 12, color: "#64748b" }}>{event.city}</span>
                        </td>

                        {/* Seats */}
                        <td style={{ padding: "11px 14px", minWidth: 90 }}>
                          <div style={{ fontSize: 12, color: "#64748b", marginBottom: 3 }}>{event.taken}/{event.totalSeats} ({pct}%)</div>
                          <div style={{ height: 3, background: "#f1f5f9", borderRadius: 4 }}>
                            <div style={{ height: 3, width: `${Math.min(pct, 100)}%`, background: pct >= 80 ? "#ef4444" : pct >= 50 ? "#f97316" : "#10b981", borderRadius: 4 }} />
                          </div>
                        </td>

                        {/* Actions */}
                        <td style={{ padding: "11px 14px" }}>
                          <div style={{ display: "flex", gap: 6 }}>
                            <button
                              onClick={() => { setFormError(null); setModal({ mode: "edit", event }); }}
                              style={{ padding: "5px 12px", borderRadius: 7, border: "1px solid #e2e8f0", background: "#f8fafc", color: "#6366f1", fontSize: 12, fontWeight: 500, cursor: "pointer" }}
                              data-testid={`button-edit-${event.id}`}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => setModal({ mode: "delete", event })}
                              style={{ padding: "5px 12px", borderRadius: 7, border: "1px solid #fca5a5", background: "#fef2f2", color: "#dc2626", fontSize: 12, fontWeight: 500, cursor: "pointer" }}
                              data-testid={`button-delete-${event.id}`}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <p style={{ textAlign: "center", fontSize: 11, color: "#cbd5e1", margin: "20px 0" }}>
            Changes sync live to all open sessions via Supabase Realtime.
          </p>
        </div>
      </div>

      {/* Modals */}
      {modal?.mode === "add" && (
        <FormModal
          title="Add New Event"
          initial={EMPTY_FORM}
          onSave={handleSaveNew}
          onClose={() => setModal(null)}
          saving={createEvent.isPending}
          error={formError}
        />
      )}

      {modal?.mode === "edit" && (
        <FormModal
          title={`Edit: ${modal.event.title}`}
          initial={toEventInput(modal.event)}
          onSave={handleSaveEdit}
          onClose={() => setModal(null)}
          saving={updateEvent.isPending}
          error={formError}
        />
      )}

      {modal?.mode === "delete" && (
        <ConfirmDelete
          eventTitle={modal.event.title}
          onConfirm={handleDelete}
          onCancel={() => setModal(null)}
          deleting={deleteEvent.isPending}
        />
      )}
    </>
  );
}
