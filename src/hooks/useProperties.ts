import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Property, PropertyFilters } from '@/types/property';
import { useToast } from '@/hooks/use-toast';

export const useProperties = (filters: PropertyFilters = {}) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProperties = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('properties')
        .select('*')
        .eq('available', true)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.city) {
        query = query.eq('city', filters.city);
      }
      if (filters.rental_period) {
        query = query.eq('rental_period', filters.rental_period);
      }
      if (filters.property_type) {
        query = query.eq('property_type', filters.property_type);
      }
      if (filters.min_price !== undefined) {
        query = query.gte('price', filters.min_price);
      }
      if (filters.max_price !== undefined) {
        query = query.lte('price', filters.max_price);
      }
      if (filters.min_bedrooms !== undefined) {
        query = query.gte('bedrooms', filters.min_bedrooms);
      }
      if (filters.max_bedrooms !== undefined) {
        query = query.lte('bedrooms', filters.max_bedrooms);
      }
      if (filters.furnished !== null && filters.furnished !== undefined) {
        query = query.eq('furnished', filters.furnished);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      setProperties((data || []) as Property[]);
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast({
        title: "Error",
        description: "Failed to load properties. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [filters]);

  return {
    properties,
    loading,
    refetch: fetchProperties,
  };
};