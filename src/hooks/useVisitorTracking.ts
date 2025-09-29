import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useVisitorTracking = (trackKey?: string) => {
  useEffect(() => {
    const trackVisitor = async () => {
      try {
        const pageUrl = window.location.href;

        // Persistent anonymous visitor id for accurate unique counts
        const VISITOR_KEY = 'visitor_id';
        let visitorId = localStorage.getItem(VISITOR_KEY) || '';
        if (!visitorId) {
          try {
            visitorId = crypto.randomUUID();
          } catch {
            // Fallback if crypto API is unavailable
            visitorId = Math.random().toString(36).slice(2) + Date.now().toString(36);
          }
          localStorage.setItem(VISITOR_KEY, visitorId);
        }

        // Dedup within 30s to prevent double inserts (e.g., React StrictMode or rapid route changes)
        const dedupKey = `visit:${pageUrl}`;
        const last = sessionStorage.getItem(dedupKey);
        const now = Date.now();
        if (last && now - Number(last) < 30000) return;
        sessionStorage.setItem(dedupKey, String(now));

        // Get device info
        const userAgent = navigator.userAgent;

        // Ignore bots/crawlers
        const isBot = /bot|crawler|spider|crawling|facebookexternalhit|opengraph|preview|pingdom|uptime|monitor/i.test(userAgent);
        if (isBot) return;

        const isMobile = /Mobile|Android|iPhone|iPad/.test(userAgent);
        const isTablet = /iPad|Android(?=.*Mobile)/.test(userAgent);
        
        let deviceType = 'desktop';
        if (isTablet) deviceType = 'tablet';
        else if (isMobile) deviceType = 'mobile';

        // Get location from IP (with a short timeout)
        let locationData: any = {};
        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 1500);
          const response = await fetch('https://ipapi.co/json/', { signal: controller.signal });
          clearTimeout(timeout);
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
          page_url: pageUrl,
          referrer: document.referrer || null,
          user_agent: userAgent,
          device_type: deviceType,
          visitor_id: visitorId || null,
          ...locationData
        });
      } catch (error) {
        console.error('Error tracking visitor:', error);
      }
    };

    // Defer slightly to avoid double-run during rapid route transitions
    queueMicrotask(trackVisitor);
  }, [trackKey]);
};

export const trackPropertyView = async (propertyId: string) => {
  try {
    // Throttle property view tracking per property for 60s
    const now = Date.now();
    const key = `pv:${propertyId}`;
    const last = sessionStorage.getItem(key);
    if (last && now - Number(last) < 60000) return;
    sessionStorage.setItem(key, String(now));

    await supabase.from('property_views').insert({
      property_id: propertyId,
      user_agent: navigator.userAgent
    });
  } catch (error) {
    console.error('Error tracking property view:', error);
  }
};