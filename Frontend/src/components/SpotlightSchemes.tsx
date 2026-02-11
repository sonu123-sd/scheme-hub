import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import schemes from '@/data/schemes.json';
import AnimatedSection from './AnimatedSection';
import AnimatedItem from './AnimatedItem';

const spotlightSchemeIds = ['pm-kisan', 'ayushman-bharat', 'mudra-yojana', 'skill-india'];

const SpotlightSchemes = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();

  const spotlightSchemes = schemes.filter(s => spotlightSchemeIds.includes(s.id));

  const handleSchemeClick = (schemeId) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { returnUrl: `/scheme/${schemeId}` } });
      return;
    }
    navigate(`/scheme/${schemeId}`);
  };

  return (
    <section className="py-12 bg-gradient-to-b from-muted/30 to-background">
      <div className="container">
        <AnimatedSection className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Star className="h-8 w-8 text-primary fill-primary" />
            <div>
              <h2 className="text-3xl font-heading font-bold text-foreground">
                {t('schemes.spotlight')}
              </h2>
              <p className="text-muted-foreground">
                {t('schemes.spotlightSubtitle')}
              </p>
            </div>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {spotlightSchemes.map((scheme, index) => (
            <AnimatedItem key={scheme.id} index={index} baseDelay={0.15}>
              <div
                onClick={() => handleSchemeClick(scheme.id)}
                className="bg-card rounded-xl overflow-hidden border border-border hover:shadow-xl transition-all duration-300 cursor-pointer group h-full"
              >
                <div className="h-32 gradient-hero relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-6xl font-heading font-bold text-white/20">
                      {scheme.name.charAt(0)}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                    <span className="text-xs font-medium text-white">
                      {scheme.type === 'Central' ? t('schemes.central') : t('schemes.state')}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-heading font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {scheme.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {scheme.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs px-2 py-1 bg-accent/10 text-accent rounded-full">
                      {scheme.category.split(',')[0]}
                    </span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </div>
            </AnimatedItem>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpotlightSchemes;
