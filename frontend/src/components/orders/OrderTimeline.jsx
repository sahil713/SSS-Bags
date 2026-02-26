import { motion } from 'framer-motion'

const STAGES = [
  { key: 'pending', label: 'Pending' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'delivered', label: 'Delivered' },
]

export default function OrderTimeline({ status }) {
  const currentIndex = STAGES.findIndex((s) => s.key === status)
  const isCancelled = status === 'cancelled'

  if (isCancelled) {
    return (
      <div className="flex items-center gap-2 py-2">
        <span className="text-sm font-medium text-red-600 dark:text-red-400">Cancelled</span>
      </div>
    )
  }

  return (
    <div className="flex items-stretch gap-0 py-2">
      {STAGES.map((stage, i) => {
        const isActive = i <= currentIndex
        const isCurrent = i === currentIndex
        const showConnectorAfter = i < STAGES.length - 1
        const nextActive = i < currentIndex
        return (
          <div key={stage.key} className="flex items-center flex-1 min-w-0">
            <div className="flex flex-col items-center flex-1 min-w-0">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
                className={
                  'w-3 h-3 rounded-full shrink-0 ' +
                  (isActive ? 'bg-primary-600 dark:bg-primary-500' : 'bg-gray-300 dark:bg-gray-600') +
                  (isCurrent ? ' ring-2 ring-primary-400 ring-offset-2 dark:ring-offset-gray-800' : '')
                }
              />
              <span
                className={
                  'text-xs mt-1 truncate w-full text-center block ' +
                  (isActive ? 'text-primary-700 dark:text-primary-400 font-medium' : 'text-gray-500 dark:text-gray-400')
                }
              >
                {stage.label}
              </span>
            </div>
            {showConnectorAfter && (
              <div className="flex-1 min-w-[8px] h-0.5 self-center mx-0.5 bg-gray-200 dark:bg-gray-700 overflow-hidden rounded">
                <motion.div
                  className="h-full bg-primary-500 dark:bg-primary-400 rounded"
                  initial={{ width: '0%' }}
                  animate={{ width: nextActive ? '100%' : '0%' }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
