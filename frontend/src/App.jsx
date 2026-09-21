import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Products from './pages/Products'
import ProductDetails from './pages/ProductDetails'
import Wishlist from './pages/Wishlist'
import { getCurrentCustomer } from './services/api'
import './App.css'

function ProtectedRoute({ element: Element }) {
  const [customer, setCustomer] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCurrentCustomer()
      .then(setCustomer)
      .catch(() => setCustomer(null))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="status-message">Loading...</p>
  if (!customer) return <Navigate to="/login" replace />

  return (
    <>
      <Navbar />
      <Element customer={customer} />
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<ProtectedRoute element={Home} />} />
        <Route path="/products" element={<ProtectedRoute element={Products} />} />
        <Route path="/products/:id" element={<ProtectedRoute element={ProductDetails} />} />
        <Route path="/wishlist" element={<ProtectedRoute element={Wishlist} />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
