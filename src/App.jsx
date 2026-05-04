import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { JDGDAuthProvider } from './context/JDGDAuthContext'
import JDGDProtectedRoute from './components/atoms/JDGDProtectedRoute/JDGDProtectedRoute'
import JDGDMainLayout from './components/organisms/JDGDMainLayout/JDGDMainLayout'
import JDGDLoginPage from './pages/JDGDLoginPage'
import JDGDDashboardPage from './pages/JDGDDashboardPage'
import JDGDPersonasPage from './pages/JDGDPersonasPage'
import JDGDPrestamosPage from './pages/JDGDPrestamosPage'
import JDGDCuotasPage from './pages/JDGDCuotasPage'
import JDGDMovimientosPage from './pages/JDGDMovimientosPage'
import JDGDGastosPage from './pages/JDGDGastosPage'

function App() {
  return (
    <JDGDAuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<JDGDLoginPage />} />
          <Route path="/" element={
            <JDGDProtectedRoute>
              <JDGDMainLayout />
            </JDGDProtectedRoute>
          }>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard"            element={<JDGDDashboardPage />} />
            <Route path="personas"             element={<JDGDPersonasPage />} />
            <Route path="prestamos"            element={<JDGDPrestamosPage />} />
            <Route path="prestamos/:id/cuotas" element={<JDGDCuotasPage />} />
            <Route path="movimientos"          element={<JDGDMovimientosPage />} />
            <Route path="gastos"               element={<JDGDGastosPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </JDGDAuthProvider>
  )
}

export default App