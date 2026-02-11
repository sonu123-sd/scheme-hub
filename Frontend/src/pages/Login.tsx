import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Navigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "@/firebase";
import { FcGoogle } from "react-icons/fc";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login, setFirebaseUser, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const returnUrl = (location.state as any)?.returnUrl || "/";

  // Email/Password Login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);

    try {
      const success = await login(email, password);

      if (success) {
        toast({ title: "Login successful", description: "Welcome back!" });
        setTimeout(() => navigate(returnUrl), 100);
      } else {
        toast({
          title: "Login failed",
          description: "Login or profile fetch failed",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Google Login (CLEAN)
  const handleGoogleLogin = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);

      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      setFirebaseUser(user);

      toast({
        title: "Login successful",
        description: `Welcome ${user.displayName || "User"}!`,
      });

      setTimeout(() => navigate(returnUrl), 100);
    } catch (error) {
      console.error(error);

      toast({
        title: "Google login failed",
        description: "Popup blocked or Firebase error",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-2xl shadow-xl p-8 border border-border">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold">Welcome Back</h1>
              <p className="text-muted-foreground mt-2">
                Login to access government schemes
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label>Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              <div className="text-right">
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
                onClick={handleGoogleLogin}
                disabled={isLoading}
              >
                <FcGoogle size={20} />
                Continue with Google
              </Button>
            </form>

            <p className="text-center mt-6 text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-primary font-medium hover:underline"
              >
                Register here
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
