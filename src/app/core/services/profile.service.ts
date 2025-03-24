import { inject, Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private storagePrefix: string = 'Profile-MOVIL';
  private storage = inject(StorageService);

  constructor() { }

  async setPrincipal(profile: any) {
    await this.setStorage('perfil', profile);
  }
  async getPrincipal() {
    return this.getStorage('perfil');
  }
  async getPrograma() {
    try {
      const principal = await this.getStorage('principal');

      if (principal) {
        return principal.programas[principal.programaIndex];
      }
    }
    catch { }

    return null;
  }
  async getPreferencias() {
    let preferencias = await this.getStorage('preferencias');

    if (!preferencias) {
      return {
        "oscuro": false,
        "movil": {
          "sincronizar_calendario": false,
          "contraste": 0,
          "font_size": 0,
          "font_range": 2,
          "oscuro_automatico": 0,
          "paleta_color": "",
          "notificaciones": {
            "inacapmail": 0,
            "sede": 0,
            "academicas": 0
          },
          "accesos_directos": []
        }
      };
    }

    if (!preferencias.movil || typeof (preferencias.movil) == 'string') {
      preferencias = {
        "oscuro": ('oscuro' in preferencias) ? preferencias.oscuro : false,
        "movil": {
          "sincronizar_calendario": false,
          "contraste": 0,
          "font_size": 0,
          "font_range": 2,
          "oscuro_automatico": 0,
          "paleta_color": "",
          "notificaciones": {
            "inacapmail": 0,
            "sede": 0,
            "academicas": 0
          },
          "accesos_directos": []
        }
      };
    }

    if (!('paleta_color' in preferencias.movil)) {
      preferencias.movil["paleta_color"] = "";
    }

    return preferencias;

  }
  async setStorage(key: string, value: any) {
    this.storage.set(`${this.storagePrefix}-${key}`, value);
  }
  async getStorage(key: string) {
    return this.storage.get(`${this.storagePrefix}-${key}`);
  }
  async removeStorage(key: string): Promise<void> {
    await Preferences.remove({
      key: `${this.storagePrefix}-${key}`,
    });
  }
  async clearStorage() {
    const principal = await this.getStorage('principal');

    if (principal != null && principal.programas) {
      const sedeCcod = principal.programas[principal.programaIndex].sedeCcod;
      await Preferences.remove({ key: `${this.storagePrefix}-dae_${sedeCcod}` });
    }

    await Preferences.remove({ key: `${this.storagePrefix}-status` });
    await Preferences.remove({ key: `${this.storagePrefix}-principal` });
    await Preferences.remove({ key: `${this.storagePrefix}-perfil` });
    await Preferences.remove({ key: `${this.storagePrefix}-profile` });
    await Preferences.remove({ key: `${this.storagePrefix}-preferencias` });
    await Preferences.remove({ key: `${this.storagePrefix}-privacyMode` });
    await Preferences.remove({ key: `${this.storagePrefix}-buscadorDocentes` });
    await Preferences.remove({ key: `${this.storagePrefix}-filtros-empleos` });
    await Preferences.remove({ key: `${this.storagePrefix}-sync_cal` });
    await Preferences.remove({ key: `${this.storagePrefix}-actualizaDatos` });
    await Preferences.remove({ key: `${this.storagePrefix}-estadoFotoPerfil` });
  }
  applyFontSize(fontSizeRange: number) {
    if (fontSizeRange == 0) {
      this.toggleBodyClass('small', true);
      this.toggleBodyClass('small-1');
      this.toggleBodyClass('large', true);
      this.toggleBodyClass('large-1', true);
    }
    else if (fontSizeRange == 1) {
      this.toggleBodyClass('small');
      this.toggleBodyClass('small-1', true);
      this.toggleBodyClass('large', true);
      this.toggleBodyClass('large-1', true);
    }
    else if (fontSizeRange == 2) {
      this.toggleBodyClass('small', true);
      this.toggleBodyClass('small-1', true);
      this.toggleBodyClass('large', true);
      this.toggleBodyClass('large-1', true);
    }
    else if (fontSizeRange == 3) {
      this.toggleBodyClass('small', true);
      this.toggleBodyClass('small-1', true);
      this.toggleBodyClass('large');
      this.toggleBodyClass('large-1', true);
    }
    else if (fontSizeRange == 4) {
      this.toggleBodyClass('small', true);
      this.toggleBodyClass('small-1', true);
      this.toggleBodyClass('large', true);
      this.toggleBodyClass('large-1');
    }
  }
  toggleBodyClass(cls: string, remove?: boolean) {
    let result = remove === true ? true : document.body.classList.contains(cls);
    document.body.classList.toggle(cls, !result);
  }
  toggleDarkMode(darkMode: boolean) {
    document.body.classList.toggle('dark', darkMode);
  }
  isDarkMode() {
    return document.body.classList.contains('dark');
  }
  removeAllClassname() {
    this.toggleBodyClass('dark', true);
    this.toggleBodyClass('large', true);
    this.toggleBodyClass('contrast', true);
    this.toggleBodyClass('small', true);
    this.toggleBodyClass('small-1', true);
    this.toggleBodyClass('large', true);
    this.toggleBodyClass('large-1', true);
    this.toggleBodyClass('blue', true);
    this.toggleBodyClass('purple', true);
    this.toggleBodyClass('violet', true);
    this.toggleBodyClass('orange', true);
    this.toggleBodyClass('green', true);
  }

}
