import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { MapPin, Search } from 'lucide-react';
import schemes from '@/data/schemes.json';

const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

const unionTerritories = [
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];

const StateSchemes = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState<string | null>(null);
  
  const stateSchemes = schemes.filter(s => s.type === 'State');

  const getSchemeCountByState = (stateName: string) => {
    return stateSchemes.filter(s => 
      s.state?.toLowerCase() === stateName.toLowerCase()
    ).length;
  };

  const getSchemesByState = (stateName: string) => {
    return stateSchemes.filter(s => 
      s.state?.toLowerCase() === stateName.toLowerCase()
    );
  };

  const handleStateClick = (stateName: string) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setSelectedState(stateName);
  };

  const filteredStates = indianStates.filter(state =>
    state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUTs = unionTerritories.filter(ut =>
    ut.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">State Government Schemes</h1>
          <p className="text-muted-foreground">
            Browse schemes by State - {stateSchemes.length} State Schemes Available
          </p>
        </div>

        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search states..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {selectedState ? (
          <div>
            <button 
              onClick={() => setSelectedState(null)}
              className="text-primary hover:underline mb-6 flex items-center gap-2"
            >
              ← Back to all states
            </button>
            
            <h2 className="text-2xl font-bold mb-6">{selectedState} Schemes</h2>
            
            <div className="grid gap-4">
              {getSchemesByState(selectedState).map((scheme) => (
                <Card 
                  key={scheme.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate(`/scheme/${scheme.id}`)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{scheme.name}</h3>
                        <p className="text-sm text-muted-foreground">{scheme.category}</p>
                      </div>
                      <Badge variant="secondary">{scheme.category}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {getSchemesByState(selectedState).length === 0 && (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">
                    No schemes found for {selectedState}. Check back later for updates.
                  </p>
                </Card>
              )}
            </div>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-4">States</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
              {filteredStates.map((state) => {
                const count = getSchemeCountByState(state);
                return (
                  <Card 
                    key={state}
                    className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1"
                    onClick={() => handleStateClick(state)}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-2">
                        <MapPin className="h-6 w-6 text-accent-foreground" />
                      </div>
                      <h3 className="font-medium text-sm mb-1">{state}</h3>
                      <Badge variant="outline" className="text-xs">{count} Schemes</Badge>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <h2 className="text-xl font-semibold mb-4">Union Territories</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredUTs.map((ut) => {
                const count = getSchemeCountByState(ut);
                return (
                  <Card 
                    key={ut}
                    className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1"
                    onClick={() => handleStateClick(ut)}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-2">
                        <MapPin className="h-6 w-6 text-secondary-foreground" />
                      </div>
                      <h3 className="font-medium text-sm mb-1">{ut}</h3>
                      <Badge variant="outline" className="text-xs">{count} Schemes</Badge>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default StateSchemes;
