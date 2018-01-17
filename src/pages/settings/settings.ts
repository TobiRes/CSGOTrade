import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { SettingsService } from "../../services/settings.service";


@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  steamTradeLink: string;

  constructor(private settingsService: SettingsService) {
  }


  saveTradeLink() {
    console.log(this.steamTradeLink);
    this.settingsService.saveTradeLink();
  }

}
