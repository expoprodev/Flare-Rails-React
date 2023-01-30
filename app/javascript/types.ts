export interface PaymentMethod {
  id: string;
  card: {
    brand: string;
    country: string;
    last4: string;
    exp_month: number;
    exp_year: number;
    generated_from: {
      payment_method_details: {
        card_present: {
          cardholder_name: string;
        };
      };
    };
  };
}

export interface Plan {
  stripe_plan_id: string;
  name: string;
  amount: number;
  id: number;
  interval: string;
}

export interface Coupon {
  name?: string;
  percent_off?: number;
  amount_off?: number;
  duration?: string;
  duration_in_months?: number;
}
