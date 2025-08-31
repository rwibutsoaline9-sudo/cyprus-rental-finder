import { useState } from 'react';
import { Property, PropertyFilters as PropertyFiltersType } from '@/types/property';
import { useProperties } from '@/hooks/useProperties';
import { PropertyCard } from '@/components/PropertyCard';
import { PropertyFilters } from '@/components/PropertyFilters';
import { BookingModal } from '@/components/BookingModal';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Home, MapPin } from 'lucide-react';

const Index = () => {
  const [filters, setFilters] = useState<PropertyFiltersType>({});
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  
  const { properties, loading, refetch } = useProperties(filters);

  const handleFiltersChange = (newFilters: PropertyFiltersType) => {
    setFilters(newFilters);
  };

  const handleSearch = () => {
    refetch();
  };

  const handleBookNow = (property: Property) => {
    setSelectedProperty(property);
    setIsBookingModalOpen(true);
  };

  const handleCloseBookingModal = () => {
    setIsBookingModalOpen(false);
    setSelectedProperty(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <Home className="h-6 w-6 sm:h-8 sm:w-8" />
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Cyprus Rental Finder</h1>
              <p className="text-sm sm:text-base text-primary-foreground/80">Find your perfect rental property in Cyprus</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4 sm:py-6 md:py-8">
        {/* Search and Filters */}
        <div className="mb-6 sm:mb-8">
          <PropertyFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onSearch={handleSearch}
          />
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>
              {loading ? 'Searching...' : `${properties.length} properties found`}
              {filters.city && ` in ${filters.city}`}
              {filters.rental_period && ` for ${filters.rental_period} rental`}
            </span>
          </div>
        </div>

        {/* Property Listings */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading properties...</span>
          </div>
        ) : properties.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Home className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No properties found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search filters to find more properties.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onBookNow={handleBookNow}
              />
            ))}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      <BookingModal
        property={selectedProperty}
        isOpen={isBookingModalOpen}
        onClose={handleCloseBookingModal}
      />
    </div>
  );
};

export default Index;
