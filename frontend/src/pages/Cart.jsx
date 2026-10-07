import { useNavigate } from 'react-router-dom'
import CartItem from '../components/CartItem'
import { useCart } from '../context/useCart'

function Cart() {
  const navigate = useNavigate()
  const { cartItems, loading, error, refreshCart } = useCart()

  if (loading) {
    return <p className="cart-status">Loading your cart...</p>
  }

  if (error) {
    return (
      <main className="cart-status">
        <h1>Unable to load your cart.</h1>
        <button type="button" className="primary-button cart-retry" onClick={refreshCart}>
          Try Again
        </button>
      </main>
    )
  }

  if (cartItems.length === 0) {
    return (
      <main className="cart-status">
        <div className="empty-cart-icon" aria-hidden="true">🛒</div>
        <h1>Your cart is empty</h1>
        <p>Looks like you haven't added anything yet.</p>
        <button type="button" className="primary-button cart-browse" onClick={() => navigate('/products')}>
          Browse Products
        </button>
      </main>
    )
  }

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0)
  const subtotal = cartItems.reduce(
    (total, item) => total + (item.product ? item.product.price * item.quantity : 0),
    0
  )

  return (
    <main className="cart-page">
      <section className="cart-list">
        <h1>My Cart</h1>
        {cartItems.map((item) => (
          <CartItem key={item.product?._id || item._id} item={item} />
        ))}
      </section>
      <aside className="order-summary">
        <h2>Order Summary</h2>
        <p><span>Items</span><strong>{totalItems}</strong></p>
        <p className="subtotal-row">
          <span>Subtotal</span>
          <strong>₹{subtotal.toLocaleString('en-IN')}</strong>
        </p>
        <button
          type="button"
          className="primary-button"
          onClick={() => navigate('/checkout')}
        >
          Proceed to Checkout
        </button>
      </aside>
    </main>
  )
}

export default Cart
