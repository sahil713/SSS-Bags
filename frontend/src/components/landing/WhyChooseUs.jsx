import { motion } from 'framer-motion'

// Reasons are in-store ones. The old list (fast delivery across India,
// secure payment) described online ordering, which is off for now.
const items = [
  {
    title: 'Hundreds of designs',
    desc: 'Shelves full of handbags, purses, clutches, backpacks and trolley bags — all under one roof.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16l-1.5 12.5a2 2 0 0 1-2 1.5h-9a2 2 0 0 1-2-1.5L4 7Zm4 0V6a4 4 0 1 1 8 0v1" />
    ),
  },
  {
    title: 'See it, touch it, try it',
    desc: 'Check the size, stitching and colour in person before you buy. No guessing from photos.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Zm9.5 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
    ),
  },
  {
    title: 'Fair local prices',
    desc: 'Honest prices for every budget, from everyday bags to wedding-season clutches.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 4h10M7 8h10M7 4c4 0 6 2 6 4s-2 4-6 4l7 8" />
    ),
  },
  {
    title: 'Ask before you visit',
    desc: 'WhatsApp us a photo or a question and we’ll reply with what’s in stock.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h8M8 14h5m-9 6 1.5-4A8 8 0 1 1 12 20a8 8 0 0 1-4-1l-4 1Z" />
    ),
  },
]

export default function WhyChooseUs() {
  return (
    <section className="w-full py-20 lg:py-28 bg-gray-50 dark:bg-black">
      <div className="max-w-content mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-xl mx-auto mb-14"
        >
          <p className="text-primary-600 dark:text-primary-400 text-xs font-semibold tracking-[0.25em] uppercase mb-3">
            Why shop with us
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">The local bag shop, done right</h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group p-7 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-soft-lg transition-[border-color,box-shadow] duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-300 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24" aria-hidden>
                  {item.icon}
                </svg>
              </div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">{item.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
