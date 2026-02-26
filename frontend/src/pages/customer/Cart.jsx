import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getCart, updateCartItem, removeFromCart, clearCart } from '../../api/cart'
import { getAddresses } from '../../api/addresses'
import { useDispatch, useSelector } from 'react-redux'
import { setCart, clearCart as clearCartState } from '../../store/slices/cartSlice'
import { createOrder } from '../../api/orders'
import Button from '../../components/Button'

export default function Cart() {
  const { items, totalPrice, totalItems } = useSelector((s) => s.cart)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [placing, setPlacing] = useState(false)
  const [addresses, setAddresses] = useState([])
  const [selectedAddressId, setSelectedAddressId] = useState(null)

  useEffect(() => {
    getCart().then((r) => dispatch(setCart(r.data))).catch(() => {}).finally(() => setLoading(false))
    getAddresses().then((r) => {
      const addrs = r.data.addresses || []
      setAddresses(addrs)
      if (addrs.length > 0 && !selectedAddressId) {
        const defaultAddr = addrs.find((a) => a.default) || addrs[0]
        setSelectedAddressId(defaultAddr.id)
      }
    }).catch(() => {})
  }, [dispatch])

  const handleUpdateQty = (id, quantity) => {
    updateCartItem(id, quantity).then(() => getCart().then((r) => dispatch(setCart(r.data)))).catch(() => {})
  }

  const handleRemove = (id) => {
    removeFromCart(id).then(() => getCart().then((r) => dispatch(setCart(r.data)))).catch(() => {})
  }

  const handleClear = () => {
    clearCart().then(() => dispatch(clearCartState())).catch(() => {})
  }

  const handlePlaceOrder = () => {
    if (!selectedAddressId && addresses.length > 0) {
      alert('Please select a delivery address')
      return
    }
    if (addresses.length === 0) {
      alert('Please add a delivery address in your profile first.')
      navigate('/profile')
      return
    }
    setPlacing(true)
    createOrder({ address_id: selectedAddressId })
      .then((res) => {
        dispatch(clearCartState())
        navigate(`/orders/${res.data.id}/track`)
      })
      .catch((e) => alert(e.response?.data?.error || 'Failed to place order'))
      .finally(() => setPlacing(false))
  }

  if (loading) return <div className="animate-pulse h-64 bg-gray-100 rounded-xl" />
  if (!items?.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">Your cart is empty.</p>
        <Link to="/products"><Button>Shop products</Button></Link>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Cart ({totalItems} items)</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 bg-white border border-gray-200 rounded-xl p-4">
              <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                {item.image ? <img src={item.image} alt="" className="w-full h-full object-cover" /> : <span className="flex items-center justify-center h-full text-2xl">🛍</span>}
              </div>
              <div className="flex-1 min-w-0">
                <Link to={`/products/${item.slug}`} className="font-medium text-gray-900 hover:text-primary-600">{item.product_name}</Link>
                <p className="text-sm text-gray-500">₹{item.price} × {item.quantity} = ₹{item.subtotal}</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) => handleUpdateQty(item.id, Number(e.target.value) || 1)}
                  className="w-14 rounded border border-gray-300 px-2 py-1 text-center text-sm"
                />
                <button type="button" onClick={() => handleRemove(item.id)} className="text-red-600 text-sm hover:underline">Remove</button>
              </div>
            </div>
          ))}
          <button type="button" onClick={handleClear} className="text-sm text-red-600 hover:underline">Clear cart</button>
        </div>
        <div className="lg:w-80 shrink-0">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 sticky top-24 space-y-4">
            <h2 className="font-bold text-lg text-gray-900 dark:text-white">Delivery address</h2>
            {addresses.length === 0 ? (
              <p className="text-sm text-amber-600 dark:text-amber-400">
                No saved addresses. <Link to="/profile" className="underline font-medium">Add one in your profile</Link> before placing order.
              </p>
            ) : (
              <ul className="space-y-2">
                {addresses.map((a) => (
                  <li key={a.id}>
                    <label className={`flex gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedAddressId === a.id
                        ? 'border-primary-500 dark:border-primary-400 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}>
                      <input
                        type="radio"
                        name="delivery-address"
                        checked={selectedAddressId === a.id}
                        onChange={() => setSelectedAddressId(a.id)}
                        className="mt-1 text-primary-600"
                      />
                      <div className="text-sm text-gray-700 dark:text-gray-300 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white">{a.line1}</p>
                        {a.line2 && <p>{a.line2}</p>}
                        <p>{[a.city, a.state].filter(Boolean).join(', ')} {a.pincode && `- ${a.pincode}`}</p>
                        {a.default && <span className="text-primary-600 dark:text-primary-400 text-xs">Default</span>}
                      </div>
                    </label>
                  </li>
                ))}
              </ul>
            )}
            <h2 className="font-bold text-lg text-gray-900 dark:text-white pt-2">Summary</h2>
            <p className="text-gray-600 dark:text-gray-400">Total: <span className="font-bold text-primary-600 dark:text-primary-400 text-xl">₹{totalPrice}</span></p>
            <Button onClick={handlePlaceOrder} disabled={placing || addresses.length === 0} className="w-full mt-2">
              {placing ? 'Placing order...' : 'Place order'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
