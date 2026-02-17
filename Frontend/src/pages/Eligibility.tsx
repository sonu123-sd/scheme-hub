import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
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
import { useToast } from '@/hooks/use-toast';

type FormDataState = {
  dob: string;
  gender: string;
  maritalStatus: string;
  caste: string;
  income: string;
  disability: string;
  education: string;
  employment: string;
  state: string;
};

type SchemeEligibility = {
  gender?: string;
  minAge?: number;
  maxAge?: number;
  caste?: string[];
  income?: number;
  incomeLimit?: number;
  education?: string;
  disability?: boolean;
  disabilityPercentage?: string;
  employment?: string;
};

type SchemeItem = {
  id: string;
  name: string;
  category: string;
  type: string;
  state?: string;
  official_link?: string;
  description?: string;
  eligibility?: SchemeEligibility;
};

type EligibilityPersistState = {
  formData: FormDataState;
  results: SchemeItem[] | null;
  showResults: boolean;
};

const ELIGIBILITY_STORAGE_KEY = 'schemehub:eligibility-form';
const defaultFormData: FormDataState = {
  dob: '',
  gender: '',
  maritalStatus: '',
  caste: '',
  income: '',
  disability: '',
  education: '',
  employment: '',
  state: '',
};

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
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState<FormDataState>(defaultFormData);

  const [results, setResults] = useState<SchemeItem[] | null>(null);
  const [showResults, setShowResults] = useState(false);
  const typedSchemes = schemes as SchemeItem[];

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(ELIGIBILITY_STORAGE_KEY);
      if (!raw) return;

      const saved = JSON.parse(raw) as EligibilityPersistState;
      if (saved?.formData) setFormData(saved.formData);
      if (saved?.results) setResults(saved.results);
      if (typeof saved?.showResults === 'boolean') setShowResults(saved.showResults);
    } catch {
      // Ignore invalid persisted payloads.
    }
  }, []);

  useEffect(() => {
    const payload: EligibilityPersistState = {
      formData,
      results,
      showResults,
    };
    sessionStorage.setItem(ELIGIBILITY_STORAGE_KEY, JSON.stringify(payload));
  }, [formData, results, showResults]);

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

  const normalize = (v: string) => (v || '').toString().trim().toLowerCase();

  const educationKeywords: Record<string, string[]> = {
    below10: ['below', 'primary', 'minimum 8th', '8th', 'no minimum', 'not required', 'any'],
    '10th': ['10th', 'class 10', 'minimum 10th'],
    '12th': ['12th', 'intermediate', 'class 12'],
    graduate: ['graduate', 'higher education', 'college'],
    postgraduate: ['post-graduate', 'post graduate', 'post graduation', 'research'],
    professional: ['professional', 'engineering', 'polytechnic', 'iti', 'diploma', 'ca'],
  };

  const casteAliases: Record<string, string[]> = {
    general: ['general'],
    obc: ['obc', 'bc', 'ebc', 'sbc'],
    sc: ['sc'],
    st: ['st'],
    ews: ['ews'],
  };

  const matchesEducation = (schemeEducationRaw: string, userEducation: string, userEmployment: string) => {
    const schemeEducation = normalize(schemeEducationRaw);
    if (!schemeEducation || ['all', 'any', 'not required', 'no minimum qualification'].includes(schemeEducation)) {
      return true;
    }

    if (schemeEducation.includes('student') && normalize(userEmployment) === 'student') {
      return true;
    }

    const keywords = educationKeywords[userEducation] || [];
    return keywords.some((k) => schemeEducation.includes(k));
  };

  const matchesCaste = (schemeCasteRaw: string[], userCaste: string) => {
    if (!Array.isArray(schemeCasteRaw) || schemeCasteRaw.length === 0) return true;

    const normalized = schemeCasteRaw.map((c) => normalize(c));
    if (normalized.includes('all')) return true;

    const aliases = casteAliases[userCaste] || [userCaste];
    return aliases.some((a) => normalized.includes(normalize(a)));
  };

  const getIncomeUpperBound = (incomeRange: string): number => {
    if (!incomeRange) return 0;
    if (incomeRange.includes('+')) {
      const base = incomeRange.replace('+', '').trim();
      return parseInt(base, 10) || 0;
    }
    const [_, max] = incomeRange.split('-').map((p) => p.trim());
    return parseInt(max || '0', 10) || 0;
  };

  const checkEligibility = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (
      !formData.dob ||
      !formData.gender ||
      !formData.maritalStatus ||
      !formData.caste ||
      !formData.income ||
      !formData.disability ||
      !formData.education ||
      !formData.employment ||
      !formData.state
    ) {
      toast({
        title: 'Incomplete details',
        description: 'Please fill all fields to get accurate scheme matches.',
        variant: 'destructive',
      });
      return;
    }

    const age = formData.dob ? calculateAge(formData.dob) : 0;
    const userIncome = getIncomeUpperBound(formData.income);
    const hasDisability = formData.disability === 'yes';
    const userGender = normalize(formData.gender);

    const eligibleSchemes = typedSchemes.filter((scheme) => {
      const elig = scheme.eligibility || {};

      // State scheme must match selected state.
      if (scheme.type === 'State') {
        if (!formData.state) return false;
        if (!scheme.state) return false;
        if (scheme.state.toLowerCase() !== formData.state.toLowerCase()) {
          return false;
        }
      }

      // Age
      const minAge = typeof elig.minAge === 'number' ? elig.minAge : 0;
      const maxAge = typeof elig.maxAge === 'number' ? elig.maxAge : 200;
      if (age < minAge || age > maxAge) {
        return false;
      }

      // Gender
      const schemeGender = normalize(elig.gender || 'all');
      if (
        schemeGender !== 'all' &&
        schemeGender !== userGender &&
        !(schemeGender === 'transgender' && userGender === 'other')
      ) {
        return false;
      }

      // Caste
      if (!matchesCaste(elig.caste || [], formData.caste)) {
        return false;
      }

      // Income
      const schemeIncomeLimit = typeof elig.incomeLimit === 'number'
        ? elig.incomeLimit
        : (typeof elig.income === 'number' ? elig.income : 0);
      if (schemeIncomeLimit > 0 && userIncome > schemeIncomeLimit) {
        return false;
      }

      // Disability
      if (elig.disability === true && !hasDisability) {
        return false;
      }
      if (elig.disabilityPercentage && !hasDisability) {
        return false;
      }

      // Employment (only few schemes)
      if (elig.employment) {
        const schemeEmployment = normalize(elig.employment);
        const userEmployment = normalize(formData.employment);
        if (schemeEmployment !== 'all' && !schemeEmployment.includes(userEmployment)) {
          return false;
        }
      }

      // Education
      if (!matchesEducation(elig.education || '', formData.education, formData.employment)) {
        return false;
      }

      return true;
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
                  <Label>Annual Family Income Range (₹)</Label>
                  <Select value={formData.income} onValueChange={(value) => setFormData({ ...formData, income: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select annual income range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-50000">0 - 50,000</SelectItem>
                      <SelectItem value="50000-100000">50,000 - 100,000</SelectItem>
                      <SelectItem value="100000-300000">100,000 - 300,000</SelectItem>
                      <SelectItem value="300000-500000">300,000 - 500,000</SelectItem>
                      <SelectItem value="500000+">500,000+</SelectItem>
                    </SelectContent>
                  </Select>
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
                            onClick={() => window.open(scheme.official_link || '#', '_blank')}
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
