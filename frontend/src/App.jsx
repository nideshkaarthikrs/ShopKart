import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import { getCurrentCustomer } from './services/api'
import './App.css'

function ProtectedHome() {
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
      <Home customer={customer} />
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
        <Route path="/home" element={<ProtectedHome />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
