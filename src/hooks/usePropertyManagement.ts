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
      console.log('Creating property with data:', propertyData);
      
      const { data, error } = await supabase
        .from('properties')
        .insert([propertyData])
        .select()
        .maybeSingle();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      if (!data) {
        throw new Error('No data returned after creating property');
      }

      toast({
        title: "Success",
        description: "Property created successfully",
      });

      return data;
    } catch (error) {
      console.error('Error creating property:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create property",
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
      console.log('Updating property:', id, 'with data:', updates);
      
      const { data, error } = await supabase
        .from('properties')
        .update(updates)
        .eq('id', id)
        .select()
        .maybeSingle();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      if (!data) {
        throw new Error('No data returned after updating property');
      }

      toast({
        title: "Success",
        description: "Property updated successfully",
      });

      return data;
    } catch (error) {
      console.error('Error updating property:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update property",
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

  const uploadImages = async (files: FileList): Promise<string[]> => {
    try {
      console.log('Starting image upload for', files.length, 'files');
      
      const uploadPromises = Array.from(files).map(async (file) => {
        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/bmp', 'image/tiff'];
        if (!allowedTypes.includes(file.type)) {
          throw new Error(`Unsupported file type: ${file.type}`);
        }

        const fileExt = file.name.split('.').pop()?.toLowerCase();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `properties/${fileName}`;

        console.log('Uploading file:', fileName, 'to path:', filePath);

        // Use upsert to handle existing files
        const { error: uploadError } = await supabase.storage
          .from('property-images')
          .upload(filePath, file, {
            upsert: true,
            cacheControl: '3600',
          });

        if (uploadError) {
          console.error('Upload error:', uploadError);
          throw uploadError;
        }

        const { data } = supabase.storage
          .from('property-images')
          .getPublicUrl(filePath);

        console.log('Upload successful, public URL:', data.publicUrl);
        return data.publicUrl;
      });

      const results = await Promise.all(uploadPromises);
      console.log('All uploads completed:', results);
      return results;
    } catch (error) {
      console.error('Error in uploadImages:', error);
      throw error;
    }
  };

  const deleteImages = async (imageUrls: string[]) => {
    const deletePromises = imageUrls.map(async (url) => {
      try {
        // Extract the full path from the public URL
        const urlParts = url.split('/');
        const storageIndex = urlParts.findIndex(part => part === 'property-images');
        
        if (storageIndex !== -1 && storageIndex < urlParts.length - 1) {
          // Get everything after 'property-images' bucket name
          const filePath = urlParts.slice(storageIndex + 1).join('/');
          
          const { error } = await supabase.storage
            .from('property-images')
            .remove([filePath]);
          
          if (error) {
            console.error('Error deleting image:', error);
            throw error;
          }
        }
      } catch (error) {
        console.error('Error processing image URL for deletion:', url, error);
      }
    });

    await Promise.all(deletePromises);
  };

  return {
    createProperty,
    updateProperty,
    deleteProperty,
    uploadImages,
    deleteImages,
    loading,
  };
};