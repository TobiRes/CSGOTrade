import {Component} from '@angular/core';
import {IonicPage} from 'ionic-angular';
import {SteamLoginService} from "../../services/steam-login.service";

@IonicPage()
@Component({
  selector: 'page-steam-login',
  templateUrl: 'steam-login.html',
})
export class SteamLoginPage {

  username: string;
  password: string;

  constructor(private steamLoginService: SteamLoginService) {
  }

  logIntoSteam() {
    this.steamLoginService.loginIntoSteam();
  }
}
