import '../../../styles/JDGDAuth.css'

const JDGDAuthTemplate = ({ children }) => (
  <div className="JDGD-auth-layout">
    <div className="JDGD-auth-card">
      <div className="JDGD-auth-brand">
        <div className="JDGD-auth-brand-name">Crédito Ágil</div>
        <div className="JDGD-auth-brand-sub">Sistema de gestión de créditos</div>
      </div>
      {children}
    </div>
  </div>
)

export default JDGDAuthTemplate