import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  const externalLinks = [
    { name: 'DigiLocker', url: 'https://www.digilocker.gov.in/' },
    { name: 'UMANG', url: 'https://web.umang.gov.in/' },
    { name: 'MyGov', url: 'https://www.mygov.in/' },
    { name: 'Data.gov.in', url: 'https://data.gov.in/' },
    { name: 'India.gov.in', url: 'https://www.india.gov.in/' },
  ];

  return (
    <footer className="bg-secondary text-secondary-foreground">
      {/* Main Footer */}
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4 text-primary">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm hover:text-primary transition-colors">
                  {t('footer.aboutUs')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm hover:text-primary transition-colors">
                  {t('footer.contactUs')}
                </Link>
              </li>
              <li>
                <Link to="/accessibility" className="text-sm hover:text-primary transition-colors">
                  {t('footer.accessibility')}
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-sm hover:text-primary transition-colors">
                  {t('footer.faq')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Middle Column */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4 text-primary">{t('footer.legal')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/disclaimer" className="text-sm hover:text-primary transition-colors">
                  {t('footer.disclaimer')}
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm hover:text-primary transition-colors">
                  {t('footer.termsConditions')}
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-sm hover:text-primary transition-colors">
                  {t('header.dashboard')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Right Column */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4 text-primary">{t('footer.governmentPortals')}</h3>
            <ul className="space-y-2">
              {externalLinks.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm hover:text-primary transition-colors inline-flex items-center gap-1"
                  >
                    {link.name}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-navy-light/30">
        <div className="container py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-secondary-foreground/80">
              {t('footer.copyright')}
            </p>
            <div className="flex items-center gap-4">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" 
                alt="Government of India" 
                className="h-8 brightness-0 invert"
              />
              <img 
                src="https://upload.wikimedia.org/wikipedia/hi/b/ba/Digital_india.png?20180228145721" 
                alt="Digital India" 
                className="h-6 brightness-0 invert"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
