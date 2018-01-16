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
import {InventoryPageModule} from "../pages/inventory/inventory.module";
import {SteamService} from "../services/steam.service";
import {ItemService} from "../services/item.service";
import {IonicStorageModule} from "@ionic/storage";
import {SteamLoginService} from "../services/steam-login.service";
import {SteamLoginPageModule} from "../pages/steam-login/steam-login.module";
import {TradeofferService} from "../services/tradeoffer.service";
import {TradeMyItemsPageModule} from "../pages/trade-my-items/trade-my-items.module";
import {TradeTheirItemsPageModule} from "../pages/trade-their-items/trade-their-items.module";
import {TradeReviewPageModule} from "../pages/trade-review/trade-review.module";
import {InAppBrowser} from "@ionic-native/in-app-browser";
import {DynamicStyleService} from "../services/dynamic-style.service";
import {AboutPageModule} from "../pages/about/about.module";
import {DirectivesModule} from "../directives/directives.module";

@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    HttpClientModule,
    ComponentsModule,
    HomePageModule,
    InventoryPageModule,
    SteamLoginPageModule,
    TradeMyItemsPageModule,
    TradeTheirItemsPageModule,
    TradeReviewPageModule,
    AboutPageModule,
    DirectivesModule
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
    ThreadinfoService,
    SteamService,
    ItemService,
    SteamLoginService,
    TradeofferService,
    InAppBrowser,
    DynamicStyleService
  ]
})
export class AppModule {
}
