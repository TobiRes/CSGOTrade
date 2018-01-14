import {Injectable} from "@angular/core";
import {InAppBrowser} from "@ionic-native/in-app-browser";

@Injectable()
export class SteamLoginService {

  constructor(private inAppBrowser: InAppBrowser) {
  }

  loginIntoSteam() {
    this.inAppBrowser.create("https://steamcommunity.com/login/");
  }
}
