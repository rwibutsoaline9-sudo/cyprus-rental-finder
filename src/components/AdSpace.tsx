import { Card, CardContent } from '@/components/ui/card';

interface AdSpaceProps {
  size?: 'banner' | 'rectangle' | 'sidebar';
  className?: string;
}

export const AdSpace = ({ size = 'rectangle', className = '' }: AdSpaceProps) => {
  const sizeClasses = {
    banner: 'h-16 sm:h-20 md:h-24 lg:h-32', // 728x90 leaderboard style
    rectangle: 'h-48 sm:h-56 md:h-64', // 300x250 rectangle style
    sidebar: 'h-64 sm:h-72 lg:h-80' // 160x600 skyscraper style
  };

  return (
    <Card className={`bg-muted/30 border-dashed ${sizeClasses[size]} ${className}`}>
      <CardContent className="h-full flex items-center justify-center p-3 sm:p-4 lg:p-6">
        <div className="text-center text-muted-foreground">
          <div className="text-sm sm:text-base lg:text-lg font-medium mb-1 sm:mb-2">Advertisement</div>
          <div className="text-xs sm:text-sm">Google AdSense Space</div>
          <div className="text-xs mt-1 opacity-70">
            {size === 'banner' && '728 x 90'}
            {size === 'rectangle' && '300 x 250'}
            {size === 'sidebar' && '160 x 600'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};