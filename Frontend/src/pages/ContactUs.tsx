import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnimatedSection from '@/components/AnimatedSection';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import api from "@/utils/api";

const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters'),

  email: z
    .string()
    .trim()
    .email('Invalid email address')
    .max(255, 'Email must be less than 255 characters'),

  phone: z
    .string()
    .trim()
    .optional()
    .refine(
      (val) => !val || /^[6-9]\d{9}$/.test(val),
      { message: 'Enter valid 10 digit mobile number' }
    ),

  subject: z
    .string()
    .trim()
    .min(1, 'Subject is required')
    .max(200, 'Subject must be less than 200 characters'),

  message: z
    .string()
    .trim()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must be less than 1000 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

const ContactUs = () => {
  const { t } = useTranslation();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      await api.post("/contact", {
        fullName: data.name,
        email: data.email,
        phone: data.phone || "",
        subject: data.subject,
        message: data.message,
      });

      toast({
        title: t('contact.successTitle'),
        description: t('contact.successMessage'),
      });

      reset();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: t('contact.address'),
      content: t('contact.addressContent'),
    },
    {
      icon: Phone,
      title: t('contact.phone'),
      content: '+91 1800-XXX-XXXX',
    },
    {
      icon: Mail,
      title: t('contact.email'),
      content: 'support@schemehub.gov.in',
    },
    {
      icon: Clock,
      title: t('contact.workingHours'),
      content: t('contact.workingHoursContent'),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-navy text-white py-16">
          <div className="container">
            <AnimatedSection>
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-center">
                {t('contact.title')}
              </h1>
              <p className="text-center text-secondary-foreground/80 mt-4 max-w-2xl mx-auto">
                {t('contact.subtitle')}
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* Contact Content */}
        <section className="py-12 md:py-16">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Contact Form */}
              <AnimatedSection delay={0.1}>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl font-heading">
                      {t('contact.formTitle')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                      {/* Name */}
                      <div className="space-y-2">
                        <Label htmlFor="name">{t('contact.nameLabel')}</Label>
                        <Input
                          id="name"
                          placeholder={t('contact.namePlaceholder')}
                          {...register('name')}
                          className={errors.name ? 'border-destructive' : ''}
                        />
                        {errors.name && (
                          <p className="text-sm text-destructive">{errors.name.message}</p>
                        )}
                      </div>

                      {/* Email */}
                      <div className="space-y-2">
                        <Label htmlFor="email">{t('contact.emailLabel')}</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder={t('contact.emailPlaceholder')}
                          {...register('email')}
                          className={errors.email ? 'border-destructive' : ''}
                        />
                        {errors.email && (
                          <p className="text-sm text-destructive">{errors.email.message}</p>
                        )}
                      </div>

                      {/* Phone */}
                      <div className="space-y-2">
                        <Label htmlFor="phone">{t('contact.phone')}</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="Enter mobile number"
                          {...register('phone')}
                          className={errors.phone ? 'border-destructive' : ''}
                        />
                        {errors.phone && (
                          <p className="text-sm text-destructive">{errors.phone.message}</p>
                        )}
                      </div>

                      {/* Subject */}
                      <div className="space-y-2">
                        <Label htmlFor="subject">{t('contact.subjectLabel')}</Label>
                        <Input
                          id="subject"
                          placeholder={t('contact.subjectPlaceholder')}
                          {...register('subject')}
                          className={errors.subject ? 'border-destructive' : ''}
                        />
                        {errors.subject && (
                          <p className="text-sm text-destructive">{errors.subject.message}</p>
                        )}
                      </div>

                      {/* Message */}
                      <div className="space-y-2">
                        <Label htmlFor="message">{t('contact.messageLabel')}</Label>
                        <Textarea
                          id="message"
                          placeholder={t('contact.messagePlaceholder')}
                          rows={5}
                          {...register('message')}
                          className={errors.message ? 'border-destructive' : ''}
                        />
                        {errors.message && (
                          <p className="text-sm text-destructive">{errors.message.message}</p>
                        )}
                      </div>

                      <Button type="submit" className="w-full" disabled={isSubmitting}>
                        <Send className="h-4 w-4 mr-2" />
                        {isSubmitting ? t('contact.sending') : t('contact.send')}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </AnimatedSection>

              {/* Contact Info */}
              <AnimatedSection delay={0.2}>
                <div className="space-y-6">
                  <h2 className="text-xl font-heading font-semibold">
                    {t('contact.infoTitle')}
                  </h2>

                  <div className="grid gap-4">
                    {contactInfo.map((item, index) => (
                      <Card key={index}>
                        <CardContent className="flex items-start gap-4 p-4">
                          <div className="p-3 bg-primary/10 rounded-lg">
                            <item.icon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium">{item.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {item.content}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ContactUs;
