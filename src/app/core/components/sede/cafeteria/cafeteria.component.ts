import { Component, inject, OnInit } from '@angular/core';
import { FileOpener } from '@capacitor-community/file-opener';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Platform } from '@ionic/angular';
import { DialogService } from 'src/app/core/services/dialog.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { PrivateService } from 'src/app/core/services/http/private.service';

@Component({
  selector: 'app-cafeteria',
  templateUrl: './cafeteria.component.html',
  styleUrls: ['./cafeteria.component.scss'],
})
export class CafeteriaComponent implements OnInit {

  private dialog = inject(DialogService);
  private api = inject(PrivateService);
  private pt = inject(Platform);
  private error = inject(ErrorHandlerService);
  data: any;

  constructor() { }

  ngOnInit() {
    console.log(this.data);
  }
  async descargarMenu() {
    const loading = await this.dialog.showLoading({ message: 'Descargando...' });

    try {
      let params = { apcaNcorr: this.data.apcaNcorr };
      let result = await this.api.descargarMenuCafeteria(params);
      let fileName = 'menu_' + this.data.apcaNcorr + '.pdf';

      if (result.success) {
        if (this.pt.is('mobileweb')) {
          const linkSource = `data:application/pdf;base64,${result.data}`;
          const downloadLink = document.createElement('a');
          downloadLink.href = linkSource;
          downloadLink.download = fileName;
          downloadLink.click();
        }
        else {
          const file = await Filesystem.writeFile({
            path: fileName,
            data: result.data,
            directory: Directory.Cache
          });

          await FileOpener.open({
            filePath: file.uri,
            contentType: 'application/pdf'
          });
        }
      }
    }
    catch (error: any) {
      await this.error.handle(error, undefined, true);
    }
    finally {
      await loading.dismiss();
    }
  }
  async cerrar() {
    await this.dialog.dismissModal();
  }

}
