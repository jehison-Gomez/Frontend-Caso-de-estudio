import JDGDUseFetch from './JDGDUseFetch'
import { JDGDGetPrestamos, JDGDGetMovimientos, JDGDGetGastos } from '../services/JDGDApi'

const JDGDFmt = (n) =>
  Number(n).toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })

const JDGDUseReportes = () => {
  const { data: prestamos,   loading: lp } = JDGDUseFetch(JDGDGetPrestamos)
  const { data: movimientos, loading: lm } = JDGDUseFetch(JDGDGetMovimientos)
  const { data: gastos,      loading: lg } = JDGDUseFetch(JDGDGetGastos)

  const loading = lp || lm || lg

  const lista = prestamos   || []
  const movs  = movimientos || []
  const gasts = gastos      || []

  const totalPrestado  = lista.reduce((s, p) => s + Number(p.valor_prestado), 0)
  const ingresos       = movs.filter(m => m.tipo === 'ingreso')
  const totalRecaudado = ingresos.reduce((s, m) => s + Number(m.valor), 0)
  const totalGastos    = gasts.reduce((s, g) => s + Number(g.valor), 0)
  const saldoNeto      = totalRecaudado - totalGastos
  const enMora         = lista.filter(p => p.estado === 'mora')
  const activos        = lista.filter(p => p.estado === 'activo')
  const carteraPend    = activos.reduce((s, p) => s + Number(p.valor_futuro || p.valor_prestado), 0)

  const filasTotalPrestado = lista.map(p => ({
    cliente:        p.persona_nombre || p.persona,
    valor_prestado: JDGDFmt(p.valor_prestado),
    interes:        `${p.interes}%`,
    plazo:          `${p.tiempo} m`,
    valor_futuro:   JDGDFmt(p.valor_futuro || 0),
    estado:         p.estado,
  }))

  const filasTotalRecaudado = ingresos.map(m => ({
    fecha:    m.fecha,
    sociedad: m.sociedad || '—',
    valor:    JDGDFmt(m.valor),
    estado:   m.estado,
  }))

  const filasCartera = activos.map(p => ({
    cliente:      p.persona_nombre || p.persona,
    valor_prest:  JDGDFmt(p.valor_prestado),
    valor_futuro: JDGDFmt(p.valor_futuro || 0),
    plazo:        `${p.tiempo} m`,
    estado:       p.estado,
  }))

  const filasEnMora = enMora.map(p => ({
    cliente:       p.persona_nombre || p.persona,
    valor_prest:   JDGDFmt(p.valor_prestado),
    interes:       `${p.interes}%`,
    fiador:        p.fiador_nombre || p.fiador || 'Sin fiador',
  }))

  const filasFlujoCaja = [
    ...ingresos.map(m => ({
      fecha:  m.fecha,
      tipo:   'Ingreso',
      detalle: m.sociedad || 'Pago de cuota',
      valor:  JDGDFmt(m.valor),
    })),
    ...gasts.map(g => ({
      fecha:  g.fecha,
      tipo:   'Egreso',
      detalle: g.detalle,
      valor:  JDGDFmt(g.valor),
    })),
  ].sort((a, b) => new Date(a.fecha) - new Date(b.fecha))

  return {
    loading,
    prestamos: lista,
    movimientos: movs,
    gastos: gasts,
    totalPrestado,
    totalRecaudado,
    totalGastos,
    saldoNeto,
    carteraPend,
    enMoraCount: enMora.length,
    filasTotalPrestado,
    filasTotalRecaudado,
    filasCartera,
    filasEnMora,
    filasFlujoCaja,
    JDGDFmt,
  }
}

export default JDGDUseReportes
