const JDGD_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

console.log('BASE URL:', import.meta.env.VITE_API_URL)

const JDGDFetch = async (endpoint, options = {}) => {
  const res = await fetch(`${JDGD_BASE_URL}${endpoint}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (res.status === 401) {
    window.location.href = '/login'
    return
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || `Error ${res.status}`)
  }

  return res.json()
}

// Auth
export const JDGDLoginApi  = (data) => JDGDFetch('/JDGDAuth/login',  { method: 'POST', body: JSON.stringify(data) })
export const JDGDLogoutApi = ()     => JDGDFetch('/JDGDAuth/logout', { method: 'POST' })

// Personas
export const JDGDGetPersonas   = ()          => JDGDFetch('/JDGDPersona')
export const JDGDGetPersona    = (id)        => JDGDFetch(`/JDGDPersona/${id}`)
export const JDGDCreatePersona = (data)      => JDGDFetch('/JDGDPersona', { method: 'POST', body: JSON.stringify(data) })
export const JDGDUpdatePersona = (id, data)  => JDGDFetch(`/JDGDPersona/${id}`, { method: 'PUT', body: JSON.stringify(data) })
export const JDGDDeletePersona = (id)        => JDGDFetch(`/JDGDPersona/${id}`, { method: 'DELETE' })

// Préstamos
export const JDGDGetPrestamos   = ()         => JDGDFetch('/JDGDPrestamo')
export const JDGDGetPrestamo    = (id)       => JDGDFetch(`/JDGDPrestamo/${id}`)
export const JDGDCreatePrestamo = (data)     => JDGDFetch('/JDGDPrestamo', { method: 'POST', body: JSON.stringify(data) })
export const JDGDUpdatePrestamo = (id, data) => JDGDFetch(`/JDGDPrestamo/${id}`, { method: 'PUT', body: JSON.stringify(data) })
export const JDGDDeletePrestamo = (id)       => JDGDFetch(`/JDGDPrestamo/${id}`, { method: 'DELETE' })

// Cuotas
export const JDGDGetCuotasPorPrestamo = (id) => JDGDFetch(`/JDGDCuota/prestamo/${id}`)
export const JDGDPagarCuota           = (id) => JDGDFetch(`/JDGDCuota/${id}/pagar`, { method: 'PUT' })

// Movimientos
export const JDGDGetMovimientos   = ()       => JDGDFetch('/JDGDMovimiento')
export const JDGDCreateMovimiento = (data)   => JDGDFetch('/JDGDMovimiento', { method: 'POST', body: JSON.stringify(data) })

// Gastos
export const JDGDGetGastos   = ()            => JDGDFetch('/JDGDGasto')
export const JDGDCreateGasto = (data)        => JDGDFetch('/JDGDGasto', { method: 'POST', body: JSON.stringify(data) })
export const JDGDUpdateGasto = (id, data)    => JDGDFetch(`/JDGDGasto/${id}`, { method: 'PUT', body: JSON.stringify(data) })
export const JDGDDeleteGasto = (id)          => JDGDFetch(`/JDGDGasto/${id}`, { method: 'DELETE' })