import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {AlertController, LoadingController} from "ionic-angular";
import {Storage} from "@ionic/storage";

declare var RSA: any;

@Injectable()
export class SteamLoginService {

  private steamGuardCode: string;
  private username: string = "";
  private password: string = "";
  private loggedIn: boolean = false;
  private loading: any;

  constructor(private http: HttpClient,
              private alertCtrl: AlertController,
              private loadCtrl: LoadingController,
              private storage: Storage) {
  }

  startLoginProcess(username, password){
    this.username = username;
    this.password = password;

    this.loading = this.loadCtrl.create();
    this.loading.present();

    this.getSteamRSAPublicKey()
      .then( (steamRSAData: any) => {
        this.encryptPWRSA(steamRSAData, this.password);
      })
      .catch( error => console.error(error));
  }

  private getSteamRSAPublicKey(){
    return new Promise((resolve, reject) => {
      try {
        let body = new FormData();
        body.append("username", this.username)

        this.http.post("https://steamcommunity.com/login/getrsakey/", body).subscribe(
          (steamRSAData: any) => {
            resolve(steamRSAData);
          })
      } catch (error) {
        reject(error);
      }
    });
  }

  private encryptPWRSA(steamRSAData, password){
    let timestamp = steamRSAData.timestamp;
    let publicKey = RSA.getPublicKey(steamRSAData.publickey_mod, steamRSAData.publickey_exp);
    let encryptedPW = RSA.encrypt(password, publicKey);
    this.logIntoSteam(this.getSteamLoginPostBody(encryptedPW, timestamp))
  }

  private logIntoSteam(postBody){
    this.http.post("https://steamcommunity.com/login/dologin/", postBody).subscribe(
      (steamResponse: any) => {
        console.log(steamResponse);
        this.loading.dismiss();
        this.loggedIn = (steamResponse.success && steamResponse.login_complete);
        if(!this.loggedIn){
          if(steamResponse.requires_twofactor){
            let steamGuardAlert = this.createSteamGuardAlert();
            steamGuardAlert.present();
          } else {
            let tooManyLoginsAlert = this.createTooManyLoginsAlert(steamResponse.message);
            tooManyLoginsAlert.present();
          }
        } else {
          this.storage.set("steamLoginData", steamResponse);
          let successfullyLoggedInAlert = this.createSuccesfulLoginAlert();
          successfullyLoggedInAlert.present();
        }
      });
  }

  private createTooManyLoginsAlert(message: string) {
    return this.alertCtrl.create({
      title: message,
      buttons: ['Dismiss']
    });
  }

  private createSuccesfulLoginAlert() {
    return this.alertCtrl.create({
      title: "Login successful!",
      subTitle: "You can send Tradeoffers now.",
      buttons: ['Ok']
    });
  }

  private createSteamGuardAlert(){
    return this.alertCtrl.create({
      title: 'Enter Steam-Guard Code',
      inputs: [
        {
          name: "steamGuardCode",
          placeholder: 'Enter Code...'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Login',
          handler: data => {
            if (data.steamGuardCode) {
              this.steamGuardCode =data.steamGuardCode;
              this.startLoginProcess(this.username, this.password);
            } else {
              console.log("Something went wrong.");
              return false;
            }
          }
        }
      ]
    });
  }

  private getSteamLoginPostBody(encryptedPW, timestamp) {
    let postBody = new FormData();
    postBody.append("password", encryptedPW);
    postBody.append("username", this.username);
    postBody.append("donotcache", new Date().getTime().toString());
    postBody.append("twofactorcode", this.steamGuardCode);
    postBody.append("loginfriendlyname", "");
    postBody.append("captchagid", "-1");
    postBody.append("captcha_text", "");
    postBody.append("emailsteamid", "");
    postBody.append("rsatimestamp", timestamp);
    postBody.append("remember_login", "false");

    return postBody;
  }
}
