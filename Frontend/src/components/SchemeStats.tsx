import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Building2, MapPin } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import schemes from '@/data/schemes.json';
import AnimatedSection from './AnimatedSection';
import AnimatedItem from './AnimatedItem';

const SchemeStats = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();

  const totalSchemes = schemes.length;
  const centralSchemes = schemes.filter(s => s.type === 'Central').length;
  const stateSchemes = schemes.filter(s => s.type === 'State').length;

  const handleClick = (path) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { returnUrl: path } });
      return;
    }
    navigate(path);
  };

  const stats = [
    {
      icon: FileText,
      count: totalSchemes,
      label: t('stats.totalSchemes'),
      path: '/total-schemes',
      gradient: 'gradient-saffron',
    },
    {
      icon: Building2,
      count: centralSchemes,
      label: t('stats.centralSchemes'),
      path: '/central-schemes',
      gradient: 'gradient-navy',
    },
    {
      icon: MapPin,
      count: stateSchemes,
      label: t('stats.stateSchemes'),
      path: '/state-schemes',
      gradient: 'gradient-green',
    },
  ];

  return (
    <AnimatedSection className="py-12">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <AnimatedItem key={stat.label} index={index} baseDelay={0.1}>
              <button
                onClick={() => handleClick(stat.path)}
                className={`${stat.gradient} rounded-2xl p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-xl group w-full`}
              >
                <div className="flex justify-center mb-4">
                  <div className="bg-white/20 p-4 rounded-full group-hover:scale-110 transition-transform">
                    <stat.icon className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-4xl font-heading font-bold text-white mb-2">
                  {stat.count}
                </h3>
                <p className="text-white/90 font-medium">{stat.label}</p>
              </button>
            </AnimatedItem>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
};

export default SchemeStats;
