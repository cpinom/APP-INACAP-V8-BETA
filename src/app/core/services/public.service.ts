import { Injectable } from '@angular/core';
import { CapacitorHttp, HttpOptions } from '@capacitor/core';
import { AppGlobal } from 'src/app/app.global';

@Injectable({
  providedIn: 'root'
})
export class PublicService {

  baseUrl: string = '';
  storagePrefix: string = 'Public-MOVIL';

  constructor(private global: AppGlobal) {
    this.baseUrl = this.global.Api;
  }

  private get = async (url: string) => {
    const options: HttpOptions = {
      url: url,
      responseType: 'json',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const response = await CapacitorHttp.get(options);

      if (response.status == 200) {
        return response.data;
      }
      else {
        return Promise.reject(response);
      }
    }
    catch (error) {
      return Promise.reject(error);
    }
  }

  getContacto() {
    return this.get(`${this.baseUrl}/api/v3/contacto`);
  }

}