import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Tractor, Building2, Briefcase, GraduationCap, Heart, Home,
  Shield, Wifi, Wrench, Users, Trophy, Car, Plane, Droplets, Baby
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import schemes from '@/data/schemes.json';
import AnimatedSection from './AnimatedSection';
import AnimatedItem from './AnimatedItem';

const categoryIcons = {
  'Agriculture, Rural & Environment': Tractor,
  'Banking, Financial Services & Insurance': Building2,
  'Business & Entrepreneurship': Briefcase,
  'Education & Learning': GraduationCap,
  'Health & Wellness': Heart,
  'Housing & Shelter': Home,
  'Public Safety': Shield,
  'IT & Communication': Wifi,
  'Skills & Employment': Wrench,
  'Social Welfare & Empowerment': Users,
  'Sports & Culture': Trophy,
  'Transport & Infrastructure': Car,
  'Travel & Tourism': Plane,
  'Utility & Sanitation': Droplets,
  'Women & Child': Baby,
};

const categories = [
  'Agriculture, Rural & Environment',
  'Banking, Financial Services & Insurance',
  'Business & Entrepreneurship',
  'Education & Learning',
  'Health & Wellness',
  'Housing & Shelter',
  'Skills & Employment',
  'Social Welfare & Empowerment',
  'Sports & Culture',
  'Transport & Infrastructure',
  'Travel & Tourism',
  'Utility & Sanitation',
  'Women & Child',
];

const CategoryGrid = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();

  const getCategoryCount = (category) => {
    return schemes.filter(s => 
      s.category.toLowerCase().includes(category.toLowerCase().split(' ')[0])
    ).length;
  };

  const handleCategoryClick = (category) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { returnUrl: `/total-schemes?category=${encodeURIComponent(category)}` } });
      return;
    }
    navigate(`/total-schemes?category=${encodeURIComponent(category)}`);
  };

  return (
    <section className="py-12 bg-muted/50">
      <div className="container">
        <AnimatedSection className="text-center mb-10">
          <h2 className="text-3xl font-heading font-bold text-foreground mb-2">
            {t('categories.title')}
          </h2>
          <p className="text-muted-foreground">
            {t('categories.subtitle')}
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {categories.map((category, index) => {
            const Icon = categoryIcons[category] || Users;
            const count = getCategoryCount(category);
            
            return (
              <AnimatedItem key={category} index={index} baseDelay={0.1}>
                <button
                  onClick={() => handleCategoryClick(category)}
                  className="bg-card rounded-xl p-4 text-center transition-all duration-300 hover:scale-105 hover:shadow-lg group border border-border w-full h-full"
                >
                  <div className="flex justify-center mb-3">
                    <div className="bg-primary/10 p-3 rounded-full group-hover:bg-primary group-hover:scale-110 transition-all">
                      <Icon className="h-6 w-6 text-primary group-hover:text-primary-foreground" />
                    </div>
                  </div>
                  <h3 className="text-sm font-medium text-foreground mb-1 line-clamp-2">
                    {category.split(',')[0]}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {count} {count === 1 ? 'Scheme' : 'Schemes'}
                  </p>
                </button>
              </AnimatedItem>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
