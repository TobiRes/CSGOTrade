import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable()
export class SteamService {

  private steamInventoryBaseUrl: string = "http://steamcommunity.com/profiles/76561198128420241/inventory/json/730/2";
  private itemImageBaseUrl: string = "http://cdn.steamcommunity.com/economy/image/";

  constructor(private http: HttpClient) {
  }

  getCSGOInventory() {
    return new Promise((resolve, reject) => {
      try {
        let httpHeader: HttpHeaders = new HttpHeaders;
        httpHeader.append("Access-Control-Allow-Origin", "*")
        this.http.get(this.steamInventoryBaseUrl, {headers: httpHeader}).subscribe(
          (csgoInventoryData: any) => {
            let csgoInventory = this.getInventoryFromJSONData(csgoInventoryData);
            resolve(csgoInventory);
          })
      } catch (error) {
        reject(error);
      }
    })
  }

  private getInventoryFromJSONData(csgoInventoryData: any) {
    console.log(csgoInventoryData);
    if (!csgoInventoryData.success)
      return "unknown";
    else {
      return csgoInventoryData.rgDescriptions;
    }
  }
}
