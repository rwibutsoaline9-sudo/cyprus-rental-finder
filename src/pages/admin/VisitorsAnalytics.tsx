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

  // Unique-key helper for visitors
  const uniqueKey = (v: any) => v.visitor_id || `${String(v.ip_address ?? '')}|${v.user_agent ?? ''}`;

  // Distinct counts
  const uniqueTotalVisitors = Array.from(new Set(visitors.map(uniqueKey))).length;
  const todayVisitorsDistinct = (() => {
    const todayStr = format(today, 'yyyy-MM-dd');
    const seen = new Set<string>();
    return visitors
      .filter(v => format(new Date(v.created_at), 'yyyy-MM-dd') === todayStr)
      .filter(v => {
        const key = uniqueKey(v);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      }).length;
  })();
  
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

  const getPageName = (url: string) => {
    try {
      const urlObj = new URL(url);
      const path = urlObj.pathname;
      
      if (path === '/') return 'Home Page';
      if (path === '/auth') return 'Login/Register';
      if (path.startsWith('/admin/')) {
        const adminPath = path.replace('/admin/', '');
        switch (adminPath) {
          case '': return 'Admin Dashboard';
          case 'visitors': return 'Visitor Analytics';
          case 'properties': return 'Properties Management';
          case 'advertisements': return 'Advertisement Management';
          case 'views': return 'Property Views';
          case 'ratings': return 'Ratings Management';
          case 'settings': return 'Admin Settings';
          default: return `Admin - ${adminPath}`;
        }
      }
      
      // Clean up the path for display
      return path.split('/').filter(Boolean).map(segment => 
        segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')
      ).join(' > ');
    } catch {
      return url.split('/').pop() || 'Unknown Page';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const visitTime = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - visitTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return format(visitTime, 'MMM dd, yyyy');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Visitor Analytics</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueTotalVisitors}</div>
            <p className="text-xs text-muted-foreground">
              Distinct visitors in last 100 events
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Visitors</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayVisitorsDistinct}</div>
            <p className="text-xs text-muted-foreground">
              Distinct visitors today
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
          <p className="text-sm text-muted-foreground">Latest {Math.min(20, visitors.length)} visitors to your website</p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Page Visited</TableHead>
                <TableHead className="w-[120px]">Device</TableHead>
                <TableHead className="w-[100px]">Browser</TableHead>
                <TableHead className="w-[150px]">Location</TableHead>
                <TableHead className="w-[120px]">Source</TableHead>
                <TableHead className="w-[100px]">When</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visitors.slice(0, 20).map((visitor) => (
                <TableRow key={visitor.id}>
                  <TableCell className="font-medium">
                    <div className="max-w-[180px] truncate" title={visitor.page_url}>
                      {getPageName(visitor.page_url)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getDeviceIcon(visitor.device_type || 'desktop')}
                      <span className="capitalize text-sm">{visitor.device_type || 'Desktop'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{getBrowserName(visitor.user_agent || '')}</span>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {visitor.city && visitor.country ? (
                        <div>
                          <div className="font-medium">{visitor.city}</div>
                          <div className="text-xs text-muted-foreground">{visitor.country}</div>
                        </div>
                      ) : visitor.country ? (
                        <span className="font-medium">{visitor.country}</span>
                      ) : (
                        <span className="text-muted-foreground">Unknown</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {visitor.referrer ? (
                      <div className="text-sm">
                        <div className="font-medium text-blue-600">External</div>
                        <div className="text-xs text-muted-foreground truncate max-w-[100px]" title={visitor.referrer}>
                          {new URL(visitor.referrer).hostname}
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm">
                        <div className="font-medium text-green-600">Direct</div>
                        <div className="text-xs text-muted-foreground">Type-in/Bookmark</div>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium">{formatTimeAgo(visitor.created_at)}</div>
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(visitor.created_at), 'HH:mm')}
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {visitors.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No visitors yet. Once people visit your website, they'll appear here.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};