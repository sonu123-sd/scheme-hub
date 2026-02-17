import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({ firstName: '', middleName: '', surname: '', dob: '', gender: '', maritalStatus: '', caste: '', education: '', employment: '', mobile: '', email: '', state: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedEmail = formData.email.trim().toLowerCase();

    // ✅ First Name validation
    if (!/^[A-Za-z\s]+$/.test(formData.firstName)) {
      toast({
        title: 'Error',
        description: 'First Name should contain only alphabets',
        variant: 'destructive',
      });
      return;
    }

    // ✅ Surname validation
    if (!/^[A-Za-z\s]+$/.test(formData.surname)) {
      toast({
        title: 'Error',
        description: 'Surname should contain only alphabets',
        variant: 'destructive',
      });
      return;
    }

    // ✅ Mobile validation
    if (!/^[0-9]{10}$/.test(formData.mobile)) {
      toast({
        title: 'Error',
        description: 'Mobile must be exactly 10 digits',
        variant: 'destructive',
      });
      return;
    }
    // ✅ Email validation (Gmail only, proper format, no spaces)
    const gmailRegex = /^[a-z0-9](?:[a-z0-9._%+-]{0,62}[a-z0-9])?@gmail\.com$/;
    if (!gmailRegex.test(normalizedEmail)) {
      toast({
        title: 'Error',
        description: 'Enter a valid Gmail address (example@gmail.com)',
        variant: 'destructive',
      });
      return;
    }
    // ✅ Password rule:
    // Must start with a capital letter, contain at least one number,
    // and at least one special character.
    const passwordRegex = /^[A-Z](?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>_\-+=~`[\]\\\/]).+$/;
    if (!passwordRegex.test(formData.password)) {
      toast({
        title: 'Error',
        description: 'Password must start with a capital letter and include at least one number and one special character.',
        variant: 'destructive',
      });
      return;
    }
    // ✅ Password match check
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    try {
      await register({ ...formData, email: normalizedEmail });
      toast({
        title: 'Registration successful',
        description: 'Welcome to Scheme Hub!',
      });
      navigate('/');
    } catch (err: any) {
      toast({
        title: 'Registration failed',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  const updateField = (field: string, value: string) => {
    let errorMessage = "";

    // ✅ Name fields validation (INCLUDING middleName)
    if (["firstName", "middleName", "surname"].includes(field)) {
      if (!/^[A-Za-z\s]*$/.test(value)) {
        errorMessage = "Invalid name";
      }
    }

    if (field === "mobile") {
      if (!/^[0-9]*$/.test(value)) {
        setErrors((prev) => ({
          ...prev,
          [field]: "Invalid mobile number (numbers only)",
        }));
        return;
      }
      if (value.length > 10) {
        return;
      }
    }

    if (field === "email") {
      const normalizedEmail = value.trim().toLowerCase();
      const gmailRegex = /^[a-z0-9](?:[a-z0-9._%+-]{0,62}[a-z0-9])?@gmail\.com$/;
      if (value && !gmailRegex.test(normalizedEmail)) {
        errorMessage = "Enter a valid Gmail address (example@gmail.com)";
      }
    }

    setErrors((prev) => ({
      ...prev,
      [field]: errorMessage,
    }));

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12 px-4">
        <div className="container max-w-2xl">
          <div className="bg-card rounded-2xl shadow-xl p-8 border border-border">
            <h1 className="text-2xl font-heading font-bold text-center mb-8">Create Your Account</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div><Label>First Name *</Label><Input value={formData.firstName} onChange={(e) => updateField('firstName', e.target.value)} required />{errors.firstName && (<p className="text-red-500 text-sm">{errors.firstName}</p>)}</div>
                <div><Label>Middle Name</Label><Input value={formData.middleName} onChange={(e) => updateField('middleName', e.target.value)} />{errors.middleName && (<p className="text-red-500 text-sm">{errors.middleName}</p>)}</div>
                <div><Label>Surname *</Label><Input value={formData.surname} onChange={(e) => updateField('surname', e.target.value)} required />{errors.surname && (<p className="text-red-500 text-sm">{errors.surname}</p>)}</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label>Date of Birth *</Label><Input type="date" value={formData.dob} onChange={(e) => updateField('dob', e.target.value)} required /></div>
                <div><Label>Gender *</Label><Select value={formData.gender} onValueChange={(v) => updateField('gender', v)}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem><SelectItem value="Other">Other</SelectItem></SelectContent></Select></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label>Marital Status</Label><Select value={formData.maritalStatus} onValueChange={(v) => updateField('maritalStatus', v)}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="Single">Single</SelectItem><SelectItem value="Married">Married</SelectItem><SelectItem value="Widowed">Widowed</SelectItem></SelectContent></Select></div>
                <div><Label>Caste Category</Label><Select value={formData.caste} onValueChange={(v) => updateField('caste', v)}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="General">General</SelectItem><SelectItem value="OBC">OBC</SelectItem><SelectItem value="SC">SC</SelectItem><SelectItem value="ST">ST</SelectItem></SelectContent></Select></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label>Education</Label><Select value={formData.education} onValueChange={(v) => updateField('education', v)}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="Below 10th">Below 10th</SelectItem><SelectItem value="10th Pass">10th Pass</SelectItem><SelectItem value="12th Pass">12th Pass</SelectItem><SelectItem value="Graduate">Graduate</SelectItem><SelectItem value="Post Graduate">Post Graduate</SelectItem></SelectContent></Select></div>
                <div><Label>Employment</Label><Select value={formData.employment} onValueChange={(v) => updateField('employment', v)}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="Employed">Employed</SelectItem><SelectItem value="Unemployed">Unemployed</SelectItem><SelectItem value="Self-Employed">Self-Employed</SelectItem><SelectItem value="Student">Student</SelectItem><SelectItem value="Farmer">Farmer</SelectItem></SelectContent></Select></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label>Mobile *</Label><Input value={formData.mobile} onChange={(e) => updateField('mobile', e.target.value)} inputMode="numeric" pattern="[0-9]*" maxLength={10} required />{errors.mobile && (<p className="text-red-500 text-sm">{errors.mobile}</p>)}</div>
                <div><Label>Email</Label><Input type="email" value={formData.email} onChange={(e) => updateField('email', e.target.value)} required />{errors.email && (<p className="text-red-500 text-sm">{errors.email}</p>)}</div>
              </div>
              <div>
                <Label>State / UT</Label>
                <Select value={formData.state} onValueChange={(v) => updateField('state', v)}>
                  <SelectTrigger><SelectValue placeholder="Select State / UT" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Andhra Pradesh">Andhra Pradesh</SelectItem>
                    <SelectItem value="Arunachal Pradesh">Arunachal Pradesh</SelectItem>
                    <SelectItem value="Assam">Assam</SelectItem>
                    <SelectItem value="Bihar">Bihar</SelectItem>
                    <SelectItem value="Chhattisgarh">Chhattisgarh</SelectItem>
                    <SelectItem value="Delhi">Delhi</SelectItem>
                    <SelectItem value="Goa">Goa</SelectItem>
                    <SelectItem value="Gujarat">Gujarat</SelectItem>
                    <SelectItem value="Haryana">Haryana</SelectItem>
                    <SelectItem value="Himachal Pradesh">Himachal Pradesh</SelectItem>
                    <SelectItem value="Jharkhand">Jharkhand</SelectItem>
                    <SelectItem value="Karnataka">Karnataka</SelectItem>
                    <SelectItem value="Kerala">Kerala</SelectItem>
                    <SelectItem value="Madhya Pradesh">Madhya Pradesh</SelectItem>
                    <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                    <SelectItem value="Manipur">Manipur</SelectItem>
                    <SelectItem value="Meghalaya">Meghalaya</SelectItem>
                    <SelectItem value="Mizoram">Mizoram</SelectItem>
                    <SelectItem value="Nagaland">Nagaland</SelectItem>
                    <SelectItem value="Odisha">Odisha</SelectItem>
                    <SelectItem value="Punjab">Punjab</SelectItem>
                    <SelectItem value="Rajasthan">Rajasthan</SelectItem>
                    <SelectItem value="Sikkim">Sikkim</SelectItem>
                    <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                    <SelectItem value="Telangana">Telangana</SelectItem>
                    <SelectItem value="Tripura">Tripura</SelectItem>
                    <SelectItem value="Uttar Pradesh">Uttar Pradesh</SelectItem>
                    <SelectItem value="Uttarakhand">Uttarakhand</SelectItem>
                    <SelectItem value="West Bengal">West Bengal</SelectItem>
                    <SelectItem value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</SelectItem>
                    <SelectItem value="Chandigarh">Chandigarh</SelectItem>
                    <SelectItem value="Dadra and Nagar Haveli and Daman and Diu">Dadra and Nagar Haveli and Daman and Diu</SelectItem>
                    <SelectItem value="Jammu and Kashmir">Jammu and Kashmir</SelectItem>
                    <SelectItem value="Ladakh">Ladakh</SelectItem>
                    <SelectItem value="Lakshadweep">Lakshadweep</SelectItem>
                    <SelectItem value="Puducherry">Puducherry</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative"><Label>Password *</Label><Input type={showPassword ? 'text' : 'password'} value={formData.password} onChange={(e) => updateField('password', e.target.value)} required /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-8">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button><p className="text-xs text-muted-foreground mt-1">Start with a capital letter, then include at least one number and one special character.</p></div>
                <div><Label>Confirm Password *</Label><Input type="password" value={formData.confirmPassword} onChange={(e) => updateField('confirmPassword', e.target.value)} required /></div>
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 mt-6" disabled={isLoading}>{isLoading ? 'Creating Account...' : 'Register'}</Button>
            </form>
            <p className="text-center mt-6 text-sm text-muted-foreground">Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Login here</Link></p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Register;
