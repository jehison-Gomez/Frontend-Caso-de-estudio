import { Navigate } from 'react-router-dom'
import { JDGDUseAuth } from '../../../context/JDGDAuthContext'

const JDGDProtectedRoute = ({ children, roles }) => {
  const { JDGDUser } = JDGDUseAuth()

  if (!JDGDUser) return <Navigate to="/login" replace />

  if (roles && !roles.includes(JDGDUser.rol)) {
    if (JDGDUser.rol === 'cliente') return <Navigate to="/cliente/prestamos" replace />
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default JDGDProtectedRoute