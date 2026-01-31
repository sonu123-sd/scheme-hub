import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import schemes from '@/data/schemes.json';

const TotalSchemes: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [type, setType] = useState('All');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { returnUrl: '/total-schemes' } });
    }
  }, [isAuthenticated, navigate]);

  const filteredSchemes = useMemo(() => {
    const normalizedCategory =
      category === 'All' || category === 'All Categories'
        ? 'all'
        : category.toLowerCase();

    return schemes.filter(s => {
      const matchesSearch =
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.description.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        normalizedCategory === 'all' ||
        s.category.toLowerCase() === normalizedCategory;

      const matchesType = type === 'All' || s.type === type;

      return matchesSearch && matchesCategory && matchesType;
    });
  }, [search, category, type]);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container">
          <h1 className="text-3xl font-heading font-bold mb-6">All Government Schemes</h1>
          <div className="flex flex-wrap gap-4 mb-8">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search schemes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Types</SelectItem>
                <SelectItem value="Central">Central</SelectItem>
                <SelectItem value="State">State</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="text-muted-foreground mb-4">
            Showing {filteredSchemes.length} schemes
          </p>
          <div className="grid gap-4">
            {filteredSchemes.map(scheme => (
              <div
                key={scheme.id}
                onClick={() => navigate(`/scheme/${scheme.id}`)}
                className="bg-card p-5 rounded-xl border border-border hover:shadow-lg cursor-pointer transition-all group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`px-2 py-0.5 text-xs rounded-full ${
                          scheme.type === 'Central'
                            ? 'bg-primary/10 text-primary'
                            : 'bg-accent/10 text-accent'
                        }`}
                      >
                        {scheme.type}
                      </span>
                      {scheme.state && (
                        <span className="text-xs text-muted-foreground">
                          {scheme.state}
                        </span>
                      )}
                    </div>
                    <h3 className="font-heading font-semibold text-lg group-hover:text-primary transition-colors">
                      {scheme.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {scheme.description}
                    </p>
                    <span className="text-xs text-muted-foreground mt-2 inline-block">
                      {scheme.category}
                    </span>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TotalSchemes;
