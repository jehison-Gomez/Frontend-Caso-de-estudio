import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { JDGDUseAuth } from '../../context/JDGDAuthContext'
import JDGDUseFetch from '../../hooks/JDGDUseFetch'
import JDGDBadge from '../../components/atoms/JDGDBadge/JDGDBadge'
import JDGDButton from '../../components/atoms/JDGDButton/JDGDButton'
import JDGDModal from '../../components/molecules/JDGDModal/JDGDModal'
import JDGDInput from '../../components/atoms/JDGDInput/JDGDInput'
import JDGDSelect from '../../components/atoms/JDGDSelect/JDGDSelect'
import JDGDMetricCard from '../../components/molecules/JDGDMetricCard/JDGDMetricCard'
import { JDGDGetPrestamos, JDGDCreatePrestamo } from '../../services/JDGDApi'
import '../../styles/JDGDCard.css'
import './JDGDClientePage.css'

const JDGD_TIPO_OPTS = [
  { value: 'mensual',  label: 'Mensual' },
  { value: 'semanal',  label: 'Semanal' },
  { value: 'diario',   label: 'Diario' },
]

const JDGDEstadoColor = { activo: 'green', finalizado: 'blue', mora: 'red', pendiente: 'amber' }

const JDGDEmptyForm = { valor_prestado: '', interes: '', tiempo: '', tipo: 'mensual' }

const JDGDClientePrestamosPage = () => {
  const navigate = useNavigate()
  const { JDGDUser } = JDGDUseAuth()
  const { data: todos, loading, refetch } = JDGDUseFetch(JDGDGetPrestamos)
  const [showModal, setShowModal] = useState(false)
  const [saving, setSaving]       = useState(false)
  const [form, setForm]           = useState(JDGDEmptyForm)

  // Filtrar solo los préstamos del cliente logueado
  const JDGDMisPrestamos = (todos || []).filter(p => p.persona === JDGDUser?.id_persona || p.persona_id === JDGDUser?.id_persona)

  const JDGDHandleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const JDGDValorFuturo = () => {
    const p = parseFloat(form.valor_prestado) || 0
    const i = parseFloat(form.interes) / 100 || 0
    const t = parseInt(form.tiempo) || 0
    return (p * (1 + i * t)).toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })
  }

  const JDGDHandleSave = async () => {
    setSaving(true)
    try {
      await JDGDCreatePrestamo({ ...form, persona: JDGDUser?.id_persona })
      setShowModal(false)
      setForm(JDGDEmptyForm)
      refetch()
    } catch (e) { alert(e.message) }
    finally { setSaving(false) }
  }

  const JDGDFmt = n => Number(n).toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })

  const JDGDActivos   = JDGDMisPrestamos.filter(p => p.estado === 'activo').length
  const JDGDEnMora    = JDGDMisPrestamos.filter(p => p.estado === 'mora').length
  const JDGDDeudaTotal = JDGDMisPrestamos.filter(p => p.estado !== 'finalizado').reduce((s, p) => s + Number(p.valor_futuro), 0)

  return (
    <div>
      <div className="JDGD-cliente-page-header">
        <div>
          <h1 className="JDGD-cliente-page-title">Mis préstamos</h1>
          <p className="JDGD-cliente-page-sub">Bienvenido, {JDGDUser?.nombres}</p>
        </div>
        <JDGDButton variant="primary" onClick={() => setShowModal(true)}>
          + Solicitar préstamo
        </JDGDButton>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 20 }}>
        <JDGDMetricCard label="Préstamos activos" value={JDGDActivos} />
        <JDGDMetricCard label="Deuda total" value={JDGDFmt(JDGDDeudaTotal)} subColor="var(--color-warning)" />
        <JDGDMetricCard label="En mora" value={JDGDEnMora} subColor={JDGDEnMora > 0 ? "var(--color-danger)" : "var(--color-success)"} />
      </div>

      {loading
        ? <p style={{ color: 'var(--color-text-secondary)' }}>Cargando...</p>
        : JDGDMisPrestamos.length === 0
          ? <div className="JDGD-cliente-empty">
              <p>No tienes préstamos activos.</p>
              <JDGDButton variant="primary" onClick={() => setShowModal(true)}>Solicitar mi primer préstamo</JDGDButton>
            </div>
          : <div className="JDGD-cliente-prestamos-grid">
              {JDGDMisPrestamos.map(p => (
                <div key={p.id_prestamo} className="JDGD-prestamo-card">
                  <div className="JDGD-prestamo-card-header">
                    <span className="JDGD-prestamo-card-num">Préstamo #{p.id_prestamo}</span>
                    <JDGDBadge label={p.estado} variant={JDGDEstadoColor[p.estado] || 'gray'} />
                  </div>
                  <div className="JDGD-prestamo-card-body">
                    <div className="JDGD-prestamo-card-row">
                      <span>Monto prestado</span>
                      <strong>{JDGDFmt(p.valor_prestado)}</strong>
                    </div>
                    <div className="JDGD-prestamo-card-row">
                      <span>Total a pagar</span>
                      <strong>{JDGDFmt(p.valor_futuro)}</strong>
                    </div>
                    <div className="JDGD-prestamo-card-row">
                      <span>Interés</span>
                      <strong>{p.interes}%</strong>
                    </div>
                    <div className="JDGD-prestamo-card-row">
                      <span>Plazo</span>
                      <strong>{p.tiempo} meses</strong>
                    </div>
                  </div>
                  <div className="JDGD-prestamo-card-footer">
                    <JDGDButton
                      variant="ghost"
                      onClick={() => navigate(`/cliente/prestamos/${p.id_prestamo}/cuotas`)}
                    >
                      Ver mis cuotas →
                    </JDGDButton>
                  </div>
                </div>
              ))}
            </div>
      }

      {showModal && (
        <JDGDModal
          title="Solicitar préstamo"
          onClose={() => setShowModal(false)}
          onConfirm={JDGDHandleSave}
          confirmLabel="Solicitar"
          loading={saving}
        >
          <JDGDInput  label="Monto a solicitar"  name="valor_prestado" value={form.valor_prestado} onChange={JDGDHandleChange} type="number" required />
          <JDGDInput  label="Interés mensual %"  name="interes"        value={form.interes}        onChange={JDGDHandleChange} type="number" required />
          <JDGDInput  label="Plazo (meses)"      name="tiempo"         value={form.tiempo}         onChange={JDGDHandleChange} type="number" required />
          <JDGDSelect label="Tipo de pago"       name="tipo"           value={form.tipo}           onChange={JDGDHandleChange} options={JDGD_TIPO_OPTS} />
          {form.valor_prestado && form.interes && form.tiempo && (
            <div style={{ padding: '8px 12px', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)', fontSize: 12 }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>Total a pagar estimado: </span>
              <strong>{JDGDValorFuturo()}</strong>
            </div>
          )}
        </JDGDModal>
      )}
    </div>
  )
}

export default JDGDClientePrestamosPage