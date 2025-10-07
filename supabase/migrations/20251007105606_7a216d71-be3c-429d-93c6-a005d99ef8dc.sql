-- Create crypto payment settings table
CREATE TABLE public.crypto_payment_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  currency_code text NOT NULL UNIQUE,
  currency_name text NOT NULL,
  wallet_address text NOT NULL,
  is_enabled boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.crypto_payment_settings ENABLE ROW LEVEL SECURITY;

-- Allow everyone to view enabled crypto payment settings
CREATE POLICY "Everyone can view enabled crypto settings"
ON public.crypto_payment_settings
FOR SELECT
USING (is_enabled = true);

-- Only admins can manage crypto payment settings
CREATE POLICY "Admins can manage crypto settings"
ON public.crypto_payment_settings
FOR ALL
USING (is_admin());

-- Insert default crypto currencies
INSERT INTO public.crypto_payment_settings (currency_code, currency_name, wallet_address, is_enabled)
VALUES 
  ('BTC', 'Bitcoin', '1NqUvkxoUJDdMRRZu3PUjj68Ro9Ki2UEkc', true),
  ('USDT', 'Tether (USDT)', '0x7d2E576De04A87bF1d5B754b3A07ED0619F141a5', true),
  ('BNB', 'Binance Coin', '0x7d2E576De04A87bF1d5B754b3A07ED0619F141a5', true);

-- Create trigger for updated_at
CREATE TRIGGER update_crypto_payment_settings_updated_at
BEFORE UPDATE ON public.crypto_payment_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();