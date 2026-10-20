
export enum UserRole {
  CLIENT = 'CLIENT',
  STORE = 'STORE',
  ADMIN = 'ADMIN'
}

export enum ProductOrigin {
  LOCAL = 'LOCAL',
  IMPORTED = 'IMPORTED'
}

export interface Product {
  id: string;
  name: string;
  price: number;
  origin: ProductOrigin;
  category: string;
  image: string;
  stock: number;
  storeId: string;
}

export interface Store {
  id: string;
  name: string;
  distance: string;
  rating: number;
  hours: string;
  image: string;
  wilaya: string;
  neighborhood: string;
  category: string;
  description?: string;
  phone?: string;
  lat?: number;
  lng?: number;
}

export interface Address {
  id: string;
  label: string;
  details: string;
  wilaya: string;
  neighborhood: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export type OrderStatus = 'PENDING' | 'PREPARING' | 'PICKUP' | 'DELIVERING' | 'COMPLETED' | 'CANCELLED';

export interface Order {
  id: string;
  date: string;
  total: number;
  status: OrderStatus;
  items: CartItem[];
  pointsGained: number;
  storeName?: string;
  address?: Address;
}

export interface UserProfile {
  name: string;
  pseudonym: string;
  email: string;
  points: number;
  role: UserRole;
  wilaya: string;
  neighborhood: string;
  lang: 'fr' | 'ar';
  theme: 'light' | 'dark';
  addresses: Address[];
  businessType?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'PROMO' | 'ORDER' | 'SYSTEM';
}

export interface HoumaNews {
  id: string;
  author: string;
  content: string;
  time: string;
  type: 'ALERT' | 'INFO' | 'PROMO' | 'EVENT';
  likes: number;
  comments: number;
  wilaya: string;
  neighborhood: string;
}

export interface HoumaService {
  id: string;
  title: string;
  provider: string;
  category: 'PLUMBING' | 'ELECTRICITY' | 'CLEANING' | 'TUTORING' | 'OTHER';
  description: string;
  price?: string;
  rating: number;
  phone: string;
  wilaya: string;
  neighborhood: string;
}

export interface Promotion {
  id: string;
  storeId: string;
  storeName: string;
  title: string;
  description: string;
  discount: string;
  expiryDate: string;
  image: string;
}

export interface CitizenReport {
  id: string;
  title: string;
  description: string;
  category: 'INFRASTRUCTURE' | 'CLEANLINESS' | 'SECURITY' | 'OTHER';
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED';
  location: { lat: number; lng: number };
  author: string;
  date: string;
  wilaya: string;
  neighborhood: string;
  images?: string[];
}
