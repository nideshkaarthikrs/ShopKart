import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getWishlist, removeFromWishlist } from '../services/api'

function Wishlist() {
  const navigate = useNavigate()
  const [wishlist, setWishlist] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [removingId, setRemovingId] = useState(null)

  useEffect(() => {
    fetchWishlist()
  }, [])

  async function fetchWishlist() {
    setLoading(true)
    setError(null)
    try {
      const data = await getWishlist()
      setWishlist(data.wishlist || [])
    } catch {
      setError("Something went wrong. We couldn't load your wishlist.")
    } finally {
      setLoading(false)
    }
  }

  async function handleRemove(productId) {
    setRemovingId(productId)
    try {
      await removeFromWishlist(productId)
      setWishlist((prev) => prev.filter((item) => item._id !== productId))
    } catch (err) {
      alert(err.message || 'Failed to remove product from wishlist')
    } finally {
      setRemovingId(null)
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center' }}>
        <p>Loading your wishlist...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center' }}>
        <h3>Something went wrong.</h3>
        <p style={{ color: '#666', margin: '0.5rem 0 1.5rem' }}>
          We couldn't load your wishlist.
        </p>
        <button
          onClick={fetchWishlist}
          style={{
            padding: '0.6rem 1.5rem',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Try Again
        </button>
      </div>
    )
  }

  if (wishlist.length === 0) {
    return (
      <div style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❤️</div>
        <h2>Your wishlist is empty</h2>
        <p style={{ color: '#666', margin: '0.5rem 0 1.5rem' }}>
          Save products you love and find them here later.
        </p>
        <button
          onClick={() => navigate('/products')}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          Browse Products
        </button>
      </div>
    )
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h2>My Wishlist</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        {wishlist.length} {wishlist.length === 1 ? 'product' : 'products'} saved
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '2rem'
        }}
      >
        {wishlist.map((product) => (
          <div
            key={product._id}
            style={{
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <img
              src={product.image}
              alt={product.name}
              style={{
                width: '100%',
                height: '200px',
                objectFit: 'cover',
                borderRadius: '4px'
              }}
            />
            <h3 style={{ margin: '0.5rem 0' }}>{product.name}</h3>
            <p style={{ color: '#555', margin: '0.2rem 0' }}>{product.category}</p>
            <p style={{ fontWeight: 'bold', margin: '0.5rem 0' }}>₹{product.price}</p>
            <p
              style={{
                color: product.stock > 0 ? 'green' : 'red',
                margin: '0.2rem 0'
              }}
            >
              {product.stock > 0 ? `${product.stock} units left` : 'Out of stock'}
            </p>

            <div
              style={{
                marginTop: 'auto',
                display: 'flex',
                gap: '0.5rem',
                flexDirection: 'column',
                paddingTop: '0.5rem'
              }}
            >
              <button
                onClick={() => navigate(`/products/${product._id}`)}
                style={{
                  padding: '0.5rem',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                View Details
              </button>
              <button
                onClick={() => handleRemove(product._id)}
                disabled={removingId === product._id}
                style={{
                  padding: '0.5rem',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: removingId === product._id ? 'not-allowed' : 'pointer',
                  opacity: removingId === product._id ? 0.7 : 1
                }}
              >
                {removingId === product._id ? 'Removing...' : 'Remove from Wishlist'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Wishlist
