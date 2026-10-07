import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getOrderById, updateOrderStatus } from '../services/api'

const STATUS_STEPS = ['PLACED', 'CONFIRMED', 'SHIPPED', 'DELIVERED']

function OrderDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusUpdating, setStatusUpdating] = useState(false)

  useEffect(() => {
    getOrderById(id)
      .then((data) => {
        setOrder(data.order)
        setError('')
      })
      .catch((err) => {
        setError(err.message || 'Unable to load order details')
      })
      .finally(() => setLoading(false))
  }, [id])

  const handleStatusProgression = async (nextStatus) => {
    setStatusUpdating(true)
    try {
      const data = await updateOrderStatus(order._id, nextStatus)
      setOrder(data.order)
    } catch (err) {
      alert(err.message || 'Failed to update order status')
    } finally {
      setStatusUpdating(false)
    }
  }

  if (loading) {
    return <p className="status-message">Loading order details...</p>
  }

  if (error || !order) {
    return (
      <main className="orders-page">
        <div className="orders-error">
          <h1>Order Not Found</h1>
          <p>{error || 'The requested order could not be found.'}</p>
          <button
            type="button"
            className="primary-button cart-browse"
            onClick={() => navigate('/orders')}
          >
            Back to Orders
          </button>
        </div>
      </main>
    )
  }

  const currentStepIndex = STATUS_STEPS.indexOf(order.status)

  return (
    <main className="orders-page">
      <div className="order-details-container">
        <div className="order-details-header">
          <div>
            <Link to="/orders" className="back-link">← Back to My Orders</Link>
            <h1>Order #{order._id}</h1>
            <p className="order-card-date">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          <div className="order-badges">
            <span className={`status-badge status-${order.status?.toLowerCase()}`}>
              {order.status}
            </span>
            <span className={`status-badge status-${order.paymentStatus?.toLowerCase()}`}>
              Payment: {order.paymentStatus}
            </span>
          </div>
        </div>

        {/* Bonus Feature: Status Progression Tracker */}
        <div className="status-tracker-card">
          <h3>Order Progress</h3>
          <div className="status-timeline">
            {STATUS_STEPS.map((step, idx) => {
              const isCompleted = currentStepIndex >= idx
              const isCurrent = currentStepIndex === idx
              return (
                <div
                  key={step}
                  className={`timeline-step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
                >
                  <div className="step-circle">{idx + 1}</div>
                  <span className="step-label">{step}</span>
                </div>
              )
            })}
          </div>

          {currentStepIndex >= 0 && currentStepIndex < STATUS_STEPS.length - 1 && (
            <div className="status-update-action">
              <small>Demo / Admin progression control:</small>
              <button
                type="button"
                className="secondary-button"
                disabled={statusUpdating}
                onClick={() => handleStatusProgression(STATUS_STEPS[currentStepIndex + 1])}
              >
                {statusUpdating ? 'Updating...' : `Mark as ${STATUS_STEPS[currentStepIndex + 1]}`}
              </button>
            </div>
          )}
        </div>

        {/* Items Section */}
        <div className="order-items-card">
          <h3>Order Items</h3>
          <div className="order-items-table">
            {order.items?.map((item, idx) => (
              <div key={idx} className="order-item-row-detail">
                <div className="order-item-left">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="order-item-thumb" />
                  ) : (
                    <div className="order-item-thumb unavailable-image">📦</div>
                  )}
                  <div>
                    <h4>{item.name}</h4>
                    <span className="order-item-unit-price">
                      ₹{item.price.toLocaleString('en-IN')} × {item.quantity}
                    </span>
                  </div>
                </div>
                <strong>₹{(item.price * item.quantity).toLocaleString('en-IN')}</strong>
              </div>
            ))}
          </div>

          <div className="order-total-bar">
            <span>Total Paid</span>
            <strong>₹{order.totalAmount.toLocaleString('en-IN')}</strong>
          </div>
        </div>

        {/* Address and Payment Information */}
        <div className="order-info-grid">
          <div className="info-card">
            <h3>Shipping Address</h3>
            <p><strong>{order.shippingAddress?.fullName}</strong></p>
            <p>Phone: {order.shippingAddress?.phone}</p>
            <p>{order.shippingAddress?.addressLine1}</p>
            <p>
              {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
            </p>
          </div>

          <div className="info-card">
            <h3>Payment Information</h3>
            <p><strong>Status:</strong> {order.paymentStatus}</p>
            <p><strong>Razorpay Order ID:</strong> {order.razorpayOrderId || 'N/A'}</p>
            {order.razorpayPaymentId && (
              <p><strong>Razorpay Payment ID:</strong> {order.razorpayPaymentId}</p>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

export default OrderDetails
