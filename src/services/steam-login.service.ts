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

    let publicKey = RSA.getPublicKey(steamRSAData.publickey_mod, steamRSAData.publickey_exp);
    let encryptedData = RSA.encrypt("test", publicKey);
    console.log(encryptedData);
  }

}
