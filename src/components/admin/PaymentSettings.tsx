import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, Settings, Eye, EyeOff, ExternalLink } from 'lucide-react';

interface PaymentConfig {
  provider: 'stripe' | 'paypal' | 'test';
  stripe_publishable_key?: string;
  stripe_secret_key?: string;
  paypal_client_id?: string;
  paypal_client_secret?: string;
  test_mode: boolean;
  enabled: boolean;
  default_payment_split: number;
  currency: string;
}

export const PaymentSettings = () => {
  const [config, setConfig] = useState<PaymentConfig>({
    provider: 'test',
    test_mode: true,
    enabled: false,
    default_payment_split: 50,
    currency: 'EUR'
  });
  const [showSecrets, setShowSecrets] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, this would save to your backend/database
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Settings saved",
        description: "Payment settings have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save payment settings.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestConnection = async () => {
    setIsLoading(true);
    try {
      // Simulate API test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Connection successful",
        description: "Payment gateway connection test passed.",
      });
    } catch (error) {
      toast({
        title: "Connection failed",
        description: "Unable to connect to payment gateway.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Payment Settings</h2>
        <p className="text-muted-foreground">
          Configure payment gateways and booking options for your property listings.
        </p>
      </div>

      {/* Payment Provider Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Gateway
          </CardTitle>
          <CardDescription>
            Choose your preferred payment provider for processing bookings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Payment Provider</Label>
            <Select value={config.provider} onValueChange={(value: any) => setConfig({...config, provider: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="stripe">
                  <div className="flex items-center gap-2">
                    Stripe
                    <Badge variant="outline">Recommended</Badge>
                  </div>
                </SelectItem>
                <SelectItem value="paypal">PayPal</SelectItem>
                <SelectItem value="test">
                  <div className="flex items-center gap-2">
                    Test Mode
                    <Badge variant="secondary">Development</Badge>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Payment Processing</Label>
              <p className="text-sm text-muted-foreground">
                Allow customers to make payments for bookings
              </p>
            </div>
            <Switch
              checked={config.enabled}
              onCheckedChange={(enabled) => setConfig({...config, enabled})}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Test Mode</Label>
              <p className="text-sm text-muted-foreground">
                Use test keys for development
              </p>
            </div>
            <Switch
              checked={config.test_mode}
              onCheckedChange={(test_mode) => setConfig({...config, test_mode})}
            />
          </div>
        </CardContent>
      </Card>

      {/* Stripe Configuration */}
      {config.provider === 'stripe' && (
        <Card>
          <CardHeader>
            <CardTitle>Stripe Configuration</CardTitle>
            <CardDescription>
              Enter your Stripe API keys. Get them from your{' '}
              <Button variant="link" size="sm" className="p-0 h-auto">
                Stripe Dashboard
                <ExternalLink className="h-3 w-3 ml-1" />
              </Button>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Publishable Key</Label>
              <Input
                type={showSecrets ? "text" : "password"}
                value={config.stripe_publishable_key || ''}
                onChange={(e) => setConfig({...config, stripe_publishable_key: e.target.value})}
                placeholder={config.test_mode ? "pk_test_..." : "pk_live_..."}
              />
            </div>

            <div className="space-y-2">
              <Label>Secret Key</Label>
              <div className="relative">
                <Input
                  type={showSecrets ? "text" : "password"}
                  value={config.stripe_secret_key || ''}
                  onChange={(e) => setConfig({...config, stripe_secret_key: e.target.value})}
                  placeholder={config.test_mode ? "sk_test_..." : "sk_live_..."}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1 h-8 w-8 p-0"
                  onClick={() => setShowSecrets(!showSecrets)}
                >
                  {showSecrets ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={handleTestConnection}
              disabled={isLoading || !config.stripe_secret_key}
            >
              Test Connection
            </Button>
          </CardContent>
        </Card>
      )}

      {/* PayPal Configuration */}
      {config.provider === 'paypal' && (
        <Card>
          <CardHeader>
            <CardTitle>PayPal Configuration</CardTitle>
            <CardDescription>
              Enter your PayPal API credentials from your PayPal Developer account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Client ID</Label>
              <Input
                value={config.paypal_client_id || ''}
                onChange={(e) => setConfig({...config, paypal_client_id: e.target.value})}
                placeholder="Your PayPal Client ID"
              />
            </div>

            <div className="space-y-2">
              <Label>Client Secret</Label>
              <Input
                type={showSecrets ? "text" : "password"}
                value={config.paypal_client_secret || ''}
                onChange={(e) => setConfig({...config, paypal_client_secret: e.target.value})}
                placeholder="Your PayPal Client Secret"
              />
            </div>

            <Button
              variant="outline"
              onClick={handleTestConnection}
              disabled={isLoading || !config.paypal_client_secret}
            >
              Test Connection
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Booking Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Booking Settings
          </CardTitle>
          <CardDescription>
            Configure default payment options and booking behavior.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Default Payment Split (%)</Label>
              <Select 
                value={config.default_payment_split.toString()} 
                onValueChange={(value) => setConfig({...config, default_payment_split: parseInt(value)})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="50">50% upfront, 50% later</SelectItem>
                  <SelectItem value="75">75% upfront, 25% later</SelectItem>
                  <SelectItem value="100">100% upfront</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Currency</Label>
              <Select value={config.currency} onValueChange={(currency) => setConfig({...config, currency})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EUR">EUR (Euro)</SelectItem>
                  <SelectItem value="USD">USD (US Dollar)</SelectItem>
                  <SelectItem value="GBP">GBP (British Pound)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <h4 className="font-medium">Payment Options Available to Guests</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>50% upfront payment</Label>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label>75% upfront payment</Label>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label>100% upfront payment</Label>
                <Switch defaultChecked />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  );
};