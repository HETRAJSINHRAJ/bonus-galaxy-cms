'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QrCode, Lock, CheckCircle, XCircle, Loader2, User, Key, AlertTriangle } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';

interface Employee {
  id: string;
  name: string;
  email: string;
  shopId: string;
  shopName: string;
}

interface VoucherDetails {
  voucherId: string;
  title: string;
  description: string;
  shopName: string;
  value: number;
  purchaseDate: string;
  expiresAt?: string;
}

export default function PartnerRedeemNewPage() {
  const [step, setStep] = useState<'login' | 'scan' | 'validate' | 'confirm'>('login');
  const [method, setMethod] = useState<'pin' | 'qr'>('qr');
  
  // Employee login
  const [employeeId, setEmployeeId] = useState('');
  const [employeePin, setEmployeePin] = useState('');
  const [employee, setEmployee] = useState<Employee | null>(null);
  
  // Voucher scanning
  const [voucherCode, setVoucherCode] = useState('');
  const [scanning, setScanning] = useState(false);
  const [qrScanned, setQrScanned] = useState(false);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  
  // Validation
  const [validationResult, setValidationResult] = useState<VoucherDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Redemption
  const [redemptionPin, setRedemptionPin] = useState('');
  const [success, setSuccess] = useState(false);
  const [attemptsLeft, setAttemptsLeft] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);

  // Employee Login
  const handleEmployeeLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // TODO: Implement employee authentication
      // For now, simulate login
      setEmployee({
        id: employeeId,
        name: 'John Doe',
        email: 'john@example.com',
        shopId: 'shop_123',
        shopName: 'Vienna Store',
      });
      setStep('scan');
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // QR Scanner
  const startScanner = () => {
    setScanning(true);
    setError(null);
  };

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
            setVoucherCode(decodedText);
            setQrScanned(true);
            stopScanner();
            handleValidate(decodedText, 'qr');
          },
          (errorMessage) => {
            // Silent - fires continuously during scanning
          }
        );
      } catch (err) {
        console.error('Scanner error:', err);
        setScanning(false);
        setError('Failed to access camera. Please check permissions.');
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

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  // Validate Voucher
  const handleValidate = async (code?: string, scanMethod?: 'pin' | 'qr') => {
    const codeToValidate = code || voucherCode;
    const methodToUse = scanMethod || method;
    
    if (!codeToValidate || !employee) return;
    
    setError(null);
    setLoading(true);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vouchers/validate-new`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method: methodToUse,
          code: codeToValidate,
          employeeId: employee.id,
        })
      });
      
      const data = await response.json();
      
      if (data.valid) {
        setValidationResult(data.voucherDetails);
        setStep('confirm');
      } else {
        setError(data.error || 'Invalid voucher');
      }
    } catch (err) {
      setError('Validation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Redeem Voucher with PIN
  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validationResult || !employee) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vouchers/redeem-new`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          voucherId: validationResult.voucherId,
          employeeId: employee.id,
          employeePin: redemptionPin,
          method,
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess(true);
        setRedemptionPin('');
        setAttemptsLeft(null);
        setLocked(false);
      } else {
        setError(data.error || 'Redemption failed');
        
        if (data.attemptsLeft !== undefined) {
          setAttemptsLeft(data.attemptsLeft);
        }
        
        if (data.locked) {
          setLocked(true);
        }
      }
    } catch (err) {
      setError('Redemption failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setVoucherCode('');
    setValidationResult(null);
    setError(null);
    setSuccess(false);
    setQrScanned(false);
    setRedemptionPin('');
    setAttemptsLeft(null);
    setLocked(false);
    setStep('scan');
    stopScanner();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="container mx-auto max-w-2xl py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Partner Voucher Redemption</h1>
          <p className="text-white/60">Bonus Galaxy Redemption System (New)</p>
        </div>

        {/* Step 1: Employee Login */}
        {step === 'login' && (
          <Card className="p-6 bg-white/5 border-white/10">
            <form onSubmit={handleEmployeeLogin} className="space-y-4">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-8 w-8 text-cyan-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Employee Login</h2>
                <p className="text-white/60 text-sm">Enter your credentials to continue</p>
              </div>

              <div>
                <Label htmlFor="employeeId" className="text-white">Employee ID</Label>
                <Input
                  id="employeeId"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  required
                  className="mt-2 bg-white/10 border-white/20 text-white"
                  placeholder="emp_123"
                />
              </div>

              <div>
                <Label htmlFor="employeePin" className="text-white">PIN</Label>
                <Input
                  id="employeePin"
                  type="password"
                  value={employeePin}
                  onChange={(e) => setEmployeePin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  required
                  maxLength={6}
                  className="mt-2 bg-white/10 border-white/20 text-white text-2xl text-center tracking-widest"
                  placeholder="••••"
                />
              </div>

              {error && (
                <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                  <p className="text-red-400 flex items-center gap-2">
                    <XCircle className="h-5 w-5" />
                    {error}
                  </p>
                </div>
              )}

              <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-cyan-500 to-blue-500">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  'Login'
                )}
              </Button>
            </form>
          </Card>
        )}

        {/* Step 2: Scan/Enter Voucher */}
        {step === 'scan' && employee && (
          <Card className="p-6 bg-white/5 border-white/10">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-white/60 text-sm">Logged in as</p>
                  <p className="text-white font-semibold">{employee.name}</p>
                  <p className="text-white/60 text-xs">{employee.shopName}</p>
                </div>
                <Button variant="ghost" onClick={() => setStep('login')} className="text-white/60">
                  Logout
                </Button>
              </div>
            </div>

            <Tabs value={method} onValueChange={(v) => setMethod(v as 'pin' | 'qr')}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="qr" className="flex items-center gap-2">
                  <QrCode className="h-4 w-4" />
                  QR Code
                </TabsTrigger>
                <TabsTrigger value="pin" className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  PIN Code
                </TabsTrigger>
              </TabsList>

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
                      Position the QR code within the frame
                    </p>
                    <Button onClick={stopScanner} variant="outline" className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10">
                      Cancel
                    </Button>
                  </div>
                )}

                {loading && (
                  <div className="text-center py-8">
                    <Loader2 className="h-12 w-12 text-cyan-400 animate-spin mx-auto mb-4" />
                    <p className="text-white">Validating voucher...</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="pin" className="space-y-4">
                <div>
                  <Label htmlFor="pin" className="text-white">4-Digit PIN Code</Label>
                  <Input
                    id="pin"
                    type="text"
                    maxLength={4}
                    placeholder="1234"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value.replace(/\D/g, ''))}
                    className="mt-2 bg-white/10 border-white/20 text-white text-2xl text-center tracking-widest"
                  />
                </div>

                <Button 
                  onClick={() => handleValidate()} 
                  disabled={loading || voucherCode.length !== 4}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500"
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
              </TabsContent>
            </Tabs>

            {error && (
              <div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                <p className="text-red-400 flex items-center gap-2">
                  <XCircle className="h-5 w-5" />
                  {error}
                </p>
              </div>
            )}
          </Card>
        )}

        {/* Step 3: Confirm with Employee PIN */}
        {step === 'confirm' && validationResult && employee && !success && (
          <Card className="p-6 bg-white/5 border-white/10">
            <div className="space-y-6">
              {/* Voucher Details */}
              <div className="p-4 bg-emerald-500/20 border border-emerald-500/30 rounded-lg">
                <p className="text-emerald-400 font-semibold flex items-center gap-2 mb-3">
                  <CheckCircle className="h-5 w-5" />
                  Valid Voucher
                </p>
                <div className="text-white/80 text-sm space-y-1">
                  <p><strong>Title:</strong> {validationResult.title}</p>
                  <p><strong>Shop:</strong> {validationResult.shopName}</p>
                  <p><strong>Value:</strong> {validationResult.value} points</p>
                </div>
              </div>

              {/* PIN Entry */}
              <form onSubmit={handleRedeem} className="space-y-4">
                <div>
                  <Label htmlFor="redemptionPin" className="text-white flex items-center gap-2">
                    <Key className="h-4 w-4" />
                    Enter Your PIN to Confirm Redemption
                  </Label>
                  <Input
                    id="redemptionPin"
                    type="password"
                    value={redemptionPin}
                    onChange={(e) => setRedemptionPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    required
                    maxLength={6}
                    autoFocus
                    disabled={locked}
                    className="mt-2 bg-white/10 border-white/20 text-white text-2xl text-center tracking-widest"
                    placeholder="••••••"
                  />
                  <p className="text-white/40 text-xs mt-1">Your employee PIN (4-6 digits)</p>
                </div>

                {attemptsLeft !== null && attemptsLeft > 0 && (
                  <div className="p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                    <p className="text-yellow-400 text-sm flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      {attemptsLeft} attempt(s) remaining
                    </p>
                  </div>
                )}

                {locked && (
                  <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                    <p className="text-red-400 text-sm flex items-center gap-2">
                      <XCircle className="h-5 w-5" />
                      Account locked due to multiple failed attempts. Please try again later.
                    </p>
                  </div>
                )}

                {error && !locked && (
                  <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                    <p className="text-red-400 text-sm flex items-center gap-2">
                      <XCircle className="h-5 w-5" />
                      {error}
                    </p>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    type="submit"
                    disabled={loading || locked || redemptionPin.length < 4}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-green-500"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Redeeming...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Confirm Redemption
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    onClick={resetForm}
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        )}

        {/* Success State */}
        {success && (
          <Card className="p-6 bg-white/5 border-white/10">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-10 w-10 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Voucher Redeemed!</h2>
                <p className="text-white/60">The voucher has been successfully redeemed</p>
              </div>
              <Button onClick={resetForm} className="bg-gradient-to-r from-cyan-500 to-blue-500">
                Redeem Another Voucher
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
