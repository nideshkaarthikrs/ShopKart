const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message || 'Request failed')
  }

  return data
}

export function registerCustomer(customer) {
  return request('/customers/register', {
    method: 'POST',
    body: JSON.stringify(customer),
  })
}

export function loginCustomer(credentials) {
  return request('/customers/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  })
}

export function getCurrentCustomer() {
  return request('/customers/me')
}

export function logoutCustomer() {
  return request('/customers/logout', { method: 'POST' })
}
