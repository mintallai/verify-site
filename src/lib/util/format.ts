import parseISO from 'date-fns/parseISO';
import format from 'date-fns/format';

export function asDate(date: Date | string): Date {
  return typeof date === 'string' ? parseISO(date) : date;
}

export function formatDate(date: Date | string): string {
  return format(asDate(date), 'MM/dd/yyyy');
}

export function formatTime(date: Date | string): string {
  return format(asDate(date), 'h:mm aa');
}
