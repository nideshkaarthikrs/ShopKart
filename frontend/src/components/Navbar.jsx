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
      <strong>ShopKart</strong>
      <button type="button" className="link-button" onClick={handleLogout}>
        Logout
      </button>
    </nav>
  )
}

export default Navbar
