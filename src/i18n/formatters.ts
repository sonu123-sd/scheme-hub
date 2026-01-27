import i18n from 'i18next';

// Locale mapping for Intl formatters
const localeMap: Record<string, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  mr: 'mr-IN',
  gu: 'gu-IN',
};

// Get current locale for formatting
export const getCurrentLocale = () => localeMap[i18n.language] || 'en-IN';

// Format numbers with locale-specific formatting
export const formatNumber = (num: number, options?: Intl.NumberFormatOptions) => {
  return new Intl.NumberFormat(getCurrentLocale(), options).format(num);
};

// Format currency (INR)
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat(getCurrentLocale(), {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format date with locale
export const formatDate = (date: Date | string, options?: Intl.DateTimeFormatOptions) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(getCurrentLocale(), {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    ...options,
  }).format(dateObj);
};

// Format date short (dd MMM yyyy)
export const formatDateShort = (date: Date | string) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(getCurrentLocale(), {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(dateObj);
};

// Format time
export const formatTime = (date: Date | string) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(getCurrentLocale(), {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(dateObj);
};

// Format relative time (e.g., "2 days ago")
export const formatRelativeTime = (date: Date | string) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  const rtf = new Intl.RelativeTimeFormat(getCurrentLocale(), { numeric: 'auto' });
  
  if (diffDays === 0) {
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours === 0) {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return rtf.format(-diffMins, 'minute');
    }
    return rtf.format(-diffHours, 'hour');
  }
  if (diffDays < 30) return rtf.format(-diffDays, 'day');
  if (diffDays < 365) return rtf.format(-Math.floor(diffDays / 30), 'month');
  return rtf.format(-Math.floor(diffDays / 365), 'year');
};

// Format age with localized "years" text
export const formatAge = (age: number, t: (key: string) => string) => {
  return `${formatNumber(age)} ${t('common.years')}`;
};

// Format percentage
export const formatPercent = (value: number) => {
  return new Intl.NumberFormat(getCurrentLocale(), {
    style: 'percent',
    maximumFractionDigits: 0,
  }).format(value / 100);
};
