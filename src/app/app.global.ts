import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class AppGlobal {
  public Siga = environment.sigaUrl;
  public Api = environment.apiUrl;
  public Version = environment.version;
  public Compilation = environment.compilation;
  public Integration = !environment.production;
  public Environment = environment.environmentTitle;
  public Timeout = 10;
  public DisabledToken = environment.disabledToken;
  public NotificationFlag = false;
  public NotificationTopic = environment.notificationTopic;
}