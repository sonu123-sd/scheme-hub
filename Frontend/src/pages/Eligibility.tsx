import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, FileText, ExternalLink } from 'lucide-react';
import schemes from '@/data/schemes.json';
import { formatNumber, formatCurrency } from '@/i18n/formatters';


const states = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry', 'Chandigarh'
];

const Eligibility = () => {
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    dob: '',
    gender: '',
    maritalStatus: '',
    caste: '',
    income: '',
    disability: '',
    education: '',
    employment: '',
    state: ''
  });

  const [results, setResults] = useState<any[] | null>(null);
  const [showResults, setShowResults] = useState(false);

  const calculateAge = (dob: string): number => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const checkEligibility = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const age = formData.dob ? calculateAge(formData.dob) : 0;

    const eligibleSchemes = schemes.filter(scheme => {
      const elig = scheme.eligibility;

      // ✅ STRICT STATE FILTER (FIX)
      if (scheme.type === 'State') {
        if (!formData.state) return false;
        if (!scheme.state) return false;
        if (scheme.state.toLowerCase() !== formData.state.toLowerCase()) {
          return false;
        }
      }

      let score = 0;
      let maxScore = 0;

      // Age check
      if (elig.minAge || elig.maxAge) {
        maxScore += 1;
        if ((!elig.minAge || age >= elig.minAge) && (!elig.maxAge || age <= elig.maxAge)) {
          score += 1;
        }
      }

      // Gender check
      if (elig.gender && elig.gender !== 'All') {
        maxScore += 1;
        if (elig.gender.toLowerCase() === formData.gender.toLowerCase()) {
          score += 1;
        }
      }

      // Caste check
      if (elig.caste && elig.caste.length > 0) {
        maxScore += 1;
        if (
          elig.caste.includes('All') ||
          elig.caste.some(c => c.toLowerCase() === formData.caste.toLowerCase())
        ) {
          score += 1;
        }
      }

      // Income check
      if (elig.income) {
        maxScore += 1;
        const userIncome = parseInt(formData.income) || 0;
        if (userIncome <= elig.income) {
          score += 1;
        }
      }

      // Disability check
      if (elig.disability !== undefined) {
        maxScore += 1;
        const hasDisability = formData.disability === 'yes';
        if (elig.disability === hasDisability || elig.disability === false) {
          score += 1;
        }
      }

      // Education check
      if (elig.education && Array.isArray(elig.education) && elig.education.length > 0) {
        maxScore += 1;
        if (
          elig.education.includes('All') ||
          elig.education.some(
            (e: string) => e.toLowerCase() === formData.education.toLowerCase()
          )
        ) {
          score += 1;
        }
      }

      // ✅ Final decision (same as before)
      return maxScore === 0 || score / maxScore >= 0.5;
    });

    setResults(eligibleSchemes);
    setShowResults(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">Check Your Eligibility</h1>
            <p className="text-muted-foreground">
              Fill in your details to find government schemes you're eligible for
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg">Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input
                    id="dob"
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  />
                  {formData.dob && (
                    <p className="text-sm text-muted-foreground">
                      Age: {calculateAge(formData.dob)} years
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Gender</Label>
                  <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Marital Status</Label>
                  <Select value={formData.maritalStatus} onValueChange={(value) => setFormData({ ...formData, maritalStatus: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select marital status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="married">Married</SelectItem>
                      <SelectItem value="divorced">Divorced</SelectItem>
                      <SelectItem value="widowed">Widowed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Caste Category</Label>
                  <Select value={formData.caste} onValueChange={(value) => setFormData({ ...formData, caste: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select caste category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="obc">OBC</SelectItem>
                      <SelectItem value="sc">SC</SelectItem>
                      <SelectItem value="st">ST</SelectItem>
                      <SelectItem value="ews">EWS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="income">Annual Family Income (₹)</Label>
                  <Input
                    id="income"
                    type="number"
                    placeholder="Enter annual income"
                    value={formData.income}
                    onChange={(e) => setFormData({ ...formData, income: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Disability</Label>
                  <Select value={formData.disability} onValueChange={(value) => setFormData({ ...formData, disability: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Do you have any disability?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no">No</SelectItem>
                      <SelectItem value="yes">Yes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Education Level</Label>
                  <Select value={formData.education} onValueChange={(value) => setFormData({ ...formData, education: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select education level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="below10">Below 10th</SelectItem>
                      <SelectItem value="10th">10th Pass</SelectItem>
                      <SelectItem value="12th">12th Pass</SelectItem>
                      <SelectItem value="graduate">Graduate</SelectItem>
                      <SelectItem value="postgraduate">Post Graduate</SelectItem>
                      <SelectItem value="professional">Professional Degree</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Employment Status</Label>
                  <Select value={formData.employment} onValueChange={(value) => setFormData({ ...formData, employment: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select employment status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unemployed">Unemployed</SelectItem>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="employed">Employed</SelectItem>
                      <SelectItem value="selfemployed">Self Employed</SelectItem>
                      <SelectItem value="farmer">Farmer</SelectItem>
                      <SelectItem value="retired">Retired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>State</Label>
                  <Select value={formData.state} onValueChange={(value) => setFormData({ ...formData, state: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your state" />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map((state) => (
                        <SelectItem key={state} value={state.toLowerCase()}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                onClick={checkEligibility}
                className="w-full mt-6 bg-primary hover:bg-primary/90"
                size="lg"
              >
                <CheckCircle className="mr-2 h-5 w-5" />
                Check Eligibility
              </Button>
            </CardContent>
          </Card>

          {showResults && results && (
            <div className="space-y-6">
              <div className="text-center p-6 bg-primary/10 rounded-lg">
                <h2 className="text-2xl font-bold text-primary">
                  {results.length} Schemes Found
                </h2>
                <p className="text-muted-foreground">
                  Based on your profile, you may be eligible for these schemes
                </p>
              </div>

              <div className="grid gap-4">
                {results.map((scheme) => (
                  <Card key={scheme.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2">{scheme.name}</h3>
                          <div className="flex flex-wrap gap-2 mb-3">
                            <Badge variant={scheme.type === 'Central' ? 'default' : 'secondary'}>
                              {scheme.type}
                            </Badge>
                            <Badge variant="outline">{scheme.category}</Badge>
                            {scheme.state && <Badge variant="outline">{scheme.state}</Badge>}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {scheme.description}
                          </p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/scheme/${scheme.id}`)}
                          >
                            <FileText className="h-4 w-4 mr-1" />
                            Details
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => window.open(scheme.official_link, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Apply
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {results.length === 0 && (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">
                    No exact matches found. Try adjusting your criteria or browse all schemes.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => navigate('/total-schemes')}
                  >
                    Browse All Schemes
                  </Button>
                </Card>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Eligibility;
