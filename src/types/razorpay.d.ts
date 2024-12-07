declare module 'razorpay' {
  export default class Razorpay {
    constructor(options: { key_id: string; key_secret: string });
    orders: {
      create(options: {
        amount: number;
        currency: string;
        receipt: string;
        payment_capture?: 0 | 1;
      }): Promise<{
        id: string;
        amount: number;
        currency: string;
        receipt: string;
        status: string;
      }>;
      fetch(orderId: string): Promise<{
        id: string;
        amount: number;
        currency: string;
        receipt: string;
        status: string;
      }>;
    };
  }
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
  };
  theme?: {
    color: string;
  };
}

declare global {
  interface Window {
    Razorpay: {
      (options: RazorpayOptions): { open(): void };
      new (options: RazorpayOptions): { open(): void };
    };
  }
}

export type { RazorpayResponse, RazorpayOptions };