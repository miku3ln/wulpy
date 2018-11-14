import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PrivacyPolicyPage } from './privacy-policy';

@NgModule({
    declarations: [
      PrivacyPolicyPage,
    ],
    imports: [
        IonicPageModule.forChild(PrivacyPolicyPage),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class PrivacyPolicyPageModule { }
