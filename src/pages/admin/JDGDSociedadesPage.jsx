import { useState } from 'react'
import JDGDPageHeader from '../../components/molecules/JDGDPageHeader/JDGDPageHeader'
import JDGDDataTable from '../../components/molecules/JDGDDataTable/JDGDDataTable'
import JDGDButton from '../../components/atoms/JDGDButton/JDGDButton'
import JDGDModal from '../../components/molecules/JDGDModal/JDGDModal'
import JDGDInput from '../../components/atoms/JDGDInput/JDGDInput'
import JDGDUseFetch from '../../hooks/JDGDUseFetch'
import {
  JDGDGetSociedades,
  JDGDCreateSociedad,
  JDGDUpdateSociedad,
  JDGDDeleteSociedad,
} from '../../services/JDGDApi'
import '../../styles/JDGDCard.css'

const JDGD_EMPTY_FORM = { sociedad: '', caja: '' }

const JDGDSociedadesPage = () => {
  const { data: sociedades, loading, refetch } = JDGDUseFetch(JDGDGetSociedades)
  const [showModal,  setShowModal]  = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [saving,     setSaving]     = useState(false)
  const [form,       setForm]       = useState(JDGD_EMPTY_FORM)

  const JDGDHandleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const JDGDOpenCreate = () => {
    setEditTarget(null)
    setForm(JDGD_EMPTY_FORM)
    setShowModal(true)
  }

  const JDGDOpenEdit = (row) => {
    setEditTarget(row)
    setForm({ sociedad: row.sociedad || '', caja: row.caja || '' })
    setShowModal(true)
  }

  const JDGDHandleSave = async () => {
    setSaving(true)
    try {
      if (editTarget) {
        await JDGDUpdateSociedad(editTarget.id_sociedad, form)
      } else {
        await JDGDCreateSociedad(form)
      }
      setShowModal(false)
      refetch()
    } catch (e) {
      alert(e.message)
    } finally {
      setSaving(false)
    }
  }

  const JDGDHandleDelete = async (row) => {
    if (!confirm(`¿Eliminar la sociedad "${row.sociedad}"?`)) return
    try {
      await JDGDDeleteSociedad(row.id_sociedad)
      refetch()
    } catch (e) {
      alert(e.message)
    }
  }

  const JDGDColumns = [
    { key: 'id_sociedad', label: '#', render: (v) => <span style={{ color: 'var(--color-text-secondary)', fontWeight: 500 }}>#{v}</span> },
    { key: 'sociedad',    label: 'Nombre' },
    { key: 'caja',        label: 'Caja' },
    {
      key: 'acc',
      label: '',
      render: (_, row) => (
        <div style={{ display: 'flex', gap: 6 }}>
          <JDGDButton size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); JDGDOpenEdit(row) }}>
            Editar
          </JDGDButton>
          <JDGDButton size="sm" variant="danger" onClick={(e) => { e.stopPropagation(); JDGDHandleDelete(row) }}>
            Eliminar
          </JDGDButton>
        </div>
      ),
    },
  ]

  return (
    <div>
      <JDGDPageHeader
        title="Sociedades"
        action={<JDGDButton variant="primary" onClick={JDGDOpenCreate}>+ Nueva sociedad</JDGDButton>}
      />

      <div className="JDGD-card">
        {loading
          ? <p style={{ padding: 24, color: 'var(--color-text-secondary)' }}>Cargando...</p>
          : <JDGDDataTable columns={JDGDColumns} data={sociedades || []} />
        }
      </div>

      {showModal && (
        <JDGDModal
          title={editTarget ? 'Editar sociedad' : 'Nueva sociedad'}
          onClose={() => setShowModal(false)}
          onConfirm={JDGDHandleSave}
          loading={saving}
        >
          <JDGDInput
            label="Nombre de la sociedad"
            name="sociedad"
            value={form.sociedad}
            onChange={JDGDHandleChange}
            required
          />
          <JDGDInput
            label="Caja"
            name="caja"
            value={form.caja}
            onChange={JDGDHandleChange}
            type="number"
            required
          />
        </JDGDModal>
      )}
    </div>
  )
}

export default JDGDSociedadesPage
