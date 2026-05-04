import './JDGDButton.css'

const JDGDButton = ({ children, variant = 'default', size = 'md', onClick, type = 'button', disabled = false }) => (
  <button
    type={type}
    className={`JDGD-btn JDGD-btn--${variant} JDGD-btn--${size}`}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
)

export default JDGDButton