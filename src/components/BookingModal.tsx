import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Property } from '@/types/property';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CalendarDays, CreditCard, MapPin, Home } from 'lucide-react';

interface BookingModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
}

export const BookingModal = ({ property, isOpen, onClose }: BookingModalProps) => {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  if (!property) return null;

  const bookingAmount = property.price * 0.5; // 50% booking fee

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerEmail || !customerPhone || !checkInDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create booking record
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          property_id: property.id,
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
          booking_amount: bookingAmount,
          check_in_date: checkInDate,
          check_out_date: checkOutDate || null,
          notes: notes || null,
          payment_status: 'pending'
        })
        .select()
        .single();

      if (bookingError) {
        throw bookingError;
      }

      // In a real implementation, you would integrate with Stripe here
      // For now, we'll simulate the payment process
      setTimeout(() => {
        toast({
          title: "Booking Submitted!",
          description: `Your booking for ${property.title} has been submitted. You will receive payment instructions via email.`,
        });
        
        // Reset form
        setCustomerName('');
        setCustomerEmail('');
        setCustomerPhone('');
        setCheckInDate('');
        setCheckOutDate('');
        setNotes('');
        onClose();
      }, 1000);

    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        title: "Booking Failed",
        description: "There was an error processing your booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price: number, period: string) => {
    if (period === 'short-term') {
      return `€${price}/night`;
    }
    return `€${price}/month`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Book Property
          </DialogTitle>
          <DialogDescription>
            Complete your booking by paying 50% upfront. The remaining 50% is due after moving in.
          </DialogDescription>
        </DialogHeader>

        {/* Property Summary */}
        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2">{property.title}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <MapPin className="h-4 w-4" />
              {property.area}, {property.city}
            </div>
            <div className="flex justify-between items-center">
              <div>
                <span className="text-sm text-muted-foreground">Total Price: </span>
                <span className="font-medium">{formatPrice(property.price, property.rental_period)}</span>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Booking Fee (50%)</div>
                <div className="text-xl font-bold text-primary">€{bookingAmount.toFixed(2)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customer_name">Full Name *</Label>
              <Input
                id="customer_name"
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customer_email">Email Address *</Label>
              <Input
                id="customer_email"
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="customer_phone">Phone Number *</Label>
            <Input
              id="customer_phone"
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="Enter your phone number"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="check_in_date" className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                Check-in Date *
              </Label>
              <Input
                id="check_in_date"
                type="date"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                required
              />
            </div>

            {property.rental_period === 'short-term' && (
              <div className="space-y-2">
                <Label htmlFor="check_out_date" className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  Check-out Date
                </Label>
                <Input
                  id="check_out_date"
                  type="date"
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special requests or additional information..."
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Processing...' : `Pay €${bookingAmount.toFixed(2)} Now`}
            </Button>
          </div>
        </form>

        <div className="text-xs text-muted-foreground text-center pt-2 border-t">
          By proceeding, you agree to pay the booking fee of 50%. The remaining 50% will be due after moving into the property.
        </div>
      </DialogContent>
    </Dialog>
  );
};