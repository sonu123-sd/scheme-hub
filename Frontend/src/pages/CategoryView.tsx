import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink, FileText } from 'lucide-react';
import schemes from '@/data/schemes.json';

const CategoryView = () => {
  const { category } = useParams<{ category: string }>();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const decodedCategory = decodeURIComponent(category || '');
  const categorySchemes = schemes.filter(
    s => s.category.toLowerCase() === decodedCategory.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <button 
          onClick={() => navigate(-1)}
          className="text-primary hover:underline mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">{decodedCategory}</h1>
          <p className="text-muted-foreground">
            {categorySchemes.length} schemes found in this category
          </p>
        </div>

        <div className="grid gap-4">
          {categorySchemes.map((scheme) => (
            <Card key={scheme.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">{scheme.name}</h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant={scheme.type === 'Central' ? 'default' : 'secondary'}>
                        {scheme.type}
                      </Badge>
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

          {categorySchemes.length === 0 && (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">
                No schemes found in this category.
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
      </main>
      
      <Footer />
    </div>
  );
};

export default CategoryView;
