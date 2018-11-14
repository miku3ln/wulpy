import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomeManagementPage } from './home-management';
@NgModule({
    declarations: [
      HomeManagementPage,
    ],
    imports: [
        IonicPageModule.forChild(HomeManagementPage),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class HomeManagementPageModule { }
