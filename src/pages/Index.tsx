import { useState } from 'react';
import { Property, PropertyFilters as PropertyFiltersType } from '@/types/property';
import { useProperties } from '@/hooks/useProperties';
import { useVisitorTracking } from '@/hooks/useVisitorTracking';
import { PropertyCard } from '@/components/PropertyCard';
import { PropertyFilters } from '@/components/PropertyFilters';
import { BookingModal } from '@/components/BookingModal';
import { Footer } from '@/components/Footer';
import { AdSpace } from '@/components/AdSpace';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Home, MapPin, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  useVisitorTracking();
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <Home className="h-6 w-6 sm:h-8 sm:w-8" />
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Cyprus Rental Finder</h1>
                <p className="text-sm sm:text-base text-primary-foreground/80">Find your perfect rental property in Cyprus</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-4">
              <Link 
                to="/admin" 
                className="flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                <Settings className="h-4 w-4" />
                Admin
              </Link>
              <Button variant="secondary" size="sm">Sign In</Button>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4 sm:py-6 md:py-8">
        {/* Top Banner Ad */}
        <div className="mb-6">
          <AdSpace size="banner" />
        </div>

        {/* Search and Filters */}
        <div className="mb-6 sm:mb-8">
          <PropertyFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onSearch={handleSearch}
          />
        </div>

        {/* Main Content with Sidebar */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <div className="flex-1">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
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

          {/* Right Sidebar - Ads */}
          <div className="lg:w-80 space-y-6">
            <AdSpace size="sidebar" />
            <AdSpace size="rectangle" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />

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
