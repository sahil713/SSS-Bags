import { useState, useEffect } from 'react'

function pad(n) {
  return String(n).padStart(2, '0')
}

export default function DiscountTimer({ endDate, label = 'Sale ends in', onEnd }) {
  const [left, setLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [mounted, setMounted] = useState(false)

  const end = endDate ? new Date(endDate).getTime() : null

  useEffect(() => {
    setMounted(true)
    if (!end) return

    const tick = () => {
      const now = Date.now()
      const diff = Math.max(0, end - now)
      if (diff === 0 && onEnd) onEnd()
      setLeft({
        days: Math.floor(diff / (24 * 60 * 60 * 1000)),
        hours: Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000)),
        minutes: Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000)),
        seconds: Math.floor((diff % (60 * 1000)) / 1000),
      })
    }

    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [end, onEnd])

  if (!mounted || !end) return null

  const { days, hours, minutes, seconds } = left
  const allZero = days === 0 && hours === 0 && minutes === 0 && seconds === 0
  if (allZero) return null

  return (
    <div className="inline-flex items-center gap-2 flex-wrap">
      {label && <span className="text-sm font-medium text-white/90">{label}</span>}
      <div className="flex gap-1.5">
        {days > 0 && (
          <span className="bg-white/20 rounded px-2 py-1 text-sm font-mono font-bold min-w-[2rem] text-center">
            {pad(days)}d
          </span>
        )}
        <span className="bg-white/20 rounded px-2 py-1 text-sm font-mono font-bold min-w-[2rem] text-center">
          {pad(hours)}
        </span>
        <span className="bg-white/20 rounded px-2 py-1 text-sm font-mono font-bold min-w-[2rem] text-center">
          {pad(minutes)}
        </span>
        <span className="bg-white/20 rounded px-2 py-1 text-sm font-mono font-bold min-w-[2rem] text-center">
          {pad(seconds)}
        </span>
      </div>
    </div>
  )
}
