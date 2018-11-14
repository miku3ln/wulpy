import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AboutUsManagementPage } from './about-us-management';

@NgModule({
    declarations: [
      AboutUsManagementPage,
    ],
    imports: [
        IonicPageModule.forChild(AboutUsManagementPage),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class AboutUsManagementPageModule { }
