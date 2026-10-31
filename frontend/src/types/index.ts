export type ServiceCategoryId =
  | 'facial'
  | 'massage'
  | 'makeup'
  | 'bridal'
  | 'additional';

export interface ServiceCategory {
  id: ServiceCategoryId;
  title: string;
  tagline: string;
  badge: string;
  description: string;
}

export interface SpaService {
  id: string;
  categoryId: ServiceCategoryId;
  name: string;
  price: number; // 0 means FREE
  duration: string;
  description: string;
  badge?: string;
  image: string;
  popular?: boolean;
}

export type ProductCategoryId =
  | 'facial-products'
  | 'body-care'
  | 'hair-care'
  | 'natural-organic'
  | 'all-skin-types';

export type ProductTag =
  | 'Oils'
  | 'Masks'
  | 'Shampoos'
  | 'Serums'
  | 'Cleansers'
  | 'Scrubs'
  | 'Lotions'
  | 'Cosmetics';

export interface SpaProduct {
  id: string;
  name: string;
  categoryId: ProductCategoryId;
  tag: ProductTag;
  price: number;
  stock: number;
  description: string;
  image: string;
  featured?: boolean;
  createdAt: string;
}

export type PaymentMethod =
  | 'M-Pesa'
  | 'Tigo Pesa'
  | 'Airtel Money'
  | 'HaloPesa'
  | 'Cash at Studio';

export type BookingStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';

export interface ServiceBooking {
  id: string;
  clientId?: string;
  clientName: string;
  clientPhone: string;
  hostelOrRoom: string;
  services: {
    serviceId: string;
    name: string;
    price: number;
    duration: string;
  }[];
  totalPrice: number;
  appointmentDate: string;
  appointmentTime: string;
  paymentMethod: PaymentMethod;
  transactionRef?: string;
  skinNotes?: string;
  status: BookingStatus;
  createdAt: string;
}

export type OrderStatus = 'Pending' | 'Processing' | 'Delivered' | 'Cancelled';

export interface ProductOrder {
  id: string;
  clientId?: string;
  clientName: string;
  clientPhone: string;
  deliveryLocation: string;
  items: {
    productId: string;
    name: string;
    tag: ProductTag;
    price: number;
    quantity: number;
  }[];
  totalPrice: number;
  paymentMethod: PaymentMethod;
  transactionRef?: string;
  status: OrderStatus;
  createdAt: string;
}

export interface UserAccount {
  id: string;
  name: string;
  phone: string;
  password: string;
  role: 'admin' | 'client';
  title?: string;
  hostel?: string;
  createdAt: string;
}

export type BrandTheme = 'flyer-rose' | 'clean-blush' | 'botanical-gold';

