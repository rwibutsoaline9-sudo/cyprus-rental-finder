import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface VisitorAnalytics {
  id: string;
  page_url: string;
  referrer?: string;
  device_type?: string;
  created_at: string;
}

export interface PropertyView {
  id: string;
  property_id: string;
  created_at: string;
  properties: {
    title: string;
  };
}

export interface PropertyRating {
  id: string;
  property_id: string;
  rating: number;
  comment?: string;
  reviewer_name?: string;
  reviewer_email?: string;
  created_at: string;
  properties: {
    title: string;
  };
}

export const useAdmin = () => {
  const [visitors, setVisitors] = useState<VisitorAnalytics[]>([]);
  const [propertyViews, setPropertyViews] = useState<PropertyView[]>([]);
  const [propertyRatings, setPropertyRatings] = useState<PropertyRating[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      const [visitorsRes, viewsRes, ratingsRes] = await Promise.all([
        supabase
          .from('visitor_analytics')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(100),
        supabase
          .from('property_views')
          .select(`
            *,
            properties(title)
          `)
          .order('created_at', { ascending: false })
          .limit(100),
        supabase
          .from('property_ratings')
          .select(`
            *,
            properties(title)
          `)
          .order('created_at', { ascending: false })
      ]);

      if (visitorsRes.data) setVisitors(visitorsRes.data);
      if (viewsRes.data) setPropertyViews(viewsRes.data as PropertyView[]);
      if (ratingsRes.data) setPropertyRatings(ratingsRes.data as PropertyRating[]);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast({
        title: "Error",
        description: "Failed to load analytics data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return {
    visitors,
    propertyViews,
    propertyRatings,
    loading,
    refetch: fetchAnalytics,
  };
};