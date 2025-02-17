import { FormControl } from '@angular/forms';

export function ValidateTelefono(control: FormControl): any {

  const value = control.value;
  const phoneno = /^\+?([0-9]{2})\)?[- ]?([0-9]{1})[- ]?([0-9]{4})[- ]?([0-9]{4})$/;

  if (value && !value.match(phoneno)) {
    return { 'telefono': true };
  }

  return null;
}
