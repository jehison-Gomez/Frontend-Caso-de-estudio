import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import JDGDPageHeader from '../../components/molecules/JDGDPageHeader/JDGDPageHeader'
import JDGDDataTable from '../../components/molecules/JDGDDataTable/JDGDDataTable'
import JDGDBadge from '../../components/atoms/JDGDBadge/JDGDBadge'
import JDGDButton from '../../components/atoms/JDGDButton/JDGDButton'
import JDGDModal from '../../components/molecules/JDGDModal/JDGDModal'
import JDGDInput from '../../components/atoms/JDGDInput/JDGDInput'
import JDGDSelect from '../../components/atoms/JDGDSelect/JDGDSelect'
import JDGDUseFetch from '../../hooks/JDGDUseFetch'
import { JDGDGetPrestamos, JDGDCreatePrestamo, JDGDGetPersonas } from '../../services/JDGDApi'
import '../../styles/JDGDCard.css'

const JDGDEstadoColor = { activo: 'green', finalizado: 'blue', 'en mora': 'red', pendiente: 'amber' }
const JDGDEmptyForm = { persona: '', fiador: '', valor_prestado: '', interes: '', tiempo: '', tipo: 'mensual' }

const JDGDPrestamosPage = () => {
  const navigate = useNavigate()
  const { data: prestamos, loading, refetch } = JDGDUseFetch(JDGDGetPrestamos)
  const { data: personas } = JDGDUseFetch(JDGDGetPersonas)
  const [showModal, setShowModal] = useState(false)
  const [saving, setSaving]       = useState(false)
  const [form, setForm]           = useState(JDGDEmptyForm)

  const JDGDHandleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const JDGDValorFuturo = () => {
    const p = parseFloat(form.valor_prestado) || 0
    const i = parseFloat(form.interes) / 100 || 0
    const t = parseInt(form.tiempo) || 0
    return (p * Math.pow(1 + i, t)).toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })
  }

  const JDGDHandleSave = async () => {
    setSaving(true)
    try {
      await JDGDCreatePrestamo(form)
      setShowModal(false)
      refetch()
    } catch (e) { alert(e.message) }
    finally { setSaving(false) }
  }

  const JDGDPersonaOpts = (personas || []).map(p => ({ value: p.id_persona, label: p.nombres }))

  const JDGDColumns = [
    { key: 'id_prestamo',   label: '#',       render: v => <span style={{ color: 'var(--color-text-secondary)', fontWeight: 500 }}>#{v}</span> },
    { key: 'persona',       label: 'Cliente', render: (_, r) => r.persona_nombre || r.persona },
    { key: 'valor_prestado',label: 'Monto',   render: v => Number(v).toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }) },
    { key: 'interes',       label: 'Interés', render: v => `${v}%` },
    { key: 'tiempo',        label: 'Tiempo',  render: v => `${v} m` },
    { key: 'valor_futuro',  label: 'V. futuro', render: v => Number(v).toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }) },
    { key: 'estado',        label: 'Estado',  render: v => <JDGDBadge label={v} variant={JDGDEstadoColor[v] || 'gray'} /> },
    { key: 'cuotas',        label: '',        render: (_, row) => (
        <JDGDButton size="sm" variant="ghost" onClick={e => { e.stopPropagation(); navigate(`/prestamos/${row.id_prestamo}/cuotas`) }}>
          Ver cuotas
        </JDGDButton>
      )
    },
  ]

  return (
    <div>
      <JDGDPageHeader
        title="Préstamos"
        action={<JDGDButton variant="primary" onClick={() => setShowModal(true)}>+ Nuevo préstamo</JDGDButton>}
      />
      <div className="JDGD-card">
        {loading
          ? <p style={{ padding: 24, color: 'var(--color-text-secondary)' }}>Cargando...</p>
          : <JDGDDataTable columns={JDGDColumns} data={prestamos || []} />
        }
      </div>

      {showModal && (
        <JDGDModal title="Nuevo préstamo" onClose={() => setShowModal(false)} onConfirm={JDGDHandleSave} loading={saving}>
          <JDGDSelect label="Cliente"          name="persona"        value={form.persona}        onChange={JDGDHandleChange} options={JDGDPersonaOpts} required />
          <JDGDSelect label="Fiador (opcional)"name="fiador"         value={form.fiador}         onChange={JDGDHandleChange} options={JDGDPersonaOpts} />
          <JDGDInput  label="Monto prestado"   name="valor_prestado" value={form.valor_prestado} onChange={JDGDHandleChange} type="number" required />
          <JDGDInput  label="Interés mensual %" name="interes"       value={form.interes}        onChange={JDGDHandleChange} type="number" required />
          <JDGDInput  label="Plazo (meses)"    name="tiempo"         value={form.tiempo}         onChange={JDGDHandleChange} type="number" required />
          {form.valor_prestado && form.interes && form.tiempo && (
            <div style={{ padding: '8px 12px', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)', fontSize: 12 }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>Valor futuro estimado: </span>
              <strong>{JDGDValorFuturo()}</strong>
            </div>
          )}
        </JDGDModal>
      )}
    </div>
  )
}

export default JDGDPrestamosPage