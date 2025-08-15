import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Rota protegida: só abre se tiver user no localStorage
function Protected({ children }) {
  const user = localStorage.getItem("user");
  if (!user) return <Navigate to="/" replace />; // volta pro login
  return children;
}

function Home() {
  const navigate = useNavigate();
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  function logout() {
    localStorage.removeItem("user");
    navigate("/");
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Home</h1>
      {user ? (
        <>
          <p>Você está logado como: {user.email}</p>
          <button onClick={logout}>Sair</button>
        </>
      ) : (
        <>
          <p>Você não está logado.</p>
          <Link to="/">Entrar</Link> | <Link to="/register">Cadastrar</Link>
        </>
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login na raiz */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Home protegida */}
        <Route
          path="/home"
          element={
            <Protected>
              <Home />
            </Protected>
          }
        />
        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
