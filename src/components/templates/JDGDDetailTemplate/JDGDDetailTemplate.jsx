import JDGDPageHeader from '../components/molecules/JDGDPageHeader'
import '../styles/JDGDCard.css'

const JDGDDetailTemplate = ({ title, breadcrumb, metrics, action, children }) => (
  <div>
    <JDGDPageHeader title={title} breadcrumb={breadcrumb} action={action} />
    {metrics && (
      <div className="JDGD-metrics-grid">{metrics}</div>
    )}
    <div className="JDGD-card">{children}</div>
  </div>
)

export default JDGDDetailTemplate