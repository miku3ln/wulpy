import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ServicesProductsManagementPage } from './services-products-management';

@NgModule({
    declarations: [
      ServicesProductsManagementPage,
    ],
    imports: [
        IonicPageModule.forChild(ServicesProductsManagementPage),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class ServicesProductsManagementPageModule { }
