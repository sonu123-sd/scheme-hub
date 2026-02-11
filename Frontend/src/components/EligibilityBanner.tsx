import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import AnimatedSection from './AnimatedSection';

const EligibilityBanner = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <AnimatedSection className="py-8" direction="up">
      <div className="container">
        <div className="gradient-hero rounded-2xl p-8 md:p-12 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
          </div>

          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                <CheckCircle className="h-6 w-6 text-accent" />
                <span className="text-accent font-semibold">{t('header.governmentPortal')}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-2">
                {t('eligibility.bannerTitle')}
              </h2>
              <p className="text-white/80">
                {t('eligibility.bannerDescription')}
              </p>
            </div>
            
            <Button
              onClick={() => navigate('/eligibility')}
              size="lg"
              className="bg-white text-secondary hover:bg-white/90 font-semibold group"
            >
              {t('eligibility.checkNow')}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
};

export default EligibilityBanner;
