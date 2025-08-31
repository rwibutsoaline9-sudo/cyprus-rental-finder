import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { PropertyFilters as PropertyFiltersType } from '@/types/property';
import { Search, Filter } from 'lucide-react';

interface PropertyFiltersProps {
  filters: PropertyFiltersType;
  onFiltersChange: (filters: PropertyFiltersType) => void;
  onSearch: () => void;
}

const cyprioticCities = [
  'Paphos', 'Limassol', 'Nicosia', 'Larnaca', 'Paralimni', 
  'Famagusta', 'Kyrenia', 'Polis', 'Ayia Napa', 'Protaras'
];

const propertyTypes = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'house', label: 'House' },
  { value: 'studio', label: 'Studio' },
  { value: 'villa', label: 'Villa' }
];

export const PropertyFilters = ({ filters, onFiltersChange, onSearch }: PropertyFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [priceRange, setPriceRange] = useState([filters.min_price || 0, filters.max_price || 5000]);
  const [bedroomRange, setBedroomRange] = useState([filters.min_bedrooms || 0, filters.max_bedrooms || 5]);

  const handleFilterChange = (key: keyof PropertyFiltersType, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value === '' || value === 'all' ? undefined : value
    });
  };

  const handlePriceRangeChange = (newRange: number[]) => {
    setPriceRange(newRange);
    onFiltersChange({
      ...filters,
      min_price: newRange[0],
      max_price: newRange[1]
    });
  };

  const handleBedroomRangeChange = (newRange: number[]) => {
    setBedroomRange(newRange);
    onFiltersChange({
      ...filters,
      min_bedrooms: newRange[0],
      max_bedrooms: newRange[1]
    });
  };

  const clearFilters = () => {
    const clearedFilters: PropertyFiltersType = {};
    onFiltersChange(clearedFilters);
    setPriceRange([0, 5000]);
    setBedroomRange([0, 5]);
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Search & Filter Properties
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Less' : 'More'} Filters
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Basic Filters - Always Visible */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Select
              value={filters.city || ''}
              onValueChange={(value) => handleFilterChange('city', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All cities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All cities</SelectItem>
                {cyprioticCities.map((city) => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rental_period">Rental Type</Label>
            <Select
              value={filters.rental_period || ''}
              onValueChange={(value) => handleFilterChange('rental_period', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="short-term">Short-term</SelectItem>
                <SelectItem value="long-term">Long-term</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="property_type">Property Type</Label>
            <Select
              value={filters.property_type || ''}
              onValueChange={(value) => handleFilterChange('property_type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                {propertyTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button onClick={onSearch} className="w-full">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </div>

        {/* Advanced Filters - Expandable */}
        {isExpanded && (
          <div className="space-y-4 pt-4 border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label>Price Range (€{priceRange[0]} - €{priceRange[1]})</Label>
                  <div className="mt-2">
                    <Slider
                      value={priceRange}
                      onValueChange={handlePriceRangeChange}
                      max={5000}
                      min={0}
                      step={50}
                      className="w-full"
                    />
                  </div>
                </div>

                <div>
                  <Label>Bedrooms ({bedroomRange[0]} - {bedroomRange[1]})</Label>
                  <div className="mt-2">
                    <Slider
                      value={bedroomRange}
                      onValueChange={handleBedroomRangeChange}
                      max={5}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="furnished"
                    checked={filters.furnished === true}
                    onCheckedChange={(checked) => 
                      handleFilterChange('furnished', checked ? true : null)
                    }
                  />
                  <Label htmlFor="furnished">Furnished only</Label>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={clearFilters}>
                Clear All Filters
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};