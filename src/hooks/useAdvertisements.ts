import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Advertisement {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  link_url: string;
  ad_size: 'banner' | 'rectangle' | 'sidebar';
  placement: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useAdvertisements = () => {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAdvertisements = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('advertisements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAdvertisements((data || []) as Advertisement[]);
    } catch (error) {
      console.error('Error fetching advertisements:', error);
      toast({
        title: "Error",
        description: "Failed to load advertisements",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createAdvertisement = async (advertisement: Omit<Advertisement, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('advertisements')
        .insert([advertisement])
        .select()
        .single();

      if (error) throw error;
      
      setAdvertisements(prev => [data as Advertisement, ...prev]);
      toast({
        title: "Success",
        description: "Advertisement created successfully",
      });
      
      return data;
    } catch (error) {
      console.error('Error creating advertisement:', error);
      toast({
        title: "Error",
        description: "Failed to create advertisement",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateAdvertisement = async (id: string, updates: Partial<Advertisement>) => {
    try {
      const { data, error } = await supabase
        .from('advertisements')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setAdvertisements(prev => 
        prev.map(ad => ad.id === id ? data as Advertisement : ad)
      );
      
      toast({
        title: "Success",
        description: "Advertisement updated successfully",
      });
      
      return data;
    } catch (error) {
      console.error('Error updating advertisement:', error);
      toast({
        title: "Error",
        description: "Failed to update advertisement",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteAdvertisement = async (id: string) => {
    try {
      const { error } = await supabase
        .from('advertisements')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setAdvertisements(prev => prev.filter(ad => ad.id !== id));
      toast({
        title: "Success",
        description: "Advertisement deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting advertisement:', error);
      toast({
        title: "Error",
        description: "Failed to delete advertisement",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchAdvertisements();
  }, []);

  return {
    advertisements,
    loading,
    createAdvertisement,
    updateAdvertisement,
    deleteAdvertisement,
    refetch: fetchAdvertisements
  };
};

// Hook for getting active advertisements by size and placement
export const useActiveAdvertisements = (size?: 'banner' | 'rectangle' | 'sidebar', placement?: string) => {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActiveAds = async () => {
      try {
        setLoading(true);
        let query = supabase
          .from('advertisements')
          .select('*')
          .eq('is_active', true);

        if (size) {
          query = query.eq('ad_size', size);
        }

        if (placement) {
          query = query.or(`placement.eq.${placement},placement.eq.all`);
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) throw error;
        setAdvertisements((data || []) as Advertisement[]);
      } catch (error) {
        console.error('Error fetching active advertisements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveAds();
  }, [size, placement]);

  return { advertisements, loading };
};