import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {SettingsPage} from './settings';
import {Camera} from "@ionic-native/camera";

@NgModule({
  declarations: [
    SettingsPage,
  ],
  imports: [
    IonicPageModule.forChild(SettingsPage),
  ],
  providers: [Camera],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class SettingsPageModule {
}
