import { describe, test, expect } from 'vitest';
import { getDatesBetween, addHours } from './time';
import type { DateRange } from 'react-day-picker';

describe('getDatesBetween', () => {
  test('should return empty array when range is undefined', () => {
    expect(getDatesBetween(undefined)).toEqual([]);
  });

  test('should return a single weekday when only from date is given', () => {
    const range: DateRange = {
      from: new Date('2026-04-06'),
      to: undefined,
    };

    expect(getDatesBetween(range)).toEqual(['2026-04-06']);
  });

  test('should return multiple dates in date range', () => {
    const range: DateRange = {
      from: new Date('2026-04-06'),
      to: new Date('2026-04-08'),
    };

    expect(getDatesBetween(range)).toEqual(['2026-04-06', '2026-04-07', '2026-04-08']);
  });

  test('should exclude weekends', () => {
    const range: DateRange = {
      from: new Date('2026-04-03'),
      to: new Date('2026-04-06'),
    };

    expect(getDatesBetween(range)).toEqual(['2026-04-03', '2026-04-06']);
  });

  test('should return only weekend dates when includeWeekends is true', () => {
    const range: DateRange = {
      from: new Date('2026-04-03'),
      to: new Date('2026-04-06'),
    };
    expect(getDatesBetween(range, true)).toEqual(['2026-04-04', '2026-04-05']);
  });
});

describe('addHours', () => {
  test('should return empty string if timeString is empty', () => {
    expect(addHours('', 2)).toBe('');
  });
});
