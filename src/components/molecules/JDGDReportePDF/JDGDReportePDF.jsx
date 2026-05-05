import {
  Document, Page, Text, View, StyleSheet
} from '@react-pdf/renderer'

const S = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 9,
    paddingTop: 36,
    paddingBottom: 40,
    paddingHorizontal: 36,
    backgroundColor: '#FFFFFF',
    color: '#1a1a1a',
  },

  header: {
    marginBottom: 18,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#D1D5DB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  headerLeft: { flexDirection: 'column', gap: 2 },
  brand: { fontSize: 14, fontFamily: 'Helvetica-Bold', color: '#185FA5' },
  brandSub: { fontSize: 8, color: '#6b6b6b' },
  reportTitle: { fontSize: 13, fontFamily: 'Helvetica-Bold', color: '#1a1a1a', marginTop: 4 },
  headerRight: { alignItems: 'flex-end' },
  fechaLabel: { fontSize: 7, color: '#9b9b9b' },
  fechaVal: { fontSize: 8, color: '#6b6b6b' },

  metricsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  metricCard: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
    padding: '8 10',
    borderLeftWidth: 3,
    borderLeftColor: '#185FA5',
  },
  metricCardDanger: { borderLeftColor: '#A32D2D' },
  metricCardSuccess: { borderLeftColor: '#3B6D11' },
  metricCardWarning: { borderLeftColor: '#854F0B' },
  metricLabel: { fontSize: 7, color: '#6b6b6b', marginBottom: 2 },
  metricValue: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#1a1a1a' },

  tableContainer: { marginTop: 4 },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#185FA5',
    borderRadius: 4,
    marginBottom: 1,
  },
  tableHeaderCell: {
    flex: 1,
    padding: '5 6',
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    color: '#FFFFFF',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E7EB',
  },
  tableRowAlt: { backgroundColor: '#F9FAFB' },
  tableCell: {
    flex: 1,
    padding: '4 6',
    fontSize: 8,
    color: '#374151',
  },
  tableCellBold: { fontFamily: 'Helvetica-Bold' },

  footer: {
    position: 'absolute',
    bottom: 20,
    left: 36,
    right: 36,
    borderTopWidth: 0.5,
    borderTopColor: '#E5E7EB',
    paddingTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: { fontSize: 7, color: '#9b9b9b' },

  emptyMsg: { fontSize: 9, color: '#9b9b9b', textAlign: 'center', marginTop: 20 },
})

const JDGD_HOY = new Date().toLocaleDateString('es-CO', {
  day: '2-digit', month: 'long', year: 'numeric'
})

const JDGDMetricVariant = (variant) => {
  if (variant === 'danger')  return [S.metricCard, S.metricCardDanger]
  if (variant === 'success') return [S.metricCard, S.metricCardSuccess]
  if (variant === 'warning') return [S.metricCard, S.metricCardWarning]
  return [S.metricCard]
}

const JDGDReportePDF = ({ titulo, subtitulo, metricas = [], columnas = [], filas = [] }) => (
  <Document title={titulo} author="Crédito Ágil">
    <Page size="A4" orientation="landscape" style={S.page}>

      <View style={S.header} fixed>
        <View style={S.headerLeft}>
          <Text style={S.brand}>Crédito Ágil</Text>
          <Text style={S.brandSub}>Sistema de créditos</Text>
          <Text style={S.reportTitle}>{titulo}</Text>
          {subtitulo ? <Text style={[S.brandSub, { marginTop: 2 }]}>{subtitulo}</Text> : null}
        </View>
        <View style={S.headerRight}>
          <Text style={S.fechaLabel}>Fecha de generación</Text>
          <Text style={S.fechaVal}>{JDGD_HOY}</Text>
        </View>
      </View>

      {metricas.length > 0 && (
        <View style={S.metricsRow}>
          {metricas.map((m, i) => (
            <View key={i} style={JDGDMetricVariant(m.variant)}>
              <Text style={S.metricLabel}>{m.label}</Text>
              <Text style={S.metricValue}>{m.value}</Text>
            </View>
          ))}
        </View>
      )}

      {filas.length === 0 ? (
        <Text style={S.emptyMsg}>Sin registros para mostrar.</Text>
      ) : (
        <View style={S.tableContainer}>
          <View style={S.tableHeader} fixed>
            {columnas.map((col, i) => (
              <Text key={i} style={S.tableHeaderCell}>{col.label}</Text>
            ))}
          </View>

          {filas.map((fila, ri) => (
            <View key={ri} style={[S.tableRow, ri % 2 === 1 ? S.tableRowAlt : {}]} wrap={false}>
              {columnas.map((col, ci) => (
                <Text key={ci} style={[S.tableCell, ci === 0 ? S.tableCellBold : {}]}>
                  {fila[col.key] ?? '—'}
                </Text>
              ))}
            </View>
          ))}
        </View>
      )}

      <View style={S.footer} fixed>
        <Text style={S.footerText}>Crédito Ágil — Reporte generado el {JDGD_HOY}</Text>
        <Text style={S.footerText} render={({ pageNumber, totalPages }) =>
          `Página ${pageNumber} de ${totalPages}`
        } />
      </View>

    </Page>
  </Document>
)

export default JDGDReportePDF
