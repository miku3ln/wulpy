import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ForgotPasswordPage} from './forgot-password';
import {AlertProvider} from "../../providers/alert/alert";
import {LoadingProvider} from "../../providers/loading/loading";


@NgModule({
    declarations: [
      ForgotPasswordPage,
    ],
    imports: [
        IonicPageModule.forChild(ForgotPasswordPage),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [

    AlertProvider,
    LoadingProvider,


  ]
})

export class ForgotPasswordPageModule { }
