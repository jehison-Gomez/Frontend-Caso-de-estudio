import JDGDPageHeader from '../components/molecules/JDGDPageHeader'
import '../styles/JDGDCard.css'

const JDGDFormTemplate = ({ title, breadcrumb, children, actions }) => (
  <div>
    <JDGDPageHeader title={title} breadcrumb={breadcrumb} />
    <div className="JDGD-card">
      <div className="JDGD-form-body">{children}</div>
      {actions && <div className="JDGD-form-actions">{actions}</div>}
    </div>
  </div>
)

export default JDGDFormTemplate