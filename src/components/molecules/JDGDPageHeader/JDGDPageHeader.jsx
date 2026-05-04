import './JDGDPageHeader.css'

const JDGDPageHeader = ({ title, breadcrumb, action }) => (
  <div className="JDGD-page-header">
    <div>
      <h1 className="JDGD-page-title">{title}</h1>
      {breadcrumb && <div className="JDGD-breadcrumb">{breadcrumb}</div>}
    </div>
    {action && <div>{action}</div>}
  </div>
)

export default JDGDPageHeader