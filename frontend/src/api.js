// URL base do backend (Render/Vite) com fallback para desenvolvimento local
const API =
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_URL) ||
  "http://127.0.0.1:8000";

// ---- Arquivos (R2) ----
export async function getArquivos() {
  const r = await fetch(`${API}/files`);
  if (!r.ok) throw new Error("Erro ao buscar arquivos");
  return r.json();
}

export async function uploadArquivo(file) {
  const form = new FormData();
  form.append("file", file); // a chave precisa ser "file" (FastAPI UploadFile)

  const r = await fetch(`${API}/upload`, {
    method: "POST",
    body: form,
  });
  if (!r.ok) throw new Error("Erro no upload");
  return r.json();
}

export async function getDownloadUrl(filename) {
  const r = await fetch(`${API}/download/${encodeURIComponent(filename)}`);
  if (!r.ok) throw new Error("Erro ao gerar URL de download");
  return r.json(); // { url }
}

export async function deleteArquivo(filename) {
  const r = await fetch(`${API}/delete/${encodeURIComponent(filename)}`, {
    method: "DELETE",
  });
  if (!r.ok) throw new Error("Erro ao apagar arquivo");
  return r.json();
}

// ---- Autenticação ----
export async function register(email, password) {
  const r = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  // backend retorna { id, email } em caso de sucesso
  if (!r.ok) {
    // tenta extrair mensagem do backend (detail)
    let msg = "Falha ao cadastrar";
    try {
      const data = await r.json();
      msg = data?.detail || msg;
    } catch {}
    throw new Error(msg);
  }
  return r.json();
}

export async function login(email, password) {
  const r = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  // backend retorna { ok, message, user: { id, email } }
  if (!r.ok) {
    let msg = "Falha ao fazer login";
    try {
      const data = await r.json();
      msg = data?.detail || msg;
    } catch {}
    throw new Error(msg);
  }
  return r.json();
}
