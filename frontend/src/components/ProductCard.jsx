import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addToWishlist } from '../services/api'

function ProductCard({ product }) {
  const navigate = useNavigate()
  const [wishlistStatus, setWishlistStatus] = useState('idle') // 'idle' | 'saving' | 'saved'
  const [wishlistError, setWishlistError] = useState('')

  async function handleAddToWishlist() {
    if (wishlistStatus === 'saving' || wishlistStatus === 'saved') return

    setWishlistStatus('saving')
    setWishlistError('')

    try {
      await addToWishlist(product._id)
      setWishlistStatus('saved')
    } catch (err) {
      setWishlistStatus('idle')
      setWishlistError(err.message || 'Unable to save product. Please try again.')
    }
  }

  return (
    <div className="product-card" style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column' }}>
      <img src={product.image} alt={product.name} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px' }} />
      <h3 style={{ margin: '0.5rem 0' }}>{product.name}</h3>
      <p style={{ color: '#555', margin: '0.2rem 0' }}>{product.category}</p>
      <p style={{ fontWeight: 'bold', margin: '0.5rem 0' }}>₹{product.price}</p>
      <p style={{ color: product.stock > 0 ? 'green' : 'red', margin: '0.2rem 0' }}>
        {product.stock > 0 ? `${product.stock} units left` : 'Out of stock'}
      </p>
      <div style={{ marginTop: 'auto', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button 
          onClick={() => navigate(`/products/${product._id}`)}
          style={{ flex: 1, padding: '0.5rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          View Details
        </button>
        <button
          onClick={handleAddToWishlist}
          disabled={wishlistStatus === 'saving' || wishlistStatus === 'saved'}
          style={{
            flex: 1,
            padding: '0.5rem',
            backgroundColor: wishlistStatus === 'saved' ? '#fce8e6' : 'white',
            color: wishlistStatus === 'saved' ? '#d93025' : '#333',
            border: '1px solid #ccc',
            borderRadius: '4px',
            cursor: wishlistStatus === 'saving' || wishlistStatus === 'saved' ? 'default' : 'pointer'
          }}
        >
          {wishlistStatus === 'saving' && '⏳ Saving...'}
          {wishlistStatus === 'saved' && '♥ Added to Wishlist'}
          {wishlistStatus === 'idle' && '♡ Add to Wishlist'}
        </button>
      </div>
      {wishlistError && (
        <p style={{ color: '#d93025', fontSize: '0.85rem', margin: '0.5rem 0 0' }}>
          {wishlistError}
        </p>
      )}
    </div>
  )
}

export default ProductCard
