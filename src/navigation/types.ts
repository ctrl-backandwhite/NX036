import type { Category, Product, Order, Invoice, Address, PaymentMethod } from '../types';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type MainTabParamList = {
  HomeTab: undefined;
  CategoriesTab: undefined;
  CartTab: undefined;
  ProfileTab: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Search: undefined;
  Notifications: undefined;
  ProductDetail: { product: Product };
  CategoryProducts: { category: Category };
  Checkout: { subtotal?: number; shipping?: number; discount?: number; tax?: number; total?: number };
  OrderConfirmation: undefined;
};

export type ProfileStackParamList = {
  ProfileMain: undefined;
  EditProfile: undefined;
  Addresses: undefined;
  AddAddress: { address?: Address };
  PaymentMethods: undefined;
  AddPaymentMethod: { payment?: PaymentMethod };
  Orders: undefined;
  OrderDetail: { order: Order };
  OrderTracking: { order: Order };
  Invoices: undefined;
  InvoiceDetail: { invoice: Invoice };
  LoyaltyPoints: undefined;
  GiftCards: undefined;
  Security: undefined;
};
