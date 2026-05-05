import { useState } from 'react'
import { pdf } from '@react-pdf/renderer'
import {
  MdPictureAsPdf,
  MdAttachMoney,
  MdSavings,
  MdAccountBalanceWallet,
  MdWarning,
  MdCurrencyExchange,
} from 'react-icons/md'
import JDGDPageHeader from '../../components/molecules/JDGDPageHeader/JDGDPageHeader'
import JDGDReportePDF from '../../components/molecules/JDGDReportePDF/JDGDReportePDF'
import JDGDUseReportes from '../../hooks/JDGDUseReportes'
import '../../styles/JDGDCard.css'
import './JDGDReportesPage.css'

const JDGDBuildReportes = (data) => {
  const {
    JDGDFmt,
    totalPrestado, totalRecaudado, totalGastos, saldoNeto,
    carteraPend, enMoraCount,
    filasTotalPrestado, filasTotalRecaudado, filasCartera,
    filasEnMora, filasFlujoCaja,
  } = data

  return [
    {
      id: 'total_prestado',
      titulo: 'Total Prestado',
      descripcion: 'Resumen de todos los créditos otorgados por el sistema.',
      icon: MdAttachMoney,
      iconColor: '#185FA5',
      bgColor: '#E6F1FB',
      metricas: [
        { label: 'Total desembolsado', value: JDGDFmt(totalPrestado) },
        { label: 'Número de créditos', value: String(filasTotalPrestado.length) },
      ],
      columnas: [
        { key: 'cliente',        label: 'Cliente' },
        { key: 'valor_prestado', label: 'Monto prestado' },
        { key: 'interes',        label: 'Interés' },
        { key: 'plazo',          label: 'Plazo' },
        { key: 'valor_futuro',   label: 'Valor futuro' },
        { key: 'estado',         label: 'Estado' },
      ],
      filas: filasTotalPrestado,
    },
    {
      id: 'total_recaudado',
      titulo: 'Total Recaudado',
      descripcion: 'Ingresos acumulados por pagos de cuotas registrados.',
      icon: MdSavings,
      iconColor: '#3B6D11',
      bgColor: '#EAF3DE',
      metricas: [
        { label: 'Total recaudado',  value: JDGDFmt(totalRecaudado), variant: 'success' },
        { label: 'Número de pagos',  value: String(filasTotalRecaudado.length), variant: 'success' },
      ],
      columnas: [
        { key: 'fecha',    label: 'Fecha' },
        { key: 'sociedad', label: 'Sociedad / Concepto' },
        { key: 'valor',    label: 'Valor' },
        { key: 'estado',   label: 'Estado' },
      ],
      filas: filasTotalRecaudado,
    },
    {
      id: 'cartera_pendiente',
      titulo: 'Cartera Pendiente',
      descripcion: 'Créditos activos con saldo por cobrar.',
      icon: MdAccountBalanceWallet,
      iconColor: '#854F0B',
      bgColor: '#FAEEDA',
      metricas: [
        { label: 'Cartera por cobrar',   value: JDGDFmt(carteraPend), variant: 'warning' },
        { label: 'Créditos activos',     value: String(filasCartera.length), variant: 'warning' },
      ],
      columnas: [
        { key: 'cliente',      label: 'Cliente' },
        { key: 'valor_prest',  label: 'Monto prestado' },
        { key: 'valor_futuro', label: 'Valor futuro' },
        { key: 'plazo',        label: 'Plazo' },
        { key: 'estado',       label: 'Estado' },
      ],
      filas: filasCartera,
    },
    {
      id: 'creditos_en_mora',
      titulo: 'Créditos en Mora',
      descripcion: 'Préstamos con estado "en mora" que requieren gestión de cobro.',
      icon: MdWarning,
      iconColor: '#A32D2D',
      bgColor: '#FCEBEB',
      metricas: [
        { label: 'Créditos en mora',  value: String(enMoraCount),                               variant: 'danger' },
        { label: 'Capital en riesgo', value: JDGDFmt(filasEnMora.reduce((s, f) => s + (parseFloat(f.valor_prest?.replace(/[^0-9,-]/g, '').replace(',', '.')) || 0), 0)), variant: 'danger' },
      ],
      columnas: [
        { key: 'cliente',     label: 'Cliente' },
        { key: 'valor_prest', label: 'Monto prestado' },
        { key: 'interes',     label: 'Interés' },
        { key: 'fiador',      label: 'Fiador' },
      ],
      filas: filasEnMora,
    },
    {
      id: 'flujo_de_caja',
      titulo: 'Flujo de Caja',
      descripcion: 'Ingresos por pagos vs. egresos por gastos operativos.',
      icon: MdCurrencyExchange,
      iconColor: saldoNeto >= 0 ? '#3B6D11' : '#A32D2D',
      bgColor: saldoNeto >= 0 ? '#EAF3DE' : '#FCEBEB',
      metricas: [
        { label: 'Total ingresos', value: JDGDFmt(totalRecaudado), variant: 'success' },
        { label: 'Total egresos',  value: JDGDFmt(totalGastos),    variant: 'danger' },
        { label: 'Saldo neto',     value: JDGDFmt(saldoNeto),      variant: saldoNeto >= 0 ? 'success' : 'danger' },
      ],
      columnas: [
        { key: 'fecha',   label: 'Fecha' },
        { key: 'tipo',    label: 'Tipo' },
        { key: 'detalle', label: 'Detalle / Concepto' },
        { key: 'valor',   label: 'Valor' },
      ],
      filas: filasFlujoCaja,
    },
  ]
}

