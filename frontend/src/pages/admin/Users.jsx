import { useEffect, useState } from 'react'
import { getUsers } from '../../api/admin'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [meta, setMeta] = useState({})

  useEffect(() => {
    setLoading(true)
    getUsers({ page, per_page: 20 }).then((res) => {
      setUsers(res.data.users || [])
      setMeta(res.data.meta || {})
    }).catch(() => setUsers([])).finally(() => setLoading(false))
  }, [page])

  const totalPages = Math.ceil(meta.total / meta.per_page) || 1

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Users</h1>
      {loading ? (
        <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />
      ) : (
        <>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3">ID</th>
                  <th className="text-left p-3">Name</th>
                  <th className="text-left p-3">Email</th>
                  <th className="text-left p-3">Phone</th>
                  <th className="text-left p-3">Role</th>
                  <th className="text-left p-3">Verified</th>
                  <th className="text-left p-3">Created</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-t border-gray-100">
                    <td className="p-3">{u.id}</td>
                    <td className="p-3 font-medium">{u.name}</td>
                    <td className="p-3">{u.email}</td>
                    <td className="p-3">{u.phone_number}</td>
                    <td className="p-3"><span className={`px-2 py-0.5 rounded ${u.role === 'admin' ? 'bg-primary-100 text-primary-800' : 'bg-gray-100'}`}>{u.role}</span></td>
                    <td className="p-3">{u.email_verified ? '✓' : ''} {u.phone_verified ? '✓' : ''}</td>
                    <td className="p-3">{new Date(u.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="mt-4 flex justify-center gap-2">
              <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} className="rounded-lg border border-primary-600 px-4 py-2 text-primary-700 disabled:opacity-50">Previous</button>
              <span className="py-2 px-4">Page {page} of {totalPages}</span>
              <button type="button" onClick={() => setPage((p) => p + 1)} disabled={page >= totalPages} className="rounded-lg border border-primary-600 px-4 py-2 text-primary-700 disabled:opacity-50">Next</button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
