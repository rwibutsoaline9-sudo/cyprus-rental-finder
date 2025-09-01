import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { usePropertyManagement } from '@/hooks/usePropertyManagement';
import { Property } from '@/types/property';
import { ImageUpload } from './ImageUpload';
import { AmenitiesSelector } from './AmenitiesSelector';

interface PropertyFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  property?: Property | null;
  onSuccess: () => void;
}

export const PropertyFormDialog = ({ open, onOpenChange, property, onSuccess }: PropertyFormDialogProps) => {
  const { createProperty, updateProperty, loading } = usePropertyManagement();
  const [formData, setFormData] = useState({
    title: '',
    property_type: 'apartment' as 'apartment' | 'house' | 'studio' | 'villa',
    bedrooms: 1,
    bathrooms: 1,
    price: 0,
    rental_period: 'short-term' as 'short-term' | 'long-term',
    city: '',
    area: '',
    furnished: false,
    description: '',
    amenities: [] as string[],
    images: [] as string[],
    available: true,
  });

  useEffect(() => {
    if (property) {
      setFormData({
        title: property.title,
        property_type: property.property_type,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        price: property.price,
        rental_period: property.rental_period,
        city: property.city,
        area: property.area,
        furnished: property.furnished,
        description: property.description || '',
        amenities: property.amenities || [],
        images: property.images || [],
        available: property.available,
      });
    } else {
      setFormData({
        title: '',
        property_type: 'apartment',
        bedrooms: 1,
        bathrooms: 1,
        price: 0,
        rental_period: 'short-term',
        city: '',
        area: '',
        furnished: false,
        description: '',
        amenities: [],
        images: [],
        available: true,
      });
    }
  }, [property]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (property) {
        await updateProperty(property.id, formData);
      } else {
        await createProperty(formData);
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving property:', error);
    }
  };

  const handleAmenitiesChange = (amenities: string[]) => {
    setFormData(prev => ({ ...prev, amenities }));
  };

  const handleImagesChange = (images: string[]) => {
    setFormData(prev => ({ ...prev, images }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {property ? 'Edit Property' : 'Add New Property'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="property_type">Property Type</Label>
              <Select
                value={formData.property_type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, property_type: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="studio">Studio</SelectItem>
                  <SelectItem value="villa">Villa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <Input
                id="bedrooms"
                type="number"
                min="1"
                value={formData.bedrooms}
                onChange={(e) => setFormData(prev => ({ ...prev, bedrooms: parseInt(e.target.value) }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bathrooms">Bathrooms</Label>
              <Input
                id="bathrooms"
                type="number"
                min="1"
                value={formData.bathrooms}
                onChange={(e) => setFormData(prev => ({ ...prev, bathrooms: parseInt(e.target.value) }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rental_period">Rental Period</Label>
              <Select
                value={formData.rental_period}
                onValueChange={(value) => setFormData(prev => ({ ...prev, rental_period: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short-term">Short-term</SelectItem>
                  <SelectItem value="long-term">Long-term</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="area">Area</Label>
              <Input
                id="area"
                value={formData.area}
                onChange={(e) => setFormData(prev => ({ ...prev, area: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          <AmenitiesSelector
            value={formData.amenities}
            onChange={handleAmenitiesChange}
          />

          <ImageUpload
            images={formData.images}
            onImagesChange={handleImagesChange}
            disabled={loading}
          />

          <div className="flex items-center space-x-2">
            <Checkbox
              id="furnished"
              checked={formData.furnished}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, furnished: !!checked }))}
            />
            <Label htmlFor="furnished">Furnished</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="available"
              checked={formData.available}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, available: !!checked }))}
            />
            <Label htmlFor="available">Available</Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : property ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};