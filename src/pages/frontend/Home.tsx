import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useVisitorTracking } from '@/hooks/useVisitorTracking';
import { Header } from '@/components/frontend/Header';
import { AdSpace } from '@/components/frontend/AdSpace';
import { Footer } from '@/components/frontend/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home as HomeIcon, Building2, Hotel, Castle, Search } from 'lucide-react';

const Home = () => {
  useVisitorTracking();
  const [searchQuery, setSearchQuery] = useState('');

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
    // Navigate to all properties with search query
    window.location.href = `/properties?search=${encodeURIComponent(query)}`;
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

          {/* Featured Locations */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Popular Locations</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {['Paphos', 'Limassol', 'Nicosia', 'Larnaca', 'Ayia Napa'].map((city) => (
                <Link key={city} to={`/properties?city=${encodeURIComponent(city)}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-4 text-center">
                      <h3 className="font-semibold">{city}</h3>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default Home;
