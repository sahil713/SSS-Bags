const WORDS = [
  'Handbags',
  'Purses',
  'Clutches',
  'Slings',
  'Wallets',
  'Backpacks',
  'Attachi',
  'Trolley Bags',
  'Wedding Season Picks',
  'College Bags',
]

function Row({ hidden = false }) {
  return (
    <div className="flex shrink-0 items-center gap-10 pr-10 animate-marquee" aria-hidden={hidden || undefined}>
      {WORDS.map((w) => (
        <span key={w} className="flex items-center gap-10 whitespace-nowrap">
          <span className="font-serif italic text-2xl sm:text-3xl">{w}</span>
          <span className="w-2 h-2 rounded-full bg-amber-400/80" />
        </span>
      ))}
    </div>
  )
}

export default function MarqueeStrip() {
  return (
    <div className="relative w-full overflow-hidden bg-black text-white border-y border-white/10 py-5 select-none">
      <div className="flex w-max motion-reduce:[&>*]:animate-none">
        <Row />
        <Row hidden />
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black to-transparent" />
    </div>
  )
}
