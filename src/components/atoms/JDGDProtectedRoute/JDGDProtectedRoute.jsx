import { Navigate } from 'react-router-dom'
import { JDGDUseAuth } from '../../../context/JDGDAuthContext'

const JDGDProtectedRoute = ({ children }) => {
  const { JDGDUser } = JDGDUseAuth()
  return JDGDUser ? children : <Navigate to="/login" replace />
}

export default JDGDProtectedRoute