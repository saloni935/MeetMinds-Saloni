import { useState, useMemo, useRef, useEffect } from "react";
import { useEvents } from "@/hooks/use-events";
import AdminPanel from "@/components/admin-panel";
import AdminLogin from "@/components/admin-login";
import { useRsvp } from "@/hooks/use-event-mutations";

// ─── Constants ───────────────────────────────────────────────────────────────

const FREEBIE_VALUE: Record<string, number> = {
  Certificate: 200,
  "Google Swag Kit": 800,
  Lunch: 300,
  "Azure Credits": 1500,
  "T-Shirt": 350,
  "Amazon Gift Voucher": 500,
  "IBM Badge": 150,
  "Infosys Goodie Bag": 400,
  Snacks: 150,
  "TCS Goodies": 300,
  "Cash Prize": 2000,
  "Pen Drive": 450,
  "Adobe Creative Cloud Trial": 1200,
  "Tote Bag": 200,
  "IoT Kit": 1800,
  "Meta Swag": 600,
  "Mentorship Session": 1000,
  "NVIDIA Developer Kit": 2500,
  "Cisco NetAcad Access": 800,
};

const swagScore = (freebies: string[]) =>
  freebies.reduce((s, f) => s + (FREEBIE_VALUE[f] ?? 100), 0);

const TYPE_ICONS: Record<string, string> = {
  Workshop: "🔧",
  Hackathon: "💻",
  Seminar: "📊",
};

const TYPE_COLORS: Record<string, string> = {
  Workshop: "#6366f1",
  Hackathon: "#f97316",
  Seminar: "#10b981",
};

const BRANCH_OPTIONS = [
  "CSE",
  "IT",
  "ECE",
  "EE",
  "Mechanical",
  "Civil",
  "Chemical",
  "Physics",
  "Design",
  "Data Science",
];

const MODE_STYLES: Record<
  string,
  { color: string; bg: string; label: string }
> = {
  offline: { color: "#065f46", bg: "#dcfce7", label: "📍 In-person" },
  virtual: { color: "#1d4ed8", bg: "#dbeafe", label: "💻 Virtual" },
  hybrid: { color: "#7c3aed", bg: "#ede9fe", label: "🌐 Hybrid" },
};

