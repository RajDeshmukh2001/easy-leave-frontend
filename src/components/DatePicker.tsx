import { format, startOfMonth } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import type { DateRange, Matcher } from 'react-day-picker';

type DatePickerProps = {
  date?: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
  mode?: 'range' | 'single';
  className?: string;
  disabledDays?: Matcher | Matcher[];
};

export const DatePicker = ({
  date,
  setDate,
  mode,
  className,
  disabledDays = [{ before: startOfMonth(new Date()) }, { dayOfWeek: [0, 6] }],
}: DatePickerProps): React.JSX.Element => {
  const today = new Date();

  const handleSingleSelect = (selected: Date | undefined) => {
    setDate(selected ? { from: selected, to: selected } : undefined);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          id="date-range-picker"
          aria-labelledby="date-range-label"
          className={cn('justify-start px-2.5 font-normal', className)}
        >
          <CalendarIcon />
          {date?.from ? (
            mode === 'range' && date.to ? (
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
        {mode === 'range' ? (
          <Calendar
            mode="range"
            defaultMonth={today}
            selected={date}
            onSelect={setDate}
            numberOfMonths={1}
            disabled={disabledDays}
          />
        ) : (
          <Calendar
            mode="single"
            defaultMonth={today}
            selected={date?.from}
            onSelect={handleSingleSelect}
            numberOfMonths={1}
            disabled={disabledDays}
          />
        )}
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
