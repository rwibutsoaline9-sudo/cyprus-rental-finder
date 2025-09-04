import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdmin } from '@/hooks/useAdmin';
import { Users, Monitor, Smartphone, Globe, Tablet, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export const VisitorsAnalytics = () => {
  const { visitors, loading } = useAdmin();

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Visitor Analytics</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-muted rounded w-24"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-16"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const today = new Date();
  const todayVisitors = visitors.filter(v => 
    format(new Date(v.created_at), 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
  );
  
  const mobileVisitors = visitors.filter(v => v.device_type === 'mobile');
  const desktopVisitors = visitors.filter(v => v.device_type === 'desktop');
  const tabletVisitors = visitors.filter(v => v.device_type === 'tablet');
  
  const uniquePages = new Set(visitors.map(v => v.page_url)).size;
  const topCountries = visitors.reduce((acc, visitor) => {
    if (visitor.country) {
      acc[visitor.country] = (acc[visitor.country] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'mobile': return <Smartphone className="h-4 w-4" />;
      case 'tablet': return <Tablet className="h-4 w-4" />;
      default: return <Monitor className="h-4 w-4" />;
    }
  };

  const getBrowserName = (userAgent: string) => {
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Other';
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Visitor Analytics</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{visitors.length}</div>
            <p className="text-xs text-muted-foreground">
              All time visitors
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Visitors</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayVisitors.length}</div>
            <p className="text-xs text-muted-foreground">
              Unique visitors today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mobile</CardTitle>
            <Smartphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mobileVisitors.length}</div>
            <p className="text-xs text-muted-foreground">
              {visitors.length > 0 ? Math.round((mobileVisitors.length / visitors.length) * 100) : 0}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Desktop</CardTitle>
            <Monitor className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{desktopVisitors.length}</div>
            <p className="text-xs text-muted-foreground">
              {visitors.length > 0 ? Math.round((desktopVisitors.length / visitors.length) * 100) : 0}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tablet</CardTitle>
            <Tablet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tabletVisitors.length}</div>
            <p className="text-xs text-muted-foreground">
              {visitors.length > 0 ? Math.round((tabletVisitors.length / visitors.length) * 100) : 0}% of total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top Countries Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Top Countries
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Object.entries(topCountries)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 8)
              .map(([country, count]) => (
                <div key={country} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="font-medium">{country}</span>
                  <span className="text-sm text-muted-foreground">{count} visitors</span>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Visitors</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Page</TableHead>
                <TableHead>Device</TableHead>
                <TableHead>Browser</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Referrer</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visitors.slice(0, 20).map((visitor) => (
                <TableRow key={visitor.id}>
                  <TableCell className="font-medium">
                    {visitor.page_url.split('/').pop() || 'Home'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getDeviceIcon(visitor.device_type || 'desktop')}
                      <span className="capitalize">{visitor.device_type || 'desktop'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{getBrowserName(visitor.user_agent || '')}</span>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {visitor.city && visitor.country ? (
                        <span>{visitor.city}, {visitor.country}</span>
                      ) : visitor.country ? (
                        <span>{visitor.country}</span>
                      ) : (
                        <span className="text-muted-foreground">Unknown</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {visitor.referrer ? (
                      <span className="text-sm text-muted-foreground">
                        {new URL(visitor.referrer).hostname}
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground">Direct</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {format(new Date(visitor.created_at), 'MMM dd, HH:mm')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};