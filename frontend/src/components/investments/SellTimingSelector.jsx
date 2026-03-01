const HORIZONS = [
  { days: 1, label: '1 day' },
  { days: 5, label: '5 days' },
  { days: 15, label: '15 days' },
  { days: 30, label: '1 month' },
  { days: 90, label: '3 months' },
  { days: 180, label: '6 months' },
  { days: 365, label: '1 year' },
]

export default function SellTimingSelector({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {HORIZONS.map((h) => (
        <button
          key={h.days}
          type="button"
          onClick={() => onChange(h.days)}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
            value === h.days
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          {h.label}
        </button>
      ))}
    </div>
  )
}
