import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { MdDashboard, MdPeople, MdCreditCard, MdSwapHoriz, MdAttachMoney, MdAssessment, MdBusiness } from 'react-icons/md'
import { JDGDUseAuth } from '../../../context/JDGDAuthContext'
import './JDGDMainLayout.css'

const JDGDNavItems = [
  { to: '/dashboard',   label: 'Dashboard',   icon: <MdDashboard /> },
  { to: '/personas',    label: 'Personas',     icon: <MdPeople /> },
  { to: '/prestamos',   label: 'Préstamos',    icon: <MdCreditCard /> },
  { to: '/movimientos', label: 'Movimientos',  icon: <MdSwapHoriz /> },
  { to: '/gastos',      label: 'Gastos',       icon: <MdAttachMoney /> },
  { to: '/sociedades',  label: 'Sociedades',   icon: <MdBusiness /> },
  { to: '/reportes',    label: 'Reportes',     icon: <MdAssessment /> },
]

const JDGDMainLayout = () => {
  const { JDGDUser, JDGDLogout } = JDGDUseAuth()
  const navigate = useNavigate()

  const JDGDHandleLogout = async () => {
    await JDGDLogout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="JDGD-layout">
      <aside className="JDGD-sidebar">
        <div className="JDGD-sidebar-logo">
          <div className="JDGD-brand">Crédito Ágil</div>
          <div className="JDGD-brand-sub">Sistema de créditos</div>
        </div>

        <nav className="JDGD-nav">
          <div className="JDGD-nav-section">Principal</div>
          {JDGDNavItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `JDGD-nav-item ${isActive ? 'JDGD-nav-item--active' : ''}`}
            >
              <span className="JDGD-nav-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="JDGD-sidebar-footer">
          <div className="JDGD-user-info">
            <div className="JDGD-user-name">{JDGDUser?.nombres}</div>
            <div className="JDGD-user-role">{JDGDUser?.rol}</div>
          </div>
          <button className="JDGD-logout-btn" onClick={JDGDHandleLogout}>
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="JDGD-main">
        <div className="JDGD-content">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default JDGDMainLayout