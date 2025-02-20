import { inject, Injectable } from '@angular/core';
import { Browser } from '@capacitor/browser';
import { DialogService } from './dialog.service';
import { IOSSettings, NativeSettings } from 'capacitor-native-settings';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  private dialog = inject(DialogService);
  private iab = inject(InAppBrowser);

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
  createImageFromFile(file: any): Promise<any> {
    return new Promise((resolve) => {
      let reader = new FileReader();

      reader.onload = () => {
        resolve(reader.result);
      };

      if (file) {
        reader.readAsDataURL(file);
      }
    })
  }
  async openLink(url: string) {
    return await Browser.open({ url: url });
  }
  openInAppLink(url: string, options?: any) {
    return this.iab.create(url, '_blank', options);
  }
  getUrlParams(name: string, url: string) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(url);
    return results == null ? null : results[1];
  }
  resolverIcono(path: string) {
    const extension = this.getFileExtension(path);
    // Mapeo de extensiones a tipos de íconos
    const iconMap: { [key: string]: string } = {
      // Documentos
      'pdf': 'picture_as_pdf',
      'doc': 'ms-word',
      'docx': 'ms-word',
      'xls': 'ms-excel',
      'xlsx': 'ms-excel',
      'ppt': 'ms-powerpoint',
      'pptx': 'ms-powerpoint',
      'txt': 'description',

      // Imágenes

      // Videos
      'mp4': 'video_library',
      'avi': 'video_library',
      'mkv': 'video_library',
      'mov': 'video_library',
      'wmv': 'video_library',

      // Audios
      'mp3': 'audio_file',
      'wav': 'audio_file',
      'ogg': 'audio_file',

      // Archivos comprimidos
      'zip': 'folder_zip',
      'rar': 'folder_zip',
      '7z': 'folder_zip',
      'tar': 'folder_zip',
      'gz': 'folder_zip',

      // Otros
      'html': 'code',
      'css': 'code',
      'js': 'code',
      'json': 'code',
      'xml': 'code'
    };

    const icon = extension ? iconMap[extension] : 'description';

    return `assets/icon/${icon}.svg`;
  }
  getFileExtension(filePath: string) {
    const lastDotIndex = filePath.lastIndexOf('.');

    if (lastDotIndex === -1 || lastDotIndex === filePath.length - 1) {
      return null; // No tiene extensión o termina con un punto
    }

    return filePath.substring(lastDotIndex + 1).toLowerCase();
  }
  getMimeType(extension: string) {
    // Mapa de extensiones a MIME types
    const mimeTypes: { [key: string]: string } = {
      "jpg": "image/jpeg",
      "jpeg": "image/jpeg",
      "png": "image/png",
      "gif": "image/gif",
      "webp": "image/webp",
      "svg": "image/svg+xml",
      "pdf": "application/pdf",
      "txt": "text/plain",
      "html": "text/html",
      "css": "text/css",
      "js": "application/javascript",
      "json": "application/json",
      "xml": "application/xml",
      "mp4": "video/mp4",
      "mp3": "audio/mpeg",
      "zip": "application/zip",
      "rar": "application/vnd.rar",
      "7z": "application/x-7z-compressed",
      "doc": "application/msword",
      "docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "xls": "application/vnd.ms-excel",
      "xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    };

    return mimeTypes[extension.toLowerCase()] || "application/octet-stream";
  }
  isImage(path: string): boolean {
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg', '.tiff', '.ico'];
    const extension = this.getFileExtension(path);

    // Validar si la extensión está en la lista
    return extension ? validExtensions.includes(`.${extension}`) : false;
  }
  async showAlertCamera(header: string = 'Escanear Código QR') {
    const alert = await this.dialog.showAlert({
      header: header,
      message: 'Permitir que INACAP acceda a la cámara del dispositivo.',
      buttons: [
        {
          text: '"Abrir" Configuración',
          role: 'destructive',
          handler: async () => {
            await NativeSettings.openIOS({
              option: IOSSettings.App,
            });
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });

    return alert;
  }

}
