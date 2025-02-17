import { AbstractControl } from '@angular/forms';

export function ValidatePatenteMoto(control: AbstractControl): any {
  if (!control.value) return null;

  let patente = control.value.replace(/\W+/g, "").toUpperCase();

  if (!patente) return null;

  let esAntigua = patente.match(/^[a-z]{2}[\.\]?[0-9]{3,4}$/i);
  let esNueva = patente.match(/^[a-z]{3}[\-\.]??[0-9]{2,3}$/i);

  if (!esAntigua && !esNueva) return { 'patente': true };

  return null;
}

export function ValidatePatenteAuto(control: AbstractControl): any {
  if (!control.value) return null;

  let patente = control.value.replace(/\W+/g, "").toUpperCase();

  if (!patente) return null;

  //debugger
  let esAntigua = patente.match(/^[A-Za-z]{2}[0-9]{4}$/i);
  let esNueva = patente.match(/^[A-Za-z]{4}[0-9]{2}$/i);

  // let esAntigua = patente.match(/^[a-z]{2}[\.\]?[0-9]{2}[\.\]?[0-9]{2}$/i);
  // let esNueva = patente.match(/^[b-d,f-h,j-l,p,r-t,v-z]{2}[\-\.]?[b-d,f-h,j-l,p,r-t,v-z]{2}[\.\]?[0-9]{2}$/i);

  if (!esAntigua && !esNueva) return { 'patente': true };

  return null;
}
