import { Card, CardContent } from '@/components/ui/card';

interface AdSpaceProps {
  size?: 'banner' | 'rectangle' | 'sidebar';
  className?: string;
}

export const AdSpace = ({ size = 'rectangle', className = '' }: AdSpaceProps) => {
  const sizeClasses = {
    banner: 'h-24 md:h-32', // 728x90 leaderboard style
    rectangle: 'h-64', // 300x250 rectangle style
    sidebar: 'h-80' // 160x600 skyscraper style
  };

  return (
    <Card className={`bg-muted/30 border-dashed ${sizeClasses[size]} ${className}`}>
      <CardContent className="h-full flex items-center justify-center p-6">
        <div className="text-center text-muted-foreground">
          <div className="text-lg font-medium mb-2">Advertisement</div>
          <div className="text-sm">Google AdSense Space</div>
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