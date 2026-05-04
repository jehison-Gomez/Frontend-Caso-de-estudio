import { useState } from 'react'
import JDGDPageHeader from '../components/molecules/JDGDPageHeader/JDGDPageHeader'
import JDGDDataTable from '../components/molecules/JDGDDataTable/JDGDDataTable'
import JDGDBadge from '../components/atoms/JDGDBadge/JDGDBadge'
import JDGDButton from '../components/atoms/JDGDButton/JDGDButton'
import JDGDModal from '../components/molecules/JDGDModal/JDGDModal'
import JDGDInput from '../components/atoms/JDGDInput/JDGDInput'
import JDGDSelect from '../components/atoms/JDGDSelect/JDGDSelect'
import JDGDUseFetch from '../hooks/JDGDUseFetch'
import { JDGDGetPersonas, JDGDCreatePersona, JDGDUpdatePersona, JDGDDeletePersona } from '../services/JDGDApi'
import '../styles/JDGDCard.css'

const JDGD_ROL_OPTS = [
  { value: 'admin', label: 'Administrador' },
  { value: 'cliente',       label: 'Cliente' },
  { value: 'cobrador',      label: 'Cobrador' },
]
const JDGD_CAL_OPTS = [
  { value: '100', label: '100' },
  { value: '75', label: '75' },
  { value: '50',   label: '50' },
  { value: '25',  label: '25' },
  { value: '10',   label: '10' },
]

const JDGDEmptyForm = { nombres: '', identificacion: '', direccion: '', telefono: '', calificacion: '75', rol: 'cliente', observacion: '', password: '' }

const JDGDCalColor = { AAA: 'green', AA: 'green', A: 'blue', B: 'amber', C: 'red' }
const JDGDRolColor = { administrador: 'purple', cliente: 'blue', cobrador: 'gray' }

const JDGDPersonasPage = () => {
  const { data: personas, loading, error, refetch } = JDGDUseFetch(JDGDGetPersonas)
  const [showModal, setShowModal]   = useState(false)
  const [saving, setSaving]         = useState(false)
  const [form, setForm]             = useState(JDGDEmptyForm)
  const [editId, setEditId]         = useState(null)

  const JDGDHandleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const JDGDOpenNew = () => { setForm(JDGDEmptyForm); setEditId(null); setShowModal(true) }
  const JDGDOpenEdit = row => { setForm({ ...row }); setEditId(row.id_persona); setShowModal(true) }

  const JDGDHandleSave = async () => {
    setSaving(true)
    try {
      if (editId) await JDGDUpdatePersona(editId, form)
      else await JDGDCreatePersona(form)
      setShowModal(false)
      refetch()
    } catch (e) { alert(e.message) }
    finally { setSaving(false) }
  }

  const JDGDHandleDelete = async (row) => {
    if (!confirm(`¿Eliminar a ${row.nombres}?`)) return
    try { await JDGDDeletePersona(row.id_persona); refetch() }
    catch (e) { alert(e.message) }
  }

  const JDGDColumns = [
    { key: 'nombres',        label: 'Nombre' },
    { key: 'identificacion', label: 'Identificación' },
    { key: 'telefono',       label: 'Teléfono' },
    { key: 'calificacion',   label: 'Calificación', render: v => <JDGDBadge label={v} variant={JDGDCalColor[v] || 'gray'} /> },
    { key: 'rol',            label: 'Rol',          render: v => <JDGDBadge label={v} variant={JDGDRolColor[v] || 'gray'} /> },
    { key: 'estado',         label: 'Estado',       render: v => <JDGDBadge label={v} variant={v === 'activo' ? 'green' : 'amber'} /> },
    { key: 'acciones',       label: '', render: (_, row) => (
        <div style={{ display: 'flex', gap: 6 }}>
          <JDGDButton size="sm" onClick={e => { e.stopPropagation(); JDGDOpenEdit(row) }}>Editar</JDGDButton>
          <JDGDButton size="sm" variant="danger" onClick={e => { e.stopPropagation(); JDGDHandleDelete(row) }}>Eliminar</JDGDButton>
        </div>
      )
    },
  ]

  return (
    <div>
      <JDGDPageHeader
        title="Personas"
        action={<JDGDButton variant="primary" onClick={JDGDOpenNew}>+ Nueva persona</JDGDButton>}
      />

      {error && <p style={{ color: 'var(--color-danger)', marginBottom: 12 }}>{error}</p>}

      <div className="JDGD-card">
        {loading
          ? <p style={{ padding: 24, color: 'var(--color-text-secondary)' }}>Cargando...</p>
          : <JDGDDataTable columns={JDGDColumns} data={personas || []} />
        }
      </div>

      {showModal && (
        <JDGDModal
          title={editId ? 'Editar persona' : 'Nueva persona'}
          onClose={() => setShowModal(false)}
          onConfirm={JDGDHandleSave}
          loading={saving}
        >
          <JDGDInput label="Nombre completo" name="nombres"        value={form.nombres}        onChange={JDGDHandleChange} required />
          <JDGDInput label="Identificación"  name="identificacion" value={form.identificacion} onChange={JDGDHandleChange} required />
          <JDGDInput label="Teléfono"        name="telefono"       value={form.telefono}       onChange={JDGDHandleChange} />
          <JDGDInput label="Dirección"       name="direccion"      value={form.direccion}      onChange={JDGDHandleChange} />
          <JDGDSelect label="Calificación"   name="calificacion"   value={form.calificacion}   onChange={JDGDHandleChange} options={JDGD_CAL_OPTS} />
          <JDGDSelect label="Rol"            name="rol"            value={form.rol}            onChange={JDGDHandleChange} options={JDGD_ROL_OPTS} />
          <JDGDInput label="Observación"     name="observacion"    value={form.observacion}    onChange={JDGDHandleChange} />
          {!editId && (
            <JDGDInput label="Contraseña" name="password" type="password" value={form.password} onChange={JDGDHandleChange} required />
          )}
          {editId && (
            <JDGDSelect label="Estado" name="estado" value={form.estado} onChange={JDGDHandleChange} options={[
              { value: 'activo',      label: 'Activo' },
              { value: 'inactivo',    label: 'Inactivo' },
            ]} />
          )}
        </JDGDModal>
      )}
    </div>
  )
}

export default JDGDPersonasPage