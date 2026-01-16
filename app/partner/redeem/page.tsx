'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QrCode, Lock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';

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
// In development, use localhost:3000 (bonus-galaxy-new)
// In production, use the deployed API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 
  (typeof window !== 'undefined' && window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api' 
    : 'https://bonus-galaxy-demo.vercel.app/api');

export default function PartnerRedeemPage() {
  const [method, setMethod] = useState<'pin' | 'qr'>('pin');
  const [pinCode, setPinCode] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [qrScanned, setQrScanned] = useState(false);
  const [scanning, setScanning] = useState(false);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

  // Start scanner - two-step process like bonus-galaxy-new
  const startScanner = () => {
    setScanning(true);
    setError(null);
  };

  // Initialize QR scanner after DOM is ready
  useEffect(() => {
    if (!scanning || html5QrCodeRef.current) return;

    const initScanner = async () => {
      try {
        const scanner = new Html5Qrcode('qr-reader');
        html5QrCodeRef.current = scanner;

        await scanner.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: function(viewfinderWidth, viewfinderHeight) {
              const size = Math.min(viewfinderWidth, viewfinderHeight) * 0.7;
              return {
                width: Math.floor(size),
                height: Math.floor(size)
              };
            },
            aspectRatio: 1.0,
          },
          (decodedText) => {
            console.log('QR Code scanned:', decodedText);
            setPinCode(decodedText);
            setQrScanned(true);
            stopScanner();
          },
          (errorMessage) => {
            // Silent - fires continuously during scanning
          }
        );
      } catch (err) {
        console.error('Scanner error:', err);
        setScanning(false);
        
        let errorMsg = 'Failed to access camera. Please check permissions.';
        if (err instanceof Error) {
          if (err.message.includes('NotAllowedError') || err.message.includes('Permission')) {
            errorMsg = 'Camera access denied. Please allow camera access in your browser settings.';
          } else if (err.message.includes('NotFoundError')) {
            errorMsg = 'No camera found. Please ensure your device has a working camera.';
          } else if (err.message.includes('NotReadableError')) {
            errorMsg = 'Camera is already in use. Please close other apps using the camera.';
          }
        }
        setError(errorMsg);
      }
    };

    const timer = setTimeout(initScanner, 100);
    return () => clearTimeout(timer);
  }, [scanning]);

  const stopScanner = async () => {
    if (html5QrCodeRef.current) {
      try {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current.clear();
        html5QrCodeRef.current = null;
      } catch (error) {
        console.error('Error stopping scanner:', error);
      }
    }
    setScanning(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

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
      console.log('Validating voucher at:', `${API_BASE_URL}/vouchers/validate`);
      
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
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const text = await response.text();
        console.error('Error response:', text);
        let errorMessage = 'Validation failed';
        try {
          const errorData = JSON.parse(text);
          errorMessage = errorData.error || errorMessage;
        } catch {
          if (response.status === 404) {
            errorMessage = 'API endpoint not found. Make sure bonus-galaxy-new is running on port 3000.';
          } else {
            errorMessage = `Server error: ${response.status}`;
          }
        }
        setError(errorMessage);
        return;
      }
      
      const data = await response.json();
      console.log('Validation response:', data);
      
      if (data.valid) {
        setValidationResult(data);
      } else {
        setError(data.error || 'Invalid voucher');
      }
    } catch (err) {
      console.error('Validation error:', err);
      setError('Connection failed. Make sure bonus-galaxy-new is running on http://localhost:3000');
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
      
      if (!response.ok) {
        const text = await response.text();
        let errorMessage = 'Redemption failed';
        try {
          const errorData = JSON.parse(text);
          errorMessage = errorData.error || errorMessage;
        } catch {
          errorMessage = `Server error: ${response.status}`;
        }
        setError(errorMessage);
        return;
      }
      
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
      console.error('Redemption error:', err);
      setError('Redemption failed. Please check your connection and try again.');
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
    stopScanner();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 md:p-6 lg:p-8">
      <div className="container mx-auto max-w-2xl py-4 md:py-8">
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Partner Voucher Redemption</h1>
          <p className="text-sm md:text-base text-white/60">Bonus Galaxy Redemption System</p>
          {typeof window !== 'undefined' && (
            <p className="text-xs text-white/40 mt-2">
              API: {API_BASE_URL}
            </p>
          )}
        </div>

        <Card className="p-4 md:p-6 bg-white/5 border-white/10">
          <Tabs value={method} onValueChange={(v) => setMethod(v as 'pin' | 'qr')}>
            <TabsList className="grid w-full grid-cols-2 mb-4 md:mb-6">
              <TabsTrigger value="pin" className="flex items-center gap-2 text-sm md:text-base">
                <Lock className="h-3 w-3 md:h-4 md:w-4" />
                <span className="hidden sm:inline">PIN Code</span>
                <span className="sm:hidden">PIN</span>
              </TabsTrigger>
              <TabsTrigger value="qr" className="flex items-center gap-2 text-sm md:text-base">
                <QrCode className="h-3 w-3 md:h-4 md:w-4" />
                <span className="hidden sm:inline">QR Code</span>
                <span className="sm:hidden">QR</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pin" className="space-y-4">
              <div>
                <Label htmlFor="pin" className="text-white text-sm md:text-base">4-Digit PIN Code</Label>
                <Input
                  id="pin"
                  type="text"
                  maxLength={4}
                  placeholder="1234"
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
                  className="mt-2 bg-white/10 border-white/20 text-white text-xl md:text-2xl text-center tracking-widest"
                  disabled={!!validationResult}
                />
              </div>
            </TabsContent>

            <TabsContent value="qr" className="space-y-4">
              {!scanning && !qrScanned && (
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto">
                    <QrCode className="h-10 w-10 text-indigo-400" />
                  </div>
                  <div>
                    <Label className="text-white text-lg font-semibold">Ready to Scan</Label>
                    <p className="text-white/60 text-sm mt-1">
                      Click the button to activate the camera
                    </p>
                  </div>
                  <Button onClick={startScanner} className="bg-indigo-500 hover:bg-indigo-600">
                    <QrCode className="h-4 w-4 mr-2" />
                    Start Scanner
                  </Button>
                </div>
              )}

              {scanning && !qrScanned && (
                <div className="space-y-4">
                  <Label className="text-white mb-2 block">Scan QR Code</Label>
                  <div id="qr-reader" className="rounded-lg overflow-hidden border-2 border-indigo-500/30"></div>
                  <p className="text-white/60 text-xs text-center">
                    Position the QR code within the frame. Allow camera access when prompted.
                  </p>
                  <Button onClick={stopScanner} variant="outline" className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10">
                    Cancel
                  </Button>
                </div>
              )}

              {qrScanned && (
                <div className="p-4 bg-emerald-500/20 border border-emerald-500/30 rounded-lg">
                  <p className="text-emerald-400 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    QR Code scanned successfully
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>

          <div className="space-y-4 mt-4 md:mt-6">
            <div>
              <Label htmlFor="employee" className="text-white text-sm md:text-base">Employee ID</Label>
              <Input
                id="employee"
                type="text"
                placeholder="emp_123"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="mt-2 bg-white/10 border-white/20 text-white text-sm md:text-base"
                disabled={!!validationResult}
              />
            </div>

            <div>
              <Label htmlFor="location" className="text-white text-sm md:text-base">Location</Label>
              <Select value={location} onValueChange={setLocation} disabled={!!validationResult}>
                <SelectTrigger className="mt-2 bg-white/10 border-white/20 text-white text-sm md:text-base">
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

          <div className="mt-4 md:mt-6 flex flex-col sm:flex-row gap-3">
            {!validationResult && !success && (
              <Button
                onClick={handleValidate}
                disabled={loading || !pinCode || !employeeId || !location}
                className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-sm md:text-base"
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
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-sm md:text-base"
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
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-sm md:text-base sm:flex-initial"
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
