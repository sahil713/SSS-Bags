export default function Button({ children, variant = 'primary', type = 'button', className = '', disabled, ...props }) {
  const base = 'inline-flex items-center justify-center rounded-lg font-medium px-4 py-2 text-sm transition focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700',
    secondary: 'bg-primary-100 text-primary-800 hover:bg-primary-200',
    outline: 'border-2 border-primary-600 text-primary-700 hover:bg-primary-50',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  }
  return (
    <button type={type} className={`${base} ${variants[variant] || variants.primary} ${className}`} disabled={disabled} {...props}>
      {children}
    </button>
  )
}
