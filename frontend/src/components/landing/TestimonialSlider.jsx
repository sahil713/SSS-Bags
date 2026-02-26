import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const testimonials = [
  { name: 'Priya S.', text: "Best quality bags I've bought online. Delivery was super fast!", rating: 5 },
  { name: 'Rahul M.', text: 'Love my new backpack. Perfect for work and travel.', rating: 5 },
  { name: 'Anita K.', text: 'SSS BAGS never disappoints. Great collection and service.', rating: 5 },
]

export default function TestimonialSlider() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % testimonials.length), 5000)
    return () => clearInterval(t)
  }, [])

  return (
    <section className="w-full py-20 lg:py-28">
      <div className="max-w-content mx-auto px-6 lg:px-12">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-14 text-center"
        >
          What Our Customers Say
        </motion.h2>
        <div className="max-w-3xl mx-auto">
          <div className="relative min-h-[200px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="text-center px-4 absolute inset-0 flex flex-col justify-center"
              >
                <p className="text-xl lg:text-2xl text-gray-700 dark:text-gray-300 italic leading-relaxed">
                  &ldquo;{testimonials[index].text}&rdquo;
                </p>
                <p className="mt-6 font-semibold text-gray-900 dark:text-white">{testimonials[index].name}</p>
                <p className="text-primary-500 mt-1 text-lg">{"★".repeat(testimonials[index].rating)}</p>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                className={'w-3 h-3 rounded-full transition-all duration-300 ' + (i === index ? 'bg-primary-600 scale-125' : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500')}
                aria-label={'Testimonial ' + (i + 1)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
