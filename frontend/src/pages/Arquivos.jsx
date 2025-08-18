// src/pages/Arquivos.jsx
import "./styles/Arquivos.css";
import { useEffect, useState } from "react";
import { getArquivos, uploadArquivo, getDownloadUrl, deleteArquivo } from "../api";

/* -------- normalização: suporta array de strings ou de objetos -------- */
function normalizeFiles(items) {
  const arr = Array.isArray(items) ? items : [];
  return arr.map((it, idx) => {
    if (typeof it === "string") {
      // caso local: ["banco-pessoal-main.zip"]
      return { id: it, name: it, raw: it };
    }
    // caso objetos (S3/Render/etc.)
    const name =
      it?.name ??
      it?.filename ?? it?.fileName ?? it?.file_name ??
      it?.key ?? it?.Key ?? "";
    const id = it?.key ?? it?.Key ?? it?.id ?? name ?? String(idx);
    return { id: String(id), name: String(name || ""), raw: it };
  });
}
/* --------------------------------------------------------------------- */

export default function Arquivos() {
  const [files, setFiles] = useState([]); // [{id, name, raw}]
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const userEmail = JSON.parse(localStorage.getItem("user") || "{}")?.email || "";

  async function load() {
    try {
      setLoading(true);
      setErr(null);
      const res = await getArquivos();
      // local: res.arquivos é string[]
      const normalized = normalizeFiles(res?.arquivos);
      setFiles(normalized);
      // console.table(normalized); // útil para depurar
    } catch (e) {
      setErr(e?.response?.data?.detail || e?.message || "Falha ao carregar arquivos");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function onUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      setErr(null);
      await uploadArquivo(file);
      await load();
    } catch (e2) {
      setErr(e2?.response?.data?.detail || e2?.message || "Falha no upload");
    } finally {
      setUploading(false);
      e.target.value = ""; // permite reenviar o mesmo arquivo
    }
  }

  const handleDownload = (raw) => getDownloadUrl(raw);
  const handleDelete = async (raw) => { await deleteArquivo(raw); await load(); };
  const logout = () => { localStorage.removeItem("user"); window.location.href = "/login"; };

  return (
    <div className="center-wrap">
      <div className="card page arquivos stack-md">
        <header className="arquivos__header">
          <h1 className="title-hero">Meus Arquivos</h1>
          <div className="muted small">Logado como: {userEmail}</div>
        </header>

        <div className="arquivos__toolbar">
          <button className="btn btn--mono" onClick={logout}>Sair</button>

          <label className="btn btn--mono" htmlFor="file-input">Escolher arquivo</label>
          <span className="input-file">
            <input id="file-input" type="file" className="visually-hidden" onChange={onUpload} />
          </span>

          <button className="btn btn--mono" onClick={load} disabled={loading}>
            {loading ? "Carregando..." : "Atualizar"}
          </button>

          {/* se o upload já dispara no onChange, este botão é opcional */}
          <button className="btn btn--mono" disabled={uploading}>
            {uploading ? "Enviando..." : "Enviar"}
          </button>
        </div>

        {err && <div className="error">{err}</div>}

        <section className="file-list stack-sm">
          {files.length === 0 ? (
            <div className="small text-muted">Nenhum arquivo</div>
          ) : (
            files.map((f, i) => (
              <div key={f.id || String(i)} className="file-row">
                <div className="file-row__name break">{f.name || "(sem nome)"}</div>
                <div className="file-row__actions">
                  <button className="btn btn--sm btn--full" onClick={() => handleDownload(f.raw)}>Baixar</button>
                  <button className="btn btn--sm btn--full" onClick={() => handleDelete(f.raw)}>Excluir</button>
                </div>
              </div>
            ))
          )}
        </section>

        <div className="status">Nomes longos quebram automaticamente.</div>
      </div>
    </div>
  );
}
