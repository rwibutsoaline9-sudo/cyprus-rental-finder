export interface Property {
  id: string;
  title: string;
  property_type: 'apartment' | 'house' | 'studio' | 'villa';
  bedrooms: number;
  bathrooms: number;
  price: number;
  rental_period: 'short-term' | 'long-term';
  city: string;
  area: string;
  furnished: boolean;
  amenities: string[];
  description: string;
  images: string[];
  available: boolean;
  created_at: string;
  updated_at: string;
}

export interface PropertyFilters {
  city?: string;
  rental_period?: 'short-term' | 'long-term' | '';
  property_type?: string;
  min_price?: number;
  max_price?: number;
  min_bedrooms?: number;
  max_bedrooms?: number;
  furnished?: boolean | null;
}

export interface Booking {
  id: string;
  property_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  booking_amount: number;
  payment_status: 'pending' | 'paid' | 'cancelled';
  stripe_session_id?: string;
  booking_date: string;
  check_in_date: string;
  check_out_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}