import './JDGDModal.css'
import JDGDButton from '../../atoms/JDGDButton/JDGDButton'

const JDGDModal = ({ title, children, onClose, onConfirm, confirmLabel = 'Guardar', loading = false }) => (
  <div className="JDGD-modal-overlay" onClick={onClose}>
    <div className="JDGD-modal" onClick={e => e.stopPropagation()}>
      <div className="JDGD-modal-header">
        <span className="JDGD-modal-title">{title}</span>
        <button className="JDGD-modal-close" onClick={onClose}>✕</button>
      </div>
      <div className="JDGD-modal-body">{children}</div>
      <div className="JDGD-modal-footer">
        <JDGDButton variant="default" onClick={onClose}>Cancelar</JDGDButton>
        <JDGDButton variant="primary" onClick={onConfirm} disabled={loading}>
          {loading ? 'Guardando...' : confirmLabel}
        </JDGDButton>
      </div>
    </div>
  </div>
)

export default JDGDModal