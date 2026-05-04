import { useParams, Link } from 'react-router-dom'
import JDGDPageHeader from '../components/molecules/JDGDPageHeader/JDGDPageHeader'
import JDGDDataTable from '../components/molecules/JDGDDataTable/JDGDDataTable'
import JDGDBadge from '../components/atoms/JDGDBadge/JDGDBadge'
import JDGDButton from '../components/atoms/JDGDButton/JDGDButton'
import JDGDMetricCard from '../components/molecules/JDGDMetricCard/JDGDMetricCard'
import JDGDUseFetch from '../hooks/JDGDUseFetch'
import { JDGDGetCuotasPorPrestamo, JDGDPagarCuota } from '../services/JDGDApi'
import '../styles/JDGDCard.css'

const JDGDEstadoColor = { pagada: 'green', pendiente: 'amber', vencida: 'red', 'en mora': 'red' }

const JDGDCuotasPage = () => {
  const { id } = useParams()
  const { data: cuotas, loading, refetch } = JDGDUseFetch(() => JDGDGetCuotasPorPrestamo(id), [id])

  const JDGDHandlePagar = async (cuota) => {
    if (!confirm(`¿Registrar pago de la cuota #${cuota.nro_cuota}?`)) return
    try { await JDGDPagarCuota(cuota.id_cuota); refetch() }
    catch (e) { alert(e.message) }
  }

  const lista = cuotas || []
  const pagadas  = lista.filter(c => c.estado === 'pagada')
  const totalPagado = pagadas.reduce((s, c) => s + Number(c.valor), 0)
  const totalPendiente = lista.filter(c => c.estado !== 'pagada').reduce((s, c) => s + Number(c.valor), 0)
  const pct = lista.length ? Math.round((pagadas.length / lista.length) * 100) : 0

  const JDGDColumns = [
    { key: 'nro_cuota', label: '#' },
    { key: 'fecha_pago', label: 'Fecha pago' },
    { key: 'valor', label: 'Valor', render: v => Number(v).toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }) },
    { key: 'estado', label: 'Estado', render: v => <JDGDBadge label={v} variant={JDGDEstadoColor[v] || 'gray'} /> },
    { key: 'fecha_recaudo', label: 'Fecha recaudo', render: v => v || '—' },
    { key: 'accion', label: '', render: (_, row) =>
        row.estado !== 'pagada'
          ? <JDGDButton size="sm" variant="ghost" onClick={() => JDGDHandlePagar(row)}>Registrar pago</JDGDButton>
          : <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>Pagada ✓</span>
    },
  ]

  return (
    <div>
      <JDGDPageHeader
        title={`Cuotas — Préstamo #${id}`}
        breadcrumb={<><Link to="/prestamos">Préstamos</Link> › Préstamo #{id}</>}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 16 }}>
        <JDGDMetricCard label="Total cuotas" value={`${lista.length}`} sub={`${pagadas.length} pagadas · ${pct}%`} />
        <JDGDMetricCard label="Total pagado"    value={totalPagado.toLocaleString('es-CO',{style:'currency',currency:'COP',minimumFractionDigits:0})} subColor="var(--color-success)" />
        <JDGDMetricCard label="Saldo pendiente" value={totalPendiente.toLocaleString('es-CO',{style:'currency',currency:'COP',minimumFractionDigits:0})} subColor="var(--color-warning)" />
      </div>

      <div style={{ marginBottom: 12 }}>
        <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, marginBottom:4, color:'var(--color-text-secondary)' }}>
          <span>{pagadas.length}/{lista.length} cuotas pagadas</span><span>{pct}%</span>
        </div>
        <div style={{ height:6, background:'var(--color-bg-secondary)', borderRadius:99, overflow:'hidden' }}>
          <div style={{ width: pct+'%', height:'100%', background:'var(--color-primary)', borderRadius:99 }} />
        </div>
      </div>

      <div className="JDGD-card">
        {loading
          ? <p style={{ padding: 24, color: 'var(--color-text-secondary)' }}>Cargando...</p>
          : <JDGDDataTable columns={JDGDColumns} data={lista} />
        }
      </div>
    </div>
  )
}

export default JDGDCuotasPage