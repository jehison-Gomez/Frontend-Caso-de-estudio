import { useState } from 'react'
import JDGDPageHeader from '../../components/molecules/JDGDPageHeader/JDGDPageHeader'
import JDGDDataTable from '../../components/molecules/JDGDDataTable/JDGDDataTable'
import JDGDBadge from '../../components/atoms/JDGDBadge/JDGDBadge'
import JDGDButton from '../../components/atoms/JDGDButton/JDGDButton'
import JDGDModal from '../../components/molecules/JDGDModal/JDGDModal'
import JDGDInput from '../../components/atoms/JDGDInput/JDGDInput'
import JDGDSelect from '../../components/atoms/JDGDSelect/JDGDSelect'
import JDGDUseFetch from '../../hooks/JDGDUseFetch'
import { JDGDGetGastos, JDGDCreateGasto, JDGDDeleteGasto } from '../../services/JDGDApi'
import '../../styles/JDGDCard.css'

const JDGD_TIPO_OPTS = [
  { value: 'operativo',     label: 'Operativo' },
  { value: 'administrativo',label: 'Administrativo' },
  { value: 'financiero',    label: 'Financiero' },
]

const JDGDEmptyForm = { detalle: '', valor: '', fecha: '' }

const JDGDGastosPage = () => {
  const { data: gastos, loading, refetch } = JDGDUseFetch(JDGDGetGastos)
  const [showModal, setShowModal] = useState(false)
  const [saving, setSaving]       = useState(false)
  const [form, setForm]           = useState(JDGDEmptyForm)

  const JDGDHandleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const JDGDHandleSave = async () => {
    setSaving(true)
    try { await JDGDCreateGasto(form); setShowModal(false); refetch() }
    catch (e) { alert(e.message) }
    finally { setSaving(false) }
  }

  const JDGDHandleDelete = async row => {
    if (!confirm(`¿Eliminar gasto "${row.detalle}"?`)) return
    try { await JDGDDeleteGasto(row.id_gasto); refetch() }
    catch (e) { alert(e.message) }
  }

  const JDGDColumns = [
    { key: 'fecha',   label: 'Fecha' },
    { key: 'detalle', label: 'Detalle' },
    { key: 'valor',   label: 'Valor',  render: v => <span style={{ color:'var(--color-danger)',fontWeight:500 }}>-{Number(v).toLocaleString('es-CO',{style:'currency',currency:'COP',minimumFractionDigits:0})}</span> },
    { key: 'estado',  label: 'Estado', render: v => <JDGDBadge label={v} variant={v === 'aprobado' ? 'green' : 'amber'} /> },
    { key: 'acc',     label: '', render: (_, row) => <JDGDButton size="sm" variant="danger" onClick={e => { e.stopPropagation(); JDGDHandleDelete(row) }}>Eliminar</JDGDButton> },
  ]

  return (
    <div>
      <JDGDPageHeader
        title="Gastos operativos"
        action={<JDGDButton variant="primary" onClick={() => setShowModal(true)}>+ Nuevo gasto</JDGDButton>}
      />
      <div className="JDGD-card">
        {loading
          ? <p style={{ padding: 24, color: 'var(--color-text-secondary)' }}>Cargando...</p>
          : <JDGDDataTable columns={JDGDColumns} data={gastos || []} />
        }
      </div>
      {showModal && (
        <JDGDModal title="Nuevo gasto" onClose={() => setShowModal(false)} onConfirm={JDGDHandleSave} loading={saving}>
          <JDGDInput  label="Detalle"  name="detalle" value={form.detalle} onChange={JDGDHandleChange} required />
          <JDGDInput  label="Valor"    name="valor"   value={form.valor}   onChange={JDGDHandleChange} type="number" required />
          <JDGDInput  label="Fecha"    name="fecha"   value={form.fecha}   onChange={JDGDHandleChange} type="date" required />
        </JDGDModal>
      )}
    </div>
  )
}

export default JDGDGastosPage