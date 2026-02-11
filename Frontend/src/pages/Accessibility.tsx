import React from 'react';
import { useTranslation } from 'react-i18next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnimatedSection from '@/components/AnimatedSection';
import { Link } from 'react-router-dom';
import { Eye, Keyboard, Monitor, Volume2, MousePointer, Smartphone } from 'lucide-react';

const Accessibility: React.FC = () => {
  const { t } = useTranslation();

  const features = [
    { icon: Eye, key: 'screenReader' },
    { icon: Keyboard, key: 'keyboard' },
    { icon: Monitor, key: 'contrast' },
    { icon: Volume2, key: 'audio' },
    { icon: MousePointer, key: 'navigation' },
    { icon: Smartphone, key: 'responsive' },
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
                {t('accessibility.title')}
              </h1>
              <p className="text-center mt-4 max-w-2xl mx-auto text-primary-foreground/90">
                {t('accessibility.subtitle')}
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
                  {t('accessibility.commitmentTitle')}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t('accessibility.commitmentDesc')}
                </p>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Accessibility Features Grid */}
        <section className="py-12 bg-background">
          <div className="container">
            <AnimatedSection>
              <h2 className="font-heading text-2xl font-semibold text-foreground mb-8 text-center">
                {t('accessibility.featuresTitle')}
              </h2>
            </AnimatedSection>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {features.map((feature, index) => (
                <AnimatedSection key={index}>
                  <div className="bg-card rounded-lg shadow-sm p-6 h-full border border-border/50 hover:border-primary/30 transition-colors">
                    <div className="flex flex-col items-center text-center">
                      <div className="p-4 bg-primary/10 rounded-full mb-4">
                        <feature.icon className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                        {t(`accessibility.${feature.key}Title`)}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {t(`accessibility.${feature.key}Desc`)}
                      </p>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Standards Compliance */}
        <section className="py-12">
          <div className="container">
            <AnimatedSection>
              <div className="max-w-4xl mx-auto bg-card rounded-lg shadow-sm p-8">
                <h2 className="font-heading text-2xl font-semibold text-foreground mb-4">
                  {t('accessibility.standardsTitle')}
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {t('accessibility.standardsDesc')}
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    {t('accessibility.standard1')}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    {t('accessibility.standard2')}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    {t('accessibility.standard3')}
                  </li>
                </ul>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Feedback Section */}
        <section className="py-12 bg-background">
          <div className="container">
            <AnimatedSection>
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="font-heading text-2xl font-semibold text-foreground mb-4">
                  {t('accessibility.feedbackTitle')}
                </h2>
                <p className="text-muted-foreground mb-4">
                  {t('accessibility.feedbackDesc')}
                </p>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  {t('accessibility.contactUs')}
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Accessibility;
