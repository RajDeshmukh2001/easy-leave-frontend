import { parse } from 'date-fns';

export const parseLocalDate = (date: string): Date => parse(date, 'yyyy-MM-dd', new Date());
