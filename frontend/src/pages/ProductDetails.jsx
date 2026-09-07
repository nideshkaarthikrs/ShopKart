import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProductById } from '../services/api'

function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchProductDetails()
  }, [id])

  async function fetchProductDetails() {
    try {
      const data = await getProductById(id)
      setProduct(data.product)
    } catch (err) {
      setError('Something went wrong while loading product details.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div style={{ padding: '2rem' }}>Loading product details...</div>
  if (error) return <div style={{ padding: '2rem', color: 'red' }}>{error}</div>
  if (!product) return <div style={{ padding: '2rem' }}>Product not found.</div>

  return (
    <>
      <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <img 
          src={product.image} 
          alt={product.name} 
          style={{ width: '100%', maxWidth: '400px', objectFit: 'cover', borderRadius: '8px' }} 
        />
        <div style={{ flex: 1, minWidth: '300px' }}>
          <h2>{product.name}</h2>
          <p style={{ color: '#555', fontSize: '1.2rem', marginBottom: '1rem' }}>{product.category}</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2c3e50', marginBottom: '1rem' }}>₹{product.price}</p>
          <p style={{ lineHeight: '1.6', marginBottom: '1rem' }}>{product.description}</p>
          <p style={{ color: product.stock > 0 ? 'green' : 'red', fontWeight: 'bold', marginBottom: '2rem' }}>
            {product.stock > 0 ? `${product.stock} units left in stock` : 'Out of stock'}
          </p>
          <button 
            style={{ 
              padding: '1rem 2rem', 
              backgroundColor: '#28a745', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              fontSize: '1.1rem', 
              cursor: product.stock > 0 ? 'pointer' : 'not-allowed',
              opacity: product.stock > 0 ? 1 : 0.5
            }}
            disabled={product.stock <= 0}
            onClick={() => alert('Add to Cart functionality coming soon!')}
          >
            Add to Cart
          </button>
          
          <div style={{ marginTop: '2rem' }}>
             <button onClick={() => navigate('/products')} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
               &larr; Back to Products
             </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProductDetails
