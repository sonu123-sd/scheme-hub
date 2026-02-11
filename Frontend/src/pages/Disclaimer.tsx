import React from 'react';
import { useTranslation } from 'react-i18next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnimatedSection from '@/components/AnimatedSection';
import { AlertTriangle, FileWarning, Shield, Scale } from 'lucide-react';

const Disclaimer = () => {
  const { t } = useTranslation();

  const sections = [
    {
      icon: AlertTriangle,
      titleKey: 'disclaimer.generalTitle',
      descKey: 'disclaimer.generalDesc',
    },
    {
      icon: FileWarning,
      titleKey: 'disclaimer.accuracyTitle',
      descKey: 'disclaimer.accuracyDesc',
    },
    {
      icon: Shield,
      titleKey: 'disclaimer.liabilityTitle',
      descKey: 'disclaimer.liabilityDesc',
    },
    {
      icon: Scale,
      titleKey: 'disclaimer.legalTitle',
      descKey: 'disclaimer.legalDesc',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        {/* Hero Section */}
        <section className="bg-primary text-primary-foreground py-16">
          <div className="container">
            <AnimatedSection>
              <h1 className="font-heading text-3xl md:text-4xl font-bold text-center">
                {t('disclaimer.title')}
              </h1>
              <p className="text-center mt-4 max-w-2xl mx-auto text-primary-foreground/90">
                {t('disclaimer.subtitle')}
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* Introduction */}
        <section className="py-12">
          <div className="container">
            <AnimatedSection>
              <div className="max-w-4xl mx-auto bg-card rounded-lg shadow-sm p-8">
                <h2 className="font-heading text-2xl font-semibold text-foreground mb-4">
                  {t('disclaimer.introTitle')}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t('disclaimer.introDesc')}
                </p>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Disclaimer Sections */}
        <section className="py-12 bg-background">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {sections.map((section, index) => (
                <AnimatedSection key={index} delay={index * 0.1}>
                  <div className="bg-card rounded-lg shadow-sm p-6 h-full border border-border/50 hover:border-primary/30 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <section.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                          {t(section.titleKey)}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {t(section.descKey)}
                        </p>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Important Notes */}
        <section className="py-12">
          <div className="container">
            <AnimatedSection>
              <div className="max-w-4xl mx-auto">
                <h2 className="font-heading text-2xl font-semibold text-foreground mb-6 text-center">
                  {t('disclaimer.notesTitle')}
                </h2>
                <ul className="space-y-4">
                  {[1, 2, 3, 4].map((num) => (
                    <li key={num} className="flex items-start gap-3 bg-card p-4 rounded-lg shadow-sm">
                      <span className="flex-shrink-0 w-6 h-6 bg-destructive/10 text-destructive rounded-full flex items-center justify-center text-sm font-medium">
                        !
                      </span>
                      <span className="text-muted-foreground">
                        {t(`disclaimer.note${num}`)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Disclaimer;
