const API = import.meta.env.VITE_API_URL; // defina no Render

export async function getArquivos() {
  const r = await fetch(`${API}/files`); // era /arquivos
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
