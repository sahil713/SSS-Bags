export const SHOP = {
  name: 'SSS BAGS',
  tagline: 'Ladies Handbags · Purses · Attachi',
  address: {
    line1: 'Near Double Phatak',
    line2: 'Dhuri · Sangrur · 148024',
    full: 'Near Double Phatak, Dhuri, Sangrur, Punjab 148024',
  },
  phones: [
    { label: '70091 83833', value: '917009183833' },
    { label: '98144 98436', value: '919814498436' },
  ],
  instagram: {
    handle: '@sss_bags_dhuri_148024',
    url: 'https://instagram.com/sss_bags_dhuri_148024',
  },
  whatWeSell: [
    { name: 'Handbags', description: 'Hundreds of designs, fresh new stock' },
    { name: 'Purses & Clutches', description: 'Everyday and party styles' },
    { name: 'Attachi & Trolley Bags', description: 'Full travel range' },
  ],
  hours: { open: '09:30', close: '20:30', label: 'Open daily · 9:30 am – 8:30 pm' },
  siteUrl: 'https://sss-bags.sahiljindal2323.workers.dev',
  photos: [
    { src: '/images/shop/store-handbags.jpg', alt: 'Wall of handbags on display at SSS Bags, Dhuri' },
    { src: '/images/shop/store-interior.jpg', alt: 'Inside SSS Bags store, Dhuri' },
  ],
  coordinates: { lat: 30.3708, lon: 75.8647 },
  // OpenStreetMap embed (no API key needed, unlike Google's embed which needs one to be reliable).
  mapsEmbedUrl:
    'https://www.openstreetmap.org/export/embed.html?bbox=75.8347%2C30.3508%2C75.8947%2C30.3908&marker=30.3708%2C75.8647&layer=mapnik',
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=' +
    encodeURIComponent('SSS Bags, Near Double Phatak, Dhuri, Sangrur, Punjab 148024'),
}

export function whatsappUrl(phoneValue, message = 'Hi! I have a question about your bags.') {
  return `https://wa.me/${phoneValue}?text=${encodeURIComponent(message)}`
}

export function telUrl(phoneValue) {
  return `tel:+${phoneValue}`
}
