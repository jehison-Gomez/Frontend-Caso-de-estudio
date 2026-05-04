import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import JDGDAuthTemplate from '../components/templates/JDGDAuthTemplate/JDGDAuthTemplate'
import JDGDInput from '../components/atoms/JDGDInput/JDGDInput'
import JDGDButton from '../components/atoms/JDGDButton/JDGDButton'
import { JDGDUseAuth } from '../context/JDGDAuthContext'
import { JDGDLoginApi } from '../services/JDGDApi'
import '../styles/JDGDAuth.css'

const JDGDLoginPage = () => {
  const navigate = useNavigate()
  const { JDGDLogin } = JDGDUseAuth()
  const [form, setForm]     = useState({ identificacion: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')

  const JDGDHandleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const JDGDHandleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await JDGDLoginApi(form)
      JDGDLogin(res.usuario)
      const JDGDRol = res.usuario.rol
      if (JDGDRol === 'cliente') navigate('/cliente/prestamos', { replace: true })
      else navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.message || 'Credenciales incorrectas')
    } finally {
      setLoading(false)
    }
  }

  return (
    <JDGDAuthTemplate>
      <form onSubmit={JDGDHandleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <JDGDInput
          label="Identificación"
          name="identificacion"
          value={form.identificacion}
          onChange={JDGDHandleChange}
          placeholder="Número de documento"
          required
        />
        <JDGDInput
          label="Contraseña"
          name="password"
          type="password"
          value={form.password}
          onChange={JDGDHandleChange}
          placeholder="••••••••"
          required
        />
        {error && (
          <div style={{ fontSize: 12, color: 'var(--color-danger)', background: 'var(--color-danger-light)', padding: '8px 12px', borderRadius: 'var(--radius-md)' }}>
            {error}
          </div>
        )}
        <JDGDButton type="submit" variant="primary" disabled={loading}>
          {loading ? 'Ingresando...' : 'Ingresar'}
        </JDGDButton>
      </form>
    </JDGDAuthTemplate>
  )
}

export default JDGDLoginPage