import { useState, useMemo } from 'react'
import JDGDPageHeader from '../../components/molecules/JDGDPageHeader/JDGDPageHeader'
import JDGDDataTable from '../../components/molecules/JDGDDataTable/JDGDDataTable'
import JDGDBadge from '../../components/atoms/JDGDBadge/JDGDBadge'
import JDGDButton from '../../components/atoms/JDGDButton/JDGDButton'
import JDGDModal from '../../components/molecules/JDGDModal/JDGDModal'
import JDGDInput from '../../components/atoms/JDGDInput/JDGDInput'
import JDGDSelect from '../../components/atoms/JDGDSelect/JDGDSelect'
import JDGDUseFetch from '../../hooks/JDGDUseFetch'
import {
  JDGDGetGastos,
  JDGDCreateGasto,
  JDGDUpdateGasto,
  JDGDDeleteGasto,
  JDGDGetSociedades,
} from '../../services/JDGDApi'
import '../../styles/JDGDCard.css'
import '../../styles/JDGDFilters.css'



const JDGD_ESTADO_OPTS = [
  { value: 'activo',   label: 'Activo' },
  { value: 'inactivo', label: 'Inactivo' },
]

const JDGD_EMPTY_FORM = {
  detalle:  '',
  valor:    '',
  fecha:    '',
  estado:   'activo',
  sociedad: '',
  caja:     '',
}

