import JDGDPageHeader from '../components/molecules/JDGDPageHeader'
import '../styles/JDGDCard.css'

const JDGDListTemplate = ({ title, action, filters, children }) => (
  <div>
    <JDGDPageHeader title={title} action={action} />
    {filters && <div className="JDGD-filters">{filters}</div>}
    <div className="JDGD-card">{children}</div>
  </div>
)

export default JDGDListTemplate