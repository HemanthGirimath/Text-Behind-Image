declare global {
  interface Window {
    Razorpay: RazorpayConstructor;
  }
}

export interface RazorpayConstructor {
  new (options: RazorpayOptions): Razorpay;
}

export interface Razorpay {
  open(): void;
  on(event: string, handler: Function): void;
  close(): void;
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  handler?: (response: RazorpayResponse) => void;
  modal?: {
    ondismiss?: () => void;
  };
  theme?: {
    color?: string;
  };
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
}

// This export statement is needed to make this file a module
export {}