import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, Wheat, GraduationCap, Heart, Home, Briefcase, 
  Landmark, Shield, Users, Leaf, Factory, Truck
} from 'lucide-react';
import schemes from '@/data/schemes.json';

const ministries = [
  { name: 'Ministry of Agriculture', icon: Wheat, color: 'bg-green-500' },
  { name: 'Ministry of Education', icon: GraduationCap, color: 'bg-blue-500' },
  { name: 'Ministry of Health & Family Welfare', icon: Heart, color: 'bg-red-500' },
  { name: 'Ministry of Housing & Urban Affairs', icon: Home, color: 'bg-amber-500' },
  { name: 'Ministry of Finance', icon: Landmark, color: 'bg-purple-500' },
  { name: 'Ministry of Labour & Employment', icon: Briefcase, color: 'bg-orange-500' },
  { name: 'Ministry of Women & Child Development', icon: Users, color: 'bg-pink-500' },
  { name: 'Ministry of Environment', icon: Leaf, color: 'bg-emerald-500' },
  { name: 'Ministry of MSME', icon: Factory, color: 'bg-indigo-500' },
  { name: 'Ministry of Road Transport', icon: Truck, color: 'bg-slate-500' },
  { name: 'Ministry of Defence', icon: Shield, color: 'bg-gray-600' },
  { name: 'Other Ministries', icon: Building2, color: 'bg-primary' },
];

const categoryToMinistry: Record<string, string> = {
  'Agriculture': 'Ministry of Agriculture',
  'Education': 'Ministry of Education',
  'Health': 'Ministry of Health & Family Welfare',
  'Housing': 'Ministry of Housing & Urban Affairs',
  'Banking & Finance': 'Ministry of Finance',
  'Skills & Employment': 'Ministry of Labour & Employment',
  'Women & Child': 'Ministry of Women & Child Development',
  'Business': 'Ministry of MSME',
  'Transport': 'Ministry of Road Transport',
  'Social Welfare': 'Ministry of Women & Child Development',
};

const CentralSchemes = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const centralSchemes = schemes.filter(s => s.type === 'Central');

  const getSchemesByMinistry = (ministryName: string) => {
    if (ministryName === 'Other Ministries') {
      return centralSchemes.filter(s => {
        const ministry = categoryToMinistry[s.category];
        return !ministry || !ministries.some(m => m.name === ministry);
      });
    }
    return centralSchemes.filter(s => categoryToMinistry[s.category] === ministryName);
  };

  const handleMinistryClick = (ministryName: string) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    const ministrySchemes = getSchemesByMinistry(ministryName);
    if (ministrySchemes.length > 0) {
      navigate(`/total-schemes?type=Central&ministry=${encodeURIComponent(ministryName)}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Central Government Schemes</h1>
          <p className="text-muted-foreground">
            Browse schemes by Ministry - {centralSchemes.length} Central Schemes Available
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {ministries.map((ministry) => {
            const count = getSchemesByMinistry(ministry.name).length;
            const Icon = ministry.icon;
            
            return (
              <Card 
                key={ministry.name}
                className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1"
                onClick={() => handleMinistryClick(ministry.name)}
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 ${ministry.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-sm mb-2 line-clamp-2">{ministry.name}</h3>
                  <Badge variant="secondary">{count} Schemes</Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">All Central Schemes</h2>
          <div className="grid gap-4">
            {centralSchemes.map((scheme) => (
              <Card 
                key={scheme.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => {
                  if (!isAuthenticated) {
                    navigate('/login');
                    return;
                  }
                  navigate(`/scheme/${scheme.id}`);
                }}
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{scheme.name}</h3>
                    <p className="text-sm text-muted-foreground">{scheme.category}</p>
                  </div>
                  <Badge>Central</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CentralSchemes;
