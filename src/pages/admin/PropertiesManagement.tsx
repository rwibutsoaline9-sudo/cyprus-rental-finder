import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProperties } from '@/hooks/useProperties';
import { usePropertyManagement } from '@/hooks/usePropertyManagement';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { PropertyFormDialog } from '@/components/admin/PropertyFormDialog';
import { Badge } from '@/components/ui/badge';
import { Property } from '@/types/property';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export const PropertiesManagement = () => {
  const { properties, loading, refetch } = useProperties();
  const { deleteProperty, loading: actionLoading } = usePropertyManagement();
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleEdit = (property: Property) => {
    setSelectedProperty(property);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setSelectedProperty(null);
    setIsFormOpen(true);
  };

  const handleDelete = async (propertyId: string) => {
    try {
      await deleteProperty(propertyId);
      refetch();
    } catch (error) {
      console.error('Error deleting property:', error);
    }
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setSelectedProperty(null);
    refetch();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Properties Management</h1>
          <Button disabled>
            <Plus className="h-4 w-4 mr-2" />
            Add Property
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-muted rounded-t-lg"></div>
              <CardContent className="p-4">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Properties Management</h1>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Property
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {properties.map((property) => (
          <Card key={property.id} className="overflow-hidden">
            <div className="relative h-48">
              {property.images && property.images.length > 0 ? (
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground">No image</span>
                </div>
              )}
              <div className="absolute top-2 right-2">
                <Badge variant={property.available ? 'default' : 'secondary'}>
                  {property.available ? 'Available' : 'Unavailable'}
                </Badge>
              </div>
            </div>
            
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{property.title}</CardTitle>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-primary">
                  ${property.price}/{property.rental_period === 'short-term' ? 'night' : 'month'}
                </span>
                <Badge variant="outline">{property.property_type}</Badge>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Location:</span>
                  <span>{property.city}, {property.area}</span>
                </div>
                <div className="flex justify-between">
                  <span>Bedrooms:</span>
                  <span>{property.bedrooms}</span>
                </div>
                <div className="flex justify-between">
                  <span>Bathrooms:</span>
                  <span>{property.bathrooms}</span>
                </div>
                <div className="flex justify-between">
                  <span>Furnished:</span>
                  <span>{property.furnished ? 'Yes' : 'No'}</span>
                </div>
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline" className="flex-1">
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleEdit(property)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="outline" className="px-3">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Property</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{property.title}"? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(property.id)}
                        disabled={actionLoading}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <PropertyFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        property={selectedProperty}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
};