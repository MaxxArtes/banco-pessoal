// src/pages/Register.jsx
import { useState } from "react";
import "./styles/Register.css";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../api";

export default function Register() {
  const nav = useNavigate();
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await register(cpf, password);
      nav("/login");
    } catch (e) {
      setErr(e?.response?.data?.detail || "Falha ao registrar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="center-wrap">
      <form className="card" onSubmit={onSubmit}>
        <img src="/logo-drive-pessoal.png" alt="Drive Pessoal" width={72} height={72} style={{ objectFit: "contain", marginBottom: 8 }} />
        <h1 className="title-1">Criar conta</h1>

        <input
          className="input"
          type="text"
          placeholder="digite seu cpf aqui"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          required
        />

        <input
          className="input"
          type="password"
          placeholder="crie sua senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {err && <div className="error">{err}</div>}

        <button className="btn" disabled={loading}>
          {loading ? "Enviando..." : "Registrar"}
        </button>

        <div className="small text-muted">
          Já tem conta? <Link className="link" to="/login">Entrar</Link>
        </div>
      </form>
    </div>
  );
}
