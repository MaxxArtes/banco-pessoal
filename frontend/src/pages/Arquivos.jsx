// src/pages/Arquivos.jsx
import { useEffect, useState } from "react";
import { getArquivos, uploadArquivo, deleteArquivo, getDownloadUrl } from "../api";

export default function Arquivos() {
  const [lista, setLista] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [file, setFile] = useState(null);
  const user = JSON.parse(localStorage.getItem("user") || "null");

  async function carregar() {
    setErr(null);
    setLoading(true);
    try {
      const r = await getArquivos();
      setLista(r.arquivos || []);
    } catch (e) {
      setErr(e.message || "Falha ao listar arquivos");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { carregar(); }, []);

  async function handleUpload(e) {
    e.preventDefault();
    if (!file) return;
    setErr(null);
    try {
      await uploadArquivo(file);
      setFile(null);
      await carregar();
    } catch (e) {
      setErr(e.message || "Falha no upload");
    }
  }

  async function handleDelete(name) {
    if (!confirm(`Excluir ${name}?`)) return;
    setErr(null);
    try {
      await deleteArquivo(name);
      await carregar();
    } catch (e) {
      setErr(e.message || "Falha ao excluir");
    }
  }

  async function handleDownload(name) {
    try {
      const { url } = await getDownloadUrl(name);
      window.location.href = url;
    } catch (e) {
      alert(e.message || "Falha ao gerar link de download");
    }
  }

  function logout() {
    localStorage.removeItem("user");
    window.location.href = "/";
  }

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", padding: 16 }}>
      <h1>Meus Arquivos</h1>
      {user && <p style={{ color: "#555" }}>Logado como: {user.email} <button onClick={logout}>Sair</button></p>}

      <form onSubmit={handleUpload} style={{ margin: "16px 0" }}>
        <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <button type="submit" disabled={!file} style={{ marginLeft: 8 }}>Enviar</button>
      </form>

      {err && <div style={{ background: "#fee2e2", color: "#991b1b", padding: 8, borderRadius: 6 }}>{err}</div>}
      {loading ? <p>Carregando...</p> : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {lista.length === 0 && <li>Nenhum arquivo.</li>}
          {lista.map((name) => (
            <li key={name} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #eee" }}>
              <span style={{ wordBreak: "break-all" }}>{name}</span>
              <span style={{ display: "flex", gap: 8 }}>
                <button onClick={() => handleDownload(name)}>Baixar</button>
                <button onClick={() => handleDelete(name)}>Excluir</button>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
