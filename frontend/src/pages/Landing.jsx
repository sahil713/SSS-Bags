import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import HeroSection from '../components/landing/HeroSection'
import MarqueeStrip from '../components/landing/MarqueeStrip'
import OurStory from '../components/landing/OurStory'
import FeaturedCategories from '../components/landing/FeaturedCategories'
import FeaturedStyles from '../components/landing/FeaturedStyles'
import PromoBanner from '../components/landing/PromoBanner'
import WhyChooseUs from '../components/landing/WhyChooseUs'
import HowItWorks from '../components/landing/HowItWorks'
import FAQSection from '../components/landing/FAQSection'
import StoreSection from '../components/landing/StoreSection'

/*
 * BACKEND DISABLED — the landing page used to fetch featured products and
 * categories from the API. Restore when the backend is live (see App.jsx):
 *
 * import { useState } from 'react'
 * import { getProducts } from '../api/products'
 * import { getCategories } from '../api/categories'
 * import FeaturedProducts from '../components/landing/FeaturedProducts'
 * import DiscountSection from '../components/landing/DiscountSection'
 * import TestimonialSlider from '../components/landing/TestimonialSlider'
 *
 * const [products, setProducts] = useState([])
 * const [categories, setCategories] = useState([])
 * const [loading, setLoading] = useState(true)
 * useEffect(() => {
 *   Promise.all([
 *     getProducts({ per_page: 8, featured: true }).then((r) => r.data.products || []),
 *     getCategories().then((r) => r.data.categories || []),
 *   ])
 *     .then(([prods, cats]) => { setProducts(prods); setCategories(cats) })
 *     .catch(() => {})
 *     .finally(() => setLoading(false))
 * }, [])
 *
 * <FeaturedCategories categories={categories} />
 * <FeaturedProducts products={products} loading={loading} />
 * <DiscountSection />      — only with real, current offers
 * <TestimonialSlider />    — only with real customer reviews
 */

export default function Landing() {
  const { hash } = useLocation()

  useEffect(() => {
    if (!hash) return undefined
    const t = setTimeout(() => {
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
    return () => clearTimeout(t)
  }, [hash])

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-black">
      <HeroSection />
      <MarqueeStrip />
      <OurStory />
      <FeaturedCategories />
      <FeaturedStyles />
      <PromoBanner />
      <WhyChooseUs />
      <HowItWorks />
      <FAQSection />
      <StoreSection />
    </div>
  )
}
