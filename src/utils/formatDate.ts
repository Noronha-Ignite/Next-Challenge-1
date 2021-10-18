import { ptBR } from 'date-fns/locale';
import { format } from 'date-fns';

export const formatDate = (date: Date) => {
  return format(date, 'dd MMM yyyy', {
    locale: ptBR,
  });
};

export const formatHours = (date: Date) => {
  return format(date, 'kk:mm', {
    locale: ptBR,
  });
};
