import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const STORAGE_KEY = 'sss-bags-announcement-closed'
const DEFAULT_MESSAGE = '🔥 Diwali Mega Sale Live Now! Shop Before It Ends!'

export default function AnnouncementBar({ announcements = [] }) {
  const [closed, setClosed] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'true'
    } catch {
      return false
    }
  })
  const [closedIds, setClosedIds] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY + '-ids')
      return raw ? new Set(JSON.parse(raw)) : new Set()
    } catch {
      return new Set()
    }
  })

  const items = announcements.filter((a) => !closedIds.has(a.id))
  const showDefault = items.length === 0 && !closed
  const showBar = (items.length > 0 || showDefault) && !closed

  useEffect(() => {
    if (closed) localStorage.setItem(STORAGE_KEY, 'true')
  }, [closed])

  useEffect(() => {
    if (closedIds.size > 0) {
      localStorage.setItem(STORAGE_KEY + '-ids', JSON.stringify(Array.from(closedIds)))
    }
  }, [closedIds])

  const handleClose = () => {
    if (items.length > 0) {
      setClosedIds(new Set(announcements.map((a) => a.id)))
    }
    setClosed(true)
  }

  const handleCloseOne = (id) => {
    setClosedIds((prev) => new Set([...prev, id]))
  }

  if (!showBar && !showDefault) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="sticky top-0 z-[100] overflow-hidden bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 dark:from-primary-700 dark:to-primary-900 text-white shadow-md"
      >
        <div className="max-w-content mx-auto px-6 lg:px-12 py-3">
          <div className="flex items-center justify-center gap-4 flex-wrap pr-10">
            {items.length > 0 ? (
              items.map((ann) => (
                <div key={ann.id} className="flex items-center gap-2" style={{ color: ann.text_color || undefined }}>
                  <span className="text-sm font-medium">
                    {ann.link ? (
                      <a href={ann.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        {ann.message}
                      </a>
                    ) : (
                      ann.message
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCloseOne(ann.id)}
                    className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
                    aria-label="Close"
                  >
                    ×
                  </button>
                </div>
              ))
            ) : (
              <span className="text-sm font-medium">{DEFAULT_MESSAGE}</span>
            )}
            <button
              type="button"
              onClick={handleClose}
              className="absolute right-6 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-white/20 transition-colors"
              aria-label="Close announcement"
            >
              ×
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