const globalCss = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
  input, select, button { font-family: inherit; }
  input[type=text], select {
    background: #fff; border: 1px solid #e2e8f0; border-radius: 8px;
    padding: 8px 12px; font-size: 13px; color: #1e293b; outline: none;
    transition: border-color 0.15s;
  }
  input[type=text]:focus, select:focus { border-color: #6366f1; }
  button { cursor: pointer; border: none; background: none; }
  .card {
    background: #fff; border: 1px solid #e2e8f0; border-radius: 14px;
    padding: 14px 16px; display: flex; flex-direction: column; gap: 10px;
    transition: box-shadow 0.2s;
  }
  .card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.08); }
  .pill {
    padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500;
    cursor: pointer; border: 1px solid #e2e8f0; background: #fff; color: #64748b;
    transition: all 0.15s;
  }
  .pill.active { background: #ede9fe; color: #6366f1; border-color: #6366f1; }
  .pill:hover:not(.active) { background: #f8fafc; }
  .tag { padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 500; }
  .stat-box {
    background: #f8fafc; border-radius: 10px; padding: 8px 14px;
    display: flex; align-items: center; gap: 8px;
  }
  @media (max-width: 600px) {
    .grid { grid-template-columns: 1fr !important; }
    .stats-row { flex-wrap: wrap; }
  }
`;

// ─── Sub-components ───────────────────────────────────────────────────────────

function FomoBar({ taken, total }: { taken: number; total: number }) {
  const pct = Math.round((taken / total) * 100);
  const left = total - taken;
  const hot = pct >= 80;
  const warm = pct >= 50;
  const color = hot ? "#ef4444" : warm ? "#f97316" : "#10b981";
  const label = hot
    ? "🔥 Filling fast!"
    : warm
      ? "📈 Going quick"
      : "✅ Seats open";
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 4,
        }}
      >
        <span style={{ fontSize: 11, color, fontWeight: 600 }}>{label}</span>
        <span style={{ fontSize: 11, color: "#94a3b8" }}>
          {left} left of {total}
        </span>
      </div>
      <div style={{ height: 4, background: "#f1f5f9", borderRadius: 4 }}>
        <div
          style={{
            height: 4,
            width: `${pct}%`,
            background: color,
            borderRadius: 4,
            transition: "width 0.3s",
          }}
        />
      </div>
    </div>
  );
}

function SwagBadge({ freebies }: { freebies: string[] }) {
  const val = swagScore(freebies);
  const [color, bg] =
    val >= 2000
      ? ["#7c3aed", "#f5f3ff"]
      : val >= 1000
        ? ["#0369a1", "#e0f2fe"]
        : ["#065f46", "#dcfce7"];
  return (
    <span className="tag" style={{ background: bg, color }}>
      🎁 ₹{val.toLocaleString("en-IN")} in freebies
    </span>
  );
}

function ShareModal({ event, onClose }: { event: any; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const val = swagScore(event.freebies);
  const dateStr = new Date(event.date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const caption = `I'm attending ${event.title} by ${event.company}! ${event.date} · ${event.venue}\nFind free tech events at meetminds.in`;

  const copy = () => {
    navigator.clipboard?.writeText(caption);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: 18,
          padding: 24,
          maxWidth: 340,
          width: "100%",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 14,
          }}
        >
          <span style={{ fontSize: 14, fontWeight: 600, color: "#1e293b" }}>
            Story card preview
          </span>
          <button
            onClick={onClose}
            style={{ fontSize: 20, color: "#94a3b8", lineHeight: 1 }}
          >
            ×
          </button>
        </div>

        <div
          style={{
            background: event.color + "12",
            border: `2px solid ${event.color}33`,
            borderRadius: 14,
            padding: "1.4rem",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: event.color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 10px",
              fontSize: 18,
              fontWeight: 700,
              color: "#fff",
            }}
          >
            {event.logo}
          </div>
          <div style={{ fontSize: 11, color: "#64748b", marginBottom: 2 }}>
            I'm attending
          </div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "#1e293b",
              lineHeight: 1.3,
              marginBottom: 6,
            }}
          >
            {event.title}
          </div>
          <div style={{ fontSize: 12, color: "#64748b", marginBottom: 10 }}>
            by {event.company} · {dateStr}
          </div>
          <div
            style={{
              display: "flex",
              gap: 6,
              justifyContent: "center",
              flexWrap: "wrap",
              marginBottom: 10,
            }}
          >
            <span
              className="tag"
              style={{ background: event.color + "22", color: event.color }}
            >
              {event.type}
            </span>
            {!event.paid && (
              <span
                className="tag"
                style={{ background: "#dcfce7", color: "#065f46" }}
              >
                Free
              </span>
            )}
            <span
              className="tag"
              style={{ background: "#f5f3ff", color: "#7c3aed" }}
            >
              ₹{val.toLocaleString("en-IN")} goodies
            </span>
          </div>
          <div style={{ fontSize: 11, color: "#94a3b8" }}>
            meetminds.in · Find yours too!
          </div>
        </div>

        <p
          style={{
            fontSize: 12,
            color: "#64748b",
            textAlign: "center",
            margin: "12px 0 8px",
          }}
        >
          Screenshot &amp; share on WhatsApp / Instagram!
        </p>
        <button
          onClick={copy}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: 9,
            background: event.color,
            color: "#fff",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          {copied ? "✓ Copied!" : "📋 Copy caption & share"}
        </button>
      </div>
    </div>
  );
}

