import { useState } from 'react';
import { Property, PropertyFilters as PropertyFiltersType } from '@/types/property';
import { useProperties } from '@/hooks/useProperties';
import { useVisitorTracking } from '@/hooks/useVisitorTracking';
import { PropertyCard } from '@/components/frontend/PropertyCard';
import { PropertyFilters } from '@/components/frontend/PropertyFilters';
import { BookingModal } from '@/components/frontend/BookingModal';
import { Footer } from '@/components/frontend/Footer';
import { AdSpace } from '@/components/frontend/AdSpace';
import { Header } from '@/components/frontend/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Building2, MapPin } from 'lucide-react';

const Apartments = () => {
  useVisitorTracking();
  const [filters, setFilters] = useState<PropertyFiltersType>({ property_type: 'apartment' });
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  
  const { properties, loading, refetch } = useProperties(filters);

  const handleFiltersChange = (newFilters: PropertyFiltersType) => {
    setFilters({ ...newFilters, property_type: 'apartment' });
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

  const handleHeaderSearch = (query: string) => {
    setFilters(prev => ({ ...prev, city: query, property_type: 'apartment' }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={handleHeaderSearch} />
      
      <div className="pt-16">
        <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-4 md:py-6">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Building2 className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">Modern Apartments in Cyprus</h1>
            </div>
            <p className="text-muted-foreground">
              Find the perfect apartment in prime locations across Cyprus
            </p>
          </div>

          <div className="mb-4 sm:mb-6">
            <AdSpace size="banner" />
          </div>

          <div className="mb-4 sm:mb-6">
            <PropertyFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onSearch={handleSearch}
            />
          </div>

          <div className="flex flex-col xl:flex-row gap-3 sm:gap-4 lg:gap-6">
            <div className="flex-1">
              <div className="mb-4 sm:mb-6">
                <div className="flex items-center gap-2 text-muted-foreground text-sm sm:text-base">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {loading ? 'Searching...' : `${properties.length} apartments found`}
                    {filters.city && ` in ${filters.city}`}
                  </span>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-8 sm:py-12">
                  <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-primary" />
                  <span className="ml-2 text-muted-foreground text-sm sm:text-base">Loading apartments...</span>
                </div>
              ) : properties.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8 sm:py-12">
                    <Building2 className="h-8 w-8 sm:h-12 sm:w-12 mx-auto text-muted-foreground mb-3 sm:mb-4" />
                    <h3 className="text-base sm:text-lg font-semibold mb-2">No apartments found</h3>
                    <p className="text-muted-foreground mb-4 text-sm sm:text-base">
                      Try adjusting your search filters to find more apartments.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-2 sm:gap-3 lg:gap-4">
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

            <div className="xl:w-64 2xl:w-72 space-y-3 sm:space-y-4">
              <AdSpace size="sidebar" />
              <AdSpace size="rectangle" />
            </div>
          </div>
        </div>

        <Footer />

        <BookingModal
          property={selectedProperty}
          isOpen={isBookingModalOpen}
          onClose={handleCloseBookingModal}
        />
      </div>
    </div>
  );
};

export default Apartments;
