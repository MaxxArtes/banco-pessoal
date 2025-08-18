// src/pages/Login.jsx
import { useState, useEffect } from "react";
import "./styles/Login.css"; // opcional, se quiser algo específico do login
import { login } from "../api";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

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
      const msg = error?.response?.data?.detail || error?.message || "Falha ao fazer login";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="center-wrap">
      <form onSubmit={handleSubmit} className="card">
        <img src="/logo-drive-pessoal.png" alt="Drive Pessoal" width={72} height={72} style={{ objectFit: "contain", marginBottom: 8 }} />

        <h1 className="title-1">Entrar na sua conta</h1>

        <input
          className="input"
          type="text"
          placeholder="digite seu cpf aqui"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="username"
          required
        />

        <div className="password-wrap">
          <input
            className="input"
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
            className="eye-btn"
          >
            {show ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>

        {err && <div className="error">{err}</div>}

        <button type="submit" disabled={loading} className="btn">
          {loading ? "Entrando..." : "Login"}
        </button>

        <div className="small text-muted">
          Não Possui Cadastro?{" "}
          <Link to="/register" className="link">Clique aqui</Link>
        </div>
      </form>
    </div>
  );
}

/* Ícones (mantenha aqui ou importe de um Icons.jsx) */
function EyeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
      <path d="M12 5c-5 0-9 4.5-10 7 1 2.5 5 7 10 7s9-4.5 10-7c-1-2.5-5-7-10-7zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10z" fill="currentColor" opacity=".6"/>
      <circle cx="12" cy="12" r="2.5" fill="currentColor" />
    </svg>
  );
}
function EyeOffIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
      <path d="M2 2l20 20-1.4 1.4-3-3A11.7 11.7 0 0 1 12 19C7 19 3 14.5 2 12c.4-1 1.3-2.4 2.6-3.8L.6 3.4 2 2zm8.5 8.5a3 3 0 0 0 4 4l-4-4zM12 5c5 0 9 4.5 10 7-.3.8-1 1.9-2.1 3.1l-1.5-1.5A7 7 0 0 0 12 7c-.7 0-1.5.1-2.1.3L8.2 5.6C9.3 5.2 10.6 5 12 5z" fill="currentColor" opacity=".6"/>
    </svg>
  );
}
