import { Package, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react';

// 1. Stats for Dashboard Cards
export const SELLER_STATS = [
  { label: "Total Revenue", value: "₹4,25,000", change: "+12%", icon: DollarSign, color: "bg-green-50 text-green-600" },
  { label: "Total Orders", value: "1,250", change: "+5%", icon: ShoppingCart, color: "bg-blue-50 text-blue-600" },
  { label: "Products Sold", value: "856", change: "+8%", icon: Package, color: "bg-orange-50 text-orange-600" },
  { label: "Growth", value: "24.5%", change: "+2%", icon: TrendingUp, color: "bg-purple-50 text-purple-600" },
];

// 2. Product List
export const SELLER_PRODUCTS = [
  { id: 1, name: "Personalized Mug", price: 499, stock: 120, sales: 450, status: "Active", image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=100" },
  { id: 2, name: "Custom T-Shirt", price: 699, stock: 45, sales: 210, status: "Active", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100" },
  { id: 3, name: "LED Lamp", price: 999, stock: 0, sales: 110, status: "Out of Stock", image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=100" },
  { id: 4, name: "Photo Frame", price: 899, stock: 8, sales: 85, status: "Low Stock", image: "https://images.unsplash.com/photo-1534349762942-5d22f6723b73?w=100" },
];

// 3. Recent Orders
export const RECENT_ORDERS = [
  { id: "#ORD-001", customer: "Amit Kumar", product: "Personalized Mug", amount: 499, status: "Pending", date: "Today" },
  { id: "#ORD-002", customer: "Priya Singh", product: "LED Lamp", amount: 999, status: "Shipped", date: "Yesterday" },
  { id: "#ORD-003", customer: "Rahul Verma", product: "Custom T-Shirt", amount: 699, status: "Delivered", date: "12 Jan" },
  { id: "#ORD-004", customer: "Sneha Gupta", product: "Photo Frame", amount: 899, status: "Cancelled", date: "10 Jan" },
];