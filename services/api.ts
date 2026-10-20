import { Store, Product, Order, HoumaNews, HoumaService, CitizenReport, UserProfile } from '../types';

export const API_BASE = '/api';

export const api = {
  // Health
  async getHealth() {
    try {
      const res = await fetch(`${API_BASE}/health`);
      return await res.json();
    } catch {
      return { status: 'offline' };
    }
  },

  // Auth
  async login(pseudonym: string, role: string): Promise<UserProfile | null> {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pseudonym, role })
      });
      if (!res.ok) throw new Error('Login failed');
      const data = await res.json();
      return data.user;
    } catch (e) {
      console.warn('API login offline fallback', e);
      return null;
    }
  },

  // Stores
  async getStores(params?: { category?: string; wilaya?: string; neighborhood?: string; search?: string }): Promise<Store[]> {
    try {
      const query = new URLSearchParams(params as Record<string, string>).toString();
      const res = await fetch(`${API_BASE}/stores?${query}`);
      if (!res.ok) throw new Error('Failed to fetch stores');
      return await res.json();
    } catch (e) {
      console.warn('Using local fallback for stores', e);
      return [];
    }
  },

  async getStoreById(id: string): Promise<Store | null> {
    try {
      const res = await fetch(`${API_BASE}/stores/${id}`);
      if (!res.ok) throw new Error('Failed to fetch store');
      return await res.json();
    } catch {
      return null;
    }
  },

  // Products
  async getProducts(params?: { storeId?: string; category?: string; origin?: string; search?: string }): Promise<Product[]> {
    try {
      const query = new URLSearchParams(params as Record<string, string>).toString();
      const res = await fetch(`${API_BASE}/products?${query}`);
      if (!res.ok) throw new Error('Failed to fetch products');
      return await res.json();
    } catch (e) {
      console.warn('Using local fallback for products', e);
      return [];
    }
  },

  async createProduct(product: Partial<Product>): Promise<Product | null> {
    try {
      const res = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
      if (!res.ok) throw new Error('Failed to create product');
      return await res.json();
    } catch {
      return null;
    }
  },

  // Orders
  async getOrders(): Promise<Order[]> {
    try {
      const res = await fetch(`${API_BASE}/orders`);
      if (!res.ok) throw new Error('Failed to fetch orders');
      return await res.json();
    } catch {
      return [];
    }
  },

  async createOrder(orderData: { items: any[]; total: number; address?: any; storeName?: string }): Promise<Order | null> {
    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      if (!res.ok) throw new Error('Failed to create order');
      return await res.json();
    } catch (e) {
      console.warn('Order API offline, fallback to local', e);
      return null;
    }
  },

  async updateOrderStatus(id: string, status: string): Promise<Order | null> {
    try {
      const res = await fetch(`${API_BASE}/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error('Failed to update status');
      return await res.json();
    } catch {
      return null;
    }
  },

  // Community News
  async getNews(wilaya?: string, neighborhood?: string): Promise<HoumaNews[]> {
    try {
      const params = new URLSearchParams();
      if (wilaya) params.set('wilaya', wilaya);
      if (neighborhood) params.set('neighborhood', neighborhood);
      const res = await fetch(`${API_BASE}/community/news?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch news');
      return await res.json();
    } catch {
      return [];
    }
  },

  async createNews(newsItem: Partial<HoumaNews>): Promise<HoumaNews | null> {
    try {
      const res = await fetch(`${API_BASE}/community/news`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newsItem)
      });
      if (!res.ok) throw new Error('Failed to post news');
      return await res.json();
    } catch {
      return null;
    }
  },

  async likeNews(id: string): Promise<HoumaNews | null> {
    try {
      const res = await fetch(`${API_BASE}/community/news/${id}/like`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to like');
      return await res.json();
    } catch {
      return null;
    }
  },

  // Community Services
  async getServices(category?: string, wilaya?: string): Promise<HoumaService[]> {
    try {
      const params = new URLSearchParams();
      if (category) params.set('category', category);
      if (wilaya) params.set('wilaya', wilaya);
      const res = await fetch(`${API_BASE}/community/services?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch services');
      return await res.json();
    } catch {
      return [];
    }
  },

  async createService(service: Partial<HoumaService>): Promise<HoumaService | null> {
    try {
      const res = await fetch(`${API_BASE}/community/services`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(service)
      });
      if (!res.ok) throw new Error('Failed to post service');
      return await res.json();
    } catch {
      return null;
    }
  },

  // Citizen Reports
  async getReports(): Promise<CitizenReport[]> {
    try {
      const res = await fetch(`${API_BASE}/community/reports`);
      if (!res.ok) throw new Error('Failed to fetch reports');
      return await res.json();
    } catch {
      return [];
    }
  },

  async createReport(report: Partial<CitizenReport>): Promise<CitizenReport | null> {
    try {
      const res = await fetch(`${API_BASE}/community/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report)
      });
      if (!res.ok) throw new Error('Failed to post report');
      return await res.json();
    } catch {
      return null;
    }
  }
};
