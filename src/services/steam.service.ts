import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class SteamService {

  private steamInventoryBaseUrl: string = "http://steamcommunity.com/profiles/76561198128420241";
  private itemImageBaseUrl: string = "http://cdn.steamcommunity.com/economy/image/";

  constructor(private http: HttpClient) {
  }

  getCSGOInventory(steamInventoryURL: string) {
    return new Promise((resolve, reject) => {
      steamInventoryURL = this.validateSteamURL(steamInventoryURL);
      this.http.get(steamInventoryURL + "/inventory/json/730/2").subscribe(
        (csgoInventoryData: any) => {
          if (!csgoInventoryData.success) {
            reject();
          }
          else {
            resolve(csgoInventoryData);
          }
        },
        onerror => {
          reject(onerror);
        });
    });
  }

  private validateSteamURL(steamInventoryURL: string) {
    steamInventoryURL = this.checkForWholeURL(steamInventoryURL);
    steamInventoryURL = this.checkForHTTP(steamInventoryURL);
    return steamInventoryURL;
  }

  private checkForWholeURL(steamInventoryURL: string) {
    if (steamInventoryURL.length <= 17) {
      if (steamInventoryURL.indexOf("/") > -1) {
        steamInventoryURL = steamInventoryURL.replace("/", "")
      }
      if (steamInventoryURL.match(/^[0-9]+$/) != null) {
        steamInventoryURL = "https://steamcommunity.com/profiles/" + steamInventoryURL;
      } else {
        steamInventoryURL = "https://steamcommunity.com/id/" + steamInventoryURL;
      }
    }
    if (steamInventoryURL.lastIndexOf("/") == steamInventoryURL.length - 1) {
      steamInventoryURL = steamInventoryURL.substr(0, steamInventoryURL.length - 1)
    }
    return steamInventoryURL;
  }

  private checkForHTTP(steamInventoryURL: string) {
    if (steamInventoryURL.indexOf("http") != 0) {
      if (steamInventoryURL.indexOf("/") == 0) {
        steamInventoryURL = steamInventoryURL.substr(1, steamInventoryURL.length)
      }
      steamInventoryURL = "https://" + steamInventoryURL;
    }
    return steamInventoryURL;
  }
}
