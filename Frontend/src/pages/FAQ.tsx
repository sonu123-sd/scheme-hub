import React from 'react';
import { useTranslation } from 'react-i18next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnimatedSection from '@/components/AnimatedSection';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const FAQ = () => {
  const { t } = useTranslation();

  const faqCategories = [
    {
      category: t('faq.generalCategory'),
      questions: [
        { q: t('faq.q1'), a: t('faq.a1') },
        { q: t('faq.q2'), a: t('faq.a2') },
        { q: t('faq.q3'), a: t('faq.a3') },
      ],
    },
    {
      category: t('faq.eligibilityCategory'),
      questions: [
        { q: t('faq.q4'), a: t('faq.a4') },
        { q: t('faq.q5'), a: t('faq.a5') },
        { q: t('faq.q6'), a: t('faq.a6') },
      ],
    },
    {
      category: t('faq.applicationCategory'),
      questions: [
        { q: t('faq.q7'), a: t('faq.a7') },
        { q: t('faq.q8'), a: t('faq.a8') },
        { q: t('faq.q9'), a: t('faq.a9') },
      ],
    },
    {
      category: t('faq.accountCategory'),
      questions: [
        { q: t('faq.q10'), a: t('faq.a10') },
        { q: t('faq.q11'), a: t('faq.a11') },
        { q: t('faq.q12'), a: t('faq.a12') },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-primary text-primary-foreground py-12">
          <div className="container mx-auto px-4 text-center">
            <AnimatedSection>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{t('faq.title')}</h1>
              <p className="text-lg opacity-90 max-w-2xl mx-auto">{t('faq.subtitle')}</p>
            </AnimatedSection>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            {faqCategories.map((category, categoryIndex) => (
              <AnimatedSection key={categoryIndex} delay={categoryIndex * 0.1} className="mb-8">
                <h2 className="text-xl font-semibold text-primary mb-4 border-b border-border pb-2">
                  {category.category}
                </h2>
                <Accordion type="single" collapsible className="w-full">
                  {category.questions.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${categoryIndex}-${index}`}>
                      <AccordionTrigger className="text-left hover:no-underline">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </AnimatedSection>
            ))}

            {/* Still Have Questions */}
            <AnimatedSection delay={0.4} className="mt-12 text-center bg-muted p-8 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">{t('faq.stillHaveQuestions')}</h3>
              <p className="text-muted-foreground mb-4">{t('faq.contactPrompt')}</p>
              <a
                href="/contact"
                className="inline-block bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90 transition-colors"
              >
                {t('footer.contactUs')}
              </a>
            </AnimatedSection>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;
