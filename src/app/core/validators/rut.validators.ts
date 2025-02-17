import { AbstractControl } from '@angular/forms';

export function ValidateRut(control: AbstractControl): any {
  if (!control.value) {
    return null;
  }

  if (!validate(control.value)) {
    return { 'rut': true };
  }

  return null;
}

export class RutValidator {

  static formatear(rut: string) {
    if (validate(rut)) {
      return format(rut);
    }
    return rut;
  }

  static limpiar(rut: string) {
    return clean(rut);
  }

  static validar(rut: string) {
    return validate(rut);
  }

}

function validate(rut: any) {
  if (typeof rut !== 'string') {
    return false;
  }

  // Elimina puntos y guiones
  rut = rut.replace(/\./g, '').replace(/-/g, '');

  // Expresión regular para validar el formato del RUT
  const rutRegex = /^[0-9]{7,8}[0-9kK]{1}$/;

  // Verifica el formato con la expresión regular
  if (!rutRegex.test(rut)) {
    return false;
  }

  // Separa número y dígito verificador
  const rutNum = parseInt(rut.slice(0, -1), 10);
  const dv = rut.slice(-1).toUpperCase();

  // Verifica si el número es mayor a 4 millones
  if (rutNum < 4000000) {
    return false;
  }

  // Calcula el dígito verificador
  let suma = 0;
  let multiplicador = 2;

  for (let i = rut.length - 2; i >= 0; i--) {
    suma += parseInt(rut.charAt(i)) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }

  const dvCalculado = 11 - (suma % 11);
  const dvEsperado = dvCalculado === 11 ? '0' : dvCalculado === 10 ? 'K' : dvCalculado.toString();

  // Verifica si el dígito verificador es correcto
  return dv === dvEsperado;

  /*if (!/^0*(\d{1,3}(\.?\d{3})*)-?([\dkK])$/.test(rut)) {
    return false;
  }

  rut = clean(rut);

  let t = parseInt(rut.slice(0, -1), 10);
  let m = 0;
  let s = 1;

  while (t > 0) {
    s = (s + (t % 10) * (9 - m++ % 6)) % 11;
    t = Math.floor(t / 10);
  }

  const v = s > 0 ? '' + (s - 1) : 'K';
  return v === rut.slice(-1);*/
}

function clean(rut: any) {
  return typeof rut === 'string' ? rut.replace(/^0+|[^0-9kK]+/g, '').toUpperCase() : '';
}

function format(rut: any) {
  rut = clean(rut);

  let result = rut.slice(-4, -1) + '-' + rut.substr(rut.length - 1);

  for (let i = 4; i < rut.length; i += 3) {
    result = rut.slice(-3 - i, -i) + '.' + result;
  }

  return result;
}
