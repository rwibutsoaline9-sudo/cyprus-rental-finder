import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Search, 
  MapPin, 
  Calendar, 
  Users, 
  Settings, 
  LogOut, 
  User, 
  Bell, 
  Heart,
  Menu,
  X,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onSearch?: (query: string) => void;
}

export const Header = ({ onSearch }: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
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
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      isScrolled 
        ? "bg-background/95 backdrop-blur-md border-b shadow-lg" 
        : "bg-gradient-to-r from-primary via-primary-glow to-primary text-primary-foreground"
    )}>
      {/* Top Bar - Promotional */}
      <div className={cn(
        "bg-gradient-to-r from-accent via-primary to-accent text-white text-center py-2 text-sm font-medium transition-all duration-300",
        isScrolled ? "opacity-0 h-0 py-0 overflow-hidden" : "opacity-100"
      )}>
        <div className="container mx-auto px-4 flex items-center justify-center gap-2">
          <Sparkles className="h-4 w-4" />
          <span>🏖️ Summer Special: 20% off on beachfront properties! Limited time offer</span>
          <Sparkles className="h-4 w-4" />
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary rounded-full blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <Home className={cn(
                "h-10 w-10 relative z-10 transition-all duration-300 group-hover:scale-110",
                isScrolled ? "text-primary" : "text-white"
              )} />
            </div>
            <div className="ml-3">
              <h1 className={cn(
                "text-2xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text transition-all duration-300",
                isScrolled ? "text-transparent" : "text-white"
              )}>
                Cyprus Rentals
              </h1>
              <p className={cn(
                "text-sm transition-all duration-300",
                isScrolled ? "text-muted-foreground" : "text-white/80"
              )}>
                Premium Properties
              </p>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex items-center flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur-lg opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className={cn(
                  "relative bg-background/10 backdrop-blur-md rounded-full border transition-all duration-300 group-hover:shadow-lg",
                  isScrolled ? "bg-background border-border" : "border-white/20"
                )}>
                  <div className="flex items-center">
                    <div className="flex items-center gap-2 px-4 py-3 flex-1">
                      <MapPin className={cn(
                        "h-5 w-5 transition-colors",
                        isScrolled ? "text-muted-foreground" : "text-white/60"
                      )} />
                      <Input
                        placeholder="Where do you want to stay?"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={cn(
                          "border-none bg-transparent placeholder:font-medium focus:ring-0 transition-all",
                          isScrolled ? "text-foreground placeholder:text-muted-foreground" : "text-white placeholder:text-white/60"
                        )}
                      />
                    </div>
                    <div className="h-8 w-px bg-border mx-2"></div>
                    <div className="flex items-center gap-2 px-4">
                      <Calendar className={cn(
                        "h-5 w-5 transition-colors",
                        isScrolled ? "text-muted-foreground" : "text-white/60"
                      )} />
                      <span className={cn(
                        "text-sm font-medium transition-colors",
                        isScrolled ? "text-muted-foreground" : "text-white/80"
                      )}>
                        Check dates
                      </span>
                    </div>
                    <div className="h-8 w-px bg-border mx-2"></div>
                    <div className="flex items-center gap-2 px-4">
                      <Users className={cn(
                        "h-5 w-5 transition-colors",
                        isScrolled ? "text-muted-foreground" : "text-white/60"
                      )} />
                      <span className={cn(
                        "text-sm font-medium transition-colors",
                        isScrolled ? "text-muted-foreground" : "text-white/80"
                      )}>
                        Guests
                      </span>
                    </div>
                    <Button 
                      type="submit"
                      size="sm" 
                      className="rounded-full mr-2 bg-gradient-to-r from-primary to-accent hover:from-primary-glow hover:to-accent shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Navigation & User Menu - Desktop */}
          <nav className="hidden lg:flex items-center space-x-6">
            {/* Quick Stats */}
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="bg-white/10 text-white border-white/20 hover:bg-white/20 transition-colors">
                🏠 2,500+ Properties
              </Badge>
              <Badge variant="secondary" className="bg-white/10 text-white border-white/20 hover:bg-white/20 transition-colors">
                ⭐ 4.8 Rating
              </Badge>
            </div>

            {user ? (
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "transition-all duration-300 hover:scale-105",
                    isScrolled 
                      ? "text-foreground hover:bg-accent/10" 
                      : "text-white hover:bg-white/10"
                  )}
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Favorites
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "transition-all duration-300 hover:scale-105",
                    isScrolled 
                      ? "text-foreground hover:bg-accent/10" 
                      : "text-white hover:bg-white/10"
                  )}
                >
                  <Bell className="h-4 w-4" />
                </Button>

                <div className="flex items-center gap-3">
                  <div className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-300",
                    isScrolled ? "bg-accent/10" : "bg-white/10"
                  )}>
                    <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className={cn(
                        "text-sm font-medium transition-colors",
                        isScrolled ? "text-foreground" : "text-white"
                      )}>
                        {user.email?.split('@')[0]}
                      </p>
                      <p className={cn(
                        "text-xs transition-colors",
                        isScrolled ? "text-muted-foreground" : "text-white/60"
                      )}>
                        Member
                      </p>
                    </div>
                    <ChevronDown className={cn(
                      "h-4 w-4 transition-colors",
                      isScrolled ? "text-muted-foreground" : "text-white/60"
                    )} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/auth">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className={cn(
                      "font-medium transition-all duration-300 hover:scale-105",
                      isScrolled 
                        ? "text-foreground hover:bg-accent/10" 
                        : "text-white hover:bg-white/10"
                    )}
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button 
                    size="sm"
                    className="bg-gradient-to-r from-accent to-primary hover:from-accent-glow hover:to-primary-glow shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    Join Now
                  </Button>
                </Link>
              </div>
            )}

            <Link 
              to="/admin" 
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-300 hover:scale-105",
                isScrolled 
                  ? "text-muted-foreground hover:text-foreground hover:bg-accent/10" 
                  : "text-white/60 hover:text-white hover:bg-white/10"
              )}
            >
              <Settings className="h-4 w-4" />
              <span className="text-sm">Admin</span>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-background/95 backdrop-blur-md border-t">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="space-y-3">
              <Input
                placeholder="Where do you want to stay?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-background/50"
              />
              <Button type="submit" className="w-full">
                <Search className="h-4 w-4 mr-2" />
                Search Properties
              </Button>
            </form>

            {/* Mobile Navigation */}
            <div className="space-y-2 pt-4 border-t">
              {user ? (
                <>
                  <div className="flex items-center gap-3 p-3 bg-accent/10 rounded-lg">
                    <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">{user.email}</p>
                      <p className="text-sm text-muted-foreground">Member</p>
                    </div>
                  </div>
                  <Button variant="ghost" className="w-full justify-start">
                    <Heart className="h-4 w-4 mr-2" />
                    Favorites
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Bell className="h-4 w-4 mr-2" />
                    Notifications
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" onClick={signOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/auth" className="block">
                    <Button variant="ghost" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/auth" className="block">
                    <Button className="w-full">
                      Join Now
                    </Button>
                  </Link>
                </>
              )}
              <Link to="/admin" className="block">
                <Button variant="ghost" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  Admin Panel
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};