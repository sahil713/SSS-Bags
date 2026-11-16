import { useEffect, useState } from 'react'
import { getProducts } from '../api/products'
import { getCategories } from '../api/categories'
import HeroSection from '../components/landing/HeroSection'
import OurStory from '../components/landing/OurStory'
import FeaturedCategories from '../components/landing/FeaturedCategories'
import FeaturedProducts from '../components/landing/FeaturedProducts'
import PromoBanner from '../components/landing/PromoBanner'
import DiscountSection from '../components/landing/DiscountSection'
import StoreSection from '../components/landing/StoreSection'
import WhyChooseUs from '../components/landing/WhyChooseUs'
import TestimonialSlider from '../components/landing/TestimonialSlider'

export default function Landing() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getProducts({ per_page: 8, featured: true }).then((r) => r.data.products || []).catch(() => getProducts({ per_page: 8 }).then((r) => r.data.products || [])),
      getCategories().then((r) => r.data.categories || []),
    ])
      .then(([prods, cats]) => {
        setProducts(prods)
        setCategories(cats)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-black">
      <HeroSection />
      <OurStory />
      <FeaturedCategories categories={categories} />
      <PromoBanner />
      <FeaturedProducts products={products} loading={loading} />
      <DiscountSection />
      <StoreSection />
      <WhyChooseUs />
      <TestimonialSlider />
    </div>
  )
}
