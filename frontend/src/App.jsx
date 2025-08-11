import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [files, setFiles] = useState([]);
  const [file, setFile] = useState(null);

  const fetchFiles = async () => {
    try {
      const res = await axios.get(`${API_URL}/files`);
      setFiles(res.data.arquivos || []);
    } catch {
      setFiles([]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      await axios.post(`${API_URL}/upload`, formData);
      setFile(null);
      fetchFiles();
    } catch {}
  };

  const handleDownload = async (filename) => {
    try {
      const res = await axios.get(`${API_URL}/download/${encodeURIComponent(filename)}`);
      window.open(res.data.url, '_blank');
    } catch {}
  };

  const handleDelete = async (filename) => {
    try {
      await axios.delete(`${API_URL}/delete/${encodeURIComponent(filename)}`);
      fetchFiles();
    } catch {}
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div style={{
      maxWidth: 600,
      width: '100%',
      background: '#fff',
      borderRadius: 12,
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      padding: '2rem',
    }}>
      <h1>Banco Pessoal de Arquivos</h1>

      <form onSubmit={handleUpload} style={{ display: 'flex', gap: 16, marginBottom: 24, alignItems: 'center' }}>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button type="submit">Enviar arquivo</button>
      </form>

      <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: 12 }}>Arquivos armazenados:</h2>
      <ul>
        {files.length === 0 && <li>Nenhum arquivo enviado ainda.</li>}
        {files.map((f) => (
          <li key={f}>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 220, display: 'inline-block' }}>{f}</span>
            <div>
              <button onClick={() => handleDownload(f)} style={{ background: '#22c55e', marginRight: 8 }}>Baixar</button>
              <button onClick={() => handleDelete(f)} style={{ background: '#ef4444' }}>Deletar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
