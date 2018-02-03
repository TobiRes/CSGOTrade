import {Component, ViewChild} from '@angular/core';
import {Nav, Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

import {HomePage} from '../pages/home/home';
import {InventoryPage} from "../pages/inventory/inventory";
import {AboutPage} from "../pages/about/about";
import {RedditService} from "../services/reddit.service";
import {SearchRedditPage} from "../pages/search-reddit/search-reddit";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;
  pages: Array<{ title: string, component: any }>;
  private activeUserCount: number;

  constructor(platform: Platform,
              statusBar: StatusBar,
              splashScreen: SplashScreen,
              private redditService: RedditService) {
    this.pages = [
      {title: 'Home', component: HomePage},
      {title: "Search", component: SearchRedditPage},
      {title: 'Inventory', component: InventoryPage},
      {title: "About", component: AboutPage}
    ];
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.getActiveUserCount();
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }

  private getActiveUserCount() {
    this.redditService.getActiveUserCount()
      .then((activeUser: number) => this.activeUserCount = activeUser)
      .catch(error => console.error(error));
  }

}

