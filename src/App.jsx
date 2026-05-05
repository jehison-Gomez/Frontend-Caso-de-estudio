import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { JDGDAuthProvider } from './context/JDGDAuthContext'
import JDGDProtectedRoute from './components/atoms/JDGDProtectedRoute/JDGDProtectedRoute'
import JDGDMainLayout from './components/organisms/JDGDMainLayout/JDGDMainLayout'
import JDGDClienteLayout from './components/organisms/JDGDClienteLayout/JDGDClienteLayout'
import JDGDLoginPage from './pages/JDGDLoginPage'
import JDGDDashboardPage from './pages/admin/JDGDDashboardPage'
import JDGDPersonasPage from './pages/admin/JDGDPersonasPage'
import JDGDPrestamosPage from './pages/admin/JDGDPrestamosPage'
import JDGDCuotasPage from './pages/admin/JDGDCuotasPage'
import JDGDMovimientosPage from './pages/admin/JDGDMovimientosPage'
import JDGDGastosPage from './pages/admin/JDGDGastosPage'
import JDGDClientePrestamosPage from './pages/cliente/JDGDClientePrestamosPage'
import JDGDClienteCuotasPage from './pages/cliente/JDGDClienteCuotasPage'
import JDGDReportesPage from './pages/admin/JDGDReportesPage'
import JDGDSociedadesPage from './pages/admin/JDGDSociedadesPage'

function App() {
  return (
    <JDGDAuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<JDGDLoginPage />} />

          <Route path="/" element={
            <JDGDProtectedRoute roles={['admin', 'cobrador']}>
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
            <Route path="reportes"             element={<JDGDReportesPage />} />
            <Route path="sociedades"           element={<JDGDSociedadesPage />} />
          </Route>

          <Route path="/cliente" element={
            <JDGDProtectedRoute roles={['cliente']}>
              <JDGDClienteLayout />
            </JDGDProtectedRoute>
          }>
            <Route index element={<Navigate to="/cliente/prestamos" replace />} />
            <Route path="prestamos"              element={<JDGDClientePrestamosPage />} />
            <Route path="prestamos/:id/cuotas"   element={<JDGDClienteCuotasPage />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </JDGDAuthProvider>
  )
}

export default App