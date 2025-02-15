import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { PublicService } from '../../services/public.service';
import { EventsService } from '../../services/events.service';
import { Directory, Filesystem } from '@capacitor/filesystem';
import * as desconocido from 'src/scripts/foto.desconocido';

@Component({
  selector: 'avatar-comp',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent implements OnInit {

  @Input('buttonConfig') buttonConfig: any;
  @Output() buttonFn: EventEmitter<any> = new EventEmitter();
  private auth = inject(AuthService);
  private publicApi = inject(PublicService);
  private events = inject(EventsService);
  private imgSrc!: string;
  public isLoading!: boolean;
  private subscription: Subscription;

  constructor() {
    this.buttonConfig = this.buttonConfig || {};

    this.subscription = this.events.app.subscribe((event: any) => {
      if (event.action == 'app:auth-notify-property') {
        this.onAuthNotifyProp({ prop: event.prop });
      }
    });
  }
  ngOnInit() {
    this.refresh();
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  onAuthNotifyProp(obj: any) {
    if (obj.prop == 'perfilImagen') {
      this.refresh();
    }
  }
  async refresh() {
    const tokenValid = await this.auth.isAuthenticated();
    const auth = await this.auth.getAuth();

    if (tokenValid) {
      try {
        let result = await Filesystem.readFile({
          path: 'CACHED-IMG/' + auth.user.data.persNcorr,
          directory: Directory.Cache
        })

        this.imgSrc = 'data:image/png;base64,' + result.data;
        this.isLoading = false;
      }
      catch (error) {
        this.imgSrc = await this.syncAvatar(auth.user);
      }
    }
  }
  buttonTap(e?: any) {
    this.buttonFn.emit();
  }
  get img() {
    return this.imgSrc;
  }
  get icon() {
    return this.buttonConfig.icon ? this.buttonConfig.icon : 'photo_camera';
  }
  get iconPath() {
    return 'assets/icon/' + this.icon + '.svg';
  }
  get iconColor() {
    return this.buttonConfig.color ? this.buttonConfig.color : '';
  }
  get showButton() {
    return this.buttonConfig.show === true;
  }
  get showVerified() {
    return this.buttonConfig.verified === true;
  }
  private async syncAvatar(user: any) {
    let url = `imagen-persona/${user.data.persNcorr}`;
    let imgData;

    this.isLoading = true;

    try {
      imgData = 'data:image/png;base64,' + await this.publicApi.getImage(url);
    }
    catch (error) {
      imgData = desconocido.imgBase64;
    }

    try {
      await Filesystem.writeFile({
        path: `CACHED-IMG/${user.data.persNcorr}`,
        data: imgData,
        directory: Directory.Cache
      });
    }
    catch { }
    finally {
      this.isLoading = false;
    }

    return imgData;
  }

}
