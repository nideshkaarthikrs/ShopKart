import { useState } from 'react'
import { useCart } from '../context/useCart'

function AddToCartButton({ product, style }) {
  const { addToCart } = useCart()
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState('')

  async function handleAddToCart() {
    setAdding(true)
    setError('')
    try {
      await addToCart(product._id)
    } catch (requestError) {
      setError(requestError.message || 'Unable to add product to cart.')
    } finally {
      setAdding(false)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={adding || product.stock <= 0}
        style={style}
      >
        {adding ? 'Adding...' : 'Add to Cart'}
      </button>
      {error && <p className="error-message add-to-cart-error" role="alert">{error}</p>}
    </>
  )
}

export default AddToCartButton
