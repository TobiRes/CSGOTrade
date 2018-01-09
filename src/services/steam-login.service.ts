import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";

declare var RSA: any;

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
            this.encryptPWRSA(steamRSAData);
            resolve(steamRSAData);
          })
      } catch (error) {
        reject(error);
      }
    });
  }

  private encryptPWRSA(steamRSAData){
    let timestamp = steamRSAData.timestamp;
    let publicKey = RSA.getPublicKey(steamRSAData.publickey_mod, steamRSAData.publickey_exp);
    let encryptedData = RSA.encrypt("Sy8kXy9aO9tb", publicKey);

    this.logIntoSteam(encryptedData, timestamp)
    console.log(publicKey);
  }


  private logIntoSteam(encryptedPW, timestamp){

    let body = new FormData();
    body.append("password", encryptedPW);
    body.append("username", "liquidwater34");
    body.append("donotcache", new Date().getTime().toString());
    body.append("twofactorcode", "");
    body.append("loginfriendlyname", "");
    body.append("captchagid", "-1");
    body.append("captcha_text", "");
    body.append("emailsteamid", "");
    body.append("rsatimestamp", timestamp);
    body.append("remember_login", "false");
    console.log(body);

    this.http.post("https://steamcommunity.com/login/dologin/", body).subscribe(
      steamResponse => console.log(steamResponse));
  }

}
