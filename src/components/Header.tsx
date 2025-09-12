import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Home, 
  Search, 
  MapPin, 
  Calendar, 
  Users, 
  Menu,
  Globe,
  User
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onSearch?: (query: string) => void;
}

export const Header = ({ onSearch }: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 bg-white transition-all duration-200",
      isScrolled ? "shadow-md border-b" : ""
    )}>
      <div className="max-w-screen-xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="text-primary text-2xl font-bold">
              Cyprus<span className="text-accent">Rentals</span>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:block">
            <form onSubmit={handleSearch}>
              <div className="flex items-center border border-gray-300 rounded-full shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center px-6 py-3">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-gray-800">Where</span>
                    <input
                      type="text"
                      placeholder="Search destinations"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="text-sm text-gray-600 placeholder-gray-400 border-none outline-none bg-transparent w-32"
                    />
                  </div>
                </div>
                
                <div className="h-8 w-px bg-gray-300"></div>
                
                <div className="flex items-center px-6 py-3">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-gray-800">Check in</span>
                    <span className="text-sm text-gray-400">Add dates</span>
                  </div>
                </div>
                
                <div className="h-8 w-px bg-gray-300"></div>
                
                <div className="flex items-center px-6 py-3">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-gray-800">Check out</span>
                    <span className="text-sm text-gray-400">Add dates</span>
                  </div>
                </div>
                
                <div className="h-8 w-px bg-gray-300"></div>
                
                <div className="flex items-center px-6 py-3 pr-2">
                  <div className="flex flex-col mr-4">
                    <span className="text-xs font-semibold text-gray-800">Who</span>
                    <span className="text-sm text-gray-400">Add guests</span>
                  </div>
                  <Button 
                    type="submit"
                    size="sm" 
                    className="rounded-full w-8 h-8 p-0 bg-primary hover:bg-primary/90"
                  >
                    <Search className="h-4 w-4 text-white" />
                  </Button>
                </div>
              </div>
            </form>
          </div>

          {/* Right Side Navigation */}
          <div className="flex items-center space-x-4">
            {/* Become a Host */}
            <Link to="/admin" className="hidden md:block">
              <span className="text-sm font-semibold text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-full transition-colors">
                Become a Host
              </span>
            </Link>

            {/* Language */}
            <Button variant="ghost" size="sm" className="hidden md:flex items-center space-x-1 hover:bg-gray-100 rounded-full">
              <Globe className="h-4 w-4" />
            </Button>

            {/* User Menu */}
            <div className="flex items-center space-x-1 border border-gray-300 rounded-full p-1 hover:shadow-md transition-shadow cursor-pointer">
              <Button variant="ghost" size="sm" className="rounded-full p-2">
                <Menu className="h-4 w-4" />
              </Button>
              <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="lg:hidden px-6 pb-4">
        <form onSubmit={handleSearch}>
          <div className="flex items-center border border-gray-300 rounded-full shadow-sm">
            <div className="flex items-center px-4 py-3 flex-1">
              <Search className="h-5 w-5 text-gray-400 mr-3" />
              <input
                type="text"
                placeholder="Where are you going?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-sm text-gray-700 placeholder-gray-400 border-none outline-none bg-transparent flex-1"
              />
            </div>
          </div>
        </form>
      </div>
    </header>
  );
};