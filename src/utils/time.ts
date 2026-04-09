import { eachDayOfInterval, format } from 'date-fns';
import type { DateRange } from 'react-day-picker';

export const addHours = (timeString: string, hours: number): string => {
  if (!timeString) return '';
  const [h, m] = timeString.split(':').map(Number);
  const date = new Date();
  date.setHours(h + hours, m);
  return date.toTimeString().slice(0, 5);
};

export const getDatesBetween = (range: DateRange | undefined): string[] => {
  const noDatesSelected = !range || !range.from;
  if (noDatesSelected) return [];

  const startDate = range.from;
  const endDate = range.to ?? range.from;
  const allDays = eachDayOfInterval({ start: startDate!, end: endDate! });

  const weekdays = allDays.filter((day) => day.getDay() !== 0 && day.getDay() !== 6);
  const formattedDays = weekdays.map((day) => format(day, 'yyyy-MM-dd'));

  return formattedDays;
};
