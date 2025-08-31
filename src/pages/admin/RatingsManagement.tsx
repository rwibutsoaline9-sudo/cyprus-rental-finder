import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdmin } from '@/hooks/useAdmin';
import { Star, MessageSquare, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export const RatingsManagement = () => {
  const { propertyRatings, loading } = useAdmin();

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Ratings & Reviews</h1>
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

  const avgRating = propertyRatings.length > 0 
    ? propertyRatings.reduce((sum, rating) => sum + rating.rating, 0) / propertyRatings.length 
    : 0;

  const ratingsWithComments = propertyRatings.filter(r => r.comment && r.comment.trim().length > 0);

  // Group ratings by score
  const ratingDistribution = propertyRatings.reduce((acc, rating) => {
    acc[rating.rating] = (acc[rating.rating] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-600';
    if (rating >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRatingBadge = (rating: number) => {
    if (rating >= 4) return 'default';
    if (rating >= 3) return 'secondary';
    return 'destructive';
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Ratings & Reviews Management</h1>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{propertyRatings.length}</div>
            <p className="text-xs text-muted-foreground">
              All property reviews
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              <span className={getRatingColor(avgRating)}>{avgRating.toFixed(1)}</span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.round(avgRating) 
                        ? 'fill-yellow-400 text-yellow-400' 
                        : 'text-muted-foreground'
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Based on {propertyRatings.length} reviews
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reviews with Comments</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ratingsWithComments.length}</div>
            <p className="text-xs text-muted-foreground">
              {propertyRatings.length > 0 
                ? Math.round((ratingsWithComments.length / propertyRatings.length) * 100)
                : 0}% include comments
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Rating Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = ratingDistribution[star] || 0;
                const percentage = propertyRatings.length > 0 
                  ? (count / propertyRatings.length) * 100 
                  : 0;
                
                return (
                  <div key={star} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-16">
                      <span className="text-sm font-medium">{star}</span>
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    </div>
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary rounded-full h-2 transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-12 text-right">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Reviews</CardTitle>
          </CardHeader>
          <CardContent className="max-h-80 overflow-y-auto">
            <div className="space-y-4">
              {propertyRatings.slice(0, 10).map((rating) => (
                <div key={rating.id} className="border-b pb-4 last:border-b-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-sm">{rating.properties?.title}</p>
                      <p className="text-xs text-muted-foreground">
                        by {rating.reviewer_name || 'Anonymous'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getRatingBadge(rating.rating)}>
                        {rating.rating}/5
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(rating.created_at), 'MMM dd')}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < rating.rating 
                            ? 'fill-yellow-400 text-yellow-400' 
                            : 'text-muted-foreground'
                        }`}
                      />
                    ))}
                  </div>
                  {rating.comment && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {rating.comment}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Reviewer</TableHead>
                <TableHead>Comment</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {propertyRatings.map((rating) => (
                <TableRow key={rating.id}>
                  <TableCell className="font-medium">
                    {rating.properties?.title || 'Unknown Property'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span className={`font-medium ${getRatingColor(rating.rating)}`}>
                        {rating.rating}
                      </span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < rating.rating 
                                ? 'fill-yellow-400 text-yellow-400' 
                                : 'text-muted-foreground'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">
                        {rating.reviewer_name || 'Anonymous'}
                      </p>
                      {rating.reviewer_email && (
                        <p className="text-xs text-muted-foreground">
                          {rating.reviewer_email}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    {rating.comment ? (
                      <p className="text-sm line-clamp-2">{rating.comment}</p>
                    ) : (
                      <span className="text-sm text-muted-foreground">No comment</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {format(new Date(rating.created_at), 'MMM dd, yyyy')}
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