import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function dateNotBeforeToday(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const day = control.get('day')?.value;
    const month = control.get('month')?.value;
    const year = control.get('year')?.value;

    if (!day || !month || !year) {
      return null; // Let the other validators handle empty inputs
    }

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const userDate = new Date(year, month - 1, day); 

    if (userDate < currentDate) {
      return { dateNotBeforeToday: true }; 
    }

    return null; 
  };
}

export function dateNotValidForMonth(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const day = control.get('day')?.value;
    const month = control.get('month')?.value;
    const year = control.get('year')?.value;
    
    if (day && month && year) {
      const date = new Date(year, month - 1, day);  // month is 0-indexed, hence subtract 1

      // If the day doesn't match the month-year, it will fix the date
      // For example, if day=31, month=2 (February), it will adjust the date to March
      const isValidDate = date.getDate() === day && date.getMonth() === month - 1;

      return isValidDate ? null : { invalidDate: true };  // invalidDate error if the day is invalid
    }
    
    return null;  // No error if day, month, or year is missing
  };
}

