import { validateRaiseRequestForm } from '@/utils/raiseRequestForm';
import type { RaiseRequestFormValues } from '@/types/request';

const validPastLeaveValues: RaiseRequestFormValues = {
  requestType: 'PAST_LEAVE',
  leaveCategoryId: 'category-1',
  dateRange: { from: new Date('2026-03-10'), to: new Date('2026-03-10') },
  duration: 'FULL_DAY',
  startTime: '09:00',
  description: 'Forgot to log sick leave',
};

describe('validateRaiseRequestForm', () => {
  test('should return error when PAST_LEAVE has no leave category', () => {
    const result = validateRaiseRequestForm({
      ...validPastLeaveValues,
      leaveCategoryId: '',
    });
    expect(result.leaveCategoryId).toBe('Select a leave category');
  });

  test('should return error when dateRange is undefined', () => {
    const result = validateRaiseRequestForm({
      ...validPastLeaveValues,
      dateRange: undefined,
    });
    expect(result.dateRange).toBe('Select a date');
  });

  test('should return error when description is empty', () => {
    const result = validateRaiseRequestForm({
      ...validPastLeaveValues,
      description: '',
    });
    expect(result.description).toBe('Reason is required');
  });

  test('should return error when description exceeds 1000 characters', () => {
    const result = validateRaiseRequestForm({
      ...validPastLeaveValues,
      description: 'a'.repeat(1500),
    });
    expect(result.description).toBe('Reason cannot be over 1000 characters');
  });
});
