import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdmin } from '@/hooks/useAdmin';
import { Users, Monitor, Smartphone, Globe } from 'lucide-react';
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
  
  const uniquePages = new Set(visitors.map(v => v.page_url)).size;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Visitor Analytics</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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
            <CardTitle className="text-sm font-medium">Mobile Visitors</CardTitle>
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
            <CardTitle className="text-sm font-medium">Desktop Visitors</CardTitle>
            <Monitor className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{desktopVisitors.length}</div>
            <p className="text-xs text-muted-foreground">
              {visitors.length > 0 ? Math.round((desktopVisitors.length / visitors.length) * 100) : 0}% of total
            </p>
          </CardContent>
        </Card>
      </div>

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
                    <span className="capitalize">{visitor.device_type}</span>
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