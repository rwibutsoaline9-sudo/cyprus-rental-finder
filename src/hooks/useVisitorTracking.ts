import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useVisitorTracking = () => {
  useEffect(() => {
    const trackVisitor = async () => {
      try {
        await supabase.from('visitor_analytics').insert({
          page_url: window.location.href,
          referrer: document.referrer || null,
          user_agent: navigator.userAgent,
          device_type: /Mobile|Android|iPhone|iPad/.test(navigator.userAgent) ? 'mobile' : 'desktop'
        });
      } catch (error) {
        console.error('Error tracking visitor:', error);
      }
    };

    trackVisitor();
  }, []);
};

export const trackPropertyView = async (propertyId: string) => {
  try {
    await supabase.from('property_views').insert({
      property_id: propertyId,
      user_agent: navigator.userAgent
    });
  } catch (error) {
    console.error('Error tracking property view:', error);
  }
};