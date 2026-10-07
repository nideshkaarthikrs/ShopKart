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

export function getProducts(search = '', category = '', sort = '') {
  const params = new URLSearchParams()
  if (search) params.append('search', search)
  if (category) params.append('category', category)
  if (sort) params.append('sort', sort)

  const queryString = params.toString()
  const url = queryString ? `/products?${queryString}` : '/products'

  return request(url)
}

export function getProductById(id) {
  return request(`/products/${id}`)
}

export function addToWishlist(productId) {
  return request(`/wishlist/${productId}`, {
    method: 'POST',
  })
}

export function getWishlist() {
  return request('/wishlist')
}

export function removeFromWishlist(productId) {
  return request(`/wishlist/${productId}`, {
    method: 'DELETE',
  })
}

export function addToCart(productId) {
  return request(`/cart/${productId}`, {
    method: 'POST',
  })
}

export function getCart() {
  return request('/cart')
}

export function updateCartQuantity(productId, quantity) {
  return request(`/cart/${productId}`, {
    method: 'PATCH',
    body: JSON.stringify({ quantity }),
  })
}

export function removeFromCart(productId) {
  return request(`/cart/${productId}`, {
    method: 'DELETE',
  })
}

export function createPaymentOrder(shippingAddress) {
  return request('/orders/create-payment-order', {
    method: 'POST',
    body: JSON.stringify({ shippingAddress }),
  })
}

export function verifyPayment(paymentData) {
  return request('/orders/verify-payment', {
    method: 'POST',
    body: JSON.stringify(paymentData),
  })
}

export function getUserOrders() {
  return request('/orders')
}

export function getOrderById(id) {
  return request(`/orders/${id}`)
}

export function updateOrderStatus(id, status) {
  return request(`/orders/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
}

