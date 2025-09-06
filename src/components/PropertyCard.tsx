import { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, CarouselApi } from '@/components/ui/carousel';
import { Property } from '@/types/property';
import { MapPin, Bed, Bath, Wifi, Car, Home, ImageIcon, Heart, Star, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';
import { trackPropertyView } from '@/hooks/useVisitorTracking';
import { useEffect } from 'react';

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
  const [isFavorited, setIsFavorited] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [previewImageIndex, setPreviewImageIndex] = useState(0);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [api, setApi] = useState<CarouselApi>();
  const [previewApi, setPreviewApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrentImageIndex(api.selectedScrollSnap());
    };

    api.on('select', onSelect);
    onSelect();

    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  useEffect(() => {
    if (!previewApi) return;

    const onSelect = () => {
      setPreviewImageIndex(previewApi.selectedScrollSnap());
    };

    previewApi.on('select', onSelect);
    onSelect();

    return () => {
      previewApi.off('select', onSelect);
    };
  }, [previewApi]);

  const formatPrice = (price: number, period: string) => {
    if (period === 'short-term') {
      return `€${price}`;
    }
    return `€${price}`;
  };

  const getPeriodLabel = (period: string) => {
    return period === 'short-term' ? 'night' : 'month';
  };

  const getPropertyImages = (property: Property) => {
    // If property has uploaded images, use them
    if (property.images && property.images.length > 0 && property.images[0] !== '') {
      return property.images;
    }
    
    // Fallback to local images based on property type
    switch (property.property_type) {
      case 'apartment':
        return [apartment1, apartment2];
      case 'studio':
        return [studio1];
      case 'house':
        return [house1, house2];
      case 'villa':
        return [villa1];
      default:
        return [apartment1];
    }
  };

  const images = getPropertyImages(property);

  return (
    <Card className="group w-full bg-card border-0 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden rounded-xl">
      {/* Image Carousel */}
      <div className="relative">
        <Carousel className="w-full" setApi={setApi}>
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index}>
                <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                   <DialogTrigger asChild>
                     <div 
                       className="relative aspect-[4/3] overflow-hidden rounded-t-xl cursor-pointer group/image"
                       onClick={() => {
                         setPreviewImageIndex(index);
                         setIsPreviewOpen(true);
                       }}
                     >
                      <img 
                        src={image} 
                        alt={`${property.title} - Image ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const fallback = target.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                      {/* Zoom overlay */}
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/image:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                        <ZoomIn className="h-8 w-8 text-white" />
                      </div>
                      {/* Fallback icon when image fails to load */}
                      <div className="absolute inset-0 bg-muted hidden items-center justify-center">
                        <ImageIcon className="h-12 w-12 text-muted-foreground" />
                      </div>
                    </div>
                  </DialogTrigger>
                </Dialog>
              </CarouselItem>
            ))}
          </CarouselContent>
          {images.length > 1 && (
            <>
              <CarouselPrevious className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 bg-white/90 hover:bg-white border-0 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 z-10" />
              <CarouselNext className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 bg-white/90 hover:bg-white border-0 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 z-10" />
            </>
          )}
          
          {/* Interactive image dots */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
              {images.map((_, index) => (
                <button
                  key={index}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                    index === currentImageIndex ? 'bg-white scale-125' : 'bg-white/60 hover:bg-white/80'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    api?.scrollTo(index);
                  }}
                />
              ))}
            </div>
          )}
        </Carousel>

        {/* Image Preview Modal */}
        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogContent className="max-w-4xl w-full h-[80vh] p-0 bg-black/95 border-0">
            <div className="relative w-full h-full flex items-center justify-center">
              <Carousel className="w-full h-full" setApi={setPreviewApi}>
                <CarouselContent>
                  {images.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="relative w-full h-full flex items-center justify-center">
                        <img 
                          src={image} 
                          alt={`${property.title} - Image ${index + 1}`}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {images.length > 1 && (
                  <>
                    <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 bg-white/10 hover:bg-white/20 border-white/20 text-white" />
                    <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 bg-white/10 hover:bg-white/20 border-white/20 text-white" />
                  </>
                )}
              </Carousel>
              
              {/* Preview image counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {previewImageIndex + 1} / {images.length}
              </div>
              
              {/* Close button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 h-10 w-10 bg-white/10 hover:bg-white/20 border-white/20 text-white"
                onClick={() => setIsPreviewOpen(false)}
              >
                ×
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Favorite button */}
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-3 right-3 h-8 w-8 bg-white/80 hover:bg-white border-0 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            setIsFavorited(!isFavorited);
          }}
        >
          <Heart className={`h-4 w-4 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
        </Button>

        {/* Property type badge */}
        <Badge className="absolute top-3 left-3 bg-black/60 text-white border-0 hover:bg-black/60">
          {property.property_type.charAt(0).toUpperCase() + property.property_type.slice(1)}
        </Badge>
      </div>
      
      <CardContent className="p-2 sm:p-3 lg:p-4 space-y-2 sm:space-y-3">
        {/* Location and rating */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
            <MapPin className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0" />
            <span className="font-medium text-foreground truncate">{property.area}, {property.city}</span>
          </div>
          <div className="flex items-center gap-1 text-xs sm:text-sm flex-shrink-0">
            <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">4.8</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-medium text-sm sm:text-base line-clamp-2 text-foreground group-hover:text-primary transition-colors leading-tight">
          {property.title}
        </h3>

        {/* Property details */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground">
          {property.bedrooms > 0 && (
            <div className="flex items-center gap-1">
              <Bed className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              <span>{property.bedrooms}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Bath className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
            <span>{property.bathrooms}</span>
          </div>
          {property.furnished && (
            <Badge variant="outline" className="text-xs py-0 px-1 hidden sm:inline-flex">
              Furnished
            </Badge>
          )}
        </div>

        {/* Amenities preview - only show on larger screens */}
        {property.amenities && property.amenities.length > 0 && (
          <div className="hidden lg:flex items-center gap-2 text-xs text-muted-foreground">
            {property.amenities.slice(0, 2).map((amenity, index) => (
              <span key={index} className="flex items-center gap-1 truncate">
                {amenity.toLowerCase().includes('wifi') && <Wifi className="h-2.5 w-2.5" />}
                {amenity.toLowerCase().includes('parking') && <Car className="h-2.5 w-2.5" />}
                <span className="truncate">{amenity}</span>
              </span>
            ))}
            {property.amenities.length > 2 && (
              <span>+{property.amenities.length - 2}</span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline justify-between pt-1 sm:pt-2">
          <div className="flex items-baseline gap-1">
            <span className="text-sm sm:text-lg font-semibold text-foreground">
              {formatPrice(property.price, property.rental_period)}
            </span>
            <span className="text-xs sm:text-sm text-muted-foreground hidden sm:inline">
              / {getPeriodLabel(property.rental_period)}
            </span>
          </div>
          <span className="text-xs text-muted-foreground hidden sm:inline">
            {property.rental_period === 'short-term' ? 'Short' : 'Long'}
          </span>
        </div>
      </CardContent>
      
      <CardFooter className="p-2 sm:p-3 lg:p-4 pt-0">
        <Button 
          onClick={() => {
            trackPropertyView(property.id);
            onBookNow(property);
          }}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg h-8 sm:h-9 lg:h-11 transition-all duration-200 hover:shadow-md text-xs sm:text-sm lg:text-base"
        >
          Reserve
        </Button>
      </CardFooter>
    </Card>
  );
};