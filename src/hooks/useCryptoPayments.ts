import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface CryptoPaymentSetting {
  id: string;
  currency_code: string;
  currency_name: string;
  wallet_address: string;
  is_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export const useCryptoPayments = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: cryptoSettings, isLoading } = useQuery({
    queryKey: ['crypto-payment-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('crypto_payment_settings')
        .select('*')
        .eq('is_enabled', true)
        .order('currency_code');

      if (error) throw error;
      return data as CryptoPaymentSetting[];
    },
  });

  const updateCryptoSetting = useMutation({
    mutationFn: async (setting: Partial<CryptoPaymentSetting> & { id: string }) => {
      const { data, error } = await supabase
        .from('crypto_payment_settings')
        .update({
          wallet_address: setting.wallet_address,
          is_enabled: setting.is_enabled,
        })
        .eq('id', setting.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crypto-payment-settings'] });
      toast({
        title: "Settings Updated",
        description: "Crypto payment settings have been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: "Failed to update crypto payment settings.",
        variant: "destructive",
      });
      console.error('Error updating crypto settings:', error);
    },
  });

  return {
    cryptoSettings,
    isLoading,
    updateCryptoSetting: updateCryptoSetting.mutate,
  };
};

export const useCryptoPaymentsAdmin = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: cryptoSettings, isLoading } = useQuery({
    queryKey: ['crypto-payment-settings-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('crypto_payment_settings')
        .select('*')
        .order('currency_code');

      if (error) throw error;
      return data as CryptoPaymentSetting[];
    },
  });

  const updateCryptoSetting = useMutation({
    mutationFn: async (setting: Partial<CryptoPaymentSetting> & { id: string }) => {
      const { data, error } = await supabase
        .from('crypto_payment_settings')
        .update({
          wallet_address: setting.wallet_address,
          is_enabled: setting.is_enabled,
        })
        .eq('id', setting.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crypto-payment-settings-admin'] });
      toast({
        title: "Settings Updated",
        description: "Crypto payment settings have been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: "Failed to update crypto payment settings.",
        variant: "destructive",
      });
      console.error('Error updating crypto settings:', error);
    },
  });

  return {
    cryptoSettings,
    isLoading,
    updateCryptoSetting: updateCryptoSetting.mutate,
  };
};