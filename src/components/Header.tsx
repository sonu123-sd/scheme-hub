import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Calendar, Globe, Moon, Sun, User, LogOut, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { languages } from '@/i18n';
import { formatDateShort } from '@/i18n/formatters';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isSticky, setIsSticky] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  // Update date every minute for real-time display
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Handle scroll to make header sticky after hero section
  useEffect(() => {
    const handleScroll = () => {
      // Hero section is typically around 500-600px, adjust as needed
      const heroHeight = 400;
      setIsSticky(window.scrollY > heroHeight);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem('language', langCode);
  };

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  return (
    <header className={`bg-navy/85 backdrop-blur-sm text-white shadow-lg transition-all duration-300 ${isSticky ? 'fixed top-0 left-0 right-0 z-50' : ''}`}>
      {/* Top Bar */}
      <div className="border-b border-navy-light/30">
        <div className="container flex items-center justify-between py-2">
          <div className="flex items-center gap-4">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" 
              alt="Ashoka Emblem" 
              className="h-10 w-auto brightness-0 invert"
            />
            <div className="hidden sm:block">
              <Link to="/" className="flex items-center gap-2">
                <h1 className="text-xl font-heading font-bold">
                  <span className="text-primary">Scheme</span>
                  <span className="text-accent"> Hub</span>
                </h1>
              </Link>
              <p className="text-xs text-secondary-foreground/80">{t('header.governmentPortal')}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <img 
              src="https://upload.wikimedia.org/wikipedia/hi/b/ba/Digital_india.png?20180228145721" 
              alt="Digital India" 
              className="h-8 w-auto hidden md:block brightness-0 invert"
            />
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="container py-3">
        <div className="flex items-center justify-between">
          {/* Mobile Logo */}
          <div className="sm:hidden">
            <Link to="/" className="flex items-center gap-2">
              <h1 className="text-lg font-heading font-bold">
                <span className="text-primary">Scheme</span>
                <span className="text-accent"> Hub</span>
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
              {t('header.home')}
            </Link>
            <Link to="/total-schemes" className="text-sm font-medium hover:text-primary transition-colors">
              {t('header.allSchemes')}
            </Link>
            <Link to="/central-schemes" className="text-sm font-medium hover:text-primary transition-colors">
              {t('header.centralSchemes')}
            </Link>
            <Link to="/state-schemes" className="text-sm font-medium hover:text-primary transition-colors">
              {t('header.stateSchemes')}
            </Link>
            <Link to="/eligibility" className="text-sm font-medium hover:text-primary transition-colors">
              {t('header.checkEligibility')}
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="text-secondary-foreground hover:text-primary gap-2 px-2">
                  <Calendar className="h-4 w-4" />
                  <span className="hidden sm:inline text-xs font-medium">
                    {formatDateShort(currentDate)}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={currentDate}
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-secondary-foreground hover:text-primary">
                  <Globe className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {languages.map((lang) => (
                  <DropdownMenuItem 
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className="flex items-center justify-between"
                  >
                    <span>{lang.nativeName}</span>
                    {i18n.language === lang.code && (
                      <Check className="h-4 w-4 text-primary ml-2" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleDarkMode}
              className="text-secondary-foreground hover:text-primary"
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2 text-secondary-foreground hover:text-primary">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">{user?.firstName}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                    <User className="h-4 w-4 mr-2" />
                    {t('header.dashboard')}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    {t('header.logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/login')}
                  className="text-secondary-foreground hover:text-primary"
                >
                  {t('header.login')}
                </Button>
                <Button 
                  size="sm"
                  onClick={() => navigate('/register')}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {t('header.register')}
                </Button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden text-secondary-foreground"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden mt-4 pb-4 border-t border-navy-light/30 pt-4 animate-slide-down">
            <div className="flex flex-col gap-3">
              <Link 
                to="/" 
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('header.home')}
              </Link>
              <Link 
                to="/total-schemes" 
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('header.allSchemes')}
              </Link>
              <Link 
                to="/central-schemes" 
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('header.centralSchemes')}
              </Link>
              <Link 
                to="/state-schemes" 
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('header.stateSchemes')}
              </Link>
              <Link 
                to="/eligibility" 
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('header.checkEligibility')}
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
