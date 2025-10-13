import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useVisitorTracking } from '@/hooks/useVisitorTracking';
import { useProperties } from '@/hooks/useProperties';
import { Property } from '@/types/property';
import { Header } from '@/components/frontend/Header';
import { AdSpace } from '@/components/frontend/AdSpace';
import { Footer } from '@/components/frontend/Footer';
import { PropertyCard } from '@/components/frontend/PropertyCard';
import { BookingModal } from '@/components/frontend/BookingModal';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home as HomeIcon, Building2, Hotel, Castle, Search, ChevronRight } from 'lucide-react';

const Home = () => {
  useVisitorTracking();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const { properties, loading } = useProperties();

  // Group properties by type
  const villas = properties.filter(p => p.property_type === 'villa');
  const apartments = properties.filter(p => p.property_type === 'apartment');
  const studios = properties.filter(p => p.property_type === 'studio');
  const houses = properties.filter(p => p.property_type === 'house');

  const propertyCategories = [
    {
      title: 'Villas',
      description: 'Luxurious villas with private pools and stunning views',
      icon: Castle,
      link: '/properties/villas',
      color: 'from-purple-500 to-purple-700'
    },
    {
      title: 'Apartments',
      description: 'Modern apartments in prime locations',
      icon: Building2,
      link: '/properties/apartments',
      color: 'from-blue-500 to-blue-700'
    },
    {
      title: 'Studios',
      description: 'Cozy studios perfect for solo travelers',
      icon: Hotel,
      link: '/properties/studios',
      color: 'from-green-500 to-green-700'
    },
    {
      title: 'Houses',
      description: 'Family-friendly houses with spacious rooms',
      icon: HomeIcon,
      link: '/properties/houses',
      color: 'from-orange-500 to-orange-700'
    }
  ];

  const handleHeaderSearch = (query: string) => {
    setSearchQuery(query);
    // SPA navigation to avoid full page reload
    navigate(`/properties?search=${encodeURIComponent(query)}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={handleHeaderSearch} />
      
      <div className="pt-16">
        <div className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Find Your Perfect Rental in Cyprus
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Discover amazing properties across Cyprus for short and long-term stays
            </p>
            <Link to="/properties">
              <Button size="lg" className="text-lg px-8">
                <Search className="mr-2 h-5 w-5" />
                Browse All Properties
              </Button>
            </Link>
          </div>

          {/* Top Banner Ad */}
          <div className="mb-8">
            <AdSpace size="banner" />
          </div>

          {/* Property Categories */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Browse by Property Type</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {propertyCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <Link key={category.title} to={category.link}>
                    <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                      <CardContent className="p-6">
                        <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center mb-4`}>
                          <Icon className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
                        <p className="text-muted-foreground">{category.description}</p>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Featured Properties Sections */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading properties...</p>
            </div>
          ) : (
            <>
              {/* Premium Villas */}
              {villas.length > 0 && (
                <div className="mb-12">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-bold">Premium Villas to Rent</h2>
                    <Link to="/properties/villas">
                      <Button variant="ghost" className="gap-2">
                        View All <ChevronRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                  <div className="relative">
                    <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
                      {villas.slice(0, 6).map((property) => (
                        <div key={property.id} className="flex-none w-[300px] snap-start">
                          <PropertyCard property={property} onBookNow={setSelectedProperty} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Premium Apartments */}
              {apartments.length > 0 && (
                <div className="mb-12">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-bold">Premium Apartments to Rent</h2>
                    <Link to="/properties/apartments">
                      <Button variant="ghost" className="gap-2">
                        View All <ChevronRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                  <div className="relative">
                    <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
                      {apartments.slice(0, 6).map((property) => (
                        <div key={property.id} className="flex-none w-[300px] snap-start">
                          <PropertyCard property={property} onBookNow={setSelectedProperty} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Houses and Studios */}
              {(houses.length > 0 || studios.length > 0) && (
                <div className="mb-12">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-bold">Houses and Studios for Rent</h2>
                    <Link to="/properties">
                      <Button variant="ghost" className="gap-2">
                        View All <ChevronRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                  <div className="relative">
                    <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
                      {[...houses, ...studios].slice(0, 6).map((property) => (
                        <div key={property.id} className="flex-none w-[300px] snap-start">
                          <PropertyCard property={property} onBookNow={setSelectedProperty} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* All Recommended */}
              {properties.length > 0 && (
                <div className="mb-12">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-bold">Recommended</h2>
                    <Link to="/properties">
                      <Button variant="ghost" className="gap-2">
                        View All <ChevronRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                  <div className="relative">
                    <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
                      {properties.slice(0, 6).map((property) => (
                        <div key={property.id} className="flex-none w-[300px] snap-start">
                          <PropertyCard property={property} onBookNow={setSelectedProperty} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Booking Modal */}
        <BookingModal
          property={selectedProperty}
          isOpen={!!selectedProperty}
          onClose={() => setSelectedProperty(null)}
        />


        <Footer />
      </div>
    </div>
  );
};

export default Home;