function EventCard({
  event,
  squadBranches,
  onShare,
  onRsvp,
  rsvped,
}: {
  event: any;
  squadBranches: string[];
  onShare: (e: any) => void;
  onRsvp: (id: number, taken: number) => void;
  rsvped: boolean;
}) {
  const squadMatch =
    squadBranches.length === 0 ||
    squadBranches.every(
      (b) =>
        event.eligibility.includes(b) ||
        event.eligibility.includes("All Branches"),
    );

  const modeStyle = MODE_STYLES[event.mode] ?? MODE_STYLES.offline;

  const dateStr = new Date(event.date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });

  const copyLinkedIn = () => {
    const val = swagScore(event.freebies);
    const d = new Date(event.date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    const post =
      `Just registered for ${event.title} by ${event.company}!\n\n` +
      `📅 ${d} · ${event.time}\n📍 ${event.venue}\n` +
      `🎁 Freebies worth ₹${val.toLocaleString("en-IN")}: ${event.freebies.join(", ")}\n\n` +
      `Highly recommend for ${event.eligibility.join("/")} students — great for learning & resume building.\n\n` +
      `Found it on MeetMinds!\n\n#TechEvents #StudentLife #${event.company} #MeetMinds`;
    navigator.clipboard?.writeText(post);
    alert("LinkedIn post copied! Go to LinkedIn → New post → Paste.");
  };

  return (
    <div
      className="card"
      style={{
        opacity: squadBranches.length > 0 && !squadMatch ? 0.35 : 1,
        borderColor:
          squadBranches.length > 0 && !squadMatch ? "#fca5a5" : "#e2e8f0",
      }}
    >
      {/* Header row */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              flexShrink: 0,
              background: event.color + "18",
              border: `1.5px solid ${event.color}33`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              fontWeight: 700,
              color: event.color,
            }}
          >
            {event.logo}
          </div>
          <div>
            <div style={{ fontSize: 11, color: "#94a3b8" }}>
              {event.company} · {dateStr}
            </div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "#1e293b",
                lineHeight: 1.3,
              }}
            >
              {event.title}
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            alignItems: "flex-end",
            flexShrink: 0,
          }}
        >
          <span
            className="tag"
            style={{
              background: TYPE_COLORS[event.type] + "18",
              color: TYPE_COLORS[event.type],
            }}
          >
            {TYPE_ICONS[event.type]} {event.type}
          </span>
          <span
            className="tag"
            style={{ background: modeStyle.bg, color: modeStyle.color }}
          >
            {modeStyle.label}
          </span>
        </div>
      </div>

      {/* Time & location */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "4px 8px",
        }}
      >
        <span
          style={{
            fontSize: 11,
            color: "#64748b",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          🕐 {event.time}
        </span>
        <span
          style={{
            fontSize: 11,
            color: "#64748b",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          {event.distance > 0 ? `📍 ${event.distance} km away` : "🌐 Online"}
        </span>
      </div>

      {/* Seat fill bar */}
      <FomoBar taken={event.taken} total={event.totalSeats} />

      {/* Pricing & freebies */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 5,
          alignItems: "center",
        }}
      >
        {event.paid ? (
          <span
            className="tag"
            style={{ background: "#fef3c7", color: "#92400e" }}
          >
            💳 Paid ₹{event.price}
          </span>
        ) : (
          <span
            className="tag"
            style={{ background: "#dcfce7", color: "#065f46" }}
          >
            ✅ Free
          </span>
        )}
        {event.freebies.length > 0 && <SwagBadge freebies={event.freebies} />}
      </div>

      {/* Eligibility */}
      <div style={{ fontSize: 11, color: "#64748b" }}>
        👥 {event.eligibility.join(", ")}
      </div>

      {/* RSVP button */}
      <button
        onClick={() => {
          if (!rsvped) onRsvp(event.id, event.taken);
        }}
        disabled={rsvped}
        style={{
          width: "100%",
          padding: "8px 0",
          borderRadius: 9,
          border: rsvped ? "none" : "1.5px solid #10b981",
          background: rsvped ? "#dcfce7" : "#f0fdf4",
          color: rsvped ? "#15803d" : "#059669",
          fontSize: 12,
          fontWeight: 600,
          cursor: rsvped ? "default" : "pointer",
          marginBottom: 6,
          transition: "background 0.2s",
        }}
        onMouseEnter={(e) => {
          if (!rsvped)
            (e.currentTarget as HTMLButtonElement).style.background = "#dcfce7";
        }}
        onMouseLeave={(e) => {
          if (!rsvped)
            (e.currentTarget as HTMLButtonElement).style.background = "#f0fdf4";
        }}
      >
        {rsvped ? "✅ You're going!" : "🙋 I'm going"}
      </button>

      {/* Register / Link Soon / Share / LinkedIn row */}
      <div style={{ display: "flex", gap: 6 }}>
        {event.link ? (
          <a
            href={event.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={async (e) =>{}}
            e.preventDefault();

              try {
                const response = await fetch(event.link, {
                  method: "HEAD",
                  mode: "no-cors",
                });

                window.open(event.link, "_blank");
              } catch (error) {
                alert("Registration link is broken or expired.");
              }
            }}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
              background: event.color,
              color: "#fff",
              borderRadius: 9,
              padding: "8px 0",
              fontSize: 12,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            🔗 Register
          </a>
        ) : (
          <span
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
              background: "#f1f5f9",
              color: "#94a3b8",
              borderRadius: 9,
              padding: "8px 0",
              fontSize: 12,
              fontWeight: 600,
              border: "1px solid #e2e8f0",
              cursor: "default",
            }}
          >
            🔗 Link Soon
          </span>
        )}
        <button
          onClick={() => onShare(event)}
          title="Share story card"
          style={{
            padding: "8px 11px",
            borderRadius: 9,
            border: "1px solid #e2e8f0",
            background: "#f8fafc",
            color: "#64748b",
            fontSize: 15,
          }}
        >
          📤
        </button>
        <button
          onClick={copyLinkedIn}
          title="Copy LinkedIn post"
          style={{
            padding: "8px 11px",
            borderRadius: 9,
            border: "1px solid #c7e0f4",
            background: "#e8f4fd",
            color: "#0077b5",
            fontSize: 15,
          }}
        >
          💼
        </button>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminAuthed, setAdminAuthed] = useState(
    () => sessionStorage.getItem("meetminds_admin") === "1",
  );

  const [rsvpedIds, setRsvpedIds] = useState<Set<number>>(
    () => new Set(JSON.parse(localStorage.getItem("meetminds_rsvp") || "[]")),
  );
  const rsvpMutation = useRsvp();

  function handleRsvp(eventId: number, currentTaken: number) {
    if (rsvpedIds.has(eventId)) return;
    rsvpMutation.mutate({ id: eventId, taken: currentTaken });
    const next = new Set(rsvpedIds);
    next.add(eventId);
    setRsvpedIds(next);
    localStorage.setItem("meetminds_rsvp", JSON.stringify([...next]));
  }

  const { data: events = [], isLoading, isError, error } = useEvents();

  const ALL_TAGS = useMemo(
    () => [...new Set(events.flatMap((e) => e.tags))],
    [events],
  );
  const CITIES = useMemo(
    () => [...new Set(events.map((e) => e.city))],
    [events],
  );

  const [search, setSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (
        searchWrapRef.current &&
        !searchWrapRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const suggestions = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return [];
    const seen = new Set<string>();
    const results: { label: string; sub: string; value: string }[] = [];
    for (const e of events) {
      if (results.length >= 7) break;
      const matches =
        e.title.toLowerCase().includes(q) ||
        e.company.toLowerCase().includes(q) ||
        e.tags.some((t: string) => t.toLowerCase().includes(q));
      if (matches) {
        const key = e.title + e.company;
        if (!seen.has(key)) {
          seen.add(key);
          results.push({ label: e.title, sub: e.company, value: e.title });
        }
      }
    }
    for (const e of events) {
      if (results.length >= 7) break;
      if (e.company.toLowerCase().includes(q)) {
        const key = "co:" + e.company;
        if (!seen.has(key)) {
          seen.add(key);
          results.push({ label: e.company, sub: "Company", value: e.company });
        }
      }
    }
    return results;
  }, [search, events]);

  const [city, setCity] = useState("All");
  const [maxDist, setMaxDist] = useState(100);
  const [period, setPeriod] = useState("all");
  const [freeOnly, setFreeOnly] = useState(false);
  const [freebiesOnly, setFreebiesOnly] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedBranch, setSelectedBranch] = useState("All");
  const [sortBy, setSortBy] = useState("fomo");
  const [eventMode, setEventMode] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [shareEvent, setShareEvent] = useState<any>(null);
  const [squadMode, setSquadMode] = useState(false);
  const [squadBranches, setSquadBranches] = useState([""]);

  const now = new Date();
  const weekEnd = new Date(now);
  weekEnd.setDate(now.getDate() + 7);
  const monthEnd = new Date(now);
  monthEnd.setDate(now.getDate() + 30);

  const filtered = useMemo(() => {
    let out = events.filter((e) => {
      const eDate = new Date(e.date);
      if (search) {
        const q = search.toLowerCase();
        const hit =
          e.title.toLowerCase().includes(q) ||
          e.company.toLowerCase().includes(q) ||
          e.tags.some((t: string) => t.toLowerCase().includes(q));
        if (!hit) return false;
      }
      if (city !== "All" && e.city !== city) return false;
      if (e.distance > maxDist && e.distance > 0) return false;
      if (period === "week" && eDate > weekEnd) return false;
      if (period === "month" && eDate > monthEnd) return false;
      if (freeOnly && e.paid) return false;
      if (freebiesOnly && e.freebies.length === 0) return false;
      if (
        selectedTags.length > 0 &&
        !selectedTags.some((t) => e.tags.includes(t))
      )
        return false;
      if (
        selectedBranch !== "All" &&
        !e.eligibility.includes(selectedBranch) &&
        !e.eligibility.includes("All Branches")
      )
        return false;
      if (eventMode !== "all" && e.mode !== eventMode) return false;
      return true;
    });
    if (sortBy === "date")
      out.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      );
    if (sortBy === "distance") out.sort((a, b) => a.distance - b.distance);
    if (sortBy === "swag")
      out.sort((a, b) => swagScore(b.freebies) - swagScore(a.freebies));
    if (sortBy === "fomo")
      out.sort((a, b) => b.taken / b.totalSeats - a.taken / a.totalSeats);
    return out;
  }, [
    events,
    search,
    city,
    maxDist,
    period,
    freeOnly,
    freebiesOnly,
    selectedTags,
    selectedBranch,
    sortBy,
    eventMode,
  ]);

  const activeBranches = squadBranches.filter(Boolean);
  const bestSwag =
    filtered.length > 0
      ? Math.max(...filtered.map((e) => swagScore(e.freebies)))
      : 0;

  const Pill = ({
    active,
    onClick,
    children,
  }: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
  }) => (
    <button className={`pill${active ? " active" : ""}`} onClick={onClick}>
      {children}
    </button>
  );

  function clearFilters() {
    setSearch("");
    setCity("All");
    setFreeOnly(false);
    setFreebiesOnly(false);
    setSelectedTags([]);
    setSelectedBranch("All");
    setEventMode("all");
    setPeriod("all");
    setMaxDist(100);
  }

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background: "#f8fafc",
        }}
      >
        <div style={{ textAlign: "center", color: "#64748b" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
          <p style={{ fontSize: 14 }}>Loading events from Supabase…</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background: "#f8fafc",
        }}
      >
        <div
          style={{
            textAlign: "center",
            color: "#ef4444",
            maxWidth: 400,
            padding: "0 24px",
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 12 }}>⚠️</div>
          <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>
            Failed to load events
          </p>
          <p style={{ fontSize: 12, color: "#94a3b8" }}>
            {(error as Error)?.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        style={{
          background: "#f8fafc",
          minHeight: "100vh",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        <style>{globalCss}</style>

        {shareEvent && (
          <ShareModal event={shareEvent} onClose={() => setShareEvent(null)} />
        )}

        <div style={{ maxWidth: 960, margin: "0 auto", padding: "20px 16px" }}>
          {/* ── Header ── */}
          <div style={{ marginBottom: 20 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 4,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                }}
              >
                🚀
              </div>
              <span style={{ fontSize: 22, fontWeight: 700, color: "#1e293b" }}>
                MeetMinds
              </span>
              <span
                style={{
                  fontSize: 11,
                  color: "#6366f1",
                  background: "#ede9fe",
                  borderRadius: 6,
                  padding: "2px 8px",
                  fontWeight: 600,
                }}
              >
                Beta
              </span>
            </div>
            <p style={{ fontSize: 13, color: "#64748b" }}>
              Workshops, hackathons &amp; seminars by top MNCs — for engineering
              students
            </p>
          </div>

          {/* ── Search row ── */}
          <div
            style={{
              display: "flex",
              gap: 8,
              marginBottom: 10,
              flexWrap: "wrap",
            }}
          >
            <div
              ref={searchWrapRef}
              style={{ flex: 1, minWidth: 180, position: "relative" }}
            >
              <span
                style={{
                  position: "absolute",
                  left: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: 15,
                  pointerEvents: "none",
                  zIndex: 1,
                }}
              >
                🔍
              </span>
              <input
                type="text"
                placeholder="Search events, companies, topics..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") setShowSuggestions(false);
                }}
                style={{ width: "100%", paddingLeft: 34 }}
              />
              {showSuggestions && suggestions.length > 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 4px)",
                    left: 0,
                    right: 0,
                    background: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: 10,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
                    zIndex: 200,
                    overflow: "hidden",
                  }}
                >
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setSearch(s.value);
                        setShowSuggestions(false);
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        width: "100%",
                        padding: "9px 12px",
                        background: "none",
                        border: "none",
                        borderBottom:
                          i < suggestions.length - 1
                            ? "1px solid #f1f5f9"
                            : "none",
                        cursor: "pointer",
                        textAlign: "left",
                      }}
                      onMouseEnter={(e) => {
                        (
                          e.currentTarget as HTMLButtonElement
                        ).style.background = "#f8fafc";
                      }}
                      onMouseLeave={(e) => {
                        (
                          e.currentTarget as HTMLButtonElement
                        ).style.background = "none";
                      }}
                    >
                      <span style={{ fontSize: 14 }}>🔍</span>
                      <span style={{ flex: 1, minWidth: 0 }}>
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: 500,
                            color: "#1e293b",
                            display: "block",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {s.label}
                        </span>
                        <span style={{ fontSize: 11, color: "#94a3b8" }}>
                          {s.sub}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <select value={city} onChange={(e) => setCity(e.target.value)}>
              <option value="All">All Cities</option>
              {CITIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>

            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="fomo">🔥 Filling fast</option>
              <option value="swag">🎁 Best swag</option>
              <option value="date">📅 Date</option>
              <option value="distance">📍 Distance</option>
            </select>

            <button
              onClick={() => setShowFilters((f) => !f)}
              style={{
                padding: "8px 14px",
                borderRadius: 8,
                border: "1px solid #e2e8f0",
                background: showFilters ? "#ede9fe" : "#fff",
                color: showFilters ? "#6366f1" : "#64748b",
                fontSize: 13,
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              ⚙️ Filters {showFilters ? "▲" : "▼"}
            </button>
          </div>

          {/* ── Squad Mode ── */}
          <div
            style={{
              background: squadMode ? "#eef2ff" : "#fff",
              border: `1px solid ${squadMode ? "#6366f1" : "#e2e8f0"}`,
              borderRadius: 12,
              padding: "10px 14px",
              marginBottom: 10,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 8,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 18 }}>👥</span>
                <div>
                  <span
                    style={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}
                  >
                    Squad Mode
                  </span>
                  <span
                    style={{ fontSize: 12, color: "#64748b", marginLeft: 8 }}
                  >
                    Find events where your whole group qualifies
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  setSquadMode((s) => !s);
                  if (squadMode) setSquadBranches([""]);
                }}
                style={{
                  fontSize: 12,
                  padding: "6px 14px",
                  borderRadius: 8,
                  background: squadMode ? "#6366f1" : "transparent",
                  color: squadMode ? "#fff" : "#64748b",
                  border: "1px solid #e2e8f0",
                  fontWeight: 500,
                }}
              >
                {squadMode ? "Exit squad mode" : "Enable squad mode"}
              </button>
            </div>

            {squadMode && (
              <div
                style={{
                  marginTop: 10,
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: 12, color: "#64748b" }}>
                  Branches in your squad:
                </span>
                {squadBranches.map((b, i) => (
                  <div
                    key={i}
                    style={{ display: "flex", gap: 4, alignItems: "center" }}
                  >
                    <select
                      value={b}
                      onChange={(e) => {
                        const n = [...squadBranches];
                        n[i] = e.target.value;
                        setSquadBranches(n);
                      }}
                      style={{
                        fontSize: 12,
                        padding: "4px 8px",
                        borderRadius: 6,
                        minWidth: 90,
                      }}
                    >
                      <option value="">Pick branch</option>
                      {BRANCH_OPTIONS.map((br) => (
                        <option key={br}>{br}</option>
                      ))}
                    </select>
                    {squadBranches.length > 1 && (
                      <button
                        onClick={() =>
                          setSquadBranches(
                            squadBranches.filter((_, j) => j !== i),
                          )
                        }
                        style={{
                          color: "#94a3b8",
                          fontSize: 16,
                          fontWeight: 700,
                        }}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                {squadBranches.length < 5 && (
                  <button
                    onClick={() => setSquadBranches([...squadBranches, ""])}
                    style={{
                      fontSize: 12,
                      padding: "5px 12px",
                      borderRadius: 7,
                      border: "1px solid #e2e8f0",
                      background: "#fff",
                      color: "#64748b",
                      fontWeight: 500,
                    }}
                  >
                    + Add friend
                  </button>
                )}
                {activeBranches.length > 0 && (
                  <span
                    style={{ fontSize: 12, color: "#6366f1", fontWeight: 600 }}
                  >
                    Showing: {activeBranches.join(" + ")}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* ── Filters panel ── */}
          {showFilters && (
            <div
              style={{
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: 12,
                padding: 16,
                marginBottom: 10,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 12, color: "#64748b", minWidth: 76 }}>
                  📍 Distance
                </span>
                <input
                  type="range"
                  min={1}
                  max={150}
                  value={maxDist}
                  onChange={(e) => setMaxDist(Number(e.target.value))}
                  style={{ flex: 1, accentColor: "#6366f1" }}
                />
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    minWidth: 55,
                    color: "#1e293b",
                  }}
                >
                  ≤ {maxDist} km
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 6,
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: 12, color: "#64748b", minWidth: 76 }}>
                  📅 Period
                </span>
                {(
                  [
                    ["all", "Any time"],
                    ["week", "This week"],
                    ["month", "This month"],
                  ] as [string, string][]
                ).map(([v, l]) => (
                  <Pill
                    key={v}
                    active={period === v}
                    onClick={() => setPeriod(v)}
                  >
                    {l}
                  </Pill>
                ))}
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 6,
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: 12, color: "#64748b", minWidth: 76 }}>
                  🌐 Mode
                </span>
                {(
                  [
                    ["all", "All"],
                    ["offline", "In-person"],
                    ["virtual", "Virtual"],
                    ["hybrid", "Hybrid"],
                  ] as [string, string][]
                ).map(([v, l]) => (
                  <Pill
                    key={v}
                    active={eventMode === v}
                    onClick={() => setEventMode(v)}
                  >
                    {l}
                  </Pill>
                ))}
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 6,
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: 12, color: "#64748b", minWidth: 76 }}>
                  🏷️ Type
                </span>
                <Pill active={freeOnly} onClick={() => setFreeOnly((f) => !f)}>
                  ✅ Free only
                </Pill>
                <Pill
                  active={freebiesOnly}
                  onClick={() => setFreebiesOnly((f) => !f)}
                >
                  🎁 Has freebies
                </Pill>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 6,
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: 12, color: "#64748b", minWidth: 76 }}>
                  🎓 Branch
                </span>
                {["All", ...BRANCH_OPTIONS.slice(0, 7)].map((b) => (
                  <Pill
                    key={b}
                    active={selectedBranch === b}
                    onClick={() => setSelectedBranch(b)}
                  >
                    {b}
                  </Pill>
                ))}
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 6,
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: 12, color: "#64748b", minWidth: 76 }}>
                  # Topics
                </span>
                {ALL_TAGS.map((t) => (
                  <Pill
                    key={t}
                    active={selectedTags.includes(t)}
                    onClick={() =>
                      setSelectedTags((prev) =>
                        prev.includes(t)
                          ? prev.filter((x) => x !== t)
                          : [...prev, t],
                      )
                    }
                  >
                    #{t}
                  </Pill>
                ))}
              </div>
            </div>
          )}

          {/* ── Stats bar ── */}
          <div
            className="stats-row"
            style={{
              display: "flex",
              gap: 8,
              marginBottom: 16,
              flexWrap: "wrap",
            }}
          >
            {[
              {
                label: "Events",
                val: filtered.length,
                icon: "📅",
                color: "#6366f1",
              },
              {
                label: "Free",
                val: filtered.filter((e) => !e.paid).length,
                icon: "✅",
                color: "#10b981",
              },
              {
                label: "With freebies",
                val: filtered.filter((e) => e.freebies.length > 0).length,
                icon: "🎁",
                color: "#f97316",
              },
              {
                label: "Best swag",
                val:
                  filtered.length > 0
                    ? "₹" + bestSwag.toLocaleString("en-IN")
                    : "—",
                icon: "🏆",
                color: "#8b5cf6",
              },
            ].map(({ label, val, icon, color }) => (
              <div key={label} className="stat-box">
                <span style={{ fontSize: 16 }}>{icon}</span>
                <span style={{ fontSize: 18, fontWeight: 700, color }}>
                  {val}
                </span>
                <span style={{ fontSize: 12, color: "#64748b" }}>{label}</span>
              </div>
            ))}
          </div>

          {/* ── Event grid ── */}
          {filtered.length === 0 ? (
            <div
              style={{ textAlign: "center", padding: "3rem", color: "#94a3b8" }}
            >
              <div style={{ fontSize: 48, marginBottom: 12 }}>😕</div>
              <p style={{ fontSize: 15 }}>No events match your filters.</p>
              <button
                onClick={clearFilters}
                style={{
                  marginTop: 12,
                  padding: "8px 18px",
                  borderRadius: 8,
                  background: "#6366f1",
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div
              className="grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
                gap: 12,
              }}
            >
              {filtered.map((e) => (
                <EventCard
                  key={e.id}
                  event={e}
                  squadBranches={activeBranches}
                  onShare={setShareEvent}
                  onRsvp={handleRsvp}
                  rsvped={rsvpedIds.has(e.id)}
                />
              ))}
            </div>
          )}

          {/* ── Footer ── */}
          <p
            style={{
              textAlign: "center",
              fontSize: 12,
              color: "#cbd5e1",
              marginTop: 24,
            }}
          >
            MeetMinds · Prototype v0.4 · Live data via Supabase ·{" "}
            <button
              onClick={() => setShowAdmin(true)}
              style={{
                background: "none",
                border: "none",
                color: "#94a3b8",
                fontSize: 12,
                cursor: "pointer",
                textDecoration: "underline",
                padding: 0,
              }}
            >
              Admin
            </button>
          </p>
        </div>
      </div>

      {showAdmin && !adminAuthed && (
        <AdminLogin
          onSuccess={() => setAdminAuthed(true)}
          onClose={() => setShowAdmin(false)}
        />
      )}

      {showAdmin && adminAuthed && (
        <AdminPanel
          onClose={() => setShowAdmin(false)}
          onLogout={() => {
            sessionStorage.removeItem("meetminds_admin");
            setAdminAuthed(false);
            setShowAdmin(false);
          }}
        />
      )}
    </>
  );
}
