import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {SignUpManagementPage} from './sign-up-management';
import {Camera} from "@ionic-native/camera";
import {Facebook} from "@ionic-native/facebook";

@NgModule({
  declarations: [
    SignUpManagementPage,
  ],
  imports: [
    IonicPageModule.forChild(SignUpManagementPage),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    Camera,
    Facebook,
  ],

})

export class SignUpManagementPageModule {
}
