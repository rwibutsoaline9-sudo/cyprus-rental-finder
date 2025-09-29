import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdmin } from '@/hooks/useAdmin';
import { useProperties } from '@/hooks/useProperties';
import { Users, Building2, Eye, Star, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

export const AdminDashboard = () => {
  const { visitors, propertyViews, propertyRatings, loading } = useAdmin();
  const { properties } = useProperties();

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-muted rounded w-24"></div>
                <div className="h-4 w-4 bg-muted rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-16 mb-2"></div>
                <div className="h-3 bg-muted rounded w-32"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const totalViews = propertyViews.length;
  const avgRating = propertyRatings.length > 0 
    ? propertyRatings.reduce((sum, rating) => sum + rating.rating, 0) / propertyRatings.length 
    : 0;

  // Unique visitors today (based on persistent visitor_id, fallback to ip+user_agent)
  const todayKey = format(new Date(), 'yyyy-MM-dd');
  const todayVisitors = (() => {
    const seen = new Set<string>();
    return visitors
      .filter(v => format(new Date(v.created_at), 'yyyy-MM-dd') === todayKey)
      .filter(v => {
        const key = (v as any).visitor_id || `${String((v as any).ip_address ?? '')}|${v.user_agent ?? ''}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      }).length;
  })();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="text-sm text-muted-foreground">
          Last updated: {format(new Date(), 'MMM dd, yyyy HH:mm')}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{properties.length}</div>
            <p className="text-xs text-muted-foreground">
              Active rental listings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayVisitors}</div>
            <p className="text-xs text-muted-foreground">
              Unique visitors today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Property Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews}</div>
            <p className="text-xs text-muted-foreground">
              Total property views
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgRating.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              From {propertyRatings.length} reviews
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {visitors.slice(0, 5).map((visitor) => (
                <div key={visitor.id} className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">
                      {visitor.page_url.split('/').pop() || 'Home'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {visitor.device_type} • {format(new Date(visitor.created_at), 'HH:mm')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Recent Reviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {propertyRatings.slice(0, 5).map((rating) => (
                <div key={rating.id}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{rating.properties.title}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < rating.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'
                            }`}
                          />
                        ))}
                      </div>
                      {rating.comment && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {rating.comment}
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(rating.created_at), 'MMM dd')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};