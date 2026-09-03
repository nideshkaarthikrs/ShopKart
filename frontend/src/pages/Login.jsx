import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginCustomer } from '../services/api'

function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (!form.email || !form.password) {
      setError('Please enter your email and password')
      return
    }

    try {
      await loginCustomer(form)
      navigate('/home')
    } catch {
      setError('Invalid Credentials')
    }
  }

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Welcome back</h1>
        <p className="subtitle">Login to your ShopKart account</p>
        {error && <p className="error-message">{error}</p>}
        <label>Email<input type="email" name="email" value={form.email} onChange={handleChange} /></label>
        <label>Password<input type="password" name="password" value={form.password} onChange={handleChange} /></label>
        <button type="submit" className="primary-button">Login</button>
        <p className="form-footer">New to ShopKart? <Link to="/register">Create an account</Link></p>
      </form>
    </main>
  )
}

export default Login
