import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ResetPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [resetEmail, setResetEmail] = useState<string | null>(null);

  useEffect(() => {
    // Check if reset token exists
    const resetData = localStorage.getItem('resetToken');
    if (resetData) {
      const parsed = JSON.parse(resetData);
      if (parsed.expiry > Date.now()) {
        setResetEmail(parsed.email);
      } else {
        localStorage.removeItem('resetToken');
        toast({
          title: 'Link Expired',
          description: 'The reset link has expired. Please request a new one.',
          variant: 'destructive',
        });
        navigate('/forgot-password');
      }
    }
  }, [navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Passwords do not match',
        description: 'Please ensure both passwords are the same.',
        variant: 'destructive',
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: 'Password too short',
        description: 'Password must be at least 6 characters long.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate password reset
    setTimeout(() => {
      if (resetEmail) {
        const users = JSON.parse(localStorage.getItem('schemeHubUsers') || '[]');
        const userIndex = users.findIndex((u: any) => u.email === resetEmail);
        
        if (userIndex !== -1) {
          users[userIndex].password = formData.password;
          localStorage.setItem('schemeHubUsers', JSON.stringify(users));
          localStorage.removeItem('resetToken');
          setIsSuccess(true);
          
          toast({
            title: 'Password Reset Successful',
            description: 'You can now login with your new password.',
          });
        }
      }
      setIsSubmitting(false);
    }, 1500);
  };

  if (!resetEmail && !isSuccess) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <Card className="max-w-md mx-auto text-center p-8">
            <CardTitle className="mb-4">Invalid Reset Link</CardTitle>
            <p className="text-muted-foreground mb-4">
              This password reset link is invalid or has expired.
            </p>
            <Link to="/forgot-password">
              <Button>Request New Link</Button>
            </Link>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                {isSuccess ? (
                  <CheckCircle className="h-8 w-8 text-green-600" />
                ) : (
                  <Lock className="h-8 w-8 text-primary" />
                )}
              </div>
              <CardTitle className="text-2xl">
                {isSuccess ? 'Password Reset Complete' : 'Reset Password'}
              </CardTitle>
              <CardDescription>
                {isSuccess 
                  ? 'Your password has been successfully reset.'
                  : 'Enter your new password below.'
                }
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {isSuccess ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground text-center">
                    You can now login with your new password.
                  </p>
                  <Button 
                    className="w-full"
                    onClick={() => navigate('/login')}
                  >
                    Go to Login
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">New Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter new password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm new password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </button>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Resetting...' : 'Reset Password'}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ResetPassword;
