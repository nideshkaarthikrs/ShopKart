import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { getOrderById } from '../services/api'

function OrderSuccess() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const [order, setOrder] = useState(location.state?.order || null)
  const [loading, setLoading] = useState(!location.state?.order)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!order && id) {
      getOrderById(id)
        .then((data) => {
          setOrder(data.order)
          setError('')
        })
        .catch((err) => {
          setError(err.message || 'Unable to load order details.')
        })
        .finally(() => setLoading(false))
    }
  }, [id, order])

  if (loading) {
    return <p className="status-message">Loading order confirmation...</p>
  }

  if (error) {
    return (
      <main className="order-success-page">
        <div className="order-card error-card">
          <h1>Order Not Found</h1>
          <p>{error}</p>
          <div className="order-actions">
            <button
              type="button"
              className="primary-button"
              onClick={() => navigate('/orders')}
            >
              View My Orders
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="order-success-page">
      <div className="order-success-card">
        <div className="success-icon" aria-hidden="true">✅</div>
        <h1>Order Placed Successfully!</h1>
        <p className="success-subtitle">
          Thank you for your purchase. Your order has been placed and payment has been verified.
        </p>

        <div className="order-details-summary">
          <div className="detail-row">
            <span>Order ID:</span>
            <strong className="order-id-badge">{order?._id}</strong>
          </div>
          <div className="detail-row">
            <span>Status:</span>
            <span className={`status-badge status-${order?.status?.toLowerCase()}`}>
              {order?.status}
            </span>
          </div>
          <div className="detail-row">
            <span>Payment Status:</span>
            <span className={`status-badge status-${order?.paymentStatus?.toLowerCase()}`}>
              {order?.paymentStatus}
            </span>
          </div>
          <div className="detail-row">
            <span>Total Amount:</span>
            <strong>₹{order?.totalAmount?.toLocaleString('en-IN')}</strong>
          </div>
          {order?.createdAt && (
            <div className="detail-row">
              <span>Date:</span>
              <span>{new Date(order.createdAt).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</span>
            </div>
          )}
        </div>

        {order?.items && order.items.length > 0 && (
          <div className="order-items-box">
            <h3>Items Ordered</h3>
            {order.items.map((item, idx) => (
              <div key={idx} className="ordered-item-line">
                <span>{item.name} × {item.quantity}</span>
                <span>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
        )}

        {order?.shippingAddress && (
          <div className="shipping-address-box">
            <h3>Delivery Address</h3>
            <p><strong>{order.shippingAddress.fullName}</strong> ({order.shippingAddress.phone})</p>
            <p>{order.shippingAddress.addressLine1}</p>
            <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
          </div>
        )}

        <div className="order-success-actions">
          <button
            type="button"
            className="primary-button"
            onClick={() => navigate('/orders')}
          >
            View My Orders
          </button>
          <Link to="/products" className="continue-shopping-link">
            Continue Shopping →
          </Link>
        </div>
      </div>
    </main>
  )
}

export default OrderSuccess
