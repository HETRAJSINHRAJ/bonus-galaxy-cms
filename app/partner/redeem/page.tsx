'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QrCode, Lock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useEffect, useRef } from 'react';

const PARTNER_LOCATIONS = [
  'Vienna Store',
  'Salzburg Store',
  'Innsbruck Store',
  'Graz Store',
  'Linz Store',
  'Ocono Office',
  'Zur Post',
  'Felsenhof',
  'oe24 Office',
  'RTS Office'
];

// API base URL - points to bonus-galaxy-new
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://bonus-galaxy-demo.vercel.app/api';

export default function PartnerRedeemPage() {
  const [method, setMethod] = useState<'pin' | 'qr'>('pin');
  const [pinCode, setPinCode] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const [qrScanned, setQrScanned] = useState(false);

  // Initialize QR scanner
  useEffect(() => {
    if (method === 'qr' && !qrScanned) {
      // Add small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        const scanner = new Html5QrcodeScanner(
          'qr-reader',
          { fps: 10, qrbox: 250 },
          false
        );
        
        scanner.render(
          (decodedText) => {
            setPinCode(decodedText);
            setQrScanned(true);
            scanner.clear();
          },
          (error) => {
            // Ignore scanning errors
          }
        );
        
        scannerRef.current = scanner;
      }, 100);
      
      return () => {
        clearTimeout(timer);
        if (scannerRef.current) {
          scannerRef.current.clear();
        }
      };
    }
  }, [method, qrScanned]);

  const handleValidate = async () => {
    setError(null);
    setValidationResult(null);
    setSuccess(false);
    
    if (!pinCode || !employeeId || !location) {
      setError('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/vouchers/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method,
          code: pinCode,
          employeeId,
          partnerLocation: location
        })
      });
      
      const data = await response.json();
      
      if (data.valid) {
        setValidationResult(data);
      } else {
        setError(data.error || 'Invalid voucher');
      }
    } catch (err) {
      setError('Validation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async () => {
    if (!validationResult) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/vouchers/redeem`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          purchaseId: validationResult.purchaseId,
          employeeId,
          partnerLocation: location,
          method
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess(true);
        setValidationResult(null);
        setPinCode('');
        setQrScanned(false);
      } else {
        setError(data.error || 'Redemption failed');
      }
    } catch (err) {
      setError('Redemption failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setPinCode('');
    setEmployeeId('');
    setLocation('');
    setValidationResult(null);
    setError(null);
    setSuccess(false);
    setQrScanned(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="container mx-auto max-w-2xl py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Partner Voucher Redemption</h1>
          <p className="text-white/60">Bonus Galaxy Redemption System</p>
        </div>

        <Card className="p-6 bg-white/5 border-white/10">
          <Tabs value={method} onValueChange={(v) => setMethod(v as 'pin' | 'qr')}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="pin" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                PIN Code
              </TabsTrigger>
              <TabsTrigger value="qr" className="flex items-center gap-2">
                <QrCode className="h-4 w-4" />
                QR Code
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pin" className="space-y-4">
              <div>
                <Label htmlFor="pin" className="text-white">4-Digit PIN Code</Label>
                <Input
                  id="pin"
                  type="text"
                  maxLength={4}
                  placeholder="1234"
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
                  className="mt-2 bg-white/10 border-white/20 text-white text-2xl text-center tracking-widest"
                  disabled={!!validationResult}
                />
              </div>
            </TabsContent>

            <TabsContent value="qr" className="space-y-4">
              {!qrScanned ? (
                <div>
                  <Label className="text-white mb-2 block">Scan QR Code</Label>
                  <div id="qr-reader" className="rounded-lg overflow-hidden"></div>
                </div>
              ) : (
                <div className="p-4 bg-emerald-500/20 border border-emerald-500/30 rounded-lg">
                  <p className="text-emerald-400 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    QR Code scanned successfully
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>

          <div className="space-y-4 mt-6">
            <div>
              <Label htmlFor="employee" className="text-white">Employee ID</Label>
              <Input
                id="employee"
                type="text"
                placeholder="emp_123"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="mt-2 bg-white/10 border-white/20 text-white"
                disabled={!!validationResult}
              />
            </div>

            <div>
              <Label htmlFor="location" className="text-white">Location</Label>
              <Select value={location} onValueChange={setLocation} disabled={!!validationResult}>
                <SelectTrigger className="mt-2 bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {PARTNER_LOCATIONS.map((loc) => (
                    <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
              <p className="text-red-400 flex items-center gap-2">
                <XCircle className="h-5 w-5" />
                {error}
              </p>
            </div>
          )}

          {validationResult && (
            <div className="mt-4 p-4 bg-emerald-500/20 border border-emerald-500/30 rounded-lg space-y-2">
              <p className="text-emerald-400 font-semibold flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Valid voucher!
              </p>
              <div className="text-white/80 text-sm space-y-1">
                <p><strong>Bundle:</strong> {validationResult.voucherDetails.bundleName}</p>
                <p><strong>Value:</strong> €{validationResult.voucherDetails.value}</p>
                <p><strong>Count:</strong> {validationResult.voucherDetails.voucherCount} vouchers</p>
              </div>
            </div>
          )}

          {success && (
            <div className="mt-4 p-4 bg-emerald-500/20 border border-emerald-500/30 rounded-lg">
              <p className="text-emerald-400 font-semibold flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Voucher redeemed successfully!
              </p>
            </div>
          )}

          <div className="mt-6 flex gap-3">
            {!validationResult && !success && (
              <Button
                onClick={handleValidate}
                disabled={loading || !pinCode || !employeeId || !location}
                className="flex-1 bg-indigo-500 hover:bg-indigo-600"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Validating...
                  </>
                ) : (
                  'Validate'
                )}
              </Button>
            )}

            {validationResult && (
              <Button
                onClick={handleRedeem}
                disabled={loading}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Redeeming...
                  </>
                ) : (
                  'Redeem Now'
                )}
              </Button>
            )}

            {(validationResult || success) && (
              <Button
                onClick={resetForm}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                Reset
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
