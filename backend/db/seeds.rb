# frozen_string_literal: true

puts "Seeding..."

# Admin user (password: admin123)
admin = User.find_or_initialize_by(email: "admin@sssbags.com")
admin.assign_attributes(
  name: "Admin",
  phone_number: "9999999999",
  password: "admin123",
  password_confirmation: "admin123",
  role: "admin",
  email_verified: true,
  phone_verified: true
)
admin.save!(validate: false)
admin.cart ||= Cart.create!(user_id: admin.id)
puts "Admin: admin@sssbags.com / admin123"

# Categories
cat_bags = Category.find_or_create_by!(slug: "handbags") { |c| c.name = "Handbags" }
cat_backpacks = Category.find_or_create_by!(slug: "backpacks") { |c| c.name = "Backpacks" }
cat_wallets = Category.find_or_create_by!(slug: "wallets") { |c| c.name = "Wallets" }
cat_luggage = Category.find_or_create_by!(slug: "luggage") { |c| c.name = "Luggage" }

# Products
products_data = [
  { name: "Classic Leather Handbag", category: cat_bags, price: 2999, discount: 2499, stock: 50, description: "Premium leather handbag with multiple compartments." },
  { name: "Designer Tote Bag", category: cat_bags, price: 3999, discount: nil, stock: 30, description: "Elegant tote for everyday use." },
  { name: "Travel Backpack", category: cat_backpacks, price: 1999, discount: 1799, stock: 80, description: "Durable backpack for travel and commute." },
  { name: "Student Backpack", category: cat_backpacks, price: 1299, discount: nil, stock: 100, description: "Lightweight backpack for students." },
  { name: "Premium Wallet", category: cat_wallets, price: 899, discount: 699, stock: 120, description: "Genuine leather bifold wallet." },
  { name: "Card Holder", category: cat_wallets, price: 499, discount: nil, stock: 200, description: "Slim card holder with cash slot." },
  { name: "Cabin Luggage", category: cat_luggage, price: 5999, discount: 4999, stock: 25, description: "55cm cabin luggage with 360° wheels." },
  { name: "Check-in Suitcase", category: cat_luggage, price: 8999, discount: nil, stock: 20, description: "75cm check-in luggage, expandable." }
]

products_data.each do |pd|
  Product.find_or_initialize_by(slug: pd[:name].parameterize).tap do |p|
    p.name = pd[:name]
    p.category_id = pd[:category].id
    p.price = pd[:price]
    p.discount_price = pd[:discount]
    p.stock_quantity = pd[:stock]
    p.description = pd[:description]
    p.status = "active"
    p.slug = pd[:name].parameterize
    p.save!
  end
end

# Banners (homepage promos)
if defined?(Banner) && Banner.table_exists?
  [
    { title: "Diwali Sale - Flat 30% OFF", subtitle: "On Premium Bags & Luggage", description: "Limited period offer. Use code DIWALI30 at checkout.", button_text: "Shop Now", button_link: "/products", banner_type: "homepage", priority: 0 },
    { title: "Buy 2 Get 1 Free", subtitle: "On Selected Collections", description: "Mix and match. Add 3 items, get the lowest priced one free.", button_text: "Explore Collection", button_link: "/products", banner_type: "homepage", priority: 1 },
    { title: "Festival Collection Live Now", subtitle: "New Arrivals", description: "Handpicked bags for the festive season.", button_text: "Shop Now", button_link: "/products", banner_type: "homepage", priority: 2 },
  ].each_with_index do |attrs, i|
    Banner.find_or_create_by!(title: attrs[:title]) do |b|
      b.subtitle = attrs[:subtitle]
      b.description = attrs[:description]
      b.button_text = attrs[:button_text]
      b.button_link = attrs[:button_link]
      b.banner_type = attrs[:banner_type]
      b.priority = attrs[:priority]
      b.is_active = true
      b.start_date = 1.month.ago
      b.end_date = 2.months.from_now
    end
  end
  puts "Seeded #{Banner.count} banners."
end

# Announcement (top strip)
if defined?(Announcement) && Announcement.table_exists?
  Announcement.find_or_create_by!(message: "🔥 Diwali Mega Sale Live Now! Shop Before It Ends!") do |a|
    a.is_active = true
    a.start_date = 1.month.ago
    a.end_date = 2.months.from_now
  end
  puts "Seeded announcements."
end

puts "Seeded #{Category.count} categories, #{Product.not_deleted.count} products."
