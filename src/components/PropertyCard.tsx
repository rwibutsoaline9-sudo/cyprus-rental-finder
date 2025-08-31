import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Property } from '@/types/property';
import { MapPin, Bed, Bath, Wifi, Car, Home } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  onBookNow: (property: Property) => void;
}

export const PropertyCard = ({ property, onBookNow }: PropertyCardProps) => {
  const formatPrice = (price: number, period: string) => {
    if (period === 'short-term') {
      return `€${price}/night`;
    }
    return `€${price}/month`;
  };

  const getPropertyIcon = (type: string) => {
    switch (type) {
      case 'apartment':
        return <Home className="h-4 w-4" />;
      case 'house':
        return <Home className="h-4 w-4" />;
      case 'studio':
        return <Home className="h-4 w-4" />;
      case 'villa':
        return <Home className="h-4 w-4" />;
      default:
        return <Home className="h-4 w-4" />;
    }
  };

  const getAmenityIcon = (amenity: string) => {
    const amenityLower = amenity.toLowerCase();
    if (amenityLower.includes('wifi')) return <Wifi className="h-3 w-3" />;
    if (amenityLower.includes('parking')) return <Car className="h-3 w-3" />;
    return null;
  };

  return (
    <Card className="w-full hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 mb-2">
            {getPropertyIcon(property.property_type)}
            <Badge variant="secondary" className="capitalize">
              {property.property_type}
            </Badge>
            <Badge 
              variant={property.rental_period === 'short-term' ? 'default' : 'outline'}
              className="capitalize"
            >
              {property.rental_period}
            </Badge>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">
              {formatPrice(property.price, property.rental_period)}
            </div>
          </div>
        </div>
        <h3 className="text-lg font-semibold line-clamp-2">{property.title}</h3>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-center gap-1 text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span className="text-sm">{property.area}, {property.city}</span>
        </div>
        
        <div className="flex items-center gap-4">
          {property.bedrooms > 0 && (
            <div className="flex items-center gap-1">
              <Bed className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{property.bedrooms} bed{property.bedrooms > 1 ? 's' : ''}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Bath className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{property.bathrooms} bath{property.bathrooms > 1 ? 's' : ''}</span>
          </div>
          {property.furnished && (
            <Badge variant="outline" className="text-xs">
              Furnished
            </Badge>
          )}
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {property.description}
        </p>

        {property.amenities && property.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {property.amenities.slice(0, 4).map((amenity, index) => (
              <div key={index} className="flex items-center gap-1">
                {getAmenityIcon(amenity)}
                <Badge variant="outline" className="text-xs">
                  {amenity}
                </Badge>
              </div>
            ))}
            {property.amenities.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{property.amenities.length - 4} more
              </Badge>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={() => onBookNow(property)}
          className="w-full bg-primary hover:bg-primary/90"
          size="lg"
        >
          Book Now - Pay 50% (€{(property.price * 0.5).toFixed(0)})
        </Button>
      </CardFooter>
    </Card>
  );
};