// src/api.js
const API_URL = "http://localhost:8000";

export async function getArquivos() {
  const response = await fetch(`${API_URL}/arquivos`);
  if (!response.ok) throw new Error("Erro ao buscar arquivos");
  return await response.json();
}

export async function uploadArquivo(formData) {
  const response = await fetch(`${API_URL}/upload`, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) throw new Error("Erro no upload");
  return await response.json();
}
