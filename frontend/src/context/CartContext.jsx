import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CartContext } from './cart-context'
import {
  addToCart as addToCartRequest,
  getCart,
  removeFromCart as removeFromCartRequest,
  updateCartQuantity as updateCartQuantityRequest
} from '../services/api'

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const revision = useRef(0)
  const mutationQueue = useRef(Promise.resolve())

  useEffect(() => {
    let active = true
    const startingRevision = revision.current
    getCart()
      .then((data) => {
        if (active && startingRevision === revision.current) {
          setCartItems(data.cart)
          setError('')
        }
      })
      .catch((requestError) => {
        if (active && startingRevision === revision.current) {
          setError(requestError.message || 'Unable to load your cart.')
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  const refreshCart = useCallback(async () => {
    const startingRevision = revision.current
    setLoading(true)
    setError('')
    try {
      const data = await getCart()
      if (startingRevision === revision.current) {
        setCartItems(data.cart)
      }
    } catch (requestError) {
      if (startingRevision === revision.current) {
        setError(requestError.message || 'Unable to load your cart.')
      }
    } finally {
      setLoading(false)
    }
  }, [])

  const mutateCart = useCallback((request) => {
    const operation = mutationQueue.current.then(async () => {
      const data = await request()
      revision.current += 1
      setCartItems(data.cart)
      setError('')
      return data
    })
    mutationQueue.current = operation.catch(() => {})
    return operation
  }, [])

  const addToCart = useCallback(
    (productId) => mutateCart(() => addToCartRequest(productId)),
    [mutateCart]
  )
  const updateQuantity = useCallback(
    (productId, quantity) => mutateCart(() => updateCartQuantityRequest(productId, quantity)),
    [mutateCart]
  )
  const removeFromCart = useCallback(
    (productId) => mutateCart(() => removeFromCartRequest(productId)),
    [mutateCart]
  )

  const value = useMemo(
    () => ({ cartItems, loading, error, refreshCart, addToCart, updateQuantity, removeFromCart }),
    [cartItems, loading, error, refreshCart, addToCart, updateQuantity, removeFromCart]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
