import './JDGDInput.css'

const JDGDSelect = ({ label, name, value, onChange, options = [], required = false }) => (
  <div className="JDGD-input-group">
    {label && <label className="JDGD-label" htmlFor={name}>{label}</label>}
    <select id={name} name={name} value={value} onChange={onChange} required={required} className="JDGD-input">
      <option value="">Seleccionar...</option>
      {options.map(o => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  </div>
)

export default JDGDSelect