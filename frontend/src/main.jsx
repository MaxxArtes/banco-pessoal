// Ponto de entrada do aplicativo React. Monta o componente <App /> na div#root
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import "./pages/styles/tokens.css";
import "./pages/styles/base.css";
import "./pages/styles/components.css";


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
