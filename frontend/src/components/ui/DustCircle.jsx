export default function DustCircle({ className = '' }) {
  return (
    <div
      className={'pointer-events-none absolute ' + className}
      style={{
        backgroundImage:
          'radial-gradient(circle, rgba(255,255,255,0.9) 0.7px, transparent 0.7px),' +
          'radial-gradient(circle, rgba(255,255,255,0.55) 0.9px, transparent 0.9px),' +
          'radial-gradient(circle, rgba(255,255,255,0.35) 1.1px, transparent 1.1px)',
        backgroundSize: '16px 16px, 30px 30px, 48px 48px',
        backgroundPosition: '0 0, 11px 19px, 27px 5px',
        WebkitMaskImage: 'radial-gradient(circle, black 0%, black 50%, transparent 72%)',
        maskImage: 'radial-gradient(circle, black 0%, black 50%, transparent 72%)',
      }}
      aria-hidden
    />
  )
}
