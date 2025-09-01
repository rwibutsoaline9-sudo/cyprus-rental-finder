import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface AmenitiesSelectorProps {
  value: string[];
  onChange: (amenities: string[]) => void;
}

const COMMON_AMENITIES = [
  'WiFi',
  'Parking',
  'Pool',
  'Gym',
  'Air Conditioning',
  'Water Bills',
  'Electricity',
  'Kitchen',
  'Laundry',
  'Balcony',
  'Garden',
  'Security',
  'Elevator',
  'Pets Allowed',
  'Furnished',
  'Dishwasher',
  'Microwave',
  'TV',
  'Internet',
  'Heating'
];

export const AmenitiesSelector = ({ value, onChange }: AmenitiesSelectorProps) => {
  const [customAmenity, setCustomAmenity] = useState('');

  const handleToggleAmenity = (amenity: string) => {
    if (value.includes(amenity)) {
      onChange(value.filter(a => a !== amenity));
    } else {
      onChange([...value, amenity]);
    }
  };

  const handleAddCustomAmenity = () => {
    if (customAmenity.trim() && !value.includes(customAmenity.trim())) {
      onChange([...value, customAmenity.trim()]);
      setCustomAmenity('');
    }
  };

  const handleRemoveAmenity = (amenity: string) => {
    onChange(value.filter(a => a !== amenity));
  };

  return (
    <div className="space-y-4">
      <Label>Amenities</Label>
      
      {/* Common amenities checkboxes */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {COMMON_AMENITIES.map((amenity) => (
          <div key={amenity} className="flex items-center space-x-2">
            <Checkbox
              id={amenity}
              checked={value.includes(amenity)}
              onCheckedChange={() => handleToggleAmenity(amenity)}
            />
            <Label htmlFor={amenity} className="text-sm">
              {amenity}
            </Label>
          </div>
        ))}
      </div>

      {/* Custom amenity input */}
      <div className="flex gap-2">
        <Input
          value={customAmenity}
          onChange={(e) => setCustomAmenity(e.target.value)}
          placeholder="Add custom amenity..."
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddCustomAmenity();
            }
          }}
        />
        <Button
          type="button"
          variant="outline"
          onClick={handleAddCustomAmenity}
          disabled={!customAmenity.trim()}
        >
          Add
        </Button>
      </div>

      {/* Selected amenities display */}
      {value.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">Selected Amenities:</Label>
          <div className="flex flex-wrap gap-2">
            {value.map((amenity) => (
              <div
                key={amenity}
                className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm"
              >
                {amenity}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0"
                  onClick={() => handleRemoveAmenity(amenity)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};