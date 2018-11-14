import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SplashPage } from './splash';

@NgModule({
    declarations: [
      SplashPage,
    ],
    imports: [
        IonicPageModule.forChild(SplashPage),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class SplashPageModule { }
