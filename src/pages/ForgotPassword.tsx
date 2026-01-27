import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate email verification (frontend only)
    const users = JSON.parse(localStorage.getItem('schemeHubUsers') || '[]');
    const userExists = users.find((u: any) => u.email === email);

    setTimeout(() => {
      if (userExists) {
        // Store reset token in localStorage (simulated)
        const resetToken = Date.now().toString();
        localStorage.setItem('resetToken', JSON.stringify({ email, token: resetToken, expiry: Date.now() + 3600000 }));
        setIsSubmitted(true);
        toast({
          title: 'Reset Link Sent',
          description: 'Check your email for password reset instructions.',
        });
      } else {
        toast({
          title: 'Email Not Found',
          description: 'No account found with this email address.',
          variant: 'destructive',
        });
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                {isSubmitted ? (
                  <CheckCircle className="h-8 w-8 text-primary" />
                ) : (
                  <Mail className="h-8 w-8 text-primary" />
                )}
              </div>
              <CardTitle className="text-2xl">
                {isSubmitted ? 'Check Your Email' : 'Forgot Password'}
              </CardTitle>
              <CardDescription>
                {isSubmitted 
                  ? 'We have sent a password reset link to your email address.'
                  : 'Enter your email address and we will send you a reset link.'
                }
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {isSubmitted ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground text-center">
                    Didn't receive the email? Check your spam folder or try again.
                  </p>
                  <div className="flex flex-col gap-3">
                    <Link to="/reset-password">
                      <Button className="w-full">
                        Continue to Reset Password
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setIsSubmitted(false)}
                    >
                      Try Again
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your registered email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Sending...' : 'Send Reset Link'}
                  </Button>
                </form>
              )}

              <div className="mt-6 text-center">
                <Link 
                  to="/login" 
                  className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Login
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ForgotPassword;
