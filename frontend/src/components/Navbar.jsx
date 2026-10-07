import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/useCart'
import { logoutCustomer } from '../services/api'

function Navbar() {
  const navigate = useNavigate()
  const { cartItems } = useCart()
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  async function handleLogout() {
    try {
      await logoutCustomer()
      navigate('/login', { replace: true })
    } catch {
      navigate('/login', { replace: true })
    }
  }

  return (
    <nav className="navbar">
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <strong>ShopKart</strong>
        <Link to="/home" style={{ color: 'white', textDecoration: 'none' }}>Home</Link>
        <Link to="/products" style={{ color: 'white', textDecoration: 'none' }}>Products</Link>
        <Link to="/wishlist" style={{ color: 'white', textDecoration: 'none' }}>Wishlist</Link>
        <Link to="/cart" style={{ color: 'white', textDecoration: 'none' }}>Cart ({cartCount})</Link>
        <Link to="/orders" style={{ color: 'white', textDecoration: 'none' }}>Orders</Link>
      </div>
      <button type="button" className="link-button" onClick={handleLogout}>
        Logout
      </button>
    </nav>
  )
}

export default Navbar
