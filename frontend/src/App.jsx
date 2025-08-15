// App principal: define rotas e proteção simples de rota
// - '/' -> Login
// - '/register' -> Cadastro
// - '/arquivos' -> Página protegida que só abre se existir 'user' no localStorage
// A proteção aqui é apenas um exemplo; para produção troque por verificação de JWT.
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Arquivos from "./pages/Arquivos"; // sua página principal

function Protected({ children }) {
  const user = localStorage.getItem("user");
  return user ? children : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/arquivos"
          element={
            <Protected>
              <Arquivos />
            </Protected>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
