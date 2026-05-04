import { Outlet, NavLink } from 'react-router-dom'
import './JDGDMainLayout.css'

const JDGDNavItems = [
  { to: '/dashboard',    label: 'Dashboard',     icon: '▦' },
  { to: '/personas',     label: 'Personas',       icon: '◯' },
  { to: '/prestamos',    label: 'Préstamos',      icon: '▭' },
  { to: '/movimientos',  label: 'Movimientos',    icon: '⇄' },
  { to: '/gastos',       label: 'Gastos',         icon: '◷' },
]

const JDGDMainLayout = () => (
  <div className="JDGD-layout">
    <aside className="JDGD-sidebar">
      <div className="JDGD-sidebar-logo">
        <div className="JDGD-brand">FinPréstamos</div>
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
          <div className="JDGD-user-name">Juan López</div>
          <div className="JDGD-user-role">Administrador</div>
        </div>
      </div>
    </aside>

    <main className="JDGD-main">
      <div className="JDGD-content">
        <Outlet />
      </div>
    </main>
  </div>
)

export default JDGDMainLayout