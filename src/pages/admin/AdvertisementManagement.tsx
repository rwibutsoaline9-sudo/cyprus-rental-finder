import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAdvertisements, Advertisement } from '@/hooks/useAdvertisements';
import { Plus, Edit2, Trash2, ExternalLink, Image, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface AdFormData {
  title: string;
  description: string;
  image_url: string;
  link_url: string;
  ad_size: 'banner' | 'rectangle' | 'sidebar';
  is_active: boolean;
}

export default function AdvertisementManagement() {
  const { advertisements, loading, createAdvertisement, updateAdvertisement, deleteAdvertisement } = useAdvertisements();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<Advertisement | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<AdFormData>({
    defaultValues: {
      title: '',
      description: '',
      image_url: '',
      link_url: '',
      ad_size: 'rectangle',
      is_active: false
    }
  });

  const handleOpenDialog = (ad?: Advertisement) => {
    if (ad) {
      setEditingAd(ad);
      setValue('title', ad.title);
      setValue('description', ad.description || '');
      setValue('image_url', ad.image_url || '');
      setValue('link_url', ad.link_url);
      setValue('ad_size', ad.ad_size);
      setValue('is_active', ad.is_active);
    } else {
      setEditingAd(null);
      reset();
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingAd(null);
    reset();
  };

  const onSubmit = async (data: AdFormData) => {
    try {
      setSubmitting(true);
      if (editingAd) {
        await updateAdvertisement(editingAd.id, data);
      } else {
        await createAdvertisement(data);
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving advertisement:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAdvertisement(id);
    } catch (error) {
      console.error('Error deleting advertisement:', error);
    }
  };

  const getSizeColor = (size: string) => {
    switch (size) {
      case 'banner': return 'bg-blue-100 text-blue-800';
      case 'rectangle': return 'bg-green-100 text-green-800';
      case 'sidebar': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSizeDimensions = (size: string) => {
    switch (size) {
      case 'banner': return '728 x 90';
      case 'rectangle': return '300 x 250';
      case 'sidebar': return '160 x 600';
      default: return '';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading advertisements...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Advertisement Management</h1>
          <p className="text-muted-foreground">
            Manage advertisements displayed on your website
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Advertisement
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingAd ? 'Edit Advertisement' : 'Add New Advertisement'}
              </DialogTitle>
              <DialogDescription>
                {editingAd ? 'Update the advertisement details.' : 'Create a new advertisement for your website.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  {...register('title', { required: 'Title is required' })}
                  placeholder="Advertisement title"
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  placeholder="Advertisement description"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="link_url">Link URL *</Label>
                <Input
                  id="link_url"
                  {...register('link_url', { required: 'Link URL is required' })}
                  placeholder="https://example.com"
                  type="url"
                />
                {errors.link_url && (
                  <p className="text-sm text-destructive">{errors.link_url.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  {...register('image_url')}
                  placeholder="https://example.com/image.jpg"
                  type="url"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ad_size">Advertisement Size *</Label>
                <Select
                  value={watch('ad_size')}
                  onValueChange={(value: 'banner' | 'rectangle' | 'sidebar') => 
                    setValue('ad_size', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="banner">Banner (728 x 90)</SelectItem>
                    <SelectItem value="rectangle">Rectangle (300 x 250)</SelectItem>
                    <SelectItem value="sidebar">Sidebar (160 x 600)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={watch('is_active')}
                  onCheckedChange={(checked) => setValue('is_active', checked)}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {editingAd ? 'Update' : 'Create'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Advertisements</CardTitle>
          <CardDescription>
            {advertisements.length} total advertisements
          </CardDescription>
        </CardHeader>
        <CardContent>
          {advertisements.length === 0 ? (
            <div className="text-center py-8">
              <Image className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No advertisements</h3>
              <p className="text-muted-foreground mb-4">
                Create your first advertisement to start monetizing your website.
              </p>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Add Advertisement
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Link</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {advertisements.map((ad) => (
                  <TableRow key={ad.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{ad.title}</div>
                        {ad.description && (
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {ad.description}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getSizeColor(ad.ad_size)}>
                        {ad.ad_size} ({getSizeDimensions(ad.ad_size)})
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <a
                        href={ad.link_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                      >
                        <ExternalLink className="h-3 w-3" />
                        {new URL(ad.link_url).hostname}
                      </a>
                    </TableCell>
                    <TableCell>
                      <Badge variant={ad.is_active ? 'default' : 'secondary'}>
                        {ad.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(ad.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDialog(ad)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Advertisement</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{ad.title}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(ad.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}