import './JDGDInput.css'

const JDGDInput = ({ label, name, type = 'text', value, onChange, placeholder = '', required = false }) => (
  <div className="JDGD-input-group">
    {label && <label className="JDGD-label" htmlFor={name}>{label}</label>}
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="JDGD-input"
    />
  </div>
)

export default JDGDInput