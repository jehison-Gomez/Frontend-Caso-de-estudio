import { createContext, useContext, useState } from 'react'
import { JDGDLogoutApi } from '../services/JDGDApi'

const JDGDAuthContext = createContext(null)

export const JDGDAuthProvider = ({ children }) => {
  // Solo guardamos el user en estado (no el token — ese vive en la cookie)
  const [JDGDUser, setJDGDUser] = useState(() => {
    const saved = localStorage.getItem('JDGD_user')
    return saved ? JSON.parse(saved) : null
  })

  const JDGDLogin = (userData) => {
    // El token ya lo guardó el servidor en la cookie HttpOnly
    // Aquí solo guardamos los datos del usuario para mostrar en UI
    localStorage.setItem('JDGD_user', JSON.stringify(userData))
    setJDGDUser(userData)
  }

  const JDGDLogout = async () => {
    try {
      await JDGDLogoutApi() // le dice al servidor que limpie la cookie
    } catch (_) {}
    localStorage.removeItem('JDGD_user')
    setJDGDUser(null)
  }

  return (
    <JDGDAuthContext.Provider value={{ JDGDUser, JDGDLogin, JDGDLogout }}>
      {children}
    </JDGDAuthContext.Provider>
  )
}

export const JDGDUseAuth = () => useContext(JDGDAuthContext)