export type ServiceCategoryId =
  | 'facial'
  | 'massage'
  | 'makeup'
  | 'bridal'
  | 'additional';

export interface SpaService {
  id: string;
  categoryId: ServiceCategoryId;
  name: string;
  price: number;
  duration: string;
  description: string;
  popular?: boolean;
}

export type ProductCategoryId =
  | 'facial-products'
  | 'body-care-products'
  | 'hair-care-products'
  | 'natural-organic-products'
  | 'all-skin-types';

export type ProductTag =
  | 'Oils'
  | 'Masks'
  | 'Shampoos'
  | 'Serums'
  | 'Cleansers'
  | 'Body Care'
  | 'Organic';

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
  | 'Cash';

export type BookingStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';

export interface ServiceBooking {
  id: string;
  clientId?: string;
  clientName: string;
  clientPhone: string;
  hostelOrRoom: string;
  services: {
    id: string;
    name: string;
    price: number;
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

export type OrderStatus = 'Pending' | 'Paid' | 'Processing' | 'Delivered' | 'Cancelled';

export interface ProductOrderItem {
  productId: string;
  name: string;
  tag: ProductTag;
  price: number;
  quantity: number;
}

export interface ProductOrder {
  id: string;
  clientId?: string;
  clientName: string;
  clientPhone: string;
  deliveryLocation: string;
  items: ProductOrderItem[];
  totalPrice: number;
  paymentMethod: PaymentMethod;
  transactionRef?: string;
  status: OrderStatus;
  createdAt: string;
}

export type UserRole = 'client' | 'admin';

export interface UserAccount {
  id: string;
  name: string;
  phone: string;
  password: string;
  role: UserRole;
  hostel?: string;
  title?: string;
  createdAt: string;
}

export type ColorThemeId =
  | 'signature-magenta'
  | 'rose-gold'
  | 'royal-emerald'
  | 'velvet-plum';

export interface DatabaseSchema {
  services: SpaService[];
  products: SpaProduct[];
  bookings: ServiceBooking[];
  orders: ProductOrder[];
  users: UserAccount[];
  colorTheme: ColorThemeId;
}

