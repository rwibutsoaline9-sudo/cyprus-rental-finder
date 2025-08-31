import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Property } from '@/types/property';
import { MapPin, Bed, Bath, Wifi, Car, Home, ImageIcon } from 'lucide-react';
import { trackPropertyView } from '@/hooks/useVisitorTracking';

// Import property images
import apartment1 from '@/assets/apartment-1.jpg';
import apartment2 from '@/assets/apartment-2.jpg';
import studio1 from '@/assets/studio-1.jpg';
import house1 from '@/assets/house-1.jpg';
import house2 from '@/assets/house-2.jpg';
import villa1 from '@/assets/villa-1.jpg';

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

  const getPropertyImage = (property: Property) => {
    // If property has images array with actual image URLs, use the first one
    if (property.images && property.images.length > 0 && property.images[0] !== '') {
      return property.images[0];
    }
    
    // Fallback to imported local images based on property type
    switch (property.property_type) {
      case 'apartment':
        return Math.random() > 0.5 ? apartment1 : apartment2;
      case 'studio':
        return studio1;
      case 'house':
        return Math.random() > 0.5 ? house1 : house2;
      case 'villa':
        return villa1;
      default:
        return apartment1;
    }
  };

  return (
    <Card className="w-full hover:shadow-lg transition-shadow overflow-hidden">
      {/* Property Image */}
      <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
        <img 
          src={getPropertyImage(property)} 
          alt={property.title}
          className="w-full h-full object-cover transition-transform hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const fallback = target.nextElementSibling as HTMLElement;
            if (fallback) fallback.style.display = 'flex';
          }}
        />
        {/* Fallback icon when image fails to load */}
        <div className="absolute inset-0 bg-muted hidden items-center justify-center">
          <ImageIcon className="h-12 w-12 text-muted-foreground" />
        </div>
        {/* Price overlay */}
        <div className="absolute top-3 right-3 bg-primary/90 text-primary-foreground px-3 py-1 rounded-full">
          <span className="font-bold text-sm sm:text-base">
            {formatPrice(property.price, property.rental_period)}
          </span>
        </div>
        {/* Property type badge */}
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="capitalize text-xs sm:text-sm">
            {property.property_type}
          </Badge>
        </div>
      </div>
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-1 sm:gap-2">
            {getPropertyIcon(property.property_type)}
            <Badge 
              variant={property.rental_period === 'short-term' ? 'default' : 'outline'}
              className="capitalize text-xs"
            >
              {property.rental_period}
            </Badge>
            {property.furnished && (
              <Badge variant="outline" className="text-xs">
                Furnished
              </Badge>
            )}
          </div>
        </div>
        <h3 className="text-base sm:text-lg font-semibold line-clamp-2">{property.title}</h3>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-center gap-1 text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span className="text-sm">{property.area}, {property.city}</span>
        </div>
        
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
          {property.bedrooms > 0 && (
            <div className="flex items-center gap-1">
              <Bed className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
              <span className="text-xs sm:text-sm">{property.bedrooms} bed{property.bedrooms > 1 ? 's' : ''}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Bath className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            <span className="text-xs sm:text-sm">{property.bathrooms} bath{property.bathrooms > 1 ? 's' : ''}</span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {property.description}
        </p>

        {property.amenities && property.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {property.amenities.slice(0, 3).map((amenity, index) => (
              <div key={index} className="flex items-center gap-1">
                {getAmenityIcon(amenity)}
                <Badge variant="outline" className="text-xs">
                  {amenity}
                </Badge>
              </div>
            ))}
            {property.amenities.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{property.amenities.length - 3} more
              </Badge>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-4">
        <Button 
          onClick={() => {
            trackPropertyView(property.id);
            onBookNow(property);
          }}
          className="w-full bg-primary hover:bg-primary/90"
          size="lg"
        >
          <span className="hidden sm:inline">Book Now - Pay 50% (€{(property.price * 0.5).toFixed(0)})</span>
          <span className="sm:hidden">Book - €{(property.price * 0.5).toFixed(0)}</span>
        </Button>
      </CardFooter>
    </Card>
  );
};