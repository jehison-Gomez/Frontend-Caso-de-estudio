import JDGDPageHeader from '../../components/molecules/JDGDPageHeader/JDGDPageHeader'
import JDGDDataTable from '../../components/molecules/JDGDDataTable/JDGDDataTable'
import JDGDBadge from '../../components/atoms/JDGDBadge/JDGDBadge'
import JDGDUseFetch from '../../hooks/JDGDUseFetch'
import { JDGDGetMovimientos } from '../../services/JDGDApi'
import '../../styles/JDGDCard.css'

const JDGDMovimientosPage = () => {
  const { data: movimientos, loading } = JDGDUseFetch(JDGDGetMovimientos)

  const JDGDColumns = [
    { key: 'fecha',       label: 'Fecha' },
    { key: 'tipo',        label: 'Tipo',   render: v => <JDGDBadge label={v} variant={v === 'ingreso' ? 'green' : 'red'} /> },
    { key: 'sociedad',    label: 'Sociedad' },
    { key: 'valor',       label: 'Valor',  render: (v, r) => (
        <span style={{ color: r.tipo === 'ingreso' ? 'var(--color-success)' : 'var(--color-danger)', fontWeight: 500 }}>
          {r.tipo === 'ingreso' ? '+' : '-'}{Number(v).toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })}
        </span>
      )
    },
    { key: 'estado',      label: 'Estado', render: v => <JDGDBadge label={v} variant={v === 'confirmado' ? 'green' : 'amber'} /> },
  ]

  return (
    <div>
      <JDGDPageHeader title="Movimientos" />
      <div className="JDGD-card">
        {loading
          ? <p style={{ padding: 24, color: 'var(--color-text-secondary)' }}>Cargando...</p>
          : <JDGDDataTable columns={JDGDColumns} data={movimientos || []} />
        }
      </div>
    </div>
  )
}

export default JDGDMovimientosPage