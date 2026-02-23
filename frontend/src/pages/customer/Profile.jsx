import { useEffect, useState } from 'react'
import { getProfile, updateProfile } from '../../api/profile'
import { getAddresses, createAddress } from '../../api/addresses'
import { useDispatch, useSelector } from 'react-redux'
import { updateUser } from '../../store/slices/authSlice'
import Button from '../../components/Button'
import Input from '../../components/Input'

export default function Profile() {
  const user = useSelector((s) => s.auth.user)
  const dispatch = useDispatch()
  const [name, setName] = useState(user?.name || '')
  const [phone_number, setPhoneNumber] = useState(user?.phone_number || '')
  const [addresses, setAddresses] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [newAddr, setNewAddr] = useState({ line1: '', line2: '', city: '', state: '', pincode: '', phone: '', default: false })

  useEffect(() => {
    getProfile().then((res) => {
      const u = res.data
      setName(u.name || '')
      setPhoneNumber(u.phone_number || '')
    }).catch(() => {})
    getAddresses().then((res) => setAddresses(res.data.addresses || [])).catch(() => {})
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    updateProfile({ name, phone_number })
      .then((res) => {
        dispatch(updateUser(res.data))
        setMessage('Profile updated')
      })
      .catch(() => setMessage('Update failed'))
      .finally(() => setLoading(false))
  }

  const handleAddAddress = (e) => {
    e.preventDefault()
    createAddress(newAddr).then(() => {
      getAddresses().then((r) => setAddresses(r.data.addresses || []))
      setNewAddr({ line1: '', line2: '', city: '', state: '', pincode: '', phone: '', default: false })
    }).catch(() => {})
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile</h1>
      {user && (
        <p className="text-sm text-gray-500 mb-4">
          Email: {user.email} {user.email_verified ? '✓' : '(not verified)'} · Phone: {user.phone_verified ? '✓' : '(not verified)'}
        </p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        {message && <p className="text-green-600 text-sm">{message}</p>}
        <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input label="Phone number" value={phone_number} onChange={(e) => setPhoneNumber(e.target.value)} />
        <Button type="submit" disabled={loading}>Save</Button>
      </form>
      <h2 className="font-semibold text-gray-900 mb-2">Shipping addresses</h2>
      <p className="text-sm text-gray-500 mb-2">Add a default address to place orders from cart.</p>
      {addresses.length > 0 && (
        <ul className="space-y-2 mb-4">
          {addresses.map((a) => (
            <li key={a.id} className="bg-gray-50 rounded-lg p-3 text-sm">
              {a.full_address} {a.default && <span className="text-primary-600 ml-1">(default)</span>}
            </li>
          ))}
        </ul>
      )}
      <form onSubmit={handleAddAddress} className="space-y-2 p-4 border border-gray-200 rounded-xl">
        <Input label="Address line 1" value={newAddr.line1} onChange={(e) => setNewAddr((a) => ({ ...a, line1: e.target.value }))} required />
        <Input label="Address line 2" value={newAddr.line2} onChange={(e) => setNewAddr((a) => ({ ...a, line2: e.target.value }))} />
        <div className="grid grid-cols-2 gap-2">
          <Input label="City" value={newAddr.city} onChange={(e) => setNewAddr((a) => ({ ...a, city: e.target.value }))} required />
          <Input label="State" value={newAddr.state} onChange={(e) => setNewAddr((a) => ({ ...a, state: e.target.value }))} />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Input label="Pincode" value={newAddr.pincode} onChange={(e) => setNewAddr((a) => ({ ...a, pincode: e.target.value }))} required />
          <Input label="Phone" value={newAddr.phone} onChange={(e) => setNewAddr((a) => ({ ...a, phone: e.target.value }))} />
        </div>
        <label className="flex items-center gap-2 mt-2">
          <input type="checkbox" checked={newAddr.default} onChange={(e) => setNewAddr((a) => ({ ...a, default: e.target.checked }))} />
          <span className="text-sm">Set as default</span>
        </label>
        <Button type="submit" className="mt-2">Add address</Button>
      </form>
    </div>
  )
}
