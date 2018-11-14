import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MagazineSubcategoryDetailsPage } from './magazine-subcategory-details';

@NgModule({
    declarations: [
      MagazineSubcategoryDetailsPage,
    ],
    imports: [
        IonicPageModule.forChild(MagazineSubcategoryDetailsPage),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class MagazineSubcategoryDetailsPageModule { }
