export interface Auth {
  access_token: string,
  expires: number,
  expiration_date: moment.Moment,
  user: User,
  sedeImagen: string,
  perfilImagen: string,
  perfil: string,
  moodle: any
}

export interface User {
  esAlumno: boolean,
  esDocente: boolean,
  esExalumno: boolean,
  persNrut: string,
  sedeUsuario: string,
  data: any,
  perfil?: string
}

export interface Ingreso {
  uuid: any,
  sedeCcod: any,
  carrCcod: any,
  diacTtipo: any,
  time: number,
  callback: Function
}

export interface Salida {
  uuid: any
}

export enum Rol {
  alumno = 1,
  docente = 2,
  exalumno = 3,
  anonimo = -1
}

export interface AppEvent {
  /**Acción que propagará el evento */
  action: string,
  index?: number,
  ev?: any,
  prop?: any,
  value?: any
}