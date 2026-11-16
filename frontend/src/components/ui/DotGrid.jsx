export default function DotGrid({ className = '' }) {
  return (
    <div
      className={'pointer-events-none absolute inset-0 ' + className}
      style={{
        backgroundImage: 'radial-gradient(rgba(255,255,255,0.18) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
        WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black 40%, transparent 85%)',
        maskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black 40%, transparent 85%)',
      }}
      aria-hidden
    />
  )
}
