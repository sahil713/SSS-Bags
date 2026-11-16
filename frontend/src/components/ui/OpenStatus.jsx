import { useEffect, useState } from 'react'
import { SHOP } from '../../constants/shop'

const toMinutes = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

const format12h = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number)
  const suffix = h >= 12 ? 'pm' : 'am'
  const hour = h % 12 || 12
  return m ? `${hour}:${String(m).padStart(2, '0')} ${suffix}` : `${hour} ${suffix}`
}

// Shop time is always India time, whatever the visitor's own timezone.
function minutesNowInIndia() {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date())
  const get = (type) => Number(parts.find((p) => p.type === type)?.value)
  return get('hour') * 60 + get('minute')
}

export function shopStatus() {
  const now = minutesNowInIndia()
  const open = toMinutes(SHOP.hours.open)
  const close = toMinutes(SHOP.hours.close)
  const isOpen = now >= open && now < close
  return {
    isOpen,
    text: isOpen
      ? `Open now · closes ${format12h(SHOP.hours.close)}`
      : `Closed now · opens ${now < open ? '' : 'tomorrow '}${format12h(SHOP.hours.open)}`,
  }
}

export default function OpenStatus({ className = '' }) {
  const [status, setStatus] = useState(shopStatus)

  useEffect(() => {
    const t = setInterval(() => setStatus(shopStatus()), 60000)
    return () => clearInterval(t)
  }, [])

  const dot = status.isOpen ? 'bg-emerald-400' : 'bg-amber-400'

  return (
    <span className={'inline-flex items-center gap-2 ' + className}>
      <span className="relative flex w-2 h-2">
        {status.isOpen && <span className={'absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping ' + dot} />}
        <span className={'relative inline-flex w-2 h-2 rounded-full ' + dot} />
      </span>
      {status.text}
    </span>
  )
}
