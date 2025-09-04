import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useVisitorTracking = () => {
  useEffect(() => {
    const trackVisitor = async () => {
      try {
        // Get device info
        const userAgent = navigator.userAgent;
        const isMobile = /Mobile|Android|iPhone|iPad/.test(userAgent);
        const isTablet = /iPad|Android(?=.*Mobile)/.test(userAgent);
        
        let deviceType = 'desktop';
        if (isTablet) deviceType = 'tablet';
        else if (isMobile) deviceType = 'mobile';

        // Get location from IP (using a simple geo API)
        let locationData = {};
        try {
          const response = await fetch('https://ipapi.co/json/');
          if (response.ok) {
            const data = await response.json();
            locationData = {
              city: data.city,
              country: data.country_name,
              ip_address: data.ip
            };
          }
        } catch (locationError) {
          console.warn('Could not get location data:', locationError);
        }

        await supabase.from('visitor_analytics').insert({
          page_url: window.location.href,
          referrer: document.referrer || null,
          user_agent: userAgent,
          device_type: deviceType,
          ...locationData
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