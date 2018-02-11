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
      this.http.get(steamInventoryURL + "/inventory/json/730/2")
        .subscribe(
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

  validateSteamURL(steamInventoryURL: string): Promise<string> {
    return new Promise((resolve, reject) => {
      steamInventoryURL = this.checkForWholeURL(steamInventoryURL);
      steamInventoryURL = this.checkForHTTP(steamInventoryURL);
      if (steamInventoryURL.indexOf(".com/id/") > 0) {
        this.getSteamProfileURLWithAnID(steamInventoryURL)
          .then((steamInventoryURL: string) => {
            resolve(steamInventoryURL);
          })
          .catch(error => reject(error));
      } else {
        resolve(steamInventoryURL);
      }
    })
  }

  validateTradelink(steamTradeLink: string): string {
    if(steamTradeLink.indexOf("steamcommunity.com/tradeoffer/new/?partner=") > -1 && steamTradeLink.indexOf("&token=") > -1){
      if(steamTradeLink.indexOf("http") < 0){
        steamTradeLink = "https://" + steamTradeLink;
      }
      return steamTradeLink
    } else {
      return "false";
    }
  }

  checkForWholeURL(steamInventoryURL: string) {
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

  getNameOfSteamProfile(steamInventoryURL: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.http.get(steamInventoryURL + "/?xml=1", {responseType: 'text'})
        .subscribe(data => {
          data = data.substring(65, 250)
          console.log(data);
          let indexOfIdStart = data.indexOf("steamID><![") + 17;
          let indexOfIdEnd = data.indexOf("]]></steamID");
          data = data.substring(indexOfIdStart, indexOfIdEnd);
          resolve(data);
          },
          onerror => {
            reject(onerror);
          });
    })
  }

  private getSteamProfileURLWithAnID(steamInventoryURL) {
    return new Promise((resolve, reject) => {
      this.http.get(steamInventoryURL + "/?xml=1", {responseType: 'text'})
        .subscribe(data => {
            data = data.substring(65, 117)
            let indexOfIdStart = data.indexOf("steamID64") + 10;
            let indexOfIdEnd = data.lastIndexOf("steamID64") - 2;
            data = data.substring(indexOfIdStart, indexOfIdEnd);
            resolve("https://steamcommunity.com/profiles/" + data);
          },
          onerror => {
            reject(onerror);
          });
    })
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
