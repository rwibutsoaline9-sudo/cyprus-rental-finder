import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  User, 
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

interface HeaderProps {
  onSearch?: (query: string) => void;
}

export const Header = ({ onSearch }: HeaderProps) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch?.(searchQuery.trim());
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    // Trigger search on input change for instant results
    if (value.trim()) {
      onSearch?.(value.trim());
    } else {
      onSearch?.(''); // Clear search when input is empty
    }
  };

  return (
    <header className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold">Cyprus Rentals</span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="flex items-center bg-white rounded overflow-hidden shadow-sm">
                 <Input
                  type="text"
                  placeholder="Where are you going?"
                  value={searchQuery}
                  onChange={handleInputChange}
                  className="flex-1 border-none text-gray-700 placeholder-gray-500 focus:ring-0 h-12"
                />
                <Button 
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 h-12 rounded-none"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            <LanguageSwitcher />
            <Link to="/admin" className="text-white hover:text-gray-200 text-sm">
              List your property
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm">Hello, {user.email?.split('@')[0]}</span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={signOut}
                  className="text-primary border-white hover:bg-white hover:text-primary"
                >
                  Sign out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/auth">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-white hover:bg-white/10"
                  >
                    Sign in
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-primary border-white bg-white hover:bg-gray-100"
                  >
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch}>
            <div className="flex items-center bg-white rounded overflow-hidden">
               <Input
                type="text"
                placeholder="Where are you going?"
                value={searchQuery}
                onChange={handleInputChange}
                className="flex-1 border-none text-gray-700 placeholder-gray-500 focus:ring-0"
              />
              <Button 
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 rounded-none"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-blue-400 py-4">
            <div className="space-y-4">
              <Link to="/admin" className="block text-white hover:text-gray-200">
                List your property
              </Link>
              
              {user ? (
                <div className="space-y-2">
                  <div className="text-sm">Hello, {user.email?.split('@')[0]}</div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={signOut}
                    className="text-primary border-white bg-white hover:bg-gray-100"
                  >
                    Sign out
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link to="/auth" className="block">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="w-full text-white hover:bg-white/10"
                    >
                      Sign in
                    </Button>
                  </Link>
                  <Link to="/auth" className="block">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="w-full text-primary border-white bg-white hover:bg-gray-100"
                    >
                      Register
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};