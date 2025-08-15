import { useState } from "react";
import { register } from "../api"; // << minúsculo
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setErr(null);

    if (password !== password2) {
      setErr("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    try {
      // usa a função do api.js
      const res = await register(email, password);
      // backend retorna { id, email }
      localStorage.setItem("user", JSON.stringify(res));
      navigate("/home");
    } catch (error) {
      const msg =
        error?.response?.data?.detail ||
        error?.message ||
        "Falha ao cadastrar";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.wrapper}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h2 style={{ marginBottom: 16 }}>Criar conta</h2>

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
          placeholder="Mínimo 8 caracteres"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={8}
          required
        />

        <label style={styles.label}>Confirmar senha</label>
        <input
          style={styles.input}
          type="password"
          placeholder="Repita a senha"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
          minLength={8}
          required
        />

        {err && <div style={styles.error}>{err}</div>}

        <button disabled={loading} style={styles.button} type="submit">
          {loading ? "Cadastrando..." : "Criar conta"}
        </button>

        <div style={{ marginTop: 12, fontSize: 14 }}>
          Já tem conta? <Link to="/login">Entrar</Link>
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
