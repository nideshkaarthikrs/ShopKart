import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getUserOrders } from '../services/api'

function Orders() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    getUserOrders()
      .then((data) => {
        if (active) {
          setOrders(data.orders || [])
          setError('')
        }
      })
      .catch((err) => {
        if (active) {
          setError(err.message || 'Failed to load your orders.')
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  if (loading) {
    return <p className="status-message">Loading your orders...</p>
  }

  if (error) {
    return (
      <main className="orders-page">
        <div className="orders-error">
          <h1>Unable to load orders</h1>
          <p>{error}</p>
          <button
            type="button"
            className="primary-button cart-retry"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </main>
    )
  }

  if (orders.length === 0) {
    return (
      <main className="orders-page">
        <div className="orders-empty">
          <div className="empty-cart-icon" aria-hidden="true">📦</div>
          <h1>You have not placed any orders yet.</h1>
          <p>Your order history will appear here once you place an order.</p>
          <button
            type="button"
            className="primary-button cart-browse"
            onClick={() => navigate('/products')}
          >
            Start Shopping
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="orders-page">
      <div className="orders-container">
        <h1>My Orders</h1>
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-card-header">
                <div>
                  <span className="order-id-title">Order #{order._id}</span>
                  <p className="order-card-date">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span className={`status-badge status-${order.status?.toLowerCase()}`}>
                    {order.status}
                  </span>
                  <span className={`status-badge status-${order.paymentStatus?.toLowerCase()}`}>
                    {order.paymentStatus}
                  </span>
                </div>
              </div>

              <div className="order-card-items">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="order-card-item-row">
                    <span className="item-name">{item.name} × {item.quantity}</span>
                    <span className="item-price">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>

              <div className="order-card-footer">
                <div className="order-card-total">
                  <span>Total:</span>
                  <strong>₹{order.totalAmount.toLocaleString('en-IN')}</strong>
                </div>
                <Link to={`/orders/${order._id}`} className="view-details-button">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

export default Orders
