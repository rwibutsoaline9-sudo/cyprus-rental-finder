import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdmin } from '@/hooks/useAdmin';
import { Eye, TrendingUp, BarChart3 } from 'lucide-react';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export const PropertyViews = () => {
  const { propertyViews, loading } = useAdmin();

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Property Views</h1>
        <div className="grid gap-6 md:grid-cols-3">
          {[...Array(3)].map((_, i) => (
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
  const todayViews = propertyViews.filter(v => 
    format(new Date(v.created_at), 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
  );

  // Group views by property
  const viewsByProperty = propertyViews.reduce((acc, view) => {
    const propertyTitle = view.properties?.title || 'Unknown Property';
    acc[propertyTitle] = (acc[propertyTitle] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topProperties = Object.entries(viewsByProperty)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const avgViewsPerProperty = propertyViews.length > 0 
    ? Math.round(propertyViews.length / Object.keys(viewsByProperty).length) 
    : 0;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Property Views Analytics</h1>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{propertyViews.length}</div>
            <p className="text-xs text-muted-foreground">
              All property views
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Views</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayViews.length}</div>
            <p className="text-xs text-muted-foreground">
              Views today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Views/Property</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgViewsPerProperty}</div>
            <p className="text-xs text-muted-foreground">
              Average views per property
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Viewed Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProperties.map(([propertyTitle, views], index) => (
                <div key={propertyTitle} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-medium text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{propertyTitle}</p>
                      <p className="text-sm text-muted-foreground">{views} views</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{views}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Property Views</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {propertyViews.slice(0, 10).map((view) => (
                  <TableRow key={view.id}>
                    <TableCell className="font-medium">
                      {view.properties?.title || 'Unknown Property'}
                    </TableCell>
                    <TableCell>
                      {format(new Date(view.created_at), 'MMM dd, HH:mm')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};