import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/useCart'
import { createPaymentOrder, verifyPayment } from '../services/api'

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true)
      return
    }
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

function Checkout() {
  const navigate = useNavigate()
  const { cartItems, loading: cartLoading, clearCartState } = useCart()

  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    city: '',
    state: '',
    pincode: ''
  })

  const [formErrors, setFormErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (cartLoading) {
    return <p className="status-message">Loading checkout...</p>
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <main className="cart-status">
        <div className="empty-cart-icon" aria-hidden="true">🛒</div>
        <h1>Your cart is empty</h1>
        <p>You cannot checkout with an empty cart.</p>
        <button
          type="button"
          className="primary-button cart-browse"
          onClick={() => navigate('/products')}
        >
          Browse Products
        </button>
      </main>
    )
  }

  const subtotal = cartItems.reduce(
    (total, item) => total + (item.product ? item.product.price * item.quantity : 0),
    0
  )

  const validateForm = () => {
    const errors = {}

    if (!shippingAddress.fullName.trim()) {
      errors.fullName = 'Full Name is required'
    }

    if (!shippingAddress.phone.trim()) {
      errors.phone = 'Phone number is required'
    } else if (!/^\d{10}$/.test(shippingAddress.phone.trim())) {
      errors.phone = 'Phone must contain a valid 10-digit number'
    }

    if (!shippingAddress.addressLine1.trim()) {
      errors.addressLine1 = 'Address is required'
    }

    if (!shippingAddress.city.trim()) {
      errors.city = 'City is required'
    }

    if (!shippingAddress.state.trim()) {
      errors.state = 'State is required'
    }

    if (!shippingAddress.pincode.trim()) {
      errors.pincode = 'Pincode is required'
    } else if (!/^\d{6}$/.test(shippingAddress.pincode.trim())) {
      errors.pincode = 'Pincode must contain 6 digits'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setShippingAddress((prev) => ({ ...prev, [name]: value }))
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }))
    }
    setServerError('')
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault()
    setServerError('')

    if (!validateForm()) {
      return
    }

    setSubmitting(true)

    try {
      // 1. Create Payment Order on backend
      const orderData = await createPaymentOrder(shippingAddress)

      // 2. Load Razorpay script
      const scriptLoaded = await loadRazorpayScript()
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay payment gateway. Please check your internet connection.')
      }

      // 3. Open Razorpay Checkout modal
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'ShopKart',
        description: 'ShopKart Order Payment',
        order_id: orderData.razorpayOrderId,
        handler: async function (response) {
          try {
            setSubmitting(true)
            // 4. Verify signature on backend
            const verifyRes = await verifyPayment({
              shopKartOrderId: orderData.shopKartOrderId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            })

            if (verifyRes.success) {
              clearCartState()
              navigate(`/order-success/${orderData.shopKartOrderId}`, {
                state: { order: verifyRes.order }
              })
            } else {
              setServerError(verifyRes.message || 'Payment verification failed.')
              setSubmitting(false)
            }
          } catch (err) {
            setServerError(err.message || 'Payment verification failed.')
            setSubmitting(false)
          }
        },
        prefill: {
          name: shippingAddress.fullName.trim(),
          contact: shippingAddress.phone.trim()
        },
        theme: {
          color: '#2563eb'
        },
        modal: {
          ondismiss: function () {
            setSubmitting(false)
          }
        }
      }

      const rzp = new window.Razorpay(options)

      rzp.on('payment.failed', function (response) {
        console.error('Payment failed:', response.error)
        setServerError(
          `Payment failed: ${response.error?.description || 'Transaction unsuccessful'}. Your cart has not been cleared. Please try again.`
        )
        setSubmitting(false)
      })

      rzp.open()
    } catch (err) {
      setServerError(err.message || 'Something went wrong while placing your order.')
      setSubmitting(false)
    }
  }

  return (
    <main className="checkout-page">
      <h1 className="checkout-title">Checkout</h1>

      {serverError && (
        <div className="error-message" style={{ marginBottom: '20px' }}>
          {serverError}
        </div>
      )}

      <div className="checkout-layout">
        {/* Shipping Details Form */}
        <section className="checkout-form-section">
          <h2>Shipping Details</h2>
          <form id="shipping-form" onSubmit={handlePlaceOrder} noValidate>
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={shippingAddress.fullName}
                onChange={handleChange}
                placeholder="Aarav Sharma"
                disabled={submitting}
              />
              {formErrors.fullName && <span className="field-error">{formErrors.fullName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={shippingAddress.phone}
                onChange={handleChange}
                placeholder="9876543210"
                disabled={submitting}
              />
              {formErrors.phone && <span className="field-error">{formErrors.phone}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="addressLine1">Address</label>
              <input
                id="addressLine1"
                name="addressLine1"
                type="text"
                value={shippingAddress.addressLine1}
                onChange={handleChange}
                placeholder="22 MG Road"
                disabled={submitting}
              />
              {formErrors.addressLine1 && <span className="field-error">{formErrors.addressLine1}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  value={shippingAddress.city}
                  onChange={handleChange}
                  placeholder="Bengaluru"
                  disabled={submitting}
                />
                {formErrors.city && <span className="field-error">{formErrors.city}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="state">State</label>
                <input
                  id="state"
                  name="state"
                  type="text"
                  value={shippingAddress.state}
                  onChange={handleChange}
                  placeholder="Karnataka"
                  disabled={submitting}
                />
                {formErrors.state && <span className="field-error">{formErrors.state}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="pincode">Pincode</label>
              <input
                id="pincode"
                name="pincode"
                type="text"
                value={shippingAddress.pincode}
                onChange={handleChange}
                placeholder="560001"
                disabled={submitting}
              />
              {formErrors.pincode && <span className="field-error">{formErrors.pincode}</span>}
            </div>
          </form>
        </section>

        {/* Order Summary */}
        <aside className="checkout-summary-section">
          <h2>Order Summary</h2>
          <div className="checkout-items-list">
            {cartItems.map((item) => {
              const product = item.product
              const price = product ? product.price : 0
              const itemTotal = price * item.quantity
              return (
                <div key={product?._id || item._id} className="checkout-item-row">
                  <div className="checkout-item-info">
                    <span className="checkout-item-name">{product?.name || 'Product'}</span>
                    <span className="checkout-item-qty">× {item.quantity}</span>
                  </div>
                  <span className="checkout-item-price">₹{itemTotal.toLocaleString('en-IN')}</span>
                </div>
              )
            })}
          </div>

          <div className="checkout-total-row">
            <span>Total</span>
            <strong>₹{subtotal.toLocaleString('en-IN')}</strong>
          </div>

          <button
            type="submit"
            form="shipping-form"
            className="primary-button"
            disabled={submitting}
          >
            {submitting ? 'Processing Payment...' : 'Place Order'}
          </button>

          <p className="checkout-test-note">
            💳 Razorpay Test Mode active. No real money will be charged.
          </p>

          <div style={{ marginTop: '12px', textAlign: 'center' }}>
            <Link to="/cart" style={{ color: '#2563eb', fontSize: '14px', textDecoration: 'none' }}>
              ← Return to Cart
            </Link>
          </div>
        </aside>
      </div>
    </main>
  )
}

export default Checkout
