import { useNavigate } from 'react-router-dom'
import { logoutCustomer } from '../services/api'

function Navbar() {
  const navigate = useNavigate()

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
        <a href="/home" style={{ color: 'white', textDecoration: 'none' }}>Home</a>
        <a href="/products" style={{ color: 'white', textDecoration: 'none' }}>Products</a>
      </div>
      <button type="button" className="link-button" onClick={handleLogout}>
        Logout
      </button>
    </nav>
  )
}

export default Navbar
