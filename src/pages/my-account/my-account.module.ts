import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyAccountPage } from './my-account';

import {Camera} from "@ionic-native/camera";

@NgModule({
    declarations: [
      MyAccountPage,
    ],
    imports: [
        IonicPageModule.forChild(MyAccountPage),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    Camera,

  ]
})

export class MyAccountPagePageModule { }
