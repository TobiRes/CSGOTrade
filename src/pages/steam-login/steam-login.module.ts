import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {SteamLoginPage} from './steam-login';

@NgModule({
  declarations: [
    SteamLoginPage,
  ],
  imports: [
    IonicPageModule.forChild(SteamLoginPage),
  ],
})
export class SteamLoginPageModule {
}
