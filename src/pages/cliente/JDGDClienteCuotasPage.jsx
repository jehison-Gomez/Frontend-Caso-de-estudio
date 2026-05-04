import { useParams, Link } from 'react-router-dom'
import JDGDUseFetch from '../../hooks/JDGDUseFetch'
import JDGDBadge from '../../components/atoms/JDGDBadge/JDGDBadge'
import JDGDButton from '../../components/atoms/JDGDButton/JDGDButton'
import JDGDMetricCard from '../../components/molecules/JDGDMetricCard/JDGDMetricCard'
import JDGDFormatearFecha from '../../JDGDFormatearFecha';
import { JDGDGetCuotasPorPrestamo, JDGDPagarCuota } from '../../services/JDGDApi'
import '../../styles/JDGDCard.css'
import './JDGDClientePage.css'

const JDGDEstadoColor = { pagada: 'green', pendiente: 'amber', vencida: 'red' }

const JDGDClienteCuotasPage = () => {
  const { id } = useParams()
  const { data: cuotas, loading, refetch } = JDGDUseFetch(() => JDGDGetCuotasPorPrestamo(id), [id])

  const JDGDHandlePagar = async (cuota) => {
    if (!confirm(`¿Confirmar pago de la cuota #${cuota.nro_cuota} por ${Number(cuota.valor).toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })}?`)) return
    try { await JDGDPagarCuota(cuota.id_cuota); refetch() }
    catch (e) { alert(e.message) }
  }

  const lista       = cuotas || []
  const pagadas     = lista.filter(c => c.estado === 'pagada')
  const proxima     = lista.find(c => c.estado === 'pendiente' || c.estado === 'vencida')
  const totalPagado = pagadas.reduce((s, c) => s + Number(c.valor), 0)
  const saldo       = lista.filter(c => c.estado !== 'pagada').reduce((s, c) => s + Number(c.valor), 0)
  const pct         = lista.length ? Math.round((pagadas.length / lista.length) * 100) : 0
  const JDGDFmt     = n => Number(n).toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Link to="/cliente/prestamos" style={{ fontSize: 12, color: 'var(--color-primary)', textDecoration: 'none' }}>
          ← Volver a mis préstamos
        </Link>
        <h1 className="JDGD-cliente-page-title" style={{ marginTop: 6 }}>Cuotas — Préstamo #{id}</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 16 }}>
        <JDGDMetricCard label="Progreso" value={`${pagadas.length}/${lista.length}`} sub={`${pct}% completado`} />
        <JDGDMetricCard label="Total pagado"    value={JDGDFmt(totalPagado)} subColor="var(--color-success)" />
        <JDGDMetricCard label="Saldo pendiente" value={JDGDFmt(saldo)}       subColor="var(--color-warning)" />
      </div>

      <div className="JDGD-card" style={{ marginBottom: 12, padding: '12px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 6, color: 'var(--color-text-secondary)' }}>
          <span>{pagadas.length} de {lista.length} cuotas pagadas</span>
          <span>{pct}%</span>
        </div>
        <div style={{ height: 8, background: 'var(--color-bg-secondary)', borderRadius: 99, overflow: 'hidden' }}>
          <div style={{ width: pct + '%', height: '100%', background: pct === 100 ? '#3B6D11' : 'var(--color-primary)', borderRadius: 99, transition: 'width 0.3s' }} />
        </div>
        {proxima && (
          <p style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 8 }}>
            Próximo pago: <strong>{JDGDFormatearFecha(proxima.fecha_pago)}</strong> — {JDGDFmt(proxima.valor)}
          </p>
        )}
      </div>

      {loading
        ? <p style={{ color: 'var(--color-text-secondary)' }}>Cargando...</p>
        : <div className="JDGD-cuotas-lista">
            {lista.map(c => (
              <div key={c.id_cuota} className={`JDGD-cuota-item ${c.estado === 'vencida' ? 'JDGD-cuota-item--mora' : ''}`}>
                <div className="JDGD-cuota-item-left">
                  <div className={`JDGD-cuota-num ${c.estado === 'pagada' ? 'JDGD-cuota-num--pagada' : ''}`}>
                    {c.nro_cuota}
                  </div>
                  <div>
                    <div className="JDGD-cuota-fecha">Vence: {JDGDFormatearFecha(c.fecha_pago)}</div>
                    {c.fecha_recaudo && <div className="JDGD-cuota-recaudo">Pagada: {c.fecha_recaudo}</div>}
                  </div>
                </div>
                <div className="JDGD-cuota-item-right">
                  <strong className="JDGD-cuota-valor">{JDGDFmt(c.valor)}</strong>
                  <JDGDBadge label={c.estado} variant={JDGDEstadoColor[c.estado] || 'gray'} />
                  {c.estado !== 'pagada'
                    ? <JDGDButton size="sm" variant="ghost" onClick={() => JDGDHandlePagar(c)}>Pagar</JDGDButton>
                    : <span style={{ fontSize: 11, color: 'var(--color-success)' }}>✓ Pagada</span>
                  }
                </div>
              </div>
            ))}
          </div>
      }
    </div>
  )
}

export default JDGDClienteCuotasPage