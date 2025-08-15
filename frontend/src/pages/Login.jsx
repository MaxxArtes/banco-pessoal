import { useState } from "react";
import { login } from "../api"; // << minúsculo
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      // usa a função do api.js
      const res = await login(email, password);
      // backend retorna { ok, message, user: {id, email} }
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
    <div style={styles.wrapper}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h2 style={{ marginBottom: 16 }}>Entrar</h2>

        <label style={styles.label}>E-mail</label>
        <input
          style={styles.input}
          type="email"
          placeholder="voce@exemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label style={styles.label}>Senha</label>
        <input
          style={styles.input}
          type="password"
          placeholder="Sua senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {err && <div style={styles.error}>{err}</div>}

        <button disabled={loading} style={styles.button} type="submit">
          {loading ? "Entrando..." : "Entrar"}
        </button>

        <div style={{ marginTop: 12, fontSize: 14 }}>
          Não tem conta? <Link to="/register">Cadastrar</Link>
        </div>
      </form>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    background: "#f6f8fb",
    padding: 16,
  },
  card: {
    width: "100%",
    maxWidth: 380,
    background: "#fff",
    padding: 24,
    borderRadius: 16,
    boxShadow:
      "0 10px 15px -3px rgba(0,0,0,.1), 0 4px 6px -2px rgba(0,0,0,.05)",
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  label: { fontSize: 14, color: "#333" },
  input: {
    border: "1px solid #e5e7eb",
    borderRadius: 10,
    padding: "10px 12px",
    outline: "none",
  },
  button: {
    marginTop: 8,
    padding: "10px 12px",
    borderRadius: 10,
    border: "none",
    background: "#111827",
    color: "white",
    cursor: "pointer",
  },
  error: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: 8,
    borderRadius: 8,
    fontSize: 13,
  },
};
