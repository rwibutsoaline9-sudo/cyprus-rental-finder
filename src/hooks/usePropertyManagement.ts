import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Property } from '@/types/property';
import { useToast } from '@/hooks/use-toast';

export const usePropertyManagement = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const createProperty = async (propertyData: Omit<Property, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('properties')
        .insert([propertyData])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Property created successfully",
      });

      return data;
    } catch (error) {
      console.error('Error creating property:', error);
      toast({
        title: "Error",
        description: "Failed to create property",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProperty = async (id: string, updates: Partial<Property>) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('properties')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Property updated successfully",
      });

      return data;
    } catch (error) {
      console.error('Error updating property:', error);
      toast({
        title: "Error",
        description: "Failed to update property",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteProperty = async (id: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Property deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting property:', error);
      toast({
        title: "Error",
        description: "Failed to delete property",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    createProperty,
    updateProperty,
    deleteProperty,
    loading,
  };
};