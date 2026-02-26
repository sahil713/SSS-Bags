import { useState } from 'react'
import { motion } from 'framer-motion'
import AnimatedButton from '../ui/AnimatedButton'
import { useToast } from '../common/Toast'

export default function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const { addToast } = useToast()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setTimeout(() => {
      addToast("Thanks for subscribing! We'll be in touch.", 'success')
      setEmail('')
      setLoading(false)
    }, 600)
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="w-full py-20 lg:py-28"
    >
      <div className="max-w-content mx-auto px-6 lg:px-12">
        <div className="rounded-3xl overflow-hidden bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-800 dark:to-primary-950 text-white shadow-soft-lg py-16 lg:py-20 px-8 lg:px-16 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-3">Stay in the loop</h2>
          <p className="text-primary-100 dark:text-primary-200 mb-8 max-w-xl mx-auto leading-relaxed">
            Get updates on new arrivals and exclusive offers.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              className="flex-1 rounded-xl px-5 py-4 text-gray-900 placeholder-gray-500 border-0 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600"
              required
            />
            <AnimatedButton type="submit" disabled={loading} className="!bg-white !text-primary-700 shrink-0 px-8 py-4 rounded-xl font-semibold">
              {loading ? 'Subscribing…' : 'Subscribe'}
            </AnimatedButton>
          </form>
        </div>
      </div>
    </motion.section>
  )
}
