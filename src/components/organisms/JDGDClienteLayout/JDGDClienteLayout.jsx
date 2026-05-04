import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { JDGDUseAuth } from '../../../context/JDGDAuthContext'
import './JDGDClienteLayout.css'

const JDGDClienteLayout = () => {
  const { JDGDUser, JDGDLogout } = JDGDUseAuth()
  const navigate = useNavigate()

  const JDGDHandleLogout = async () => {
    await JDGDLogout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="JDGD-cliente-layout">
      <header className="JDGD-cliente-header">
        <div className="JDGD-cliente-brand">
          <div className="JDGD-cliente-brand-name">Crédito Ágil</div>
          <div className="JDGD-cliente-brand-sub">Portal del cliente</div>
        </div>
        <nav className="JDGD-cliente-nav">
          <NavLink
            to="/cliente/prestamos"
            className={({ isActive }) => `JDGD-cliente-nav-item ${isActive ? 'JDGD-cliente-nav-item--active' : ''}`}
          >
            Mis préstamos
          </NavLink>
        </nav>
        <div className="JDGD-cliente-user">
          <div className="JDGD-cliente-user-info">
            <div className="JDGD-cliente-user-name">{JDGDUser?.nombres}</div>
            <div className="JDGD-cliente-user-role">Cliente</div>
          </div>
          <button className="JDGD-cliente-logout" onClick={JDGDHandleLogout}>
            Cerrar sesión
          </button>
        </div>
      </header>
      <main className="JDGD-cliente-main">
        <div className="JDGD-cliente-content">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default JDGDClienteLayout