const fmtCOP = (v) =>
  Number(v).toLocaleString('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  })

const JDGDGastosPage = () => {
  const { data: gastos,     loading,  refetch }   = JDGDUseFetch(JDGDGetGastos)
  const { data: sociedades, loading: loadingSocs } = JDGDUseFetch(JDGDGetSociedades)

  const [showModal,  setShowModal]  = useState(false)
  const [editTarget, setEditTarget] = useState(null)   // null = crear, objeto = editar
  const [saving,     setSaving]     = useState(false)
  const [form,       setForm]       = useState(JDGD_EMPTY_FORM)

  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')

  const socOpts = useMemo(
    () =>
      (sociedades || []).map((s) => ({
        value: s.id_sociedad,
        label: s.sociedad,
        caja:  s.caja,
      })),
    [sociedades]
  )

  // Al cambiar sociedad → auto-rellenar caja
  const JDGDHandleSociedadChange = (e) => {
    const idSoc = e.target.value
    const soc   = (sociedades || []).find((s) => String(s.id_sociedad) === String(idSoc))
    setForm((f) => ({ ...f, sociedad: idSoc, caja: soc ? soc.caja : '' }))
  }

  const datosFiltrados = useMemo(() => {
    const lista = gastos || []
    return lista.filter((g) => {
      const fecha = new Date(g.fecha)
      const desde = fechaDesde ? new Date(fechaDesde) : null
      const hasta = fechaHasta ? new Date(fechaHasta) : null
      if (desde && fecha < desde) return false
      if (hasta && fecha > hasta) return false
      return true
    })
  }, [gastos, fechaDesde, fechaHasta])

  const totalVisible = useMemo(
    () => datosFiltrados.reduce((s, g) => s + Number(g.valor), 0),
    [datosFiltrados]
  )

  const JDGDHandleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const JDGDOpenCreate = () => {
    setEditTarget(null)
    setForm(JDGD_EMPTY_FORM)
    setShowModal(true)
  }

  const JDGDOpenEdit = (row) => {
    setEditTarget(row)
    setForm({
      detalle:  row.detalle  || '',
      valor:    row.valor    || '',
      fecha:    row.fecha    || '',
      estado:   row.estado   || 'activo',
      sociedad: '',
      caja:     '',
    })
    setShowModal(true)
  }

  const JDGDHandleSave = async () => {
    setSaving(true)
    try {
      if (editTarget) {
        await JDGDUpdateGasto(editTarget.id_gasto, form)
      } else {
        await JDGDCreateGasto(form)
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
    if (!confirm(`¿Eliminar gasto "${row.detalle}"?`)) return
    try {
      await JDGDDeleteGasto(row.id_gasto)
      refetch()
    } catch (e) {
      alert(e.message)
    }
  }

  const JDGDLimpiarFiltros = () => {
    setFechaDesde('')
    setFechaHasta('')
  }

  const JDGDColumns = [
    { key: 'fecha',   label: 'Fecha' },
    { key: 'detalle', label: 'Detalle' },
    {
      key: 'valor',
      label: 'Valor',
      render: (v) => (
        <span style={{ color: 'var(--color-danger)', fontWeight: 500 }}>
          -{fmtCOP(v)}
        </span>
      ),
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (v) => (
        <JDGDBadge
          label={v}
          variant={v === 'activo' ? 'green' : 'amber'}
        />
      ),
    },
    {
      key: 'acc',
      label: '',
      render: (_, row) => (
        <div style={{ display: 'flex', gap: 6 }}>
          <JDGDButton
            size="sm"
            variant="secondary"
            onClick={(e) => { e.stopPropagation(); JDGDOpenEdit(row) }}
          >
            Editar
          </JDGDButton>
          <JDGDButton
            size="sm"
            variant="danger"
            onClick={(e) => { e.stopPropagation(); JDGDHandleDelete(row) }}
          >
            Eliminar
          </JDGDButton>
        </div>
      ),
    },
  ]

  return (
    <div>
      <JDGDPageHeader
        title="Gastos operativos"
        action={
          <JDGDButton variant="primary" onClick={JDGDOpenCreate}>
            + Nuevo gasto
          </JDGDButton>
        }
      />

      <div className="JDGD-card">
        <div className="JDGD-filters">
          <JDGDInput
            label="Desde"
            name="fechaDesde"
            type="date"
            value={fechaDesde}
            onChange={(e) => setFechaDesde(e.target.value)}
          />
          <JDGDInput
            label="Hasta"
            name="fechaHasta"
            type="date"
            value={fechaHasta}
            onChange={(e) => setFechaHasta(e.target.value)}
          />
          <JDGDButton
            size="sm"
            variant="secondary"
            onClick={JDGDLimpiarFiltros}
            style={{ alignSelf: 'flex-end' }}
          >
            Limpiar filtros
          </JDGDButton>

          {(fechaDesde || fechaHasta) && (
            <span
              style={{
                marginLeft: 'auto',
                alignSelf: 'flex-end',
                color: 'var(--color-danger)',
                fontWeight: 600,
                fontSize: '0.95rem',
              }}
            >
              Total filtrado: {fmtCOP(totalVisible)}
            </span>
          )}
        </div>
      </div>

      <div className="JDGD-card">
        {loading
          ? <p style={{ padding: 24, color: 'var(--color-text-secondary)' }}>Cargando...</p>
          : <JDGDDataTable columns={JDGDColumns} data={datosFiltrados} />
        }
      </div>

      {showModal && (
        <JDGDModal
          title={editTarget ? 'Editar gasto' : 'Nuevo gasto'}
          onClose={() => setShowModal(false)}
          onConfirm={JDGDHandleSave}
          loading={saving}
        >
          <JDGDInput
            label="Detalle"
            name="detalle"
            value={form.detalle}
            onChange={JDGDHandleChange}
            required
          />
          <JDGDInput
            label="Valor"
            name="valor"
            value={form.valor}
            onChange={JDGDHandleChange}
            type="number"
            required
          />
          <JDGDInput
            label="Fecha"
            name="fecha"
            value={form.fecha}
            onChange={JDGDHandleChange}
            type="date"
            required
          />

          <JDGDSelect
            label="Estado"
            name="estado"
            value={form.estado}
            onChange={JDGDHandleChange}
            options={JDGD_ESTADO_OPTS}
            required
          />
          <JDGDSelect
            label="Sociedad"
            name="sociedad"
            value={form.sociedad}
            onChange={JDGDHandleSociedadChange}
            options={loadingSocs ? [] : socOpts}
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

export default JDGDGastosPage