import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable()
export class SteamLoginService {

  constructor(private http: HttpClient) {
  }

  getSteamRSAPublicKey(){
    return new Promise((resolve, reject) => {
      try {
        let body = new FormData();
        body.append("username","liquidwater34")

        this.http.post("https://steamcommunity.com/login/getrsakey/", body).subscribe(
          (steamRSAData: any) => {
            resolve(steamRSAData);
          })
      } catch (error) {
        reject(error);
      }
    });
  }

}
