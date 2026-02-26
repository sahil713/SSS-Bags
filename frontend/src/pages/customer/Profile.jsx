import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getProfile, updateProfile } from '../../api/profile'
import { getAddresses, createAddress } from '../../api/addresses'
import { useDispatch, useSelector } from 'react-redux'
import { updateUser } from '../../store/slices/authSlice'
import Button from '../../components/Button'
import Input from '../../components/Input'
import PhoneInput from '../../components/PhoneInput'

export default function Profile() {
  const user = useSelector((s) => s.auth.user)
  const dispatch = useDispatch()
  const [name, setName] = useState(user?.name || '')
  const [phone_number, setPhoneNumber] = useState(user?.phone_number || '')
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || null)
  const [avatarFile, setAvatarFile] = useState(null)
  const blobUrlRef = useRef(null)
  const [addresses, setAddresses] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [newAddr, setNewAddr] = useState({ line1: '', line2: '', city: '', state: '', pincode: '', phone: '', default: false })

  useEffect(() => {
    getProfile().then((res) => {
      const u = res.data
      setName(u.name || '')
      setPhoneNumber(u.phone_number || '')
      setAvatarUrl(u.avatar_url || null)
    }).catch(() => {})
    getAddresses().then((res) => setAddresses(res.data.addresses || [])).catch(() => {})
  }, [])
  useEffect(() => {
    if (user?.avatar_url) setAvatarUrl(user.avatar_url)
  }, [user?.avatar_url])
  useEffect(() => () => {
    if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    const payload = { name, phone_number }
    if (avatarFile) payload.avatar = avatarFile
    updateProfile(payload)
      .then((res) => {
        dispatch(updateUser(res.data))
        setAvatarUrl(res.data.avatar_url || null)
        setAvatarFile(null)
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-content mx-auto px-6 lg:px-12 py-12 lg:py-16"
    >
      <div className="mb-8 w-full pl-0">
        <nav className="flex gap-8 w-full text-sm font-medium border-b border-gray-200 dark:border-gray-700 pb-4" aria-label="Account sections">
          <Link to="/profile" className="text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400 pb-4 -mb-4 shrink-0 pl-0">
            My Profile
          </Link>
          <Link
            to="/my-orders"
            className="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors pb-4 -mb-4 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 shrink-0"
          >
            My Orders
          </Link>
        </nav>
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mt-6 mb-0 pl-0">Profile</h1>
      </div>

      {user && (
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Email: {user.email}
            {user.email_verified ? (
              <span className="ml-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800">
                ✓ Verified
              </span>
            ) : (
              <span className="ml-1.5 text-amber-600 dark:text-amber-400">(not verified)</span>
            )}
          </span>
          <span className="text-gray-300 dark:text-gray-600">·</span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Phone:
            {user.phone_verified ? (
              <span className="ml-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800">
                ✓ Verified
              </span>
            ) : (
              <span className="ml-1.5 text-amber-600 dark:text-amber-400">(not verified)</span>
            )}
          </span>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        <motion.section
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-soft hover:shadow-soft-lg p-6 lg:p-8 transition-shadow duration-200"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Personal details</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex items-center gap-4">
              <label className="relative cursor-pointer group block">
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    if (f) {
                      if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current)
                      blobUrlRef.current = URL.createObjectURL(f)
                      setAvatarFile(f)
                      setAvatarUrl(blobUrlRef.current)
                    }
                    e.target.value = ''
                  }}
                />
                <div className="relative w-20 h-20">
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-primary-500 flex items-center justify-center ring-2 ring-primary-400 group-hover:ring-primary-400 transition-all shadow-md">
                    {(avatarUrl || avatarFile) ? (
                      <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl font-semibold text-white">
                        {(name || user?.name || '?').trim().slice(0, 2).toUpperCase() || '?'}
                      </span>
                    )}
                  </div>
                  <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-medium">
                    Change
                  </span>
                </div>
              </label>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Profile photo</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Click to upload a new avatar</p>
              </div>
            </div>
            {message && (
              <motion.p
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-sm font-medium ${message === 'Profile updated' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
              >
                {message}
              </motion.p>
            )}
            <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <PhoneInput label="Phone number" value={phone_number} onChange={setPhoneNumber} />
            <div className="flex justify-end pt-1">
              <Button type="submit" disabled={loading} className="rounded-xl px-6 py-3 min-w-[120px]">
                {loading ? 'Saving…' : 'Save'}
              </Button>
            </div>
          </form>
        </motion.section>

        <motion.section
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-soft hover:shadow-soft-lg p-6 lg:p-8 transition-shadow duration-200"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Shipping addresses</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Add a default address to place orders from cart.</p>
          {addresses.length > 0 && (
            <ul className="space-y-4 mb-6">
              {addresses.map((a) => (
                <li
                  key={a.id}
                  className="rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 p-4 text-sm text-gray-700 dark:text-gray-300"
                >
                  <div className="flex items-start justify-between gap-2">
                    <address className="not-italic space-y-0.5">
                      <p className="font-medium text-gray-900 dark:text-white">{a.line1}</p>
                      {a.line2 && <p>{a.line2}</p>}
                      <p>{[a.city, a.state].filter(Boolean).join(', ')} {a.pincode && `- ${a.pincode}`}</p>
                      {a.phone && <p className="text-gray-600 dark:text-gray-400">Phone: {a.phone}</p>}
                    </address>
                    {a.default && (
                      <span className="shrink-0 px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-400 border border-primary-200 dark:border-primary-800">
                        Default
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
          <form onSubmit={handleAddAddress} className="space-y-4 p-4 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/30 hover:border-primary-300 dark:hover:border-primary-700/50 transition-colors duration-200">
            <Input label="Address line 1" value={newAddr.line1} onChange={(e) => setNewAddr((a) => ({ ...a, line1: e.target.value }))} required />
            <Input label="Address line 2" value={newAddr.line2} onChange={(e) => setNewAddr((a) => ({ ...a, line2: e.target.value }))} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="City" value={newAddr.city} onChange={(e) => setNewAddr((a) => ({ ...a, city: e.target.value }))} required />
              <Input label="State" value={newAddr.state} onChange={(e) => setNewAddr((a) => ({ ...a, state: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Pincode" value={newAddr.pincode} onChange={(e) => setNewAddr((a) => ({ ...a, pincode: e.target.value }))} required />
              <PhoneInput label="Phone" value={newAddr.phone} onChange={(v) => setNewAddr((a) => ({ ...a, phone: v }))} />
            </div>
            <label className="flex items-center gap-2 cursor-pointer select-none hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              <input
                type="checkbox"
                checked={newAddr.default}
                onChange={(e) => setNewAddr((a) => ({ ...a, default: e.target.checked }))}
                className="rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500 focus:ring-2"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Set as default</span>
            </label>
            <div className="flex justify-end pt-1">
              <Button type="submit" className="rounded-xl px-6 py-3 min-w-[140px]">Add address</Button>
            </div>
          </form>
        </motion.section>
      </div>
    </motion.div>
  )
}
