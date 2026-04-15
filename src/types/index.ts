// ==================== USER & AUTH ====================
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  avatar?: string;
  memberSince: string;
  loyaltyTier: 'bronze' | 'silver' | 'gold' | 'platinum';
  loyaltyPoints: number;
  totalOrders: number;
  totalSpent: number;
  isVerified: boolean;
  twoFactorEnabled: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

// ==================== ADDRESS ====================
export interface Address {
  id: string;
  label: string;
  fullName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

// ==================== CATEGORIES & PRODUCTS ====================
export interface Category {
  id: string;
  name: string;
  icon: string;
  image: string;
  productCount: number;
  subcategories?: SubCategory[];
}

export interface SubCategory {
  id: string;
  name: string;
  productCount: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  images: string[];
  categoryId: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockQuantity: number;
  brand: string;
  sku: string;
  tags: string[];
  specifications: ProductSpec[];
  isFavorite: boolean;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface ProductReview {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
}

// ==================== CART ====================
export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  loyaltyDiscount: number;
  giftCardDiscount: number;
  total: number;
  appliedCoupon?: string;
  appliedGiftCard?: string;
  appliedLoyaltyPoints: number;
}

// ==================== PAYMENT ====================
export interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'debit_card' | 'paypal' | 'apple_pay' | 'google_pay' | 'bank_transfer';
  label: string;
  cardNumber?: string;
  lastFour?: string;
  expiryDate?: string;
  cardHolder?: string;
  cardBrand?: 'visa' | 'mastercard' | 'amex' | 'discover';
  email?: string;
  isDefault: boolean;
}

// ==================== ORDERS ====================
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'in_transit'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'returned'
  | 'refunded';

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  items: OrderItem[];
  shippingAddress: Address;
  paymentMethod: PaymentMethod;
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  loyaltyPointsUsed: number;
  loyaltyPointsEarned: number;
  giftCardAmount: number;
  total: number;
  createdAt: string;
  estimatedDelivery: string;
  trackingNumber?: string;
  trackingHistory: TrackingEvent[];
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
}

export interface TrackingEvent {
  id: string;
  status: OrderStatus;
  description: string;
  location?: string;
  timestamp: string;
  isCompleted: boolean;
}

// ==================== INVOICES ====================
export interface Invoice {
  id: string;
  invoiceNumber: string;
  orderId: string;
  orderNumber: string;
  issuedDate: string;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  items: InvoiceItem[];
  billingAddress: Address;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

// ==================== LOYALTY ====================
export interface LoyaltyTransaction {
  id: string;
  type: 'earned' | 'redeemed' | 'expired' | 'bonus';
  points: number;
  description: string;
  date: string;
  orderId?: string;
}

export interface LoyaltyTier {
  name: 'bronze' | 'silver' | 'gold' | 'platinum';
  minPoints: number;
  multiplier: number;
  benefits: string[];
}

// ==================== GIFT CARDS ====================
export interface GiftCard {
  id: string;
  code: string;
  balance: number;
  originalAmount: number;
  expiryDate: string;
  status: 'active' | 'used' | 'expired';
  issuedDate: string;
  lastUsed?: string;
}

// ==================== CHECKOUT ====================
export interface CheckoutData {
  step: 'address' | 'payment' | 'review' | 'confirmation';
  selectedAddressId?: string;
  selectedPaymentId?: string;
  cart: Cart;
  appliedCoupon?: string;
  appliedGiftCardId?: string;
  loyaltyPointsToUse: number;
  notes?: string;
}

// ==================== NOTIFICATIONS ====================
export interface Notification {
  id: string;
  type: 'order' | 'promotion' | 'loyalty' | 'system';
  title: string;
  message: string;
  date: string;
  isRead: boolean;
}

// ==================== SEARCH ====================
export interface SearchFilters {
  query: string;
  categoryId?: string;
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  inStock?: boolean;
  sortBy: 'relevance' | 'price_asc' | 'price_desc' | 'rating' | 'newest';
}

// ==================== WISHLIST ====================
export interface WishlistItem {
  id: string;
  product: Product;
  addedAt: string;
}

// ==================== COUPON ====================
export interface Coupon {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minPurchase: number;
  expiryDate: string;
  description: string;
}
