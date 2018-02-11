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
import {CSGOItemService} from "../services/csgoItem.service";
import {IonicStorageModule} from "@ionic/storage";
import {SteamLoginService} from "../services/steam-login.service";
import {TradeofferService} from "../services/tradeoffer.service";
import {TradeMyItemsPageModule} from "../pages/trade-my-items/trade-my-items.module";
import {TradeTheirItemsPageModule} from "../pages/trade-their-items/trade-their-items.module";
import {TradeReviewPageModule} from "../pages/trade-review/trade-review.module";
import {InAppBrowser} from "@ionic-native/in-app-browser";
import {DynamicStyleService} from "../services/dynamic-style.service";
import {AboutPageModule} from "../pages/about/about.module";
import {DirectivesModule} from "../directives/directives.module";
import {ItemModalPageModule} from "../pages/item-modal/item-modal.module";
import {PostViewPageModule} from "../pages/post-view/post-view.module";
import {SearchRedditPageModule} from "../pages/search-reddit/search-reddit.module";
import {TradeLinkPageModule} from "../pages/trade-link/trade-link.module";

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
    DirectivesModule,
    HomePageModule,
    InventoryPageModule,
    TradeMyItemsPageModule,
    TradeTheirItemsPageModule,
    TradeReviewPageModule,
    AboutPageModule,
    ItemModalPageModule,
    PostViewPageModule,
    SearchRedditPageModule,
    TradeLinkPageModule
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
    CSGOItemService,
    SteamLoginService,
    TradeofferService,
    InAppBrowser,
    DynamicStyleService
  ]
})
export class AppModule {
}
