import { useNavigate } from 'react-router-dom'

function ProductCard({ product }) {
  const navigate = useNavigate()

  return (
    <div className="product-card" style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column' }}>
      <img src={product.image} alt={product.name} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px' }} />
      <h3 style={{ margin: '0.5rem 0' }}>{product.name}</h3>
      <p style={{ color: '#555', margin: '0.2rem 0' }}>{product.category}</p>
      <p style={{ fontWeight: 'bold', margin: '0.5rem 0' }}>₹{product.price}</p>
      <p style={{ color: product.stock > 0 ? 'green' : 'red', margin: '0.2rem 0' }}>
        {product.stock > 0 ? `${product.stock} units left` : 'Out of stock'}
      </p>
      <button 
        onClick={() => navigate(`/products/${product._id}`)}
        style={{ marginTop: 'auto', padding: '0.5rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
      >
        View Details
      </button>
    </div>
  )
}

export default ProductCard
