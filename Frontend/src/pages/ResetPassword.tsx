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
import { useParams } from 'react-router-dom';
import api from '@/utils/api';

const ResetPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { token } = useParams();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      toast({
        title: "Invalid link",
        description: "Reset token missing",
        variant: "destructive",
      });
      navigate("/forgot-password");
    }
  }, [token, toast, navigate]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Passwords do not match',
        variant: 'destructive',
      });
      setIsSubmitting(false);
      return;
    }

    try {
      await api.post(`/auth/reset-password/${token}`, {
        newPassword: formData.password,
      });

      setIsSuccess(true);
      toast({
        title: 'Password Reset Successful',
        description: 'You can now login with your new password',
      });
      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err: any) {
      toast({
        title: 'Invalid or Expired Link',
        description:
          err?.response?.data?.message ||
          'Reset link is invalid or expired',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
