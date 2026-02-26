export default function Spinner({ className = '', size = 'md' }) {
  const sizeClass = size === 'sm' ? 'w-5 h-5 border-2' : size === 'lg' ? 'w-12 h-12 border-3' : 'w-8 h-8 border-2'
  return (
    <div
      className={`rounded-full border-primary-200 dark:border-primary-900 border-t-primary-600 dark:border-t-primary-400 animate-spin ${sizeClass} ${className}`}
      role="status"
      aria-label="Loading"
    />
  )
}
