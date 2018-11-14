import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TermServicesPage } from './term-services';

@NgModule({
    declarations: [
      TermServicesPage,
    ],
    imports: [
        IonicPageModule.forChild(TermServicesPage),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class TermServicesPageModule { }
