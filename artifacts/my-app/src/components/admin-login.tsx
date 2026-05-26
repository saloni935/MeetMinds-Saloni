import { useState } from "react";

interface AdminLoginProps {
  onSuccess: () => void;
  onClose: () => void;
}

export default function AdminLogin({ onSuccess, onClose }: AdminLoginProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [shaking, setShaking] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const correct = import.meta.env.VITE_ADMIN_PASSWORD;

    if (password === correct) {
      sessionStorage.setItem("meetminds_admin", "1");
      onSuccess();
    } else {
      setError(true);
      setShaking(true);
      setPassword("");
      setTimeout(() => setShaking(false), 500);
    }
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,23,42,0.65)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1600,
        padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: 20,
          padding: "36px 32px 28px",
          width: "100%",
          maxWidth: 360,
          boxShadow: "0 32px 80px rgba(0,0,0,0.28)",
          animation: shaking ? "shake 0.45s ease" : undefined,
        }}
      >
        <style>{`
          @keyframes shake {
            0%,100% { transform: translateX(0); }
            15%      { transform: translateX(-8px); }
            30%      { transform: translateX(8px); }
            45%      { transform: translateX(-6px); }
            60%      { transform: translateX(6px); }
            75%      { transform: translateX(-3px); }
            90%      { transform: translateX(3px); }
          }
        `}</style>

        {/* Lock icon */}
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 14,
            background: "linear-gradient(135deg,#6366f1,#818cf8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
            margin: "0 auto 18px",
          }}
        >
          🔐
        </div>

        <h2
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: "#1e293b",
            textAlign: "center",
            marginBottom: 4,
          }}
        >
          Admin Access
        </h2>
        <p
          style={{
            fontSize: 13,
            color: "#94a3b8",
            textAlign: "center",
            marginBottom: 24,
          }}
        >
          Enter the admin password to continue
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            autoFocus
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
            placeholder="Password"
            style={{
              width: "100%",
              padding: "11px 14px",
              borderRadius: 10,
              border: error ? "1.5px solid #ef4444" : "1.5px solid #e2e8f0",
              fontSize: 14,
              color: "#1e293b",
              background: error ? "#fef2f2" : "#f8fafc",
              outline: "none",
              boxSizing: "border-box",
              transition: "border-color 0.15s, background 0.15s",
            }}
          />

          {error && (
            <p
              style={{
                fontSize: 12,
                color: "#ef4444",
                marginTop: 7,
                textAlign: "center",
              }}
            >
              Incorrect password. Try again.
            </p>
          )}

          <button
            type="submit"
            disabled={!password}
            style={{
              width: "100%",
              marginTop: 16,
              padding: "11px",
              borderRadius: 10,
              border: "none",
              background: password
                ? "linear-gradient(135deg,#6366f1,#818cf8)"
                : "#e2e8f0",
              color: password ? "#fff" : "#94a3b8",
              fontSize: 14,
              fontWeight: 600,
              cursor: password ? "pointer" : "not-allowed",
              transition: "background 0.2s, color 0.2s",
            }}
          >
            Unlock Admin Panel
          </button>
        </form>

        <button
          onClick={onClose}
          style={{
            width: "100%",
            marginTop: 10,
            padding: "9px",
            borderRadius: 10,
            border: "none",
            background: "none",
            color: "#94a3b8",
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
