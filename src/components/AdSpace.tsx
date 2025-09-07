import { Card, CardContent } from '@/components/ui/card';
import { useActiveAdvertisements } from '@/hooks/useAdvertisements';
import { ExternalLink } from 'lucide-react';

interface AdSpaceProps {
  size?: 'banner' | 'rectangle' | 'sidebar';
  className?: string;
}

export const AdSpace = ({ size = 'rectangle', className = '' }: AdSpaceProps) => {
  const { advertisements, loading } = useActiveAdvertisements(size);
  
  const sizeClasses = {
    banner: 'h-16 sm:h-20 md:h-24 lg:h-32', // 728x90 leaderboard style
    rectangle: 'h-48 sm:h-56 md:h-64', // 300x250 rectangle style
    sidebar: 'h-64 sm:h-72 lg:h-80' // 160x600 skyscraper style
  };

  // Get the first active advertisement for this size
  const ad = advertisements[0];

  if (loading) {
    return (
      <Card className={`bg-muted/20 border-dashed ${sizeClasses[size]} ${className} animate-pulse`}>
        <CardContent className="h-full flex items-center justify-center p-3 sm:p-4 lg:p-6">
          <div className="text-center text-muted-foreground">
            <div className="text-sm sm:text-base lg:text-lg font-medium mb-1 sm:mb-2">Loading...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!ad) {
    return (
      <Card className={`bg-muted/30 border-dashed ${sizeClasses[size]} ${className}`}>
        <CardContent className="h-full flex items-center justify-center p-3 sm:p-4 lg:p-6">
          <div className="text-center text-muted-foreground">
            <div className="text-sm sm:text-base lg:text-lg font-medium mb-1 sm:mb-2">Advertisement</div>
            <div className="text-xs sm:text-sm">Ad Space Available</div>
            <div className="text-xs mt-1 opacity-70">
              {size === 'banner' && '728 x 90'}
              {size === 'rectangle' && '300 x 250'}
              {size === 'sidebar' && '160 x 600'}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`bg-card border hover:shadow-md transition-shadow ${sizeClasses[size]} ${className} overflow-hidden`}>
      <CardContent className="h-full p-0">
        <a
          href={ad.link_url}
          target="_blank"
          rel="noopener noreferrer"
          className="block h-full w-full group relative"
        >
          {ad.image_url ? (
            <div className="relative h-full">
              <img
                src={ad.image_url}
                alt={ad.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to text-based ad if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hidden">
                <div className="text-white text-center">
                  <div className="text-sm font-medium mb-1">{ad.title}</div>
                  {ad.description && (
                    <div className="text-xs opacity-90">{ad.description}</div>
                  )}
                  <ExternalLink className="h-4 w-4 mx-auto mt-2" />
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-3 sm:p-4 lg:p-6 bg-gradient-to-br from-primary/10 to-primary/5 group-hover:from-primary/20 group-hover:to-primary/10 transition-colors">
              <div className="text-center">
                <div className="text-sm sm:text-base lg:text-lg font-semibold text-primary mb-1 sm:mb-2">
                  {ad.title}
                </div>
                {ad.description && (
                  <div className="text-xs sm:text-sm text-muted-foreground mb-2">
                    {ad.description}
                  </div>
                )}
                <div className="flex items-center justify-center gap-1 text-xs text-primary/70">
                  <ExternalLink className="h-3 w-3" />
                  <span>Click to visit</span>
                </div>
              </div>
            </div>
          )}
        </a>
      </CardContent>
    </Card>
  );
};