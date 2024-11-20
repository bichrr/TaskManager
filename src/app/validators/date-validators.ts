import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function dateNotBeforeToday(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const today = new Date();
    const selectedDate = new Date(control.value);

    // Ensure the selected date is not before today
    if (selectedDate < today) {
      return { dateNotBeforeToday: 'Due date cannot be in the past.' };
    }
    return null;
  };
}
