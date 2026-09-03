import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerCustomer } from '../services/api'

const initialForm = { fullName: '', email: '', password: '', phone: '' }

function Register() {
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (Object.values(form).some((value) => !value.trim())) {
      setError('Please fill in all fields')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    try {
      await registerCustomer(form)
      navigate('/login')
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Create your account</h1>
        <p className="subtitle">Join ShopKart today</p>
        {error && <p className="error-message">{error}</p>}
        <label>Full Name<input name="fullName" value={form.fullName} onChange={handleChange} /></label>
        <label>Email<input type="email" name="email" value={form.email} onChange={handleChange} /></label>
        <label>Password<input type="password" name="password" value={form.password} onChange={handleChange} /></label>
        <label>Phone Number<input name="phone" value={form.phone} onChange={handleChange} /></label>
        <button type="submit" className="primary-button">Create Account</button>
        <p className="form-footer">Already have an account? <Link to="/login">Login</Link></p>
      </form>
    </main>
  )
}

export default Register
