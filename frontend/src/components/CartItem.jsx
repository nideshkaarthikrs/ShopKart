import { useState } from 'react'
import { useCart } from '../context/useCart'

function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const product = item.product

  async function changeQuantity(quantity) {
    setBusy(true)
    setError('')
    try {
      await updateQuantity(product._id, quantity)
    } catch (requestError) {
      setError(requestError.message || 'Unable to update quantity.')
    } finally {
      setBusy(false)
    }
  }

  async function handleRemove() {
    setBusy(true)
    setError('')
    try {
      await removeFromCart(product?._id || item.product)
    } catch (requestError) {
      setError(requestError.message || 'Unable to remove product.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <article className="cart-item">
      {product ? (
        <img className="cart-item-image" src={product.image} alt={product.name} />
      ) : (
        <div className="cart-item-image unavailable-image">Unavailable</div>
      )}
      <div className="cart-item-details">
        <h2>{product?.name || 'Product no longer available'}</h2>
        {product && <p className="cart-item-price">₹{product.price.toLocaleString('en-IN')}</p>}
        {product && item.quantity > product.stock && (
          <p className="stock-warning" role="status">
            {product.stock > 0
              ? `Only ${product.stock} currently in stock. Reduce the quantity before checkout.`
              : 'This product is out of stock. Remove it from your cart to continue.'}
          </p>
        )}
        <div className="cart-item-actions">
          {product && (
            <div className="quantity-control" aria-label={`Quantity for ${product.name}`}>
              <button
                type="button"
                aria-label={`Decrease ${product.name} quantity`}
                onClick={() => changeQuantity(
                  item.quantity > product.stock && product.stock > 0
                    ? product.stock
                    : item.quantity - 1
                )}
                disabled={busy || item.quantity <= 1 || (item.quantity > product.stock && product.stock === 0)}
              >
                −
              </button>
              <span>{item.quantity}</span>
              <button
                type="button"
                aria-label={`Increase ${product.name} quantity`}
                onClick={() => changeQuantity(item.quantity + 1)}
                disabled={busy || item.quantity >= product.stock}
              >
                +
              </button>
            </div>
          )}
          <button type="button" className="remove-cart-item" onClick={handleRemove} disabled={busy}>
            {busy ? 'Updating...' : 'Remove'}
          </button>
        </div>
        {error && <p className="error-message cart-item-error" role="alert">{error}</p>}
      </div>
      {product && (
        <strong className="cart-item-total">
          ₹{(product.price * item.quantity).toLocaleString('en-IN')}
        </strong>
      )}
    </article>
  )
}

export default CartItem
