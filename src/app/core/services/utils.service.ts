import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  divideBase64(base64: string, maxSize: number = 3 * 1024 * 1024): string[] {
    // Calcular el tamaño en caracteres para que corresponda a maxSize en bytes
    const chunkSize = Math.floor(maxSize * 4 / 3);
    const base64Data = base64.includes(",") ? base64.split(",")[1] : base64;
    const fragments: string[] = [];

    for (let i = 0; i < base64Data.length; i += chunkSize) {
      fragments.push(base64Data.substring(i, i + chunkSize));
    }

    return fragments;
  }
  fileToBase64(file: any): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      // Cuando se haya leído el archivo, se ejecutará onload
      reader.onload = () => {
        const base64String = reader.result as string; // Asegurarse de que el resultado sea una cadena
        resolve(base64String);
      };

      // En caso de error, rechazar la promesa
      reader.onerror = (error) => {
        reject(error);
      };

      // Leer el archivo como Data URL (Base64)
      reader.readAsDataURL(file);
    });
  }

}
