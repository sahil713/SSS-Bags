export default function Input({ label, error, className = '', ...props }) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
      )}
      <input
        className={`w-full rounded-xl border px-3 py-2.5 text-gray-900 transition-colors dark:text-white focus:ring-2 focus:ring-primary-500/20 ${
          error
            ? 'border-red-500 dark:border-red-500 focus:border-red-500 dark:focus:border-red-500 bg-red-50/50 dark:bg-red-900/10'
            : 'border-gray-300 dark:border-gray-600 dark:bg-gray-800 focus:border-primary-500'
        }`}
        aria-invalid={!!error}
        aria-describedby={error ? `${props.id || 'input'}-error` : undefined}
        {...props}
      />
      {error && (
        <p id={props.id ? `${props.id}-error` : undefined} className="mt-1.5 flex items-center gap-1.5 text-sm text-red-600 dark:text-red-400" role="alert">
          <span className="shrink-0" aria-hidden>⚠</span>
          {error}
        </p>
      )}
    </div>
  )
}
