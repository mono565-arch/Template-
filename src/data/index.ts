export interface Product {
  id: string
  name: string
  description: string
  price: number
  rating: number
  image: string
  category: string
  ingredients?: string[]
  isPopular?: boolean
  isAvailable?: boolean
}

export interface Category {
  id: string
  name: string
  icon: string
}

export interface Review {
  id: string
  name: string
  review: string
  rating: number
  avatar: string
  role: string
}

// Home page categories (emoji icons)
export const categories: Category[] = [
  { id: '1', name: 'Pizza', icon: '🍕' },
  { id: '2', name: 'Burger', icon: '🍔' },
  { id: '3', name: 'Fries', icon: '🍟' },
  { id: '4', name: 'Pasta', icon: '🍝' },
  { id: '5', name: 'Drinks', icon: '🥤' },
  { id: '6', name: 'Desserts', icon: '🍰' },
]

// Menu page categories (for tabs)
export const menuCategories = ['All', 'Pizza', 'Burgers', 'Fries', 'Broast', 'Sandwich', 'Pasta', 'Drinks', 'Ice Cream', 'Desserts']

// Full menu products — single source of truth
export const menuProducts: Product[] = [
  // ===== PIZZA (6 items) =====
  {
    id: 'p1',
    name: 'Classic Margherita',
    description: 'Fresh mozzarella, vine-ripened tomatoes, and fragrant basil on our hand-tossed crust.',
    price: 12.99,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop',
    category: 'Pizza',
    ingredients: ['Mozzarella Cheese', 'Tomato Sauce', 'Fresh Basil', 'Olive Oil', 'Sea Salt'],
    isPopular: true,
    isAvailable: true,
  },
  {
    id: 'p2',
    name: 'Pepperoni Feast',
    description: 'Double pepperoni, extra mozzarella, and our signature tomato sauce.',
    price: 14.99,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop',
    category: 'Pizza',
    ingredients: ['Pepperoni', 'Mozzarella Cheese', 'Tomato Sauce', 'Oregano', 'Garlic'],
    isPopular: true,
    isAvailable: true,
  },
  {
    id: 'p3',
    name: 'BBQ Chicken',
    description: 'Grilled chicken, smoky BBQ sauce, red onions, and cilantro.',
    price: 15.99,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop',
    category: 'Pizza',
    ingredients: ['Grilled Chicken', 'BBQ Sauce', 'Red Onions', 'Cilantro', 'Mozzarella'],
    isPopular: false,
    isAvailable: true,
  },
  {
    id: 'p4',
    name: 'Veggie Supreme',
    description: 'Bell peppers, mushrooms, olives, onions, and fresh tomatoes.',
    price: 13.99,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
    category: 'Pizza',
    ingredients: ['Bell Peppers', 'Mushrooms', 'Black Olives', 'Red Onions', 'Tomatoes'],
    isPopular: false,
    isAvailable: true,
  },
  {
    id: 'p5',
    name: 'Meat Lovers',
    description: 'Pepperoni, sausage, bacon, and ham with extra cheese.',
    price: 16.99,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=300&fit=crop',
    category: 'Pizza',
    ingredients: ['Pepperoni', 'Sausage', 'Bacon', 'Ham', 'Mozzarella Cheese'],
    isPopular: true,
    isAvailable: true,
  },
  {
    id: 'p6',
    name: 'Hawaiian Delight',
    description: 'Sweet pineapple, smoked ham, and mozzarella on a golden crust.',
    price: 14.49,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop',
    category: 'Pizza',
    ingredients: ['Pineapple', 'Smoked Ham', 'Mozzarella', 'Tomato Sauce'],
    isPopular: false,
    isAvailable: true,
  },

  // ===== BURGERS =====
  {
    id: 'b1',
    name: 'Classic Beef Burger',
    description: 'Juicy beef patty, lettuce, tomato, pickles, and our secret sauce.',
    price: 9.99,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
    category: 'Burgers',
    ingredients: ['Beef Patty', 'Lettuce', 'Tomato', 'Pickles', 'Secret Sauce', 'Brioche Bun'],
    isPopular: true,
    isAvailable: true,
  },
  {
    id: 'b2',
    name: 'Cheese Lover Burger',
    description: 'Double cheese, beef patty, caramelized onions, and special mayo.',
    price: 11.49,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&h=300&fit=crop',
    category: 'Burgers',
    ingredients: ['Beef Patty', 'Cheddar Cheese', 'Swiss Cheese', 'Caramelized Onions', 'Mayo'],
    isPopular: true,
    isAvailable: true,
  },
  {
    id: 'b3',
    name: 'Spicy Chicken Burger',
    description: 'Crispy chicken, spicy mayo, jalapenos, and coleslaw.',
    price: 10.49,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400&h=300&fit=crop',
    category: 'Burgers',
    ingredients: ['Crispy Chicken', 'Spicy Mayo', 'Jalapenos', 'Coleslaw', 'Brioche Bun'],
    isPopular: false,
    isAvailable: true,
  },

  // ===== FRIES =====
  {
    id: 'f1',
    name: 'Classic Fries',
    description: 'Crispy golden fries seasoned with sea salt.',
    price: 4.99,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=400&h=300&fit=crop',
    category: 'Fries',
    ingredients: ['Potatoes', 'Sea Salt', 'Vegetable Oil'],
    isPopular: false,
    isAvailable: true,
  },
  {
    id: 'f2',
    name: 'Cheese Fries',
    description: 'Crispy fries topped with melted cheddar and special seasoning.',
    price: 6.49,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1585109649139-366815a0c713?w=400&h=300&fit=crop',
    category: 'Fries',
    ingredients: ['Potatoes', 'Cheddar Cheese', 'Special Seasoning', 'Green Onions'],
    isPopular: true,
    isAvailable: true,
  },
  {
    id: 'f3',
    name: 'Loaded Fries',
    description: 'Fries topped with bacon, cheese, sour cream, and chives.',
    price: 7.99,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=400&h=300&fit=crop',
    category: 'Fries',
    ingredients: ['Potatoes', 'Bacon', 'Cheddar Cheese', 'Sour Cream', 'Chives'],
    isPopular: true,
    isAvailable: true,
  },

  // ===== BROAST =====
  {
    id: 'br1',
    name: 'Classic Broast',
    description: 'Crispy pressure-fried chicken with our signature 11-spice blend.',
    price: 11.99,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&h=300&fit=crop',
    category: 'Broast',
    ingredients: ['Chicken', '11-Spice Blend', 'Buttermilk', 'Flour', 'Vegetable Oil'],
    isPopular: true,
    isAvailable: true,
  },
  {
    id: 'br2',
    name: 'Spicy Broast',
    description: 'Hot and crispy broast with extra chili kick.',
    price: 12.49,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=400&h=300&fit=crop',
    category: 'Broast',
    ingredients: ['Chicken', 'Chili Powder', 'Cayenne', 'Buttermilk', 'Flour'],
    isPopular: false,
    isAvailable: true,
  },
  {
    id: 'br3',
    name: 'Broast Combo',
    description: '2 pieces broast with fries, coleslaw, and dinner roll.',
    price: 14.99,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&h=300&fit=crop',
    category: 'Broast',
    ingredients: ['Chicken', 'Fries', 'Coleslaw', 'Dinner Roll', 'Dipping Sauce'],
    isPopular: true,
    isAvailable: true,
  },

  // ===== SANDWICH =====
  {
    id: 's1',
    name: 'Club Sandwich',
    description: 'Triple-decker with chicken, bacon, lettuce, tomato, and mayo.',
    price: 8.99,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=300&fit=crop',
    category: 'Sandwich',
    ingredients: ['Chicken Breast', 'Bacon', 'Lettuce', 'Tomato', 'Mayo', 'Toasted Bread'],
    isPopular: true,
    isAvailable: true,
  },
  {
    id: 's2',
    name: 'Grilled Cheese',
    description: 'Melted cheddar and mozzarella on butter-toasted sourdough.',
    price: 6.99,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=300&fit=crop',
    category: 'Sandwich',
    ingredients: ['Cheddar Cheese', 'Mozzarella', 'Sourdough Bread', 'Butter'],
    isPopular: false,
    isAvailable: true,
  },
  {
    id: 's3',
    name: 'Tuna Melt',
    description: 'Creamy tuna salad with melted cheese on grilled bread.',
    price: 7.99,
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=300&fit=crop',
    category: 'Sandwich',
    ingredients: ['Tuna', 'Mayo', 'Celery', 'Cheddar Cheese', 'Grilled Bread'],
    isPopular: false,
    isAvailable: true,
  },

  // ===== PASTA =====
  {
    id: 'pa1',
    name: 'Alfredo Pasta',
    description: 'Creamy parmesan sauce with fettuccine and grilled chicken.',
    price: 13.99,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&h=300&fit=crop',
    category: 'Pasta',
    ingredients: ['Fettuccine', 'Parmesan', 'Cream', 'Butter', 'Grilled Chicken'],
    isPopular: true,
    isAvailable: true,
  },
  {
    id: 'pa2',
    name: 'Bolognese Pasta',
    description: 'Rich meat sauce with spaghetti and parmesan.',
    price: 12.99,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&h=300&fit=crop',
    category: 'Pasta',
    ingredients: ['Spaghetti', 'Ground Beef', 'Tomato Sauce', 'Parmesan', 'Herbs'],
    isPopular: false,
    isAvailable: true,
  },
  {
    id: 'pa3',
    name: 'Pesto Pasta',
    description: 'Fresh basil pesto with penne and cherry tomatoes.',
    price: 11.99,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400&h=300&fit=crop',
    category: 'Pasta',
    ingredients: ['Penne', 'Basil Pesto', 'Cherry Tomatoes', 'Parmesan', 'Pine Nuts'],
    isPopular: false,
    isAvailable: true,
  },

  // ===== DRINKS =====
  {
    id: 'd1',
    name: 'Classic Cola',
    description: 'Refreshing classic cola served ice cold.',
    price: 2.99,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&h=300&fit=crop',
    category: 'Drinks',
    ingredients: ['Carbonated Water', 'Cane Sugar', 'Natural Flavors', 'Caramel Color'],
    isPopular: false,
    isAvailable: true,
  },
  {
    id: 'd2',
    name: 'Fresh Lemonade',
    description: 'Hand-squeezed lemons with a touch of sweetness.',
    price: 3.49,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400&h=300&fit=crop',
    category: 'Drinks',
    ingredients: ['Fresh Lemons', 'Water', 'Cane Sugar', 'Mint Leaves'],
    isPopular: true,
    isAvailable: true,
  },
  {
    id: 'd3',
    name: 'Mango Smoothie',
    description: 'Tropical mango blended with yogurt and honey.',
    price: 4.99,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400&h=300&fit=crop',
    category: 'Drinks',
    ingredients: ['Fresh Mango', 'Yogurt', 'Honey', 'Ice'],
    isPopular: true,
    isAvailable: true,
  },
  {
    id: 'd4',
    name: 'Iced Coffee',
    description: 'Cold-brewed coffee with a splash of cream.',
    price: 3.99,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b5dd7359?w=400&h=300&fit=crop',
    category: 'Drinks',
    ingredients: ['Cold Brew Coffee', 'Cream', 'Ice', 'Vanilla Syrup'],
    isPopular: false,
    isAvailable: true,
  },

  // ===== ICE CREAM =====
  {
    id: 'i1',
    name: 'Vanilla Ice Cream',
    description: 'Creamy classic vanilla made with real Madagascar vanilla beans.',
    price: 4.99,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400&h=300&fit=crop',
    category: 'Ice Cream',
    ingredients: ['Milk', 'Cream', 'Madagascar Vanilla', 'Sugar'],
    isPopular: false,
    isAvailable: true,
  },
  {
    id: 'i2',
    name: 'Chocolate Fudge',
    description: 'Rich chocolate ice cream swirled with fudge ribbons.',
    price: 5.49,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop',
    category: 'Ice Cream',
    ingredients: ['Milk', 'Cream', 'Cocoa', 'Fudge', 'Sugar'],
    isPopular: true,
    isAvailable: true,
  },
  {
    id: 'i3',
    name: 'Strawberry Swirl',
    description: 'Fresh strawberry ice cream with real fruit chunks.',
    price: 5.49,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400&h=300&fit=crop',
    category: 'Ice Cream',
    ingredients: ['Milk', 'Cream', 'Fresh Strawberries', 'Sugar'],
    isPopular: false,
    isAvailable: true,
  },

  // ===== DESSERTS =====
  {
    id: 'de1',
    name: 'Chocolate Lava Cake',
    description: 'Warm chocolate cake with a molten center, served with vanilla ice cream.',
    price: 7.99,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&h=300&fit=crop',
    category: 'Desserts',
    ingredients: ['Dark Chocolate', 'Butter', 'Eggs', 'Flour', 'Vanilla Ice Cream'],
    isPopular: true,
    isAvailable: true,
  },
  {
    id: 'de2',
    name: 'Tiramisu',
    description: 'Classic Italian coffee dessert with mascarpone and cocoa.',
    price: 6.99,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop',
    category: 'Desserts',
    ingredients: ['Mascarpone', 'Espresso', 'Ladyfingers', 'Cocoa Powder', 'Eggs'],
    isPopular: false,
    isAvailable: true,
  },
  {
    id: 'de3',
    name: 'Cheesecake',
    description: 'New York style cheesecake with berry compote.',
    price: 6.49,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1524351199678-941a58a3df26?w=400&h=300&fit=crop',
    category: 'Desserts',
    ingredients: ['Cream Cheese', 'Graham Cracker', 'Sugar', 'Berries', 'Vanilla'],
    isPopular: false,
    isAvailable: true,
  },
]

