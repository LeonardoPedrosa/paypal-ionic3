import { SacolaPage } from './../pages/sacola/sacola';
import { SplashPage } from './../pages/splash/splash';
import { ProdutosPage } from './../pages/produtos/produtos';
import { PayPal } from '@ionic-native/paypal';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpServicesProvider } from '../providers/http-services/http-services';
import { Http, HttpModule } from '@angular/http';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    ProdutosPage,
    SplashPage,
    TabsPage,
    SacolaPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    ProdutosPage,
    TabsPage,
    SplashPage,
    SacolaPage
  ],
  providers: [
    PayPal,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    HttpServicesProvider,
    
  ]
})
export class AppModule {}
