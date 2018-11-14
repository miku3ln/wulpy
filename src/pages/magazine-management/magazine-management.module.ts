import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MagazineManagementPage } from './magazine-management';

@NgModule({
    declarations: [
      MagazineManagementPage,
    ],
    imports: [
        IonicPageModule.forChild(MagazineManagementPage),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class MagazineManagementPageModule { }
