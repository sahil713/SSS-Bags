export function formatPrice(value) {
  const n = Number(value)
  if (Number.isNaN(n)) return value
  return n.toLocaleString('en-IN', { maximumFractionDigits: 0 })
}
