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
      try {
        this.http.get(steamInventoryURL + "/inventory/json/730/2").subscribe(
          (csgoInventoryData: any) => {
            if (!csgoInventoryData.success)
              resolve("unknown");
            else {
              resolve(csgoInventoryData);
            }
          })
      } catch (error) {
        reject(error);
      }
    })
  }
}
