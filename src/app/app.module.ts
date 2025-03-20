import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginPageModule } from './core/components/login/login.module';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { PagosModule } from './core/components/pagos/pagos.module';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { FingerprintAIO } from '@awesome-cordova-plugins/fingerprint-aio/ngx';
import { initializeApp } from "firebase/app";
import { environment } from 'src/environments/environment.proxy';

initializeApp(environment.firebase);

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot({
      // mode: 'ios',
      innerHTMLTemplatesEnabled: true
    }),
    AppRoutingModule,
    LoginPageModule,
    PagosModule
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideAnimationsAsync(),
    InAppBrowser,
    FingerprintAIO
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
