import './JDGDBadge.css'

const JDGDVariantMap = {
  green:  { bg: '#EAF3DE', color: '#3B6D11' },
  amber:  { bg: '#FAEEDA', color: '#854F0B' },
  red:    { bg: '#FCEBEB', color: '#A32D2D' },
  blue:   { bg: '#E6F1FB', color: '#185FA5' },
  gray:   { bg: '#F1EFE8', color: '#5F5E5A' },
  purple: { bg: '#EEEDFE', color: '#534AB7' },
}

const JDGDBadge = ({ label, variant = 'gray' }) => {
  const style = JDGDVariantMap[variant] || JDGDVariantMap.gray
  return (
    <span className="JDGD-badge" style={{ background: style.bg, color: style.color }}>
      {label}
    </span>
  )
}

export default JDGDBadge