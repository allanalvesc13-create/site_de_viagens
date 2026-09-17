import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import DestinosPage from './pages/destinos.jsx'
import PassagensPage from './pages/passagens.jsx'
import OfertasPage from './pages/ofertas.jsx'
import ServicosPage from './pages/servicos.jsx'
import SobrePage from './pages/sobre.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />} />
        <Route path='/destinos' element={<DestinosPage />} />
        <Route path='/passagens' element={<PassagensPage />} />
        <Route path='/ofertas' element={<OfertasPage />} />
        <Route path='/servicos' element={<ServicosPage />} />
        <Route path='/sobre' element={<SobrePage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