// Alias for pages that import 'products' instead of 'menuProducts'
export const products = menuProducts

// Featured products — SAME object references as menuProducts (fixes the bug!)
export const featuredProducts: Product[] = [
  menuProducts[0], // p1 - Classic Margherita
  menuProducts[1], // p2 - Pepperoni Feast
  menuProducts[2], // p3 - BBQ Chicken
  menuProducts[3], // p4 - Veggie Supreme
  menuProducts[4], // p5 - Meat Lovers
  menuProducts[5], // p6 - Hawaiian Delight
]

export const reviews: Review[] = [
  {
    id: '1',
    name: 'Sarah Mitchell',
    review: 'The best pizza I have ever had! The crust was perfectly crispy and the toppings were incredibly fresh. Delivery was super fast too.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    role: 'Food Blogger',
  },
  {
    id: '2',
    name: 'Michael Chen',
    review: 'Pizza Saucy never disappoints. Their Margherita is absolutely authentic and the quality is consistently amazing. My go-to pizza place!',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    role: 'Regular Customer',
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    review: 'Amazing flavors and great value for money. The family pack is perfect for our weekend dinners. Highly recommend the BBQ Chicken!',
    rating: 4,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    role: 'Verified Buyer',
  },
]

export const whyChooseUs = [
  {
    id: '1',
    title: 'Fresh Ingredients',
    description: 'We source only the freshest, highest-quality ingredients from local farms and trusted suppliers.',
    icon: '🥬',
  },
  {
    id: '2',
    title: 'Fast Delivery',
    description: 'Hot and fresh pizza delivered to your doorstep in under 30 minutes, guaranteed.',
    icon: '⚡',
  },
  {
    id: '3',
    title: 'Best Quality',
    description: 'Handcrafted by expert pizzaiolos using traditional techniques passed down through generations.',
    icon: '🏆',
  },
  {
    id: '4',
    title: 'Affordable Prices',
    description: 'Premium quality at prices that will not break the bank. Great value for every meal.',
    icon: '💰',
  },
]