const JDGDReportesPage = () => {
  const data    = JDGDUseReportes()
  const [generando, setGenerando] = useState({})

  const JDGDHoy = new Date().toISOString().slice(0, 10)

  const JDGDHandleGenerar = async (reporte) => {
    setGenerando(g => ({ ...g, [reporte.id]: true }))
    try {
      const doc  = (
        <JDGDReportePDF
          titulo={reporte.titulo}
          subtitulo={reporte.descripcion}
          metricas={reporte.metricas}
          columnas={reporte.columnas}
          filas={reporte.filas}
        />
      )
      const blob = await pdf(doc).toBlob()
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href     = url
      a.download = `reporte_${reporte.id}_${JDGDHoy}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Error generando PDF:', err)
      alert('Error al generar el PDF. Revisa la consola.')
    } finally {
      setGenerando(g => ({ ...g, [reporte.id]: false }))
    }
  }

  if (data.loading) {
    return (
      <div>
        <JDGDPageHeader title="Reportes PDF" />
        <div className="JDGD-reportes-loading">
          <span className="JDGD-reportes-spinner" />
          <p>Cargando datos del sistema…</p>
        </div>
      </div>
    )
  }

  const reportes = JDGDBuildReportes(data)

  return (
    <div>
      <JDGDPageHeader
        title="Reportes PDF"
        breadcrumb="Generación de reportes en PDF"
      />

      {/* <div className="JDGD-reportes-intro JDGD-card">
        <MdPictureAsPdf className="JDGD-reportes-intro-icon" />
        <div>
          <p className="JDGD-reportes-intro-title">Módulo de reportes</p>
          <p className="JDGD-reportes-intro-sub">
            Selecciona el reporte que deseas generar. Cada archivo se descargará
            automáticamente en formato PDF con los datos actuales del sistema.
          </p>
        </div>
      </div> */}

      <div className="JDGD-reportes-grid">
        {reportes.map((rep) => {
          const Icon = rep.icon
          const enProceso = generando[rep.id]
          return (
            <div key={rep.id} className="JDGD-reporte-card JDGD-card">
              <div
                className="JDGD-reporte-icon-wrap"
                style={{ background: rep.bgColor, color: rep.iconColor }}
              >
                <Icon className="JDGD-reporte-icon" />
              </div>

              <div className="JDGD-reporte-body">
                <p className="JDGD-reporte-titulo">{rep.titulo}</p>
                <p className="JDGD-reporte-desc">{rep.descripcion}</p>

                <div className="JDGD-reporte-metricas">
                  {rep.metricas.map((m, i) => (
                    <div key={i} className="JDGD-reporte-metrica">
                      <span className="JDGD-reporte-metrica-label">{m.label}</span>
                      <span className="JDGD-reporte-metrica-val">{m.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                className={`JDGD-reporte-btn${enProceso ? ' JDGD-reporte-btn--loading' : ''}`}
                onClick={() => JDGDHandleGenerar(rep)}
                disabled={enProceso}
              >
                {enProceso ? (
                  <>
                    <span className="JDGD-btn-spinner" />
                    Generando…
                  </>
                ) : (
                  <>
                    <MdPictureAsPdf />
                    Generar PDF
                  </>
                )}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default JDGDReportesPage
