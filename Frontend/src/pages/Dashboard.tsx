import React, { useState, useRef } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, FileText, Bookmark, Clock, Settings, Upload, Camera, Edit2, Save, X, Trash2, Eye, CheckCircle2, Users, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import schemes from '@/data/schemes.json';
import api from "@/utils/api";
import { useEffect } from "react";


const Dashboard = () => {
  const { user, isAuthenticated, updateUser, unsaveScheme, logout } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (isAuthenticated) {
      fetchDocuments();
    }
  }, [isAuthenticated]);

  const profilePhotoRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [eligibleSchemes, setEligibleSchemes] = useState<any[]>([]);
  const [eligibleLoading, setEligibleLoading] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: user?.firstName || '',
    middleName: user?.middleName || '',
    surname: user?.surname || '',
    mobile: user?.mobile || '',
    state: user?.state || '',
    education: user?.education || '',
    employment: user?.employment || '',
    dob: user?.dob || '',
    gender: user?.gender || '',
    caste: user?.caste || '',
  });


  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  const formatDate = (iso?: string) => {
    if (!iso) return "-";
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };
  const calculateAge = (dob?: string) => {
    if (!dob) return null;

    const birthDate = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };
  const userAge = calculateAge(user?.dob);

  useEffect(() => {
    const fetchEligibleSchemes = async () => {
      if (!isAuthenticated || !user?.dob || !user?.gender || !user?.state) {
        setEligibleSchemes([]);
        return;
      }

      try {
        setEligibleLoading(true);
        const res = await api.post<{ data: Array<Record<string, unknown>> }>("/api/eligibility/check", {
          dateOfBirth: user.dob,
          gender: user.gender,
          maritalStatus: (user as any)?.maritalStatus || "",
          caste: user.caste || "",
          annualIncome: Number((user as any)?.income || 0),
          disability: (user as any)?.disability || "no",
          education: user.education || "",
          employment: user.employment || "",
          state: user.state || "",
        });

        setEligibleSchemes(Array.isArray(res.data?.data) ? res.data.data : []);
      } catch (err: any) {
        console.error("Fetch eligible schemes failed", err?.response?.data || err?.message);
        setEligibleSchemes([]);
      } finally {
        setEligibleLoading(false);
      }
    };

    fetchEligibleSchemes();
  }, [
    isAuthenticated,
    user?.dob,
    user?.gender,
    user?.state,
    user?.caste,
    user?.education,
    user?.employment,
  ]);


  const handleProfilePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateUser({ profilePhoto: reader.result as string });
        toast.success('Profile photo updated!');
      };
      reader.readAsDataURL(file);
    }
  };
  const fetchDocuments = async () => {
    try {
      const res = await api.get("/documents");

      const docs: Record<string, string> = {};

      if (Array.isArray(res.data)) {
        res.data.forEach((d: any) => {
          docs[d.docType] = d.fileUrl;
        });
      }

      updateUser({ documents: docs });
    } catch (err: any) {
      console.error(
        "Fetch documents failed",
        err?.response?.data || err.message
      );
    }
  };
  const handleDocumentUpload =
    (docType: string) =>
      async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // 10MB check
        if (file.size > 10 * 1024 * 1024) {
          toast.error("File must be under 10MB");
          return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("docType", docType);

        try {
          await api.post("/documents", formData); //  headers mat lagana
          toast.success("Document uploaded");
          fetchDocuments(); //  UI refresh
        } catch (err) {
          toast.error("Upload failed");
        }
      };


  const handleDeleteDocument = async (docType: string) => {
    try {
      await api.delete(`/documents/${docType}`);
      toast.success("Document deleted");
      fetchDocuments(); //  DB se reload
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const handleSaveProfile = () => {
    updateUser(editForm);
    setIsEditing(false);
    toast.success('Profile updated successfully!');
  };


  const savedSchemesList = schemes.filter(s => user?.savedSchemes.includes(s.id));
  const recentlyViewedList = schemes.filter(s => user?.recentlyViewed.includes(s.id));

  // Get age category label
  const getAgeCategory = (age: number) => {
    if (age < 18) return { label: 'Minor', color: 'bg-blue-100 text-blue-700' };
    if (age >= 18 && age <= 25) return { label: 'Youth (18-25)', color: 'bg-green-100 text-green-700' };
    if (age >= 26 && age <= 40) return { label: 'Adult (26-40)', color: 'bg-purple-100 text-purple-700' };
    if (age >= 41 && age <= 59) return { label: 'Middle Age (41-59)', color: 'bg-orange-100 text-orange-700' };
    return { label: 'Senior Citizen (60+)', color: 'bg-red-100 text-red-700' };
  };

  const userAgeCategory = userAge ? getAgeCategory(userAge) : null;

  const documentTypes = [
    { key: 'aadhaar', label: 'Aadhaar Card', icon: FileText },
    { key: 'pan', label: 'PAN Card', icon: FileText },
    { key: 'caste', label: 'Caste Certificate', icon: FileText },
    { key: 'income', label: 'Income Certificate', icon: FileText },
    { key: 'disability', label: 'Disability Certificate', icon: FileText },
    { key: 'rationCard', label: 'Ration Card', icon: FileText },
  ];

  const states = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ];

  return (
    <div className="w-full bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 pb-40">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">My Dashboard</h1>
          <p className="text-muted-foreground mt-2">Manage your profile, documents, and saved schemes</p>
        </div>

        <Tabs defaultValue="eligible" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
            <TabsTrigger value="eligible" className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              <span className="hidden sm:inline">Eligible</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Documents</span>
            </TabsTrigger>
            <TabsTrigger value="saved" className="flex items-center gap-2">
              <Bookmark className="h-4 w-4" />
              <span className="hidden sm:inline">Saved</span>
            </TabsTrigger>
            <TabsTrigger value="recent" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="hidden sm:inline">Recent</span>
            </TabsTrigger>
          </TabsList>

          {/* Eligible Schemes Tab */}
          <TabsContent value="eligible">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  Schemes You're Eligible For ({eligibleSchemes.length})
                </CardTitle>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge className={userAgeCategory?.color}>
                    <Calendar className="h-3 w-3 mr-1" />
                    {userAge} years - {userAgeCategory?.label}
                  </Badge>
                  <Badge variant="outline" className="bg-pink-50 text-pink-700 border-pink-200">
                    <Users className="h-3 w-3 mr-1" />
                    {user?.gender}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {eligibleLoading ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">Loading eligible schemes...</p>
                  </div>
                ) : eligibleSchemes.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Complete your profile to see eligible schemes</p>
                    <Button className="mt-4" onClick={() => navigate('/eligibility')}>
                      Check Eligibility
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Age Group Filter Info */}
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Your Eligibility Profile:</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Age:</span>
                          <span className="font-medium">{userAge} years</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Gender:</span>
                          <span className="font-medium">{user?.gender}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Category:</span>
                          <span className="font-medium">{user?.caste || 'General'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">State:</span>
                          <span className="font-medium">{user?.state || 'All India'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Schemes Grid */}
                    <div className="grid gap-4">
                      {eligibleSchemes.map((scheme) => (
                        <Card key={scheme.id} className="hover:shadow-md transition-shadow border-l-4 border-l-green-500">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                  <Badge variant={scheme.type === 'Central' ? 'default' : 'secondary'}>
                                    {scheme.type}
                                  </Badge>
                                  <Badge variant="outline">{scheme.category}</Badge>
                                  {/* Age Range Badge */}
                                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    Age: {scheme.eligibility.minAge}-{scheme.eligibility.maxAge}
                                  </Badge>
                                  {/* Gender Badge */}
                                  <Badge variant="outline" className={
                                    scheme.eligibility.gender === 'Female'
                                      ? 'bg-pink-50 text-pink-700 border-pink-200'
                                      : scheme.eligibility.gender === 'Male'
                                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                                        : 'bg-gray-50 text-gray-700 border-gray-200'
                                  }>
                                    <Users className="h-3 w-3 mr-1" />
                                    {scheme.eligibility.gender}
                                  </Badge>
                                </div>
                                <h3 className="font-semibold text-lg mb-1">{scheme.name}</h3>
                                <p className="text-muted-foreground text-sm line-clamp-2">
                                  {scheme.description}
                                </p>
                                {scheme.state && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    State: {scheme.state}
                                  </p>
                                )}
                              </div>
                              <Button
                                variant="default"
                                size="sm"
                                className="ml-4"
                                onClick={() => navigate(`/scheme/${scheme.id}`)}
                              >
                                Apply Now
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Profile Information</CardTitle>
                {!isEditing ? (
                  <Button variant="outline" onClick={() => setIsEditing(true)}>
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button onClick={handleSaveProfile}>
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Profile Photo */}
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                      <Avatar className="h-32 w-32">
                        <AvatarImage src={user?.profilePhoto} />
                        <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                          {user?.firstName?.charAt(0)}{user?.surname?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <button
                        onClick={() => profilePhotoRef.current?.click()}
                        className="absolute bottom-0 right-0 p-2 bg-primary rounded-full text-primary-foreground hover:bg-primary/90 transition-colors"
                      >
                        <Camera className="h-4 w-4" />
                      </button>
                      <input
                        ref={profilePhotoRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleProfilePhotoUpload}
                      />
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-lg">{user?.firstName} {user?.surname}</p>
                      <p className="text-muted-foreground text-sm">{user?.email}</p>
                    </div>
                  </div>

                  {/* Profile Details */}
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>First Name</Label>
                      {isEditing ? (
                        <Input
                          value={editForm.firstName}
                          onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                        />
                      ) : (
                        <p className="mt-1 p-2 bg-muted rounded">{user?.firstName}</p>
                      )}
                    </div>
                    <div>
                      <Label>Middle Name</Label>
                      {isEditing ? (
                        <Input
                          value={editForm.middleName}
                          onChange={(e) => setEditForm({ ...editForm, middleName: e.target.value })}
                        />
                      ) : (
                        <p className="mt-1 p-2 bg-muted rounded">{user?.middleName || '-'}</p>
                      )}
                    </div>
                    <div>
                      <Label>Surname</Label>
                      {isEditing ? (
                        <Input
                          value={editForm.surname}
                          onChange={(e) => setEditForm({ ...editForm, surname: e.target.value })}
                        />
                      ) : (
                        <p className="mt-1 p-2 bg-muted rounded">{user?.surname}</p>
                      )}
                    </div>
                    <div>
                      <Label>Date of Birth</Label>
                      {isEditing ? (
                        <Input
                          type="date"
                          value={editForm.dob}
                          onChange={(e) => setEditForm({ ...editForm, dob: e.target.value })}
                        />
                      ) : (
                        <p className="mt-1 p-2 bg-muted rounded">
                          {formatDate(user?.dob)}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label>Age</Label>
                      <p className="mt-1 p-2 bg-muted rounded">{userAge} years</p>
                    </div>
                    <div>
                      <Label>Gender</Label>
                      {isEditing ? (
                        <select
                          value={editForm.gender}
                          onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                          className="w-full mt-1 p-2 border rounded bg-background"
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="Transgender">Transgender</option>
                          <option value="other">Other</option>
                        </select>
                      ) : (
                        <p className="mt-1 p-2 bg-muted rounded">{user?.gender}</p>
                      )}
                    </div>
                    <div>
                      <Label>Mobile</Label>
                      {isEditing ? (
                        <Input
                          value={editForm.mobile}
                          onChange={(e) => setEditForm({ ...editForm, mobile: e.target.value })}
                        />
                      ) : (
                        <p className="mt-1 p-2 bg-muted rounded">{user?.mobile}</p>
                      )}
                    </div>
                    <div>
                      <Label>Email</Label>
                      <p className="mt-1 p-2 bg-muted rounded">{user?.email}</p>
                    </div>
                    <div>
                      <Label>State</Label>
                      {isEditing ? (
                        <select
                          value={editForm.state}
                          onChange={(e) => setEditForm({ ...editForm, state: e.target.value })}
                          className="w-full mt-1 p-2 border rounded bg-background"
                        >
                          <option value="">Select State</option>
                          {states.map(state => (
                            <option key={state} value={state}>{state}</option>
                          ))}
                        </select>
                      ) : (
                        <p className="mt-1 p-2 bg-muted rounded">{user?.state}</p>
                      )}
                    </div>
                    <div>
                      <Label>Caste Category</Label>
                      {isEditing ? (
                        <select
                          value={editForm.caste}
                          onChange={(e) =>
                            setEditForm({ ...editForm, caste: e.target.value })
                          }
                          className="w-full mt-1 p-2 border rounded bg-background">
                          <option value="">Select Category</option>
                          <option value="">Select Caste Category</option>
                          <option value="General">General (Open)</option>
                          <option value="OBC">OBC</option>
                          <option value="OBC-NCL">OBC - NCL</option>
                          <option value="SC">SC</option>
                          <option value="ST">ST</option>
                          <option value="EWS">EWS</option>
                          <option value="VJNT">VJNT</option>
                          <option value="NT-A">NT-A</option>
                          <option value="NT-B">NT-B</option>
                          <option value="NT-C">NT-C</option>
                          <option value="NT-D">NT-D</option>
                          <option value="Other">Other</option>
                        </select>
                      ) : (
                        <p className="mt-1 p-2 bg-muted rounded">
                          {user?.caste || "-"}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label>Employment</Label>
                      {isEditing ? (
                        <Input
                          value={editForm.employment}
                          onChange={(e) => setEditForm({ ...editForm, employment: e.target.value })}
                        />
                      ) : (
                        <p className="mt-1 p-2 bg-muted rounded">{user?.employment}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t flex justify-between items-center">
                  <Button variant="outline" onClick={() => navigate('/settings')}>
                    <Settings className="h-4 w-4 mr-2" />
                    Account Settings
                  </Button>
                  <Button variant="destructive" onClick={() => { logout(); navigate('/'); }}>
                    Logout
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Document Vault
                </CardTitle>
                <p className="text-muted-foreground text-sm">
                  Securely store your documents for quick access during scheme applications
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {documentTypes.map((docItem) => {
                    const isUploaded = user?.documents?.[docItem.key as keyof typeof user.documents];
                    return (
                      <Card key={docItem.key} className={`border-2 ${isUploaded ? 'border-green-500/50 bg-green-50/50 dark:bg-green-950/20' : 'border-dashed'}`}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <docItem.icon className={`h-5 w-5 ${isUploaded ? 'text-green-600' : 'text-muted-foreground'}`} />
                              <span className="font-medium">{docItem.label}</span>
                            </div>
                            {isUploaded && (
                              <Badge variant="secondary" className="bg-green-100 text-green-700">
                                Uploaded
                              </Badge>
                            )}
                          </div>

                          {isUploaded ? (
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1"
                                onClick={() => {
                                  const docData = user?.documents?.[docItem.key as keyof typeof user.documents];
                                  if (docData) window.open(docData as string, '_blank');
                                }}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-destructive hover:text-destructive"
                                onClick={() => handleDeleteDocument(docItem.key)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <div>
                              <input
                                type="file"
                                id={`doc-${docItem.key}`}
                                accept=".pdf,.jpg,.jpeg,.png"
                                className="hidden"
                                onChange={handleDocumentUpload(docItem.key)}
                              />
                              <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => document.getElementById(`doc-${docItem.key}`)?.click()}
                              >
                                <Upload className="h-4 w-4 mr-2" />
                                Upload
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Other Documents Section */}
                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-semibold mb-4">Other Documents</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {user?.documents?.others?.map((doc, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        Document {index + 1}
                        <button onClick={() => {
                          const others = user?.documents?.others?.filter((_, i) => i !== index);
                          updateUser({ documents: { ...user?.documents, others } });
                        }}>
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <input
                    type="file"
                    id="other-docs"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          const others = [...(user?.documents?.others || []), reader.result as string];
                          updateUser({ documents: { ...user?.documents, others } });
                          toast.success('Document uploaded!');
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('other-docs')?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Add Other Document
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Saved Schemes Tab */}
          <TabsContent value="saved">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bookmark className="h-5 w-5" />
                  Saved Schemes ({savedSchemesList.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {savedSchemesList.length === 0 ? (
                  <div className="text-center py-12">
                    <Bookmark className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No saved schemes yet</p>
                    <Button className="mt-4" onClick={() => navigate('/total-schemes')}>
                      Browse Schemes
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {savedSchemesList.map((scheme) => (
                      <Card key={scheme.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant={scheme.type === 'Central' ? 'default' : 'secondary'}>
                                  {scheme.type}
                                </Badge>
                                <Badge variant="outline">{scheme.category}</Badge>
                              </div>
                              <h3 className="font-semibold text-lg mb-1">{scheme.name}</h3>
                              <p className="text-muted-foreground text-sm line-clamp-2">
                                {scheme.description}
                              </p>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate(`/scheme/${scheme.id}`)}
                              >
                                View
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive"
                                onClick={() => unsaveScheme(scheme.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recently Viewed Tab */}
          <TabsContent value="recent">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recently Viewed ({recentlyViewedList.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentlyViewedList.length === 0 ? (
                  <div className="text-center py-12">
                    <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No recently viewed schemes</p>
                    <Button className="mt-4" onClick={() => navigate('/total-schemes')}>
                      Browse Schemes
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {recentlyViewedList.map((scheme) => (
                      <Card key={scheme.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant={scheme.type === 'Central' ? 'default' : 'secondary'}>
                                  {scheme.type}
                                </Badge>
                                <Badge variant="outline">{scheme.category}</Badge>
                              </div>
                              <h3 className="font-semibold text-lg mb-1">{scheme.name}</h3>
                              <p className="text-muted-foreground text-sm line-clamp-2">
                                {scheme.description}
                              </p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="ml-4"
                              onClick={() => navigate(`/scheme/${scheme.id}`)}
                            >
                              View
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
