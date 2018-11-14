import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {LoginManagementPage} from './login-management';
import {Facebook} from "@ionic-native/facebook";

@NgModule({
  declarations: [
    LoginManagementPage,
  ],
  imports: [
    IonicPageModule.forChild(LoginManagementPage),
  ],
  providers: [
    Facebook
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class LoginManagementPageModule {
}
