import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Copy, Check, Bitcoin } from 'lucide-react';
import { useCryptoPayments } from '@/hooks/useCryptoPayments';
import { useToast } from '@/hooks/use-toast';
import QRCode from 'qrcode';

interface CryptoPaymentOptionProps {
  amount: number;
  onPaymentMethodChange: (method: string, address?: string) => void;
}

export const CryptoPaymentOption = ({ amount, onPaymentMethodChange }: CryptoPaymentOptionProps) => {
  const { cryptoSettings, isLoading } = useCryptoPayments();
  const [selectedCrypto, setSelectedCrypto] = useState('');
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const { toast } = useToast();

  const handleCryptoSelect = async (currencyCode: string) => {
    setSelectedCrypto(currencyCode);
    const setting = cryptoSettings?.find(s => s.currency_code === currencyCode);
    if (setting) {
      onPaymentMethodChange('crypto', setting.wallet_address);
      
      // Generate QR code
      try {
        const url = await QRCode.toDataURL(setting.wallet_address, {
          width: 200,
          margin: 2,
        });
        setQrCodeUrl(url);
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    }
  };

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    toast({
      title: "Address Copied",
      description: "Wallet address has been copied to clipboard",
    });
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  if (isLoading || !cryptoSettings || cryptoSettings.length === 0) {
    return null;
  }

  const selectedSetting = cryptoSettings.find(s => s.currency_code === selectedCrypto);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Bitcoin className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Pay with Cryptocurrency</h3>
        <Badge variant="secondary">Secure</Badge>
      </div>

      <RadioGroup value={selectedCrypto} onValueChange={handleCryptoSelect} className="space-y-3">
        {cryptoSettings.map((setting) => (
          <div
            key={setting.id}
            className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
          >
            <RadioGroupItem value={setting.currency_code} id={`crypto-${setting.currency_code}`} />
            <Label
              htmlFor={`crypto-${setting.currency_code}`}
              className="flex-1 cursor-pointer flex items-center justify-between"
            >
              <div>
                <div className="font-medium">{setting.currency_name}</div>
                <div className="text-sm text-muted-foreground">{setting.currency_code}</div>
              </div>
            </Label>
          </div>
        ))}
      </RadioGroup>

      {selectedSetting && (
        <Card className="border-2 border-primary/20">
          <CardContent className="p-6 space-y-4">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">Send exactly</p>
              <p className="text-2xl font-bold">€{amount.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">worth of {selectedSetting.currency_name} to:</p>
            </div>

            {qrCodeUrl && (
              <div className="flex justify-center">
                <img src={qrCodeUrl} alt="QR Code" className="rounded-lg border" />
              </div>
            )}

            <div className="space-y-2">
              <Label>Wallet Address</Label>
              <div className="flex gap-2">
                <div className="flex-1 p-3 bg-muted rounded-lg font-mono text-sm break-all">
                  {selectedSetting.wallet_address}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopyAddress(selectedSetting.wallet_address)}
                >
                  {copiedAddress === selectedSetting.wallet_address ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-lg text-sm space-y-1">
              <p className="font-medium text-yellow-700 dark:text-yellow-400">Important:</p>
              <ul className="list-disc list-inside text-yellow-600 dark:text-yellow-500 space-y-1 text-xs">
                <li>Send only {selectedSetting.currency_code} to this address</li>
                <li>Network fees may apply</li>
                <li>Your booking will be confirmed after transaction confirmation</li>
                <li>Keep your transaction ID for reference</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};