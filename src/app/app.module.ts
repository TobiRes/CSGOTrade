import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';

import {MyApp} from './app.component';
import {HomePage} from '../pages/home/home';
import {HttpClientModule} from "@angular/common/http";
import {RedditService} from "../services/reddit.service";
import {ThreadinfoService} from "../services/threadinfo.service";
import {ComponentsModule} from "../components/components.module";
import {HomePageModule} from "../pages/home/home.module";
import {PostViewPageModule} from "../pages/post-view/post-view.module";

@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    ComponentsModule,
    HomePageModule,
    PostViewPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    RedditService,
    ThreadinfoService
  ]
})
export class AppModule {
}
