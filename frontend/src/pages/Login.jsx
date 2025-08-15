// src/pages/Login.jsx
import { useState, useEffect } from "react";
import { login } from "../api";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");      // mantém “email” por causa do backend
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  // se já estiver logado, pula pro app
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) navigate("/arquivos");
  }, [navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const res = await login(email, password);
      localStorage.setItem("user", JSON.stringify(res.user));
      navigate("/arquivos");
    } catch (error) {
      const msg =
        error?.response?.data?.detail ||
        error?.message ||
        "Falha ao fazer login";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.wrap}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <img
          src="/logo-drive-pessoal.png"
          alt="Drive Pessoal"
          style={{ width: 72, height: 72, objectFit: "contain", marginBottom: 8 }}
        />
        <div style={{ marginBottom: 8 }}>
          <CloudIcon />
        </div>

        <h1 style={styles.title}>Entrar na sua conta</h1>

        {/* Campo “email/cpf” — placeholder como no print */}
        <input
          style={styles.input}
          type="text"
          placeholder="digite seu cpf aqui"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="username"
          required
        />

        {/* Campo senha com ícone de olho */}
        <div style={{ position: "relative", width: 260 }}>
          <input
            style={{ ...styles.input, width: "100%", paddingRight: 40 }}
            type={show ? "text" : "password"}
            placeholder="digite sua senha aqui"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            title={show ? "Ocultar senha" : "Mostrar senha"}
            style={styles.eyeBtn}
          >
            {show ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>

        {err && <div style={styles.error}>{err}</div>}

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? "Entrando..." : "Login"}
        </button>

        <div style={styles.small}>
          Não Possui Cadastro?{" "}
          <Link to="/register" style={styles.link}>
            Clique aqui
          </Link>
        </div>
      </form>
    </div>
  );
}

/* ==================== estilos ==================== */
const styles = {
  wrap: {
    minHeight: "100vh",
    background: "#1c1c1c",
    display: "grid",
    placeItems: "center",
    padding: 16,
  },
  card: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 14,
  },
  title: {
    color: "#fff",
    fontWeight: 600,
    fontSize: 24,
    margin: "6px 0 10px",
    textAlign: "center",
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
  },
  input: {
    width: 260,
    height: 38,
    borderRadius: 6,
    border: "none",
    outline: "none",
    padding: "0 12px",
    background: "#f0f2f5",
    color: "#111",
    fontSize: 13,
  },
  eyeBtn: {
    position: "absolute",
    right: 8,
    top: "50%",
    transform: "translateY(-50%)",
    background: "transparent",
    border: "none",
    padding: 6,
    cursor: "pointer",
    color: "#777",
  },
  button: {
    width: 260,
    height: 40,
    borderRadius: 8,
    border: "none",
    background: "#fff",
    color: "#1565d8",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 1px 0 rgba(0,0,0,.15)",
  },
  small: { color: "#c9c9c9", fontSize: 12, marginTop: 6 },
  link: { color: "#c9c9c9", textDecoration: "underline" },
  error: {
    width: 260,
    background: "#fee2e2",
    color: "#991b1b",
    padding: "8px 10px",
    borderRadius: 6,
    fontSize: 12,
  },
};

/* ==================== ícones (SVG inline) ==================== */
function CloudIcon() {
  return (
    <svg width="72" height="72" viewBox="0 0 64 64" aria-hidden>
      <defs>
        <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#3aa7ff" />
          <stop offset="100%" stopColor="#1366d6" />
        </linearGradient>
      </defs>
      <path
        fill="url(#g)"
        d="M22 26a12 12 0 0 1 23.4-2.8A10 10 0 1 1 49 42H20a10 10 0 0 1 2-20z"
      />
      <rect x="29" y="38" width="6" height="6" rx="2" fill="#1b75ff" />
      <rect x="29" y="46" width="6" height="6" rx="2" fill="#1b75ff" />
      <rect x="29" y="54" width="6" height="6" rx="2" fill="#1b75ff" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
      <path
        d="M12 5c-5 0-9 4.5-10 7 1 2.5 5 7 10 7s9-4.5 10-7c-1-2.5-5-7-10-7zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10z"
        fill="currentColor"
        opacity=".6"
      />
      <circle cx="12" cy="12" r="2.5" fill="currentColor" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
      <path
        d="M2 2l20 20-1.4 1.4-3-3A11.7 11.7 0 0 1 12 19C7 19 3 14.5 2 12c.4-1 1.3-2.4 2.6-3.8L.6 3.4 2 2zm8.5 8.5a3 3 0 0 0 4 4l-4-4zM12 5c5 0 9 4.5 10 7-.3.8-1 1.9-2.1 3.1l-1.5-1.5A7 7 0 0 0 12 7c-.7 0-1.5.1-2.1.3L8.2 5.6C9.3 5.2 10.6 5 12 5z"
        fill="currentColor"
        opacity=".6"
      />
    </svg>
  );
}
