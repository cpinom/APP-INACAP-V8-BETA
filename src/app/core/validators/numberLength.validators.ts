import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function numberLength(min: number, max: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const num = control.value as number;
    const len = Math.ceil(Math.log10(num + 1));
    if (control.value !== undefined && (isNaN(control.value) || checkMin(min, len) || checkMax(max, len))) {
      return { lengthValidator: true };
    }
    else {
      // return { lengthValidator: false};
      return null;
    }
  };
}

function checkMin(min: number, len: number) {
  if (min) {
    return len < min;
  }
  else {
    return false;
  }
}
function checkMax(max: number, len: number) {
  if (max) {
    return len > max;
  }
  else {
    return false;
  }
}
