import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import type { DateRange } from 'react-day-picker';

type DatePickerProps = {
  date?: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
  className?: string;
};

export const DatePicker = ({ date, setDate, className }: DatePickerProps): React.JSX.Element => {
  const today = new Date();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          id="date-picker-range"
          className={cn('justify-start px-2.5 font-normal', className)}
        >
          <CalendarIcon />
          {date?.from ? (
            date.to ? (
              <>
                {format(date.from, 'LLL dd, y')} - {format(date.to, 'LLL dd, y')}
              </>
            ) : (
              format(date.from, 'LLL dd, y')
            )
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 " align="start">
        <Calendar
          mode="range"
          defaultMonth={today}
          selected={date}
          onSelect={setDate}
          numberOfMonths={1}
          disabled={{ dayOfWeek: [0, 6] }}
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
