import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function dateNotBeforeToday(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const day = control.get('day')?.value;
    const month = control.get('month')?.value;
    const year = control.get('year')?.value;

    if (!day || !month || !year) {
      return null; 
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
      const date = new Date(year, month - 1, day);  

      
      
      const isValidDate = date.getDate() === day && date.getMonth() === month - 1;

      return isValidDate ? null : { invalidDate: true };  
    }
    
    return null;  
  };
}

