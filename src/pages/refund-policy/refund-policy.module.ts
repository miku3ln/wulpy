import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RefundPolicyPage } from './refund-policy';

@NgModule({
    declarations: [
      RefundPolicyPage,
    ],
    imports: [
        IonicPageModule.forChild(RefundPolicyPage),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class RefundPolicyPageModule { }
