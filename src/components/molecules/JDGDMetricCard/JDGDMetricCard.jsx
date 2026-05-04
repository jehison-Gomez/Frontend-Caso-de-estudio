import './JDGDMetricCard.css'

const JDGDMetricCard = ({ label, value, sub, subColor }) => (
  <div className="JDGD-metric-card">
    <div className="JDGD-metric-label">{label}</div>
    <div className="JDGD-metric-value">{value}</div>
    {sub && <div className="JDGD-metric-sub" style={{ color: subColor }}>{sub}</div>}
  </div>
)

export default JDGDMetricCard