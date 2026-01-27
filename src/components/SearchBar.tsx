import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const categories = [
  'All Categories',
  'Agriculture, Rural & Environment',
  'Banking, Financial Services & Insurance',
  'Business & Entrepreneurship',
  'Education & Learning',
  'Health & Wellness',
  'Housing & Shelter',
  'Skills & Employment',
  'Social Welfare & Empowerment',
  'Travel & Tourism',
  'Utility & Sanitation',
  'Women & Child',
];

const trendingTags = [
  'PM-KISAN',
  'Ayushman Bharat',
  'MUDRA Yojana',
  'Skill India',
  'Startup India',
];

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSearch = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { returnUrl: '/total-schemes', searchQuery, category: selectedCategory } });
      return;
    }
    navigate(`/total-schemes?search=${encodeURIComponent(searchQuery)}&category=${encodeURIComponent(selectedCategory)}`);
  };

  const handleTagClick = (tag) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { returnUrl: '/total-schemes', searchQuery: tag } });
      return;
    }
    navigate(`/total-schemes?search=${encodeURIComponent(tag)}`);
  };

  return (
    <div className="relative -mt-20 z-10">
      <div className="container">
        <div className="bg-card rounded-2xl shadow-xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder={t('home.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10 h-12 text-lg border-border"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-[250px] h-12">
                <SelectValue placeholder={t('home.allCategories')} />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === 'All Categories' ? t('home.allCategories') : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              onClick={handleSearch}
              className="h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            >
              <Search className="h-5 w-5 mr-2" />
              {t('home.search')}
            </Button>
          </div>

          {/* Trending Tags */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">{t('home.trending')}:</span>
            {trendingTags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className="px-3 py-1 text-sm bg-muted hover:bg-primary hover:text-primary-foreground rounded-full transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
