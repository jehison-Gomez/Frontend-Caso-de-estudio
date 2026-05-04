import { useNavigate } from 'react-router-dom'
import JDGDMetricCard from '../../components/molecules/JDGDMetricCard/JDGDMetricCard'
import JDGDPageHeader from '../../components/molecules/JDGDPageHeader/JDGDPageHeader'
import JDGDDataTable from '../../components/molecules/JDGDDataTable/JDGDDataTable'
import JDGDBadge from '../../components/atoms/JDGDBadge/JDGDBadge'
import JDGDButton from '../../components/atoms/JDGDButton/JDGDButton'
import JDGDUseFetch from '../../hooks/JDGDUseFetch'
import { JDGDGetPrestamos, JDGDGetMovimientos, JDGDGetGastos } from '../../services/JDGDApi'
import '../../styles/JDGDCard.css'

const JDGDEstadoColor = { activo: 'green', finalizado: 'blue', 'en mora': 'red', pendiente: 'amber' }

const JDGDDashboardPage = () => {
  const navigate = useNavigate()
  const { data: prestamos }    = JDGDUseFetch(JDGDGetPrestamos)
  const { data: movimientos }  = JDGDUseFetch(JDGDGetMovimientos)
  const { data: gastos }       = JDGDUseFetch(JDGDGetGastos)

  const lista = prestamos || []
  const movs  = movimientos || []
  const gasts = gastos || []

  const JDGDTotalPrestado   = lista.reduce((s, p) => s + Number(p.valor_prestado), 0)
  const JDGDTotalRecaudado  = movs.filter(m => m.tipo === 'ingreso').reduce((s, m) => s + Number(m.valor), 0)
  const JDGDTotalGastos     = gasts.reduce((s, g) => s + Number(g.valor), 0)
  const JDGDEnMora          = lista.filter(p => p.estado === 'en mora').length
  const JDGDActivos         = lista.filter(p => p.estado === 'activo').length

  const JDGDFmt = n => n.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })

  const JDGDCols = [
    { key: 'id_prestamo', label: '#', render: v => `#${v}` },
    { key: 'persona_nombre', label: 'Cliente' },
    { key: 'valor_prestado', label: 'Monto', render: v => JDGDFmt(Number(v)) },
    { key: 'estado', label: 'Estado', render: v => <JDGDBadge label={v} variant={JDGDEstadoColor[v] || 'gray'} /> },
    { key: 'ver', label: '', render: (_, r) =>
        <JDGDButton size="sm" variant="ghost" onClick={e => { e.stopPropagation(); navigate(`/prestamos/${r.id_prestamo}/cuotas`) }}>
          Ver cuotas
        </JDGDButton>
    },
  ]

  return (
    <div>
      <JDGDPageHeader title="Dashboard" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 16 }}>
        <JDGDMetricCard label="Total prestado"   value={JDGDFmt(JDGDTotalPrestado)}  sub={`${JDGDActivos} préstamos activos`} />
        <JDGDMetricCard label="Total recaudado"  value={JDGDFmt(JDGDTotalRecaudado)} subColor="var(--color-success)" />
        <JDGDMetricCard label="Cartera pendiente" value={JDGDFmt(JDGDTotalPrestado - JDGDTotalRecaudado)} subColor="var(--color-warning)" />
        <JDGDMetricCard label="En mora"          value={`${JDGDEnMora} créditos`}    subColor="var(--color-danger)" />
      </div>

      <div className="JDGD-card">
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
          <span style={{ fontSize:13, fontWeight:500 }}>Préstamos recientes</span>
          <JDGDButton size="sm" onClick={() => navigate('/prestamos')}>Ver todos</JDGDButton>
        </div>
        <JDGDDataTable columns={JDGDCols} data={lista.slice(0, 5)} />
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
        <div className="JDGD-card">
          <div style={{ fontSize:13, fontWeight:500, marginBottom:12 }}>Flujo de caja</div>
          <div style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', borderBottom:'0.5px solid var(--color-border)', fontSize:12 }}>
            <span style={{ color:'var(--color-text-secondary)' }}>Ingresos (pagos)</span>
            <span style={{ color:'var(--color-success)', fontWeight:500 }}>+{JDGDFmt(JDGDTotalRecaudado)}</span>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', borderBottom:'0.5px solid var(--color-border)', fontSize:12 }}>
            <span style={{ color:'var(--color-text-secondary)' }}>Egresos (gastos)</span>
            <span style={{ color:'var(--color-danger)', fontWeight:500 }}>-{JDGDFmt(JDGDTotalGastos)}</span>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', padding:'8px 0 0', fontSize:13 }}>
            <span style={{ fontWeight:500 }}>Saldo neto</span>
            <span style={{ fontWeight:500, color: JDGDTotalRecaudado - JDGDTotalGastos >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
              {JDGDFmt(JDGDTotalRecaudado - JDGDTotalGastos)}
            </span>
          </div>
        </div>
        <div className="JDGD-card">
          <div style={{ fontSize:13, fontWeight:500, marginBottom:12 }}>Créditos por estado</div>
          {['activo','en mora','finalizado','pendiente'].map(est => {
            const count = lista.filter(p => p.estado === est).length
            const pct   = lista.length ? Math.round((count / lista.length) * 100) : 0
            return (
              <div key={est} style={{ marginBottom: 10 }}>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, marginBottom:3 }}>
                  <span style={{ textTransform:'capitalize' }}>{est}</span>
                  <span style={{ fontWeight:500 }}>{count} ({pct}%)</span>
                </div>
                <div style={{ height:5, background:'var(--color-bg-secondary)', borderRadius:99, overflow:'hidden' }}>
                  <div style={{ width:pct+'%', height:'100%', borderRadius:99, background: est==='activo'?'#3B6D11':est==='en mora'?'#A32D2D':est==='finalizado'?'#185FA5':'#854F0B' }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default JDGDDashboardPage