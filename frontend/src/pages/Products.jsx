import { useState, useEffect } from 'react'
import ProductCard from '../components/ProductCard'
import SearchBar from '../components/SearchBar'
import { getProducts } from '../services/api'

function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Filters state
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [sort, setSort] = useState('')

  useEffect(() => {
    // Debounce search slightly
    const timeoutId = setTimeout(() => {
      fetchProducts()
    }, 300)
    
    return () => clearTimeout(timeoutId)
  }, [search, category, sort])

  async function fetchProducts() {
    setLoading(true)
    setError(null)
    try {
      const data = await getProducts(search, category, sort)
      setProducts(data.products)
    } catch (err) {
      setError('Something went wrong while loading products.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h2>Our Products</h2>
        
        <SearchBar 
          search={search} setSearch={setSearch}
          category={category} setCategory={setCategory}
          sort={sort} setSort={setSort}
        />

        {loading && <p>Loading products...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        {!loading && !error && products.length === 0 && (
          <p>No products found.</p>
        )}

        {!loading && !error && products.length > 0 && (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
            gap: '2rem' 
          }}>
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default Products
