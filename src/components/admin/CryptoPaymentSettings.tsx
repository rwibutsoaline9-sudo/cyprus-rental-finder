import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Bitcoin, Wallet, Eye, EyeOff, Save } from 'lucide-react';
import { useCryptoPaymentsAdmin } from '@/hooks/useCryptoPayments';

export const CryptoPaymentSettings = () => {
  const { cryptoSettings, isLoading, updateCryptoSetting } = useCryptoPaymentsAdmin();
  const [showAddresses, setShowAddresses] = useState(false);
  const [localSettings, setLocalSettings] = useState<Record<string, { wallet_address: string; is_enabled: boolean }>>({});

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleToggleEnabled = (id: string, currentValue: boolean) => {
    const setting = cryptoSettings?.find(s => s.id === id);
    if (setting) {
      updateCryptoSetting({
        id,
        wallet_address: localSettings[id]?.wallet_address || setting.wallet_address,
        is_enabled: !currentValue,
      });
    }
  };

  const handleWalletChange = (id: string, wallet_address: string) => {
    setLocalSettings(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        wallet_address,
        is_enabled: cryptoSettings?.find(s => s.id === id)?.is_enabled || false,
      },
    }));
  };

  const handleSaveWallet = (id: string) => {
    const setting = cryptoSettings?.find(s => s.id === id);
    if (setting && localSettings[id]) {
      updateCryptoSetting({
        id,
        wallet_address: localSettings[id].wallet_address,
        is_enabled: setting.is_enabled,
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bitcoin className="h-5 w-5" />
          Cryptocurrency Payment Settings
        </CardTitle>
        <CardDescription>
          Manage your cryptocurrency wallet addresses for accepting payments
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Show Wallet Addresses</Label>
            <p className="text-sm text-muted-foreground">
              Toggle visibility of wallet addresses
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAddresses(!showAddresses)}
          >
            {showAddresses ? (
              <>
                <EyeOff className="h-4 w-4 mr-2" />
                Hide
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-2" />
                Show
              </>
            )}
          </Button>
        </div>

        <Separator />

        {cryptoSettings?.map((setting) => (
          <div key={setting.id} className="space-y-4 p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Wallet className="h-5 w-5 text-primary" />
                <div>
                  <h4 className="font-medium">{setting.currency_name}</h4>
                  <p className="text-sm text-muted-foreground">{setting.currency_code}</p>
                </div>
              </div>
              <Switch
                checked={setting.is_enabled}
                onCheckedChange={() => handleToggleEnabled(setting.id, setting.is_enabled)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`wallet-${setting.id}`}>Wallet Address</Label>
              <div className="flex gap-2">
                <Input
                  id={`wallet-${setting.id}`}
                  type={showAddresses ? 'text' : 'password'}
                  value={localSettings[setting.id]?.wallet_address ?? setting.wallet_address}
                  onChange={(e) => handleWalletChange(setting.id, e.target.value)}
                  placeholder={`Enter ${setting.currency_code} wallet address`}
                  className="font-mono text-sm"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSaveWallet(setting.id)}
                  disabled={!localSettings[setting.id] || localSettings[setting.id]?.wallet_address === setting.wallet_address}
                >
                  <Save className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}

        <div className="bg-muted/50 p-4 rounded-lg text-sm">
          <p className="font-medium mb-2">Important Notes:</p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>Double-check wallet addresses before saving</li>
            <li>Customers will see QR codes and can copy these addresses</li>
            <li>Disable a currency to hide it from customers</li>
            <li>Keep your wallet addresses secure and backed up</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};