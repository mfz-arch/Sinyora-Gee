'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  SpaService,
  SpaProduct,
  ServiceBooking,
  ProductOrder,
  UserAccount,
  BrandTheme,
  BookingStatus,
  OrderStatus,
} from '@/types';
import {
  INITIAL_SERVICES,
  INITIAL_PRODUCTS,
  INITIAL_USERS,
} from '@/data/initialData';

interface CartItem {
  product: SpaProduct;
  quantity: number;
}

interface StoreContextType {
  theme: BrandTheme;
  setTheme: (theme: BrandTheme) => void;
  services: SpaService[];
  products: SpaProduct[];
  bookings: ServiceBooking[];
  orders: ProductOrder[];
  users: UserAccount[];
  currentUser: UserAccount | null;
  selectedServicesForBooking: SpaService[];
  cart: CartItem[];
  // Auth actions
  login: (phone: string, password: string) => { ok: boolean; message: string; user?: UserAccount };
  registerClient: (data: {
    name: string;
    phone: string;
    password: string;
    hostel: string;
  }) => { ok: boolean; message: string; user?: UserAccount };
  logout: () => void;
  // Booking actions
  toggleServiceForBooking: (service: SpaService) => void;
  clearBookingSelection: () => void;
  createBooking: (
    booking: Omit<ServiceBooking, 'id' | 'status' | 'createdAt'>
  ) => ServiceBooking;
  updateBookingStatus: (id: string, status: BookingStatus) => void;
  // Product & Cart actions
  addToCart: (product: SpaProduct) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  createProductOrder: (
    order: Omit<ProductOrder, 'id' | 'status' | 'createdAt'>
  ) => ProductOrder;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  // Admin Catalog actions
  addProduct: (product: Omit<SpaProduct, 'id' | 'createdAt'>) => void;
  updateProduct: (
    id: string,
    updates: Partial<Omit<SpaProduct, 'id' | 'createdAt'>>
  ) => void;
  deleteProduct: (id: string) => void;
  addService: (service: Omit<SpaService, 'id'>) => void;
  updateServicePrice: (id: string, price: number) => void;
  deleteService: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  THEME: 'sinyora_gee_theme_v1',
  SERVICES: 'sinyora_gee_services_v2',
  PRODUCTS: 'sinyora_gee_products_v1',
  BOOKINGS: 'sinyora_gee_bookings_v1',
  ORDERS: 'sinyora_gee_orders_v1',
  USERS: 'sinyora_gee_users_v1',
  CURRENT_USER: 'sinyora_gee_current_user_v1',
};

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<BrandTheme>('flyer-rose');
  const [services, setServices] = useState<SpaService[]>(INITIAL_SERVICES);
  const [products, setProducts] = useState<SpaProduct[]>(INITIAL_PRODUCTS);
  const [bookings, setBookings] = useState<ServiceBooking[]>([]);
  const [orders, setOrders] = useState<ProductOrder[]>([]);
  const [users, setUsers] = useState<UserAccount[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [selectedServicesForBooking, setSelectedServicesForBooking] = useState<
    SpaService[]
  >([]);
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) as BrandTheme | null;
      if (savedTheme) {
        setThemeState(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);
      } else {
        document.documentElement.setAttribute('data-theme', 'flyer-rose');
      }

      const savedServices = localStorage.getItem(STORAGE_KEYS.SERVICES);
      if (savedServices) setServices(JSON.parse(savedServices));

      const savedProducts = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (savedProducts) setProducts(JSON.parse(savedProducts));

      const savedBookings = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      if (savedBookings) setBookings(JSON.parse(savedBookings));

      const savedOrders = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (savedOrders) setOrders(JSON.parse(savedOrders));

      const savedUsers = localStorage.getItem(STORAGE_KEYS.USERS);
      if (savedUsers) {
        const parsedUsers: UserAccount[] = JSON.parse(savedUsers);
        // Ensure both mandatory admin accounts always use latest names & credentials
        const merged = [...INITIAL_USERS];
        for (const u of parsedUsers) {
          if (!merged.some((admin) => admin.phone === u.phone)) {
            merged.push(u);
          }
        }
        setUsers(merged);
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(merged));
      }

      const savedCurrentUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (savedCurrentUser) {
        const parsedCurrent: UserAccount = JSON.parse(savedCurrentUser);
        const matchingAdmin = INITIAL_USERS.find(
          (admin) => admin.phone === parsedCurrent.phone
        );
        const syncedUser = matchingAdmin || parsedCurrent;
        setCurrentUser(syncedUser);
        localStorage.setItem(
          STORAGE_KEYS.CURRENT_USER,
          JSON.stringify(syncedUser)
        );
      }
    } catch {
      // Fallback to defaults if storage unavailable
    }
  }, []);

  const setTheme = (newTheme: BrandTheme) => {
    setThemeState(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, newTheme);
    } catch {}
  };

  const normalizePhone = (phone: string) => phone.replace(/\s+/g, '').trim();

  const login = (phone: string, password: string) => {
    const cleanPhone = normalizePhone(phone);
    const match = users.find(
      (u) => normalizePhone(u.phone) === cleanPhone && u.password === password
    );

    if (!match) {
      return {
        ok: false,
        message: 'Invalid phone number or password. Please check and try again.',
      };
    }

    setCurrentUser(match);
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(match));
    } catch {}

    return {
      ok: true,
      message: `Welcome back, ${match.name}!`,
      user: match,
    };
  };

  const registerClient = (data: {
    name: string;
    phone: string;
    password: string;
    hostel: string;
  }) => {
    const cleanPhone = normalizePhone(data.phone);
    if (!cleanPhone || cleanPhone.length < 9) {
      return { ok: false, message: 'Please enter a valid mobile phone number.' };
    }
    const existing = users.find((u) => normalizePhone(u.phone) === cleanPhone);
    if (existing) {
      return {
        ok: false,
        message: 'An account with this phone number already exists. Please sign in.',
      };
    }

    const newUser: UserAccount = {
      id: `client-${Date.now()}`,
      name: data.name.trim(),
      phone: cleanPhone,
      password: data.password,
      role: 'client',
      hostel: data.hostel.trim() || 'Royal Hostel',
      createdAt: new Date().toISOString(),
    };

    const nextUsers = [...users, newUser];
    setUsers(nextUsers);
    setCurrentUser(newUser);
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(nextUsers));
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser));
    } catch {}

    return {
      ok: true,
      message: `Account created! Welcome to Sinyora Gee, ${newUser.name}.`,
      user: newUser,
    };
  };

  const logout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    } catch {}
  };

  const toggleServiceForBooking = (service: SpaService) => {
    setSelectedServicesForBooking((prev) => {
      const exists = prev.some((s) => s.id === service.id);
      if (exists) {
        return prev.filter((s) => s.id !== service.id);
      }
      return [...prev, service];
    });
  };

  const clearBookingSelection = () => setSelectedServicesForBooking([]);

  const createBooking = (
    data: Omit<ServiceBooking, 'id' | 'status' | 'createdAt'>
  ) => {
    const newBooking: ServiceBooking = {
      ...data,
      id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };
    const next = [newBooking, ...bookings];
    setBookings(next);
    setSelectedServicesForBooking([]);
    try {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(next));
    } catch {}
    return newBooking;
  };

  const updateBookingStatus = (id: string, status: BookingStatus) => {
    const next = bookings.map((b) => (b.id === id ? { ...b, status } : b));
    setBookings(next);
    try {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(next));
    } catch {}
  };

  const addToCart = (product: SpaProduct) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const createProductOrder = (
    data: Omit<ProductOrder, 'id' | 'status' | 'createdAt'>
  ) => {
    const newOrder: ProductOrder = {
      ...data,
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };
    const next = [newOrder, ...orders];
    setOrders(next);
    setCart([]);
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(next));
    } catch {}
    return newOrder;
  };

  const updateOrderStatus = (id: string, status: OrderStatus) => {
    const next = orders.map((o) => (o.id === id ? { ...o, status } : o));
    setOrders(next);
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(next));
    } catch {}
  };

  const addProduct = (productData: Omit<SpaProduct, 'id' | 'createdAt'>) => {
    const newProduct: SpaProduct = {
      ...productData,
      id: `prd-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const next = [newProduct, ...products];
    setProducts(next);
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(next));
    } catch {}
  };

  const updateProduct = (
    id: string,
    updates: Partial<Omit<SpaProduct, 'id' | 'createdAt'>>
  ) => {
    const next = products.map((p) => (p.id === id ? { ...p, ...updates } : p));
    setProducts(next);
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(next));
    } catch {}
  };

  const deleteProduct = (id: string) => {
    const next = products.filter((p) => p.id !== id);
    setProducts(next);
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(next));
    } catch {}
  };

  const addService = (serviceData: Omit<SpaService, 'id'>) => {
    const newService: SpaService = {
      ...serviceData,
      id: `srv-${Date.now()}`,
    };
    const next = [...services, newService];
    setServices(next);
    try {
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(next));
    } catch {}
  };

  const updateServicePrice = (id: string, price: number) => {
    const next = services.map((s) => (s.id === id ? { ...s, price } : s));
    setServices(next);
    try {
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(next));
    } catch {}
  };

  const deleteService = (id: string) => {
    const next = services.filter((s) => s.id !== id);
    setServices(next);
    try {
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(next));
    } catch {}
  };

  return (
    <StoreContext.Provider
      value={{
        theme,
        setTheme,
        services,
        products,
        bookings,
        orders,
        users,
        currentUser,
        selectedServicesForBooking,
        cart,
        login,
        registerClient,
        logout,
        toggleServiceForBooking,
        clearBookingSelection,
        createBooking,
        updateBookingStatus,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        createProductOrder,
        updateOrderStatus,
        addProduct,
        updateProduct,
        deleteProduct,
        addService,
        updateServicePrice,
        deleteService,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within a StoreProvider');
  return ctx;
}

