import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale/es';

export const formatDate = (date: string | Date, formatStr: string = 'dd/MM/yyyy'): string => {
  try {
    let dateObj: Date;
    
    if (typeof date === 'string') {
      // Parse ISO string
      dateObj = parseISO(date);
      
      // If it's a date-only string (YYYY-MM-DD) without time, treat as local date
      // to avoid timezone conversion issues
      if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        const [year, month, day] = date.split('-').map(Number);
        dateObj = new Date(year, month - 1, day);
      }
    } else {
      dateObj = date;
    }
    
    return format(dateObj, formatStr, { locale: es });
  } catch {
    return '-';
  }
};

export const formatDateTime = (date: string | Date): string => {
  return formatDate(date, 'dd/MM/yyyy HH:mm');
};

export const formatPercentage = (value: number, total: number): string => {
  if (total === 0) return '0%';
  return `${Math.round((value / total) * 100)}%`;
};

