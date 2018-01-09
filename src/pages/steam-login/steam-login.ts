import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {SteamLoginService} from "../../services/steam-login.service";

@IonicPage()
@Component({
  selector: 'page-steam-login',
  templateUrl: 'steam-login.html',
})
export class SteamLoginPage {

  username: string;
  password: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private steamLoginService: SteamLoginService) {
  }

  logIntoSteam(){
    this.steamLoginService.startLoginProcess(this.username,this.password);
  }

}
