import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Property } from '@/types/property';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CalendarDays, CreditCard, MapPin, Home, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { CryptoPaymentOption } from '@/components/CryptoPaymentOption';

interface BookingModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
}

export const BookingModal = ({ property, isOpen, onClose }: BookingModalProps) => {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [checkInDate, setCheckInDate] = useState<Date>();
  const [checkOutDate, setCheckOutDate] = useState<Date>();
  const [notes, setNotes] = useState('');
  const [paymentPercentage, setPaymentPercentage] = useState('50');
  const [paymentMethod, setPaymentMethod] = useState<'standard' | 'crypto'>('standard');
  const [cryptoWalletAddress, setCryptoWalletAddress] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  if (!property) return null;

  const paymentAmount = property.price * (parseFloat(paymentPercentage) / 100);
  const remainingAmount = property.price - paymentAmount;

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
          booking_amount: paymentAmount,
          check_in_date: checkInDate.toISOString().split('T')[0],
          check_out_date: checkOutDate ? checkOutDate.toISOString().split('T')[0] : null,
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
        setCheckInDate(undefined);
        setCheckOutDate(undefined);
        setNotes('');
        setPaymentPercentage('50');
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Home className="h-5 w-5" />
            Complete your reservation
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left side - Form */}
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Guest Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Your information</h3>
                
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
              </div>

              {/* Dates */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Your trip</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Check-in Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !checkInDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {checkInDate ? format(checkInDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={checkInDate}
                          onSelect={setCheckInDate}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {property.rental_period === 'short-term' && (
                    <div className="space-y-2">
                      <Label>Check-out Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !checkOutDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {checkOutDate ? format(checkOutDate, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={checkOutDate}
                            onSelect={setCheckOutDate}
                            disabled={(date) => date < (checkInDate || new Date())}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Payment method</h3>
                <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as 'standard' | 'crypto')} className="space-y-3">
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                    <RadioGroupItem value="standard" id="payment-standard" />
                    <Label htmlFor="payment-standard" className="flex-1 cursor-pointer">
                      <div className="font-medium">Standard Payment</div>
                      <div className="text-sm text-muted-foreground">Credit card or bank transfer</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                    <RadioGroupItem value="crypto" id="payment-crypto" />
                    <Label htmlFor="payment-crypto" className="flex-1 cursor-pointer">
                      <div className="font-medium">Cryptocurrency</div>
                      <div className="text-sm text-muted-foreground">Bitcoin, USDT, BNB</div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {paymentMethod === 'standard' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Payment options</h3>
                  <RadioGroup value={paymentPercentage} onValueChange={setPaymentPercentage} className="space-y-3">
                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                      <RadioGroupItem value="50" id="payment-50" />
                      <Label htmlFor="payment-50" className="flex-1 cursor-pointer">
                        <div className="font-medium">Pay 50% now</div>
                        <div className="text-sm text-muted-foreground">
                          Pay €{(property.price * 0.5).toFixed(0)} now, €{(property.price * 0.5).toFixed(0)} after check-in
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                      <RadioGroupItem value="75" id="payment-75" />
                      <Label htmlFor="payment-75" className="flex-1 cursor-pointer">
                        <div className="font-medium">Pay 75% now</div>
                        <div className="text-sm text-muted-foreground">
                          Pay €{(property.price * 0.75).toFixed(0)} now, €{(property.price * 0.25).toFixed(0)} after check-in
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                      <RadioGroupItem value="100" id="payment-100" />
                      <Label htmlFor="payment-100" className="flex-1 cursor-pointer">
                        <div className="font-medium">Pay 100% now</div>
                        <div className="text-sm text-muted-foreground">
                          Pay full amount €{property.price.toFixed(0)} now
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              )}

              {paymentMethod === 'crypto' && (
                <CryptoPaymentOption
                  amount={paymentAmount}
                  onPaymentMethodChange={(method, address) => setCryptoWalletAddress(address || '')}
                />
              )}

              {/* Additional Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Message to host (optional)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Tell your host about your trip, who's coming with you, or ask any questions..."
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
                  disabled={isSubmitting || (paymentMethod === 'crypto' && !cryptoWalletAddress)}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  {isSubmitting ? 'Processing...' : paymentMethod === 'crypto' ? 'Confirm Crypto Payment' : `Reserve & Pay €${paymentAmount.toFixed(0)}`}
                </Button>
              </div>
            </form>
          </div>

          {/* Right side - Property Summary */}
          <div className="lg:sticky lg:top-6">
            <Card className="border shadow-sm">
              <CardContent className="p-6 space-y-4">
                {/* Property Image & Basic Info */}
                <div className="flex gap-4">
                  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <img 
                      src={property.images?.[0] || ''} 
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium line-clamp-2">{property.title}</h4>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                      <MapPin className="h-3 w-3" />
                      {property.area}, {property.city}
                    </div>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 pt-4 border-t">
                  <h4 className="font-medium">Price details</h4>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Total price</span>
                      <span>{formatPrice(property.price, property.rental_period)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pay now ({paymentPercentage}%)</span>
                      <span className="font-medium">€{paymentAmount.toFixed(0)}</span>
                    </div>
                    {parseFloat(paymentPercentage) < 100 && (
                      <div className="flex justify-between text-muted-foreground">
                        <span>Pay after check-in</span>
                        <span>€{remainingAmount.toFixed(0)}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between font-semibold pt-2 border-t">
                    <span>Total due now</span>
                    <span>€{paymentAmount.toFixed(0)}</span>
                  </div>
                </div>

                {/* Booking Protection */}
                <div className="bg-muted/50 p-3 rounded-lg text-sm space-y-1">
                  <div className="font-medium">Your booking is protected</div>
                  <div className="text-muted-foreground text-xs">
                    Free cancellation for 48 hours. Get a full refund if you cancel before then.
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};