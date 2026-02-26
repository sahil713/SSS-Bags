export default function Button({ children, variant = 'primary', type = 'button', className = '', disabled, ...props }) {
  const base =
    'inline-flex items-center justify-center rounded-xl font-semibold px-5 py-2.5 text-sm transition-all duration-200 ' +
    'focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 ' +
    'disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed cursor-pointer ' +
    'active:scale-[0.98] shadow-md hover:shadow-lg'
  const variants = {
    primary:
      'bg-primary-600 text-white hover:bg-primary-700 border border-primary-500/30 hover:border-primary-400/50',
    secondary:
      'bg-primary-100 dark:bg-primary-900/40 text-primary-800 dark:text-primary-200 hover:bg-primary-200 dark:hover:bg-primary-800/60 border border-primary-200 dark:border-primary-700',
    outline:
      'border-2 border-primary-600 text-primary-700 dark:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 bg-transparent',
    danger:
      'bg-red-600 text-white hover:bg-red-700 border border-red-500/30 hover:border-red-400/50',
  }
  return (
    <button
      type={type}
      className={`${base} ${variants[variant] || variants.primary} